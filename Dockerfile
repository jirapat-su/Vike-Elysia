# images preparation
FROM imbios/bun-node:latest-20-alpine-git AS builder-image
FROM oven/bun:slim AS runner-image

# Builder stage --------------------------------------------
FROM builder-image AS builder
WORKDIR /app
# Install dependencies
COPY package.json bun.lock* ./
# Use frozen lockfile to ensure consistent installs
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Runner stage ---------------------------------------------
FROM runner-image AS runner
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Create and set up non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 runner

# Set up necessary directories and permissions
RUN mkdir -p .next && \
  chown runner:nodejs dist

USER runner

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

EXPOSE $PORT

# Start the application
CMD ["bun", "dist/server/index.standalone.mjs"]

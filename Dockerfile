# images preparation
FROM imbios/bun-node:latest-20-alpine-git AS builder-image
FROM oven/bun:alpine AS runner-image

# Set environment variable to indicate CI environment
ENV CI=1

# Builder stage --------------------------------------------
FROM builder-image AS builder

# Set working directory
WORKDIR /app

# Set environment variable for production build
ENV NODE_ENV=production

# Copy project files to the working directory
COPY . .

# Use frozen lockfile to ensure consistent installs
RUN bun install --frozen-lockfile

# Build the application for production
RUN bun run build

# Compile standalone server
RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --outfile ./build/server \
  ./dist/server/index.standalone.mjs

# Runner stage ---------------------------------------------
FROM runner-image AS runner

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder --chmod=755 /app/dist/client ./dist/client
COPY --from=builder --chmod=755 /app/build/server server

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT

# Start the application
CMD ["./server"]

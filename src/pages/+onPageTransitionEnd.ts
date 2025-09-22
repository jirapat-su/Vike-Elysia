import type { PageContextClient } from 'vike/types';

export async function onPageTransitionEnd(_pageContext: PageContextClient) {
  document.body.classList.remove('page-transition');
}

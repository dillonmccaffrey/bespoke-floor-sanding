import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  // This endpoint is called by the CMS when content changes
  // In a static site, this would trigger a rebuild
  // For SSR mode, we just acknowledge the request
  // The content is read fresh on each request from CONTENT_DIR
  
  console.log('Rebuild webhook received - content will be refreshed on next request');
  
  return new Response(JSON.stringify({ success: true, message: 'Content will refresh on next request' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

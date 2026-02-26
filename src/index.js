// The Board - Cloudflare Worker
// Modular structure for maintainability

import { handleAPI } from './api.js';
import { FRONTEND_HTML } from './frontend.js';
import { MOBILE_HTML } from './mobile.js';
import { APP_ICON } from './icon.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // App icon
    if (path === '/icon.png' || path === '/apple-touch-icon.png') {
      const binaryData = Uint8Array.from(atob(APP_ICON), c => c.charCodeAt(0));
      return new Response(binaryData, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
      });
    }

    // Mobile view
    if (path === '/mobile') {
      return new Response(MOBILE_HTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // API routes
    if (path.startsWith('/api/')) {
      try {
        const result = await handleAPI(request, env, path);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Serve frontend
    return new Response(FRONTEND_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};

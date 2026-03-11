// The Board - Cloudflare Worker
// Modular structure for maintainability

import { handleAPI } from './api.js';
import { FRONTEND_HTML } from './frontend.js';
import { MOBILE_HTML } from './mobile.js';
import { APP_ICON } from './icon.js';

// PWA Manifest for iOS Add to Home Screen
const MANIFEST = {
  name: "The Board",
  short_name: "The Board",
  description: "Personal productivity dashboard",
  start_url: "/",
  display: "standalone",
  background_color: "#f5f5f0",
  theme_color: "#1a1a1a",
  orientation: "any",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    { src: "/icon-180.png", sizes: "180x180", type: "image/png" },
    { src: "/icon-167.png", sizes: "167x167", type: "image/png" },
    { src: "/icon-152.png", sizes: "152x152", type: "image/png" }
  ]
};

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

    // PWA Manifest
    if (path === '/manifest.json') {
      return new Response(JSON.stringify(MANIFEST), {
        headers: { 
          'Content-Type': 'application/manifest+json',
          'Cache-Control': 'public, max-age=86400'
        },
      });
    }

    // App icons (all sizes use the same base icon, scaled by iOS)
    if (path.match(/^\/icon(-\d+)?\.png$/) || path === '/apple-touch-icon.png' || path === '/apple-touch-icon-precomposed.png') {
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

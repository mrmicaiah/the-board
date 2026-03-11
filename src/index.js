// The Board - Cloudflare Worker
// Modular structure for maintainability

import { handleAPI } from './api.js';
import { FRONTEND_HTML } from './frontend.js';
import { MOBILE_HTML } from './mobile.js';

// Alice's profile pic as the app icon
const ALICE_ICON_URL = 'https://res.cloudinary.com/dxzw1zwez/image/upload/w_512,h_512,c_fill,g_face/v1772644026/alice_profile_kpamkm.jpg';

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
    { src: "/icon-192.png", sizes: "192x192", type: "image/jpeg", purpose: "any maskable" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/jpeg", purpose: "any maskable" },
    { src: "/icon-180.png", sizes: "180x180", type: "image/jpeg" },
    { src: "/icon-167.png", sizes: "167x167", type: "image/jpeg" },
    { src: "/icon-152.png", sizes: "152x152", type: "image/jpeg" }
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

    // App icons - redirect to Alice's Cloudinary image with appropriate size
    if (path.match(/^\/icon(-\d+)?\.png$/) || path === '/apple-touch-icon.png' || path === '/apple-touch-icon-precomposed.png') {
      // Extract size from path if present, default to 180
      const sizeMatch = path.match(/icon-(\d+)/);
      const size = sizeMatch ? sizeMatch[1] : '180';
      
      // Redirect to Cloudinary with proper sizing
      const iconUrl = `https://res.cloudinary.com/dxzw1zwez/image/upload/w_${size},h_${size},c_fill,g_face/v1772644026/alice_profile_kpamkm.jpg`;
      
      return Response.redirect(iconUrl, 302);
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

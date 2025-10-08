// This file runs before anything else in Next.js
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Polyfill 'self' for Node.js environment to prevent SSR errors
    if (typeof global.self === 'undefined') {
      global.self = global;
    }
  }
}


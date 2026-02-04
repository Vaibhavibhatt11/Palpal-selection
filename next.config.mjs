/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd()
  },
  allowedDevOrigins: [
    "http://192.168.184.1:3000",
    "http://192.168.184.1:3001",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "**.supabase.co"
      }
    ]
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: https: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https:",
      "frame-src https://www.google.com https://maps.google.com https://www.google.com/maps https://www.google.com/maps/embed https://maps.gstatic.com",
      "child-src https://www.google.com https://maps.google.com https://www.google.com/maps https://www.google.com/maps/embed https://maps.gstatic.com",
      "frame-ancestors 'none'"
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: csp }
        ]
      }
    ];
  }
};

export default nextConfig;

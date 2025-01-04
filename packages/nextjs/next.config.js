// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    if (isServer) {
      config.externals.push("ssh2"); // Exclude `ssh2` from the server bundle
    }

    return config;
  },
  output: "export",
};

module.exports = nextConfig;

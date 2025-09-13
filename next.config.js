/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://35.224.211.72/graphql',
      },
    ];
  },
};

module.exports = nextConfig;
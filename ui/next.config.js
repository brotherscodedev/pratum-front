/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|ico|icon|webp|woff2|gif|css)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=15552000, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = {
  eslint: {
    dirs: ['pages', 'utils', 'constants'], // <- Only run ESLint on this directories. | Errors on: components(++), app(++++), lib(+), hooks(+), services(++), types(+)
  },
  nextConfig,
};
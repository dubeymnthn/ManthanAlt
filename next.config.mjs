/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;

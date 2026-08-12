/** @type {import('next').NextConfig} */
const customDistDir =
  process.env.NEXT_DIST_DIR ??
  (process.env.NODE_ENV === "development" ? ".next-local" : undefined);

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  ...(customDistDir ? { distDir: customDistDir } : {}),
};

export default nextConfig;

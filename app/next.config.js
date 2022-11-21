/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env:{
    PROJECT_ID: process.env.PROJECT_ID,
    PROJECT_SECRET: process.env.PROJECT_SECRET,
    NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY,
    NFT_STORAGE_LINK: process.env.NFT_STORAGE_LINK,
  },
}

module.exports = nextConfig

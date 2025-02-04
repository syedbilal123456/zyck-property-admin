/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com", // Existing domain
        },
        {
          protocol: 'https',
          hostname: 'jaghufeohfcrwkhqisxt.supabase.co', // Add your Supabase domain
        },
      ],
    },
  };
  
  export default nextConfig; // Correct way to export in ES module
  
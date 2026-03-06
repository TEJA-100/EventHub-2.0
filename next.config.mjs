/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/colleges', destination: '/college', permanent: true },
            { source: '/about-us', destination: '/about', permanent: true },
            { source: '/contact', destination: '/about', permanent: true },
        ];
    },
};

export default nextConfig;

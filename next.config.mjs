/** @type {import('next').NextConfig} */
const basePath = "/Lazy-barcodes-generator";

const nextConfig = {
    /**
     * Enable static exports.
     *
     * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */
    output: "export",
    /**
     * Set base path. This is the slug of your GitHub repository.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
     */
    basePath: basePath,
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
     */
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: basePath,
                basePath: false, // Importante: false para que no prefije el basePath a la ruta source ('/')
                permanent: false,
            },
        ]
    }
}

export default nextConfig
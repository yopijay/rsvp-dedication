import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        // Keep Turbopack scoped to this app when multiple lockfiles exist in parent folders.
        root: process.cwd(),
    },
};

export default nextConfig;

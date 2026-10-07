import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		localPatterns: [
			{
				pathname: "/**",
				search: "",
			},
			{
				pathname: "/api/artwork-image/**",
				search: "?variant=original",
			},
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
			},
		],
	},
};

export default nextConfig;

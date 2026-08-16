import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone 输出便于 Docker 部署
  output: "standalone",
};

export default nextConfig;

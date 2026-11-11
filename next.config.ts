import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = {
  compiler: { styledComponents: true },
  devIndicators: false,
  distDir: process.env.NOVA_NEXT_DIST_DIR || ".next",
};

export default createNextIntlPlugin("./src/i18n.ts")(config);

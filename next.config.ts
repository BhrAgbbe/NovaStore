import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = { compiler: { styledComponents: true }, devIndicators: false };

export default createNextIntlPlugin("./src/i18n.ts")(config);

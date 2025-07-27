// 在你的入口文件（如index.js）中
require('dotenv').config();

// Export all environment variables
export const ENV_CONFIG = {
  PLAYWRIGHT_BROWSERTYPE: process.env.PLAYWRIGHT_BROWSERTYPE,
  PLAYWRIGHT_LOGLEVEL: process.env.PLAYWRIGHT_LOGLEVEL,
  HTTP_PROXY: process.env.HTTP_PROXY,
  TARGET_TEL_NUM: process.env.TARGET_TEL_NUM || "",
};

if (ENV_CONFIG.TARGET_TEL_NUM.length < 11) {
  console.warn("Warning: TARGET_TEL_NUM is less than 11 characters.");
}

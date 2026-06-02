const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Le decimos a Metro que compile usando nuestro archivo CSS global
module.exports = withNativeWind(config, { input: "./global.css" });
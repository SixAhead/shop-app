const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ignore backend folder so it doesn't pull in its own React
config.watchFolders = [
  path.resolve(__dirname), // only watch this app folder
];

config.resolver.blockList = [
  /server[\\/]functions[\\/].*/, // block server/functions
];

module.exports = config;

const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  plugins: [
    new Dotenv({
      path: "./.env.local",
      safe: true,
    }),
  ],
};

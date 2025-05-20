// apps/api-main/webpack.config.js
const path = require('path');
const webpack = require('webpack'); // Import webpack

module.exports = {
  context: __dirname, // Sets the base directory to 'apps/api-main'
  entry: './src/main.ts', // Entry point relative to the context
  mode: 'development', // Explicitly set mode to address the warning
  target: 'node', // Specify the target environment as Node.js
  resolve: {
    extensions: ['.ts', '.js'], // Add .ts and .js to resolvable extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader', // Basic TypeScript loader
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/swagger-ui$/,
      contextRegExp: /@nestjs\/swagger$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^@nestjs\/websockets\/socket-module$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^@nestjs\/microservices\/microservices-module$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^@nestjs\/microservices$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^bufferutil$/,
      contextRegExp: /ws\/lib$/, // Target only within ws/lib context
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^utf-8-validate$/,
      contextRegExp: /ws\/lib$/, // Target only within ws/lib context
    }),
  ],
  // Nx's @nx/webpack:webpack executor should merge its default TypeScript
  // loaders and output configurations with this.
  // We are keeping this minimal to first resolve the entry point issue.
};
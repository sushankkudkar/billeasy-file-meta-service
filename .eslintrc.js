const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = {
  // Define which files this config applies to (JS, MJS, CJS, and TS)
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      languageOptions: {
        globals: globals.node, // Node.js global variables
      },
      extends: [
        // Apply recommended JS and TypeScript configurations
        pluginJs.configs.recommended, // JavaScript linting rules
        ...tseslint.configs.recommended, // TypeScript linting rules
        'plugin:prettier/recommended', // Prettier integration
      ],
      parserOptions: {
        ecmaVersion: 'latest', // Supports the latest ECMAScript version
        sourceType: 'module', // Allows ECMAScript modules (ESM)
      },
    },
  ],
  plugins: ['prettier'], // Ensure the Prettier plugin is used
};
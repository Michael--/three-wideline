module.exports = {
   env: {
      browser: true,
      es6: true,
   },
   parser: "@typescript-eslint/parser",
   parserOptions: {
      project: "./tsconfig-base.json",
      sourceType: "module",
      jsx: true,
   },
   extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
   ],
   plugins: ["react", "@typescript-eslint"],
   rules: {
      "indent": ["error", 3, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["error", "never"],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": [
         "warn",
         {
            vars: "all",
            args: "none",
            ignoreRestSiblings: false,
         },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
   },
   settings: {
      react: {
         version: "detect",
      },
   },
}

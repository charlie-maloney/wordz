import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const tsFilePatterns = ["**/*.{ts,tsx,cts,mts}"];
const jsFilePatterns = ["**/*.{js,jsx,mjs,cjs}"];
const reactFilePatterns = ["**/*.{jsx,tsx}"];

const tsConfigs = tseslint
  .config(...tseslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked)
  .map((config) => {
    if (!config.files) {
      return {
        ...config,
        files: tsFilePatterns,
        languageOptions: {
          ...config.languageOptions,
          ecmaVersion: "latest",
          sourceType: "module",
          globals: {
            ...globals.browser,
            ...globals.node,
          },
          parserOptions: {
            ...(config.languageOptions?.parserOptions ?? {}),
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      };
    }

    if (config.languageOptions) {
      return {
        ...config,
        files: config.files ?? tsFilePatterns,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            ...(config.languageOptions.parserOptions ?? {}),
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      };
    }

    return {
      ...config,
      files: config.files ?? tsFilePatterns,
    };
  });

const reactRecommended = {
  ...react.configs.flat.recommended,
  files: reactFilePatterns,
};

const reactJsxRuntime = {
  ...react.configs.flat["jsx-runtime"],
  files: reactFilePatterns,
};

const reactHooksConfig = {
  files: ["**/*.{ts,tsx,js,jsx}"],
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  {
    files: jsFilePatterns,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  reactRecommended,
  reactJsxRuntime,
  ...tsConfigs,
  reactHooksConfig,
];

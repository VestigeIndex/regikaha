import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  { ignores: [".next/**", "out/**", ".wrangler/**", "node_modules/**", "public/geo/**"] },
  ...compat.extends("next/core-web-vitals"),
];

export default config;

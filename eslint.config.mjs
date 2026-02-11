// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Disable no-useless-escape in docs pages that contain code examples
  // with <\/script> (necessary in Vue SFC to avoid HTML parser issues)
  {
    files: ["app/pages/docs/**/*.vue"],
    rules: {
      "no-useless-escape": "off",
    },
  },
);

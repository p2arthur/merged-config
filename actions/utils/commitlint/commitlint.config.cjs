/**
 * Commitlint configuration for conventional commits.
 * Extends @commitlint/config-conventional with relaxed rules.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [1, "always", ["pascal-case", "upper-case"]],
    "type-empty": [1, "never"],
    "subject-empty": [2, "never"],
    "body-leading-blank": [0, "always"],
    "body-max-line-length": [1, "always", 200],
    "header-max-length": [1, "always", 150],
    "footer-max-length": [1, "always", 150],
    "footer-max-line-length": [1, "always", 150],
  },
};

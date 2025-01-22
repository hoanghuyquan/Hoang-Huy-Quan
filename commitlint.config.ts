import { RuleConfigSeverity } from "@commitlint/types";
import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-case": [RuleConfigSeverity.Error, "always", "lower-case"],
    "type-empty": [RuleConfigSeverity.Error, "never"],
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "test",
        "setup",
      ],
    ],
    "scope-case": [RuleConfigSeverity.Disabled],
    "scope-empty": [RuleConfigSeverity.Error, "never"],
    "scope-enum": [
      RuleConfigSeverity.Error,
      "always",
      ["challenge"],
    ],
    "subject-case": [RuleConfigSeverity.Disabled],
    "subject-empty": [RuleConfigSeverity.Error, "never"],
  },
};

export default Configuration;

// <type>(<scope1>,<scope2>,...): <subject>

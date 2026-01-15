#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [, , docsPath, repository, commitSha] = process.argv;

if (!docsPath || !repository || !commitSha) {
  console.error("Usage: node generate-manifest.mjs <docs_path> <repository> <commit_sha>");
  process.exit(1);
}

const detectTool = () => {
  const markers = [
    { file: "package.json", tool: "typedoc", key: "typedoc" },
    { file: "package.json", tool: "jsdoc", key: "jsdoc" },
    { file: "pyproject.toml", tool: "sphinx", key: "[tool.sphinx]" },
  ];

  for (const marker of markers) {
    const filePath = join(process.cwd(), marker.file);
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf8");
    if (marker.file === "package.json") {
      const pkg = JSON.parse(content);
      if (pkg.devDependencies?.[marker.tool] || pkg.dependencies?.[marker.tool]) {
        return { tool: marker.tool, version: pkg.devDependencies?.[marker.tool] || pkg.dependencies?.[marker.tool] };
      }
      if (pkg[marker.key]) {
        return { tool: marker.tool, version: pkg[marker.key]?.version || "unknown" };
      }
    } else if (content.includes(marker.key)) {
      return { tool: marker.tool, version: "unknown" };
    }
  }

  return { tool: "unknown", version: "unknown" };
};

const manifest = {
  generated: new Date().toISOString(),
  generator: detectTool(),
  metadata: {
    repository,
    commit: commitSha,
  },
};

const targetPath = join(process.cwd(), docsPath, "manifest.json");
writeFileSync(targetPath, JSON.stringify(manifest, null, 2));
console.log(`manifest.json written to ${targetPath}`);

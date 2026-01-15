const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const configsDir = path.join(rootDir, "configs");
const distConfigsDir = path.join(distDir, "configs");

const pkg = JSON.parse(
  fs.readFileSync(path.join(rootDir, "package.json"), "utf8"),
);

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distConfigsDir, { recursive: true });

for (const entry of fs.readdirSync(configsDir)) {
  fs.copyFileSync(
    path.join(configsDir, entry),
    path.join(distConfigsDir, entry),
  );
}

const distPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
  repository: pkg.repository,
  bugs: pkg.bugs,
  homepage: pkg.homepage,
  keywords: pkg.keywords,
  exports: pkg.exports,
  files: ["configs"],
  publishConfig: pkg.publishConfig,
  peerDependencies: pkg.peerDependencies,
};

fs.writeFileSync(
  path.join(distDir, "package.json"),
  JSON.stringify(distPkg, null, 2) + "\n",
);

for (const file of ["README.md", "LICENSE"]) {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

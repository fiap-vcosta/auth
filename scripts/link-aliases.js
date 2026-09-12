const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

const aliases = {
  "@domain": "src/domain",
  "@application": "src/application",
  "@infrastructure": "src/infrastructure",
  "@presentation": "src/presentation",
  "@test": "test",
};

for (const [name, target] of Object.entries(aliases)) {
  const linkPath = path.join(root, "node_modules", name);
  const targetPath = path.join(root, target);
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(path.relative(path.dirname(linkPath), targetPath), linkPath);
}

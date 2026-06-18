// Workaround: prettier 3.x + Node.js 22 + spaces in path
// import("./index.mjs") fails because spaces aren't percent-encoded in ESM URLs.
// We replace it with pathToFileURL to ensure correct encoding.
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "node_modules", "prettier", "index.cjs");

if (!fs.existsSync(file)) process.exit(0);

const before = 'import("./index.mjs")';
const after = 'import(require("url").pathToFileURL(require("path").join(__dirname, "index.mjs")).href)';

const content = fs.readFileSync(file, "utf8");
if (content.includes(before)) {
  fs.writeFileSync(file, content.replace(before, after));
  console.log("postinstall: patched prettier/index.cjs (ESM spaces-in-path fix)");
}

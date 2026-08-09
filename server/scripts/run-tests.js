const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const serverRoot = path.resolve(__dirname, "..");
const testDatabase = path.join(serverRoot, "prisma", "test.db");
fs.closeSync(fs.openSync(testDatabase, "a"));
const env = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL: `file:${testDatabase}`,
  JWT_SECRET: "test-secret-at-least-32-characters",
};

const run = (script, args) => {
  const result = spawnSync(process.execPath, [require.resolve(script), ...args], {
    cwd: serverRoot,
    env,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status || 1);
};

run("prisma/build/index.js", ["generate"]);
run("prisma/build/index.js", ["db", "push", "--skip-generate", "--accept-data-loss"]);
run("jest/bin/jest", ["--runInBand"]);

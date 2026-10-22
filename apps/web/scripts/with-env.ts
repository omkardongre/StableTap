// Run a command with variables from an env file: node scripts/with-env.ts <file> <cmd> [...args]
// (Next.js forwards node flags to its workers, and --env-file is not allowed there.)
import { spawn } from "node:child_process";

const [file, cmd, ...args] = process.argv.slice(2);
if (!file || !cmd) {
  console.error("usage: with-env.ts <env-file> <command> [...args]");
  process.exit(2);
}
process.loadEnvFile(file);
const child = spawn(cmd, args, { stdio: "inherit", env: process.env, shell: false });
child.on("error", (e) => {
  console.error(`could not start ${cmd}: ${e.message}`);
  process.exit(127);
});
child.on("exit", (code, signal) => (signal ? process.kill(process.pid, signal) : process.exit(code ?? 1)));

/** Session-Start Hook — GitFinder Starter */
import * as fs from "fs";
import * as path from "path";
interface HookResult { status: string; message?: string }
export default function sessionStartHook(): HookResult {
  const root = process.cwd();
  const msgs: string[] = [];
  if (!fs.existsSync(path.join(root, "node_modules"))) msgs.push("node_modules missing — run pnpm install");
  if (!fs.existsSync(path.join(root, "apps/gitfinder-hub/.env.local"))) msgs.push("No .env.local — run bash scripts/setup.sh");
  if (msgs.length > 0) return { status: "warn", message: msgs.join(" | ") };
  return { status: "pass", message: "GitFinder ready. Run: pnpm dev" };
}

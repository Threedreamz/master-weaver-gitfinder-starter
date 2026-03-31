/** Pre-Compact Hook — GitFinder Starter */
import * as fs from "fs";
import * as path from "path";
interface HookResult { status: string }
export default function preCompactHook(): HookResult {
  try {
    const d = path.join(process.cwd(), ".claude/logs");
    fs.mkdirSync(d, {recursive:true});
    fs.appendFileSync(path.join(d,"compact-context.md"), "[" + new Date().toISOString() + "] compacted
");
  } catch {}
  return {status:"pass"};
}

/** Stop Hook — GitFinder Starter */
import * as fs from "fs";
import * as path from "path";
interface HookResult { status: string }
export default function stopHook(): HookResult {
  try {
    const d = path.join(process.cwd(), ".claude/logs");
    fs.mkdirSync(d, {recursive:true});
    fs.appendFileSync(path.join(d,"sessions.log"), "[" + new Date().toISOString() + "] session ended
");
  } catch {}
  return {status:"pass"};
}

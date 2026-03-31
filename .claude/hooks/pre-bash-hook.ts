/** Pre-Bash Hook — GitFinder Starter */
interface HookResult { status: string; message?: string }
interface HookInput { command: string }
const BLOCKED = [
  { pattern: /rms+-[rf]+.*/(apps|packages)/, reason: "BLOCKED: Recursive delete of apps/ or packages/." },
  { pattern: /gits+push.*--force.*(main|master)/, reason: "BLOCKED: Force push to main/master forbidden." },
];
const WARN = [
  { pattern: /pnpms+publish/, message: "WARNING: Publishing — use --dry-run first." },
  { pattern: /railways+up/, message: "WARNING: Railway deploy — verify linked service." },
];
export default function preBashHook(input: HookInput): HookResult {
  const cmd = input.command || "";
  for (const { pattern, reason } of BLOCKED) if (pattern.test(cmd)) return { status: "block", message: reason };
  for (const { pattern, message } of WARN) if (pattern.test(cmd)) return { status: "warn", message };
  return { status: "pass" };
}

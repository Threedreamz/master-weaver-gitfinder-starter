/** Git Config Safety Hook — GitFinder Starter */
interface HookResult { status: string; message?: string }
interface HookInput { command: string }
export default function gitConfigSafetyHook(input: HookInput): HookResult {
  const cmd = input.command || "";
  if (/gits+configs+--global/.test(cmd)) return { status: "warn", message: "WARNING: Modifying global git config. Use --local for repo-scoped changes." };
  return { status: "pass" };
}

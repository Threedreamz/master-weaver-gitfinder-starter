/** Deploy Safety Hook — GitFinder Starter
 * Warns before Railway deploys.
 */
interface HookResult { status: string; message?: string }
interface HookInput { command: string }
export default function deploySafetyHook(input: HookInput): HookResult {
  const cmd = input.command || "";
  if (/railways+(up|deploy)/.test(cmd)) {
    return { status: "warn", message: "WARNING: Railway deploy detected. Verify railway status shows correct project/service/env." };
  }
  if (/railways+redeploy/.test(cmd)) {
    return { status: "warn", message: "WARNING: railway redeploy reuses the same built image — does NOT pick up new code. Use railway up for code changes." };
  }
  return { status: "pass" };
}

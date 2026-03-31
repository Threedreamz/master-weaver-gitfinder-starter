/** Post-Bash Hint Hook — GitFinder Starter
 * Suggests follow-up actions after common commands.
 */
interface HookResult { status: string; message?: string }
interface HookInput { command: string; exitCode?: number }
const HINTS = [
  { pattern: /pnpm install/, message: "Dependencies installed. Run: pnpm dev" },
  { pattern: /git commit/, message: "Committed! Push with: git push origin HEAD" },
  { pattern: /git push/, message: "Pushed! Open a PR or deploy with: bash scripts/deploy-railway.sh gitfinder-all" },
  { pattern: /pnpm turbo build/, message: "Build complete. Check for bundle size regressions." },
];
export default function postBashHintHook(input: HookInput): HookResult {
  if (input.exitCode !== 0) return { status: "pass" };
  const cmd = input.command || "";
  for (const {pattern, message} of HINTS) if (pattern.test(cmd)) return { status: "warn", message };
  return { status: "pass" };
}

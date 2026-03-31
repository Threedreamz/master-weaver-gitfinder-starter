/** Deploy Write Safety Hook — GitFinder Starter
 * Prevents accidental writes to production env files.
 */
interface HookResult { status: string; message?: string }
interface HookInput { filePath: string }
export default function deployWriteSafetyHook(input: HookInput): HookResult {
  const fp = (input.filePath || "").replace(//g, "/");
  if (/.env.production/.test(fp)) {
    return { status: "warn", message: "WARNING: Writing to .env.production. Ensure no secrets are committed." };
  }
  return { status: "pass" };
}

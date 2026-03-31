/** On-Error Hook — GitFinder Starter */
interface HookResult { status: string; message?: string }
interface HookInput { error: string }
const SUGGESTIONS = [
  { pattern: /MODULE_NOT_FOUND/, suggestion: "Run pnpm install." },
  { pattern: /ECONNREFUSED.*463/, suggestion: "GitFinder services not running. Run pnpm dev." },
  { pattern: /ECONNREFUSED.*5432/, suggestion: "PostgreSQL not running. Check DATABASE_URL." },
  { pattern: /TypeScript|tsc.*error/i, suggestion: "Run pnpm turbo typecheck for details." },
  { pattern: /ERR_PNPM/, suggestion: "Try: pnpm install --no-frozen-lockfile" },
];
export default function onErrorHook(input: HookInput): HookResult {
  const err = input.error||"";
  for (const {pattern,suggestion} of SUGGESTIONS) if (pattern.test(err)) return {status:"warn",message:suggestion};
  return {status:"pass"};
}

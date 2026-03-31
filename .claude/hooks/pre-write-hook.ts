/** Pre-Write Hook — GitFinder Starter */
interface HookResult { status: string; message?: string }
interface HookInput { filePath: string; content?: string }
const BLOCKED = [
  { pattern: /.env(.local|.production|.development)?$/, reason: "BLOCKED: .env files may contain secrets." },
  { pattern: /pnpm-lock.yaml$/, reason: "BLOCKED: Do not manually edit lockfile." },
];
const WARN = [
  { pattern: /next.config.[tj]s$/, message: "WARNING: Editing Next.js config." },
  { pattern: /.github/workflows//, message: "WARNING: Editing CI workflow." },
];
export default function preWriteHook(input: HookInput): HookResult {
  const fp = (input.filePath||"" ).replace(/\/g, "/");
  for (const {pattern,reason} of BLOCKED) if (pattern.test(fp)) return {status:"block",message:reason};
  for (const {pattern,message} of WARN) if (pattern.test(fp)) return {status:"warn",message};
  return {status:"pass"};
}

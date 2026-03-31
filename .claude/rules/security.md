# Security Rules

## Secrets
- Never hardcode API keys, passwords, or tokens in source code
- Use environment variables for all secrets
- AUTH_SECRET must be randomly generated per environment

## Auth
- FinderAuth OIDC for production auth
- Apps work without auth by default (mock mode)
- Required env vars: FINDERAUTH_ISSUER, FINDERAUTH_CLIENT_ID, FINDERAUTH_CLIENT_SECRET, AUTH_SECRET

## API Security
- All mutation endpoints require authentication
- Validate and sanitize all user inputs
- Use HTTPS in production (Railway handles TLS)

## Git Safety
- Never commit .env or .env.local files
- Never force push to main or master
- Review PRs before merging to main

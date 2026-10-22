# Deploying on Vercel

The public pages render on each request and read MongoDB at runtime. A successful
build does not verify the deployed database connection. The local `.env` files
are ignored by Git and are not uploaded with the repository.

1. In Vercel, open the project, then **Settings > Environment Variables**.
   Add the values for the environment you are deploying (Production or Preview):
   - `MONGODB_URI`: a connection string for a database reachable from Vercel.
     A local `localhost` database cannot be reached from the deployment.
   - `SESSION_SECRET`: at least 32 random characters, used by admin authentication.
   - `NEXT_PUBLIC_SITE_URL`: the full public URL, including `https://`.
2. If using MongoDB Atlas, confirm the database user credentials and configure
   Atlas Network Access to allow connections from the deployment's outbound IPs.
   A rule allowing only your development computer will not allow Vercel.
3. Redeploy after changing environment variables. Existing deployments retain
   their previous values.
4. Open `/` and `/bn`. If the database cannot be read, these pages show the
   bundled content from `lib/profile-defaults.ts`, and the server logs a
   `[portfolio] Could not load MongoDB profile` message. Admin pages and database
   writes still require a working connection; the fallback does not save data.

To create the admin account, run `pnpm seed:admin` locally with `ADMIN_EMAIL`,
`ADMIN_PASSWORD` (at least 12 characters), and the deployed database's
`MONGODB_URI` configured. This creates or resets that database's admin account.

For other runtime errors, open **Vercel > Project > Logs**, reload the failing
page, and inspect the error entry. The browser's digest is an error identifier;
the runtime log contains the diagnostic information. Do not share credentials
or full connection strings when sharing logs.

Local checks: `pnpm typecheck`, `pnpm build`, and
`pnpm exec tsx --test tests/deployment.test.ts`. The regression tests mock database
operations and do not connect to or modify a real database.


References: [Vercel environment variables](https://vercel.com/docs/environment-variables),
[MongoDB Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

Supabase quick setup for your static site

1) Store credentials securely
- For client/browser use only the publishable key (`SUPABASE_ANON_KEY`) and enable Row Level Security (RLS) on tables.
- For server-side operations use the `SUPABASE_SERVICE_ROLE_KEY` (never expose in browser).
- Copy `.env.example` to `.env` on your server and fill values.

2) Client (browser) example
- Use `supabase/client.example.html` as a starting point. Replace `<YOUR_PROJECT_REF>` with your Supabase project ref (project URL found in Supabase dashboard).
- Ensure tables you access have RLS enabled and policies allowing the intended actions.

3) Server example
- `supabase/server-example.js` is a minimal Express proxy using the service role key for privileged writes.
- Install deps:

```bash
npm init -y
npm i express @supabase/supabase-js dotenv
```

- Run locally:

```bash
cp supabase/.env.example .env
# edit .env with real values
node supabase/server-example.js
```

4) Running your SQL migrations
- You have `creation_bdd_supabase (2).sql` open; to run it against Supabase you can:
  - Use `psql` with your database connection string (from Supabase dashboard "Connection string"):

```bash
psql "postgresql://<db_user>:<db_pass>@db.<project_ref>.supabase.co:5432/postgres" -f "c:/Users/hugow/Downloads/creation_bdd_supabase (2).sql"
```

  - Or use the Supabase SQL editor in dashboard → SQL to paste & run the file contents.

5) Security notes
- Rotate keys if they were exposed.
- Do not commit `.env` or secret keys into source control.
- Prefer Edge Functions or serverless endpoints to keep secrets safe.

If you want, je peux:
- 1) créer un fichier `.env` (avec placeholders) et des scripts npm dans le workspace;
- 2) ajouter l'initialisation Supabase dans `Login.html`/auth flow pour remplacer le localStorage demo accounts;
- 3) exécuter une vérification automatique du fichier SQL et convertir le DDL au style Postgres-compatible si nécessaire.

Dites-moi quelle action vous voulez que je fasse maintenant.
-- Politiques RLS pour le site statique (clé publishable, rôles anon et authenticated).
-- À exécuter dans Supabase : Dashboard -> SQL Editor -> coller -> Run. Le script
-- est idempotent, il peut être relancé sans risque.
--
-- Contexte : le site n'a pas d'authentification Supabase (auth.js ne fait qu'un
-- contrôle de mot de passe en localStorage), toutes les requêtes partent donc
-- avec le rôle `anon`. Chaque table dont une politique manque provoque une
-- erreur côté caisse ou Fast Fashion :
--   * UPDATE manquant  -> 0 ligne modifiée, puis PostgREST `PGRST116`
--                         (« Cannot coerce the result to a single JSON object »)
--   * INSERT manquant  -> `42501` (« new row violates row-level security policy »)
--
-- Cas constatés : UPDATE absent sur `produits` (déduction de stock à la vente) et
-- `commandes_sfs` (statut Ship From Store), INSERT absent sur `charges`
-- (enregistrement d'une dépense dans Fast Fashion).
--
-- ⚠️ Ces politiques sont totalement permissives : la clé publishable étant dans
-- le navigateur, n'importe quel visiteur peut lire et écrire ces tables via
-- l'API PostgREST. C'est le modèle déjà en place sur le reste du projet. Pour
-- verrouiller réellement l'accès, il faut passer par l'authentification
-- Supabase (voir Login.html) et restreindre ces politiques au rôle
-- `authenticated`.

-- Politiques créées par une première version de ce script, remplacées ci-dessous.
drop policy if exists "produits_update_anon" on public.produits;
drop policy if exists "commandes_sfs_update_anon" on public.commandes_sfs;

do $$
declare
    table_name text;
    command_name text;
begin
    foreach table_name in array array[
        'produits', 'employes', 'fidelite', 'factures', 'factures_data',
        'planning', 'config', 'offres', 'charges', 'commandes_sfs'
    ]
    loop
        execute format('alter table public.%I enable row level security', table_name);

        foreach command_name in array array['select', 'insert', 'update', 'delete']
        loop
            execute format(
                'drop policy if exists %I on public.%I',
                table_name || '_' || command_name || '_public', table_name
            );
            execute format(
                'create policy %I on public.%I for %s to anon, authenticated %s',
                table_name || '_' || command_name || '_public',
                table_name,
                command_name,
                case command_name
                    when 'insert' then 'with check (true)'
                    when 'update' then 'using (true) with check (true)'
                    else 'using (true)'
                end
            );
        end loop;
    end loop;
end
$$;

-- Vérification : chaque table doit lister 4 politiques `_public`.
-- select tablename, count(*) from pg_policies
--  where schemaname = 'public' and policyname like '%\_public'
--  group by tablename order by tablename;

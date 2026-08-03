-- Politiques RLS manquantes pour le site statique (clé publishable, rôle anon).
-- À exécuter dans Supabase : Dashboard -> SQL Editor -> coller -> Run.
--
-- Contexte : les tables `produits` et `commandes_sfs` autorisent la lecture et
-- l'insertion mais aucune politique UPDATE n'existe. Un UPDATE renvoie alors 0
-- ligne, et `.single()` côté client échoue avec l'erreur PostgREST PGRST116
-- (« Cannot coerce the result to a single JSON object »). C'est ce qui se
-- produisait à la déduction de stock, juste après l'enregistrement de la
-- facture, lors de la confirmation d'un paiement en caisse.

-- Déduction du stock à la vente (Caisse) et ajustements/transferts (Fast Fashion).
drop policy if exists "produits_update_anon" on public.produits;
create policy "produits_update_anon"
    on public.produits
    for update
    to anon, authenticated
    using (true)
    with check (true);

-- Mise à jour du statut des commandes (Ship From Store).
drop policy if exists "commandes_sfs_update_anon" on public.commandes_sfs;
create policy "commandes_sfs_update_anon"
    on public.commandes_sfs
    for update
    to anon, authenticated
    using (true)
    with check (true);

-- Vérification : les deux requêtes doivent renvoyer une ligne.
-- update public.produits set stock_surface_vente = stock_surface_vente where id = 'P018' returning id;
-- select tablename, policyname, cmd from pg_policies
--  where schemaname = 'public' and tablename in ('produits', 'commandes_sfs');

# Migration Google Sheets / Apps Script vers Supabase

## Connexion unique

Chaque page charge le SDK Supabase v2, `js/config.js`, puis `js/supabase.js`.
Le seul client créé est exposé par `window.supabaseClient`. Les services et les
pages l'utilisent directement : aucun client n'est recréé.

Renseignez uniquement la clé publishable dans `js/config.js`. Ne placez jamais
de clé `service_role` ou toute autre clé secrète dans le navigateur.

## Couche d'accès aux données

Les services ES2022 sont dans `js/services/` et utilisent `async/await` avec
gestion centralisée des erreurs par `executeSupabase` :

| Service | Table Supabase |
| --- | --- |
| ProductService | `produits` |
| EmployeeService | `employes` |
| CustomerService | `fidelite` |
| InvoiceService | `factures` |
| PlanningService | `planning` |
| SettingsService | `config` |

Chaque service propose `getAll`, `getById`, `create`, `update`, `delete` et
`search`. `SettingsService` propose également `upsert`.

## Pages migrées

- Caisse : employés, produits, fidélité, paramètres, factures et lignes de facture.
- Fast Fashion : produits et charges.
- Planning : lecture, création, mise à jour et suppression des entrées.
- Ship From Store : commandes SFS et employés.
- Dashboard : factures.
- Config : fidélité, employés et offres.
- Login : authentification Supabase.

Les échanges de données utilisent les tables réelles du schéma fourni,
notamment `charges`, `commandes_sfs`, `offres` et `factures_data`.

## Vérification

Servez le projet sur `http://localhost` (pas avec une URL `file://`) puis
ouvrez la console du navigateur :

```js
await ProductService.getAll({ limit: 1 });
```

Un tableau ou `[]` confirme la connexion. Une erreur de politique RLS confirme
que le client atteint Supabase, mais que les politiques de la table doivent être
créées ou ajustées.

## Point à finaliser

Les politiques RLS doivent autoriser les rôles et les opérations voulus pour
chaque table. Cette configuration s'effectue dans Supabase et ne nécessite pas
de clé serveur dans ce projet statique.

`supabase/rls_policies.sql` contient les politiques `UPDATE` manquantes sur
`produits` et `commandes_sfs` (à exécuter dans le SQL Editor de Supabase). Sans
elles, la déduction de stock à la validation d'un paiement ne modifie aucune
ligne et l'ancien code remontait l'erreur PostgREST `PGRST116`.

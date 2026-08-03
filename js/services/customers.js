const CustomerService = {
    table: 'fidelite',
    async getAll(options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select(options.select || '*').order(options.orderBy || 'nom', { ascending: options.ascending ?? true }).limit(options.limit || 1000)); },
    async getById(id) { return executeSupabase(window.supabaseClient.from(this.table).select('*').eq('telephone', id).single()); },
    async create(customer) { return executeSupabase(window.supabaseClient.from(this.table).insert(customer).select().single()); },
    async update(id, customer) { return executeSupabase(window.supabaseClient.from(this.table).update(customer).eq('telephone', id).select().single()); },
    async delete(id) { await executeSupabase(window.supabaseClient.from(this.table).delete().eq('telephone', id)); },
    async search(term, options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select('*').ilike(options.column || 'telephone', `%${term}%`).order(options.orderBy || 'nom').limit(options.limit || 100)); }
};

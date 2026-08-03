const InvoiceService = {
    table: 'factures',
    async getAll(options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select(options.select || '*').order(options.orderBy || 'date_vente', { ascending: options.ascending ?? false }).limit(options.limit || 1000)); },
    async getById(id) { return executeSupabase(window.supabaseClient.from(this.table).select('*').eq('numero', id).single()); },
    async create(invoice) { return executeSupabase(window.supabaseClient.from(this.table).insert(invoice).select().single()); },
    async update(id, invoice) { return executeSupabase(window.supabaseClient.from(this.table).update(invoice).eq('numero', id).select().single()); },
    async delete(id) { await executeSupabase(window.supabaseClient.from(this.table).delete().eq('numero', id)); },
    async search(term, options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select('*').ilike(options.column || 'numero', `%${term}%`).order(options.orderBy || 'date_vente', { ascending: false }).limit(options.limit || 100)); }
};

const PlanningService = {
    table: 'planning',
    async getAll(options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select(options.select || '*').order(options.orderBy || 'date_evt', { ascending: options.ascending ?? true }).limit(options.limit || 1000)); },
    async getById(id) { return executeSupabase(window.supabaseClient.from(this.table).select('*').eq('id', id).single()); },
    async create(entry) { return executeSupabase(window.supabaseClient.from(this.table).insert(entry).select().single()); },
    async update(id, entry) { return executeSupabase(window.supabaseClient.from(this.table).update(entry).eq('id', id).select().single()); },
    async delete(id) { await executeSupabase(window.supabaseClient.from(this.table).delete().eq('id', id)); },
    async search(term, options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select('*').ilike(options.column || 'nom', `%${term}%`).order(options.orderBy || 'date_evt').limit(options.limit || 100)); }
};

const SettingsService = {
    table: 'config',
    async getAll(options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select(options.select || '*').order(options.orderBy || 'cle', { ascending: options.ascending ?? true }).limit(options.limit || 1000)); },
    async getById(id) { return executeSupabase(window.supabaseClient.from(this.table).select('*').eq('cle', id).single()); },
    async create(setting) { return executeSupabase(window.supabaseClient.from(this.table).insert(setting).select().single()); },
    async update(id, setting) { return executeSupabase(window.supabaseClient.from(this.table).update(setting).eq('cle', id).select().single()); },
    async delete(id) { await executeSupabase(window.supabaseClient.from(this.table).delete().eq('cle', id)); },
    async search(term, options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select('*').ilike(options.column || 'cle', `%${term}%`).order(options.orderBy || 'cle').limit(options.limit || 100)); },
    async upsert(setting) { return executeSupabase(window.supabaseClient.from(this.table).upsert(setting, { onConflict: 'cle' }).select().single()); }
};

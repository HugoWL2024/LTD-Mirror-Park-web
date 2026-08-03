const EmployeeService = {
    table: 'employes',
    async getAll(options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select(options.select || '*').order(options.orderBy || 'nom', { ascending: options.ascending ?? true }).limit(options.limit || 1000)); },
    async getById(id) { return executeSupabase(window.supabaseClient.from(this.table).select('*').eq('id', id).single()); },
    async create(employee) { return executeSupabase(window.supabaseClient.from(this.table).insert(employee).select().single()); },
    async update(id, employee) { return executeSupabase(window.supabaseClient.from(this.table).update(employee).eq('id', id).select().single()); },
    async delete(id) { await executeSupabase(window.supabaseClient.from(this.table).delete().eq('id', id)); },
    async search(term, options = {}) { return executeSupabase(window.supabaseClient.from(this.table).select('*').ilike(options.column || 'nom', `%${term}%`).order(options.orderBy || 'nom').limit(options.limit || 100)); }
};

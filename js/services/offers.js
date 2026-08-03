const OfferService = {
    table: 'offres',
    async getAll(options = {}) {
        return executeSupabase(
            window.supabaseClient
                .from(this.table)
                .select(options.select || '*')
                .order(options.orderBy || 'nom', { ascending: options.ascending ?? true })
                .limit(options.limit || 1000)
        );
    }
};

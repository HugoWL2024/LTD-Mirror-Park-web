const SupabaseSdk = window.supabaseJs || window.supabase || window.Supabase;
if (!SupabaseSdk || typeof SupabaseSdk.createClient !== 'function') {
    throw new Error('Le SDK Supabase n’a pas été chargé.');
}

window.supabaseClient = SupabaseSdk.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function executeSupabase(query) {
    try {
        const { data, error } = await query;
        if (error) throw error;
        return data;
    } catch (error) {
    console.error("===== ERREUR SUPABASE =====");
    console.error(error);
    console.error("Code :", error.code);
    console.error("Message :", error.message);
    console.error("Details :", error.details);
    console.error("Hint :", error.hint);

    alert(
        "Code : " + error.code +
        "\nMessage : " + error.message +
        "\nDetails : " + (error.details || "") +
        "\nHint : " + (error.hint || "")
    );

    throw error;
}
}

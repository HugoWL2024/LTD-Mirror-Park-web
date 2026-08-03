// auth.js - Système de contrôle d'accès par mot de passe admin pour le site LTD

/**
 * Demande le mot de passe administrateur et configure le rôle admin si valide
 */
function promptAdminPassword() {
    let password = null;
    try {
        password = prompt('Saisissez le mot de passe administrateur :');
    } catch(e) {
        // Fallback si prompt() non supporté
        password = 'bumpadia';
    }
    if (password === 'bumpadia') {
        localStorage.setItem('ltd_admin_session', 'true');
        return true;
    } else if (password === null) {
        return false;
    } else {
        alert('❌ Mot de passe incorrect ! Accès refusé.');
        return false;
    }
}

/**
 * Vérifie si l'accès administrateur est actif (via mot de passe)
 * Si l'accès est requis mais absent, demande le mot de passe
 */
function checkAuth(requiredRole = 'employe') {
    // Les pages employe sont maintenant libres d'accès direct sans login initial
    if (requiredRole === 'admin') {
        const isAdminSession = localStorage.getItem('ltd_admin_session') === 'true';
        if (!isAdminSession) {
            const success = promptAdminPassword();
            if (!success) {
                window.location.href = 'index.html';
                return false;
            }
        }
    }
    return true;
}

/**
 * Retirer les droits admin actifs
 */
function logout() {
    localStorage.removeItem('ltd_admin_session');
    location.reload();
}

/**
 * Vérifie si l'utilisateur est admin
 */
function hasRole(role) {
    if (role === 'admin') {
        return localStorage.getItem('ltd_admin_session') === 'true';
    }
    return true;
}

/**
 * Détecte les clics sur déconnexion / verrouillage et gère l'affichage du bouton Config
 */
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    const configLink = document.getElementById('config-link');

    function syncAdminUi() {
        if (configLink) {
            configLink.style.display = hasRole('admin') ? 'block' : 'none';
        }
        if (logoutBtn) {
            logoutBtn.textContent = hasRole('admin') ? '🔓 Admin connecté' : '🔐 Connexion Admin';
        }
    }

    if (logoutBtn) {
        syncAdminUi();
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!hasRole('admin')) {
                if (promptAdminPassword()) {
                    syncAdminUi();
                    alert('✅ Connexion admin activée.');
                }
                return;
            }
            if (confirm('Vous êtes déjà connecté admin. Voulez-vous vous déconnecter ?')) {
                localStorage.removeItem('ltd_admin_session');
                syncAdminUi();
            }
        });
    }

    syncAdminUi();
});

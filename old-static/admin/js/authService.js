/**
 * ManusDrip Admin - Authentication Service
 * 
 * Configured with Store Owner Password: Manojkumarkhan
 */

const AuthService = {
  SESSION_KEY: 'manusdrip_admin_auth_token',
  SESSION_USER_KEY: 'manusdrip_admin_user',
  OWNER_PASSWORD: 'Manojkumarkhan',

  /**
   * Verify password against server-side Google Apps Script and owner credentials
   * @param {string} password 
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async login(password) {
    if (!password || !password.trim()) {
      return { success: false, message: 'Please enter your admin password.' };
    }

    const cleanPassword = password.trim();
    const customPass = localStorage.getItem('manusdrip_admin_password_custom');
    const validLocally = (cleanPassword === this.OWNER_PASSWORD) || (customPass && cleanPassword === customPass);

    // 1. Direct Owner Password Match
    if (validLocally) {
      const token = 'MD_AUTH_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2);
      this.setSession(token, { name: 'Manoj Kumar', role: 'Store Owner', store: 'ManusDrip Hospet' });

      // Synchronize to Cloud if connected
      if (window.AdminAPI && AdminAPI.isConfigured()) {
        try {
          AdminAPI.postAction('UPDATE_SETTINGS', { admin_password: cleanPassword }).catch(() => {});
        } catch (e) {}
      }

      return { success: true };
    }

    // 2. If Google Apps Script API is configured, verify against server-side
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const url = AdminAPI.getApiUrl();
        const payload = {
          action: 'VERIFY_ADMIN',
          password: cleanPassword
        };

        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.token) {
            this.setSession(data.token, data.user || { name: 'Store Owner', role: 'Owner' });
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Apps Script authentication check:', err);
      }
    }

    return { success: false, message: 'Incorrect password.' };
  },

  /**
   * Save session token and user info
   */
  setSession(token, user) {
    localStorage.setItem(this.SESSION_KEY, token);
    localStorage.setItem(this.SESSION_USER_KEY, JSON.stringify(user));
  },

  /**
   * Check if current user is logged in
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.SESSION_KEY);
    return Boolean(token && token.trim());
  },

  /**
   * Get active admin token for API requests
   * @returns {string}
   */
  getToken() {
    return localStorage.getItem(this.SESSION_KEY) || '';
  },

  /**
   * Get current session user info
   * @returns {Object|null}
   */
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_USER_KEY)) || { name: 'Manoj Kumar', role: 'Store Owner' };
    } catch (e) {
      return { name: 'Manoj Kumar', role: 'Store Owner' };
    }
  },

  /**
   * Log out and clear session
   */
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_USER_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Route Guard: Call on protected admin pages
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }
};

window.AuthService = AuthService;

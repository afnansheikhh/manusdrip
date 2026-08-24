/**
 * ManusDrip - Central Store Configuration
 * Controls launch mode, WhatsApp parameters, social handles, and global settings
 */

const StoreConfig = {
  // Launch Status Mode: "COMING_SOON" or "LIVE"
  // When "LIVE", active products, shop grid, bag, and instant WhatsApp ordering are fully enabled.
  STORE_LAUNCH_MODE: localStorage.getItem('manusdrip_launch_mode') || "LIVE",

  isComingSoon() {
    return this.STORE_LAUNCH_MODE === "COMING_SOON";
  },

  // Store Identity
  STORE_NAME: "MANUSDRIP",
  STORE_TAGLINE: "WEAR YOUR DRIP.",
  STORE_LOCATION: "Hospet, Karnataka",
  CURRENCY_SYMBOL: "₹",
  CURRENCY_CODE: "INR",

  // Central WhatsApp Configuration
  DEFAULT_WHATSAPP_NUMBER: "916366691845",

  // Central Social Links
  INSTAGRAM_URL: "https://www.instagram.com/crushb0yy_?igsh=MXN3aXp3eTJtbXB1dg==",
  INSTAGRAM_HANDLE: "@crushb0yy_",

  /**
   * Get Active WhatsApp Number (Admin configured or default)
   * @returns {string} Clean digits WhatsApp number e.g. "916366691845"
   */
  getWhatsAppNumber() {
    const saved = localStorage.getItem('manusdrip_whatsapp_number');
    if (saved && saved.trim()) {
      return saved.replace(/\D/g, '');
    }
    return this.DEFAULT_WHATSAPP_NUMBER;
  },

  /**
   * Save WhatsApp Number from Admin Panel
   * @param {string} number 
   */
  setWhatsAppNumber(number) {
    const clean = String(number).replace(/\D/g, '');
    localStorage.setItem('manusdrip_whatsapp_number', clean);
  },

  /**
   * Generate Temporary Reference ID
   * Example: MD-20260810-8429
   * @returns {string}
   */
  generateReferenceId() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `MD-${dateStr}-${rand}`;
  },

  /**
   * Format Direct WhatsApp Click-to-Chat URL
   * @param {string} messageText 
   * @returns {string}
   */
  buildWhatsAppUrl(messageText) {
    const phone = this.getWhatsAppNumber();
    const encoded = encodeURIComponent(messageText.trim());
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  // Synchronized Global Pre-Launch Target Date for ALL Users
  // All users across all devices and browsers will count down to this exact moment
  LAUNCH_TARGET_ISO: "2026-08-17T23:59:59+05:30",

  /**
   * Get global launch countdown target timestamp
   * @returns {number} Target timestamp in milliseconds
   */
  getLaunchTargetTimestamp() {
    const adminCustom = localStorage.getItem('manusdrip_launch_target_date');
    if (adminCustom && adminCustom.trim()) {
      const parsed = new Date(adminCustom.trim()).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    return new Date(this.LAUNCH_TARGET_ISO).getTime();
  },

  /**
   * Get remaining countdown values synchronized for all users
   * @returns {{ total: number, days: string, hours: string, minutes: string, seconds: string, isExpired: boolean }}
   */
  getCountdownData() {
    const target = this.getLaunchTargetTimestamp();
    const now = Date.now();
    const total = Math.max(0, target - now);

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      isExpired: total <= 0,
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }
};

window.StoreConfig = StoreConfig;

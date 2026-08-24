/**
 * ManusDrip Admin - Core UI Logic & Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check auth for non-login pages
  const isLoginPage = window.location.pathname.endsWith('/admin/') || 
                      window.location.pathname.endsWith('/admin/index.html') ||
                      window.location.pathname.endsWith('/index.html');

  if (!isLoginPage && window.AuthService) {
    AuthService.requireAuth();
  }

  // Sidebar navigation active state
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile sidebar drawer trigger
  const toggleBtn = document.getElementById('adminSidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('adminBackdrop');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('active');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Set user email in header
  const user = AuthService.getCurrentUser();
  const userEmailEl = document.getElementById('adminUserEmail');
  if (userEmailEl && user) {
    userEmailEl.textContent = user.email;
  }
});

/**
 * Toast Notification for Admin Panel
 */
function adminToast(message, type = 'success') {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `
    <span class="admin-toast-icon">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Confirm Dialog Modal for Admin Panel
 */
function confirmDialog({ title = 'CONFIRM ACTION', message = 'Are you sure?', confirmText = 'CONFIRM', cancelText = 'CANCEL', onConfirm }) {
  let modal = document.getElementById('adminConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminConfirmModal';
    modal.className = 'admin-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="admin-modal-card">
      <h3 class="admin-modal-title">${title}</h3>
      <p class="admin-modal-msg">${message}</p>
      <div class="admin-modal-actions">
        <button type="button" class="admin-btn admin-btn-secondary" id="confirmCancelBtn">${cancelText}</button>
        <button type="button" class="admin-btn admin-btn-danger" id="confirmActionBtn">${confirmText}</button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  const cancelBtn = modal.querySelector('#confirmCancelBtn');
  const actionBtn = modal.querySelector('#confirmActionBtn');

  cancelBtn.onclick = () => {
    modal.classList.remove('active');
  };

  actionBtn.onclick = () => {
    modal.classList.remove('active');
    if (typeof onConfirm === 'function') onConfirm();
  };
}

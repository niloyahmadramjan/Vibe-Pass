'use client';

export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  info: (message) => showToast(message, 'info'),
};

function showToast(message, type) {
  const colors =
    type === 'success'
      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
      : 'linear-gradient(135deg, #EF4444, #DC2626)';

  const toastEl = document.createElement('div');
  toastEl.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 1000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    ">
      ${message}
    </div>
  `;
  document.body.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (document.body.contains(toastEl)) {
        document.body.removeChild(toastEl);
      }
    }, 300);
  }, 3000);

  // Inject animation styles once
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

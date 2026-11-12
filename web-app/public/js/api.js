/**
 * API Client & UI Utilities
 */

const API = {
    baseUrl: '/api',

    async get(endpoint) {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`);
            return await res.json();
        } catch (err) {
            console.error(`GET ${endpoint} failed:`, err);
            return { success: false, message: 'Gagal menghubungi server: ' + err.message };
        }
    },

    async post(endpoint, data) {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error(`POST ${endpoint} failed:`, err);
            return { success: false, message: 'Gagal mengirim data: ' + err.message };
        }
    },

    async put(endpoint, data = {}) {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error(`PUT ${endpoint} failed:`, err);
            return { success: false, message: 'Gagal memperbarui data: ' + err.message };
        }
    },

    async delete(endpoint) {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE'
            });
            return await res.json();
        } catch (err) {
            console.error(`DELETE ${endpoint} failed:`, err);
            return { success: false, message: 'Gagal menghapus data: ' + err.message };
        }
    }
};

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
        <span style="font-size: 18px;">${icon}</span>
        <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getStatusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'tersedia' || s === 'approved' || s === 'kembali') {
        return `<span class="badge badge-success">${status}</span>`;
    }
    if (s === 'dipinjam' || s === 'pending') {
        return `<span class="badge badge-warning">${status}</span>`;
    }
    if (s === 'rusak' || s === 'habis' || s === 'rejected') {
        return `<span class="badge badge-danger">${status}</span>`;
    }
    return `<span class="badge badge-muted">${status}</span>`;
}

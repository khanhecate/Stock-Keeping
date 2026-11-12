const { getPool, isDbConnected } = require('../config/database');
const { ALL_PERMISSION_KEYS, _mockAccessRoles } = require('./accessController');

// In-memory fallback if MySQL is offline during initial preview
const mockUsers = [
    {
        user_id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Administrator IT',
        access_id: 1,
        divisi: 'Information Technology',
        level: 'Administrator',
        is_active: 1
    },
    {
        user_id: 2,
        username: 'staff_ga',
        password: 'staff123',
        name: 'Staff HR & General Affairs',
        access_id: 2,
        divisi: 'HR & GA',
        level: 'Staff',
        is_active: 1
    },
    {
        user_id: 3,
        username: 'staff_opr',
        password: 'staff123',
        name: 'Staff Operasional',
        access_id: 3,
        divisi: 'Operasional',
        level: 'Staff',
        is_active: 1
    }
];

async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan Password wajib diisi!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT u.user_id, u.username, u.name, u.access_id, u.is_active,
                       IFNULL(a.divisi, u.divisi) AS divisi,
                       IFNULL(a.level, u.level) AS level,
                       a.permissions
                FROM users u
                LEFT JOIN access_roles a ON u.access_id = a.access_id
                WHERE u.username = ? AND u.password = ? AND u.is_active = 1
            `;
            const [rows] = await pool.query(sql, [username, password]);

            if (rows.length > 0) {
                const user = rows[0];
                let perms = [];
                if (user.permissions) {
                    perms = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions;
                }
                // If Administrator or IT, ensure full permissions
                if (user.level === 'Administrator' || (user.divisi && user.divisi.toLowerCase().includes('information technology'))) {
                    perms = ALL_PERMISSION_KEYS;
                }

                return res.json({
                    success: true,
                    message: 'Login berhasil!',
                    user: {
                        userId: user.user_id,
                        username: user.username,
                        name: user.name,
                        divisi: user.divisi || 'Umum',
                        level: user.level || 'Staff',
                        accessId: user.access_id,
                        permissions: perms
                    }
                });
            } else {
                return res.status(401).json({ success: false, message: 'Username atau Password salah!' });
            }
        } else {
            // Fallback for offline mode preview
            const user = mockUsers.find(u => u.username === username && u.password === password && u.is_active === 1);
            if (user) {
                const roleObj = _mockAccessRoles.find(r => r.access_id == user.access_id) || _mockAccessRoles[0];
                let perms = roleObj ? roleObj.permissions : ALL_PERMISSION_KEYS;
                if (user.level === 'Administrator') perms = ALL_PERMISSION_KEYS;

                return res.json({
                    success: true,
                    message: 'Login berhasil (Mode Offline/Demo)',
                    user: {
                        userId: user.user_id,
                        username: user.username,
                        name: user.name,
                        divisi: user.divisi,
                        level: user.level,
                        accessId: user.access_id,
                        permissions: perms
                    },
                    isOfflineMode: true
                });
            } else {
                return res.status(401).json({ success: false, message: 'Username atau Password salah!' });
            }
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem saat proses autentikasi: ' + err.message });
    }
}

async function getProfile(req, res) {
    return res.json({
        success: true,
        isDbConnected: isDbConnected(),
        serverTime: new Date().toISOString()
    });
}

module.exports = {
    login,
    getProfile
};

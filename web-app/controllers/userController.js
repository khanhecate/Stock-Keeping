const { getPool, isDbConnected } = require('../config/database');
const { _mockAccessRoles } = require('./accessController');

let mockUsersList = [
    {
        user_id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Administrator IT',
        access_id: 1,
        divisi: 'Information Technology',
        level: 'Administrator',
        is_active: 1,
        created_at: '2026-05-01 08:00:00'
    },
    {
        user_id: 2,
        username: 'staff_ga',
        password: 'staff123',
        name: 'Staff HR & General Affairs',
        access_id: 2,
        divisi: 'HR & GA',
        level: 'Staff',
        is_active: 1,
        created_at: '2026-05-02 09:00:00'
    },
    {
        user_id: 3,
        username: 'staff_opr',
        password: 'staff123',
        name: 'Staff Operasional Kantor',
        access_id: 3,
        divisi: 'Operasional',
        level: 'Staff',
        is_active: 1,
        created_at: '2026-05-03 10:00:00'
    }
];

async function getAllUsers(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT u.user_id, u.username, u.name, u.is_active, u.created_at,
                       u.access_id, IFNULL(a.divisi, u.divisi) AS divisi, IFNULL(a.level, u.level) AS level
                FROM users u
                LEFT JOIN access_roles a ON u.access_id = a.access_id
                WHERE (u.username LIKE ? OR u.name LIKE ? OR a.divisi LIKE ? OR u.divisi LIKE ?)
                ORDER BY u.user_id ASC
            `;
            const q = `%${search}%`;
            const [rows] = await pool.query(sql, [q, q, q, q]);
            return res.json({ success: true, data: rows });
        } else {
            const q = search.toLowerCase();
            const filtered = mockUsersList.filter(u =>
                u.username.toLowerCase().includes(q) ||
                u.name.toLowerCase().includes(q) ||
                (u.divisi && u.divisi.toLowerCase().includes(q))
            );
            return res.json({ success: true, data: filtered });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function createUser(req, res) {
    const { username, password, name, access_id, is_active } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: 'Username, password, dan nama lengkap wajib diisi!' });
    }

    try {
        const accessId = access_id ? parseInt(access_id, 10) : 1;
        const active = is_active !== undefined ? (is_active ? 1 : 0) : 1;

        if (isDbConnected()) {
            const pool = getPool();
            const [exist] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
            if (exist.length > 0) {
                return res.status(400).json({ success: false, message: 'Username sudah digunakan, silakan pilih username lain!' });
            }

            // Get divisi & level from access_roles
            let divisi = 'General';
            let level = 'Staff';
            if (accessId) {
                const [roles] = await pool.query('SELECT divisi, level FROM access_roles WHERE access_id = ?', [accessId]);
                if (roles.length > 0) {
                    divisi = roles[0].divisi;
                    level = roles[0].level;
                }
            }

            const sql = `
                INSERT INTO users (username, password, name, access_id, divisi, level, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            const [result] = await pool.query(sql, [username, password, name, accessId, divisi, level, level, active]);
            return res.json({ success: true, message: 'User berhasil didaftarkan!', id: result.insertId });
        } else {
            if (mockUsersList.some(u => u.username === username)) {
                return res.status(400).json({ success: false, message: 'Username sudah digunakan!' });
            }
            const roleObj = _mockAccessRoles.find(r => r.access_id == accessId) || _mockAccessRoles[0];
            const newUser = {
                user_id: Date.now(),
                username,
                password,
                name,
                access_id: accessId,
                divisi: roleObj ? roleObj.divisi : 'General',
                level: roleObj ? roleObj.level : 'Staff',
                is_active: active,
                created_at: new Date().toISOString()
            };
            mockUsersList.push(newUser);
            return res.json({ success: true, message: 'User berhasil didaftarkan (Demo)!', id: newUser.user_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal membuat user: ' + err.message });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { name, access_id, is_active, password } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi!' });
    }

    try {
        const accessId = access_id ? parseInt(access_id, 10) : null;
        const active = is_active !== undefined ? (is_active ? 1 : 0) : 1;

        if (isDbConnected()) {
            const pool = getPool();

            let divisi = null;
            let level = null;
            if (accessId) {
                const [roles] = await pool.query('SELECT divisi, level FROM access_roles WHERE access_id = ?', [accessId]);
                if (roles.length > 0) {
                    divisi = roles[0].divisi;
                    level = roles[0].level;
                }
            }

            if (password && password.trim() !== '') {
                await pool.query(
                    'UPDATE users SET name = ?, access_id = ?, divisi = ?, level = ?, role = ?, is_active = ?, password = ? WHERE user_id = ?',
                    [name, accessId, divisi, level, level, active, password, id]
                );
            } else {
                await pool.query(
                    'UPDATE users SET name = ?, access_id = ?, divisi = ?, level = ?, role = ?, is_active = ? WHERE user_id = ?',
                    [name, accessId, divisi, level, level, active, id]
                );
            }
            return res.json({ success: true, message: 'Data user berhasil diperbarui!' });
        } else {
            const u = mockUsersList.find(x => x.user_id == id);
            if (u) {
                u.name = name;
                u.access_id = accessId;
                const roleObj = _mockAccessRoles.find(r => r.access_id == accessId);
                if (roleObj) {
                    u.divisi = roleObj.divisi;
                    u.level = roleObj.level;
                }
                u.is_active = active;
                if (password && password.trim() !== '') u.password = password;
            }
            return res.json({ success: true, message: 'Data user berhasil diperbarui (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal memperbarui user: ' + err.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ success: false, message: 'User Administrator utama tidak boleh dinonaktifkan/dihapus!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE users SET is_active = 0 WHERE user_id = ?', [id]);
            return res.json({ success: true, message: 'User berhasil dinonaktifkan!' });
        } else {
            const u = mockUsersList.find(x => x.user_id == id);
            if (u) u.is_active = 0;
            return res.json({ success: true, message: 'User berhasil dinonaktifkan (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal menonaktifkan user: ' + err.message });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    _mockUsersList: mockUsersList
};

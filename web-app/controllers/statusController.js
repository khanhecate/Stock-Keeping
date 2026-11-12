const { getPool, isDbConnected } = require('../config/database');

let mockStatuses = [
    { status_id: 1, name: 'Tersedia', description: 'Barang siap digunakan atau dipinjam', is_deleted: 0 },
    { status_id: 2, name: 'Dipinjam', description: 'Barang sedang dibawa atau dipinjam oleh user/karyawan', is_deleted: 0 },
    { status_id: 3, name: 'Rusak', description: 'Barang memerlukan perbaikan atau afkir', is_deleted: 0 },
    { status_id: 4, name: 'Habis', description: 'Stok barang habis (untuk consumable)', is_deleted: 0 }
];

async function getAll(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM statuses WHERE is_deleted = 0 ORDER BY status_id ASC');
            return res.json({ success: true, data: rows });
        } else {
            return res.json({ success: true, data: mockStatuses.filter(s => s.is_deleted === 0) });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama status wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query('INSERT INTO statuses (name, description, is_deleted) VALUES (?, ?, 0)', [name, description || '']);
            return res.json({ success: true, message: 'Status berhasil ditambahkan!', id: result.insertId });
        } else {
            const item = { status_id: Date.now(), name, description: description || '', is_deleted: 0 };
            mockStatuses.push(item);
            return res.json({ success: true, message: 'Status berhasil ditambahkan (Demo)!', id: item.status_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama status wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE statuses SET name = ?, description = ? WHERE status_id = ?', [name, description || '', id]);
            return res.json({ success: true, message: 'Status berhasil diperbarui!' });
        } else {
            const item = mockStatuses.find(s => s.status_id == id);
            if (item) {
                item.name = name;
                item.description = description || '';
            }
            return res.json({ success: true, message: 'Status berhasil diperbarui (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function remove(req, res) {
    const { id } = req.params;
    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE statuses SET is_deleted = 1 WHERE status_id = ?', [id]);
            return res.json({ success: true, message: 'Status berhasil dihapus!' });
        } else {
            const item = mockStatuses.find(s => s.status_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Status berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, create, update, remove };

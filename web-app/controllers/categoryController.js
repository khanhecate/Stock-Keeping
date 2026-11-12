const { getPool, isDbConnected } = require('../config/database');

let mockCategories = [
    { category_id: 1, name: 'Elektronik & IT', type: 'ASET', is_deleted: 0 },
    { category_id: 2, name: 'Furniture & Kantor', type: 'ASET', is_deleted: 0 },
    { category_id: 3, name: 'Alat Tulis Kantor (ATK)', type: 'CONSUMABLE', is_deleted: 0 },
    { category_id: 4, name: 'Peralatan Kebersihan', type: 'CONSUMABLE', is_deleted: 0 },
    { category_id: 5, name: 'Kendaraan Operasional', type: 'ASET', is_deleted: 0 }
];

async function getAll(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM categories WHERE is_deleted = 0 ORDER BY category_id DESC');
            return res.json({ success: true, data: rows });
        } else {
            return res.json({ success: true, data: mockCategories.filter(c => c.is_deleted === 0) });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { name, type } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });
    const catType = type || 'ASET';

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query('INSERT INTO categories (name, type, is_deleted) VALUES (?, ?, 0)', [name, catType]);
            return res.json({ success: true, message: 'Kategori berhasil ditambahkan!', id: result.insertId });
        } else {
            const item = { category_id: Date.now(), name, type: catType, is_deleted: 0 };
            mockCategories.unshift(item);
            return res.json({ success: true, message: 'Kategori berhasil ditambahkan (Demo)!', id: item.category_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { name, type } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE categories SET name = ?, type = ? WHERE category_id = ?', [name, type || 'ASET', id]);
            return res.json({ success: true, message: 'Kategori berhasil diperbarui!' });
        } else {
            const item = mockCategories.find(c => c.category_id == id);
            if (item) {
                item.name = name;
                item.type = type || 'ASET';
            }
            return res.json({ success: true, message: 'Kategori berhasil diperbarui (Demo)!' });
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
            await pool.query('UPDATE categories SET is_deleted = 1 WHERE category_id = ?', [id]);
            return res.json({ success: true, message: 'Kategori berhasil dihapus!' });
        } else {
            const item = mockCategories.find(c => c.category_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Kategori berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, create, update, remove };

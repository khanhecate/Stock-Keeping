const { getPool, isDbConnected } = require('../config/database');

let mockSuppliers = [
    { supplier_id: 1, name: 'PT Mitra Teknologi Solusi', phone: '021-5551234', email: 'sales@mitratek.co.id', address: 'Jl. Jenderal Sudirman No. 45, Jakarta', is_deleted: 0 },
    { supplier_id: 2, name: 'CV Maju Jaya Abadi ATK', phone: '0812-3456-7890', email: 'contact@majujayaatk.com', address: 'Jl. Gatot Subroto Kav. 12, Jakarta', is_deleted: 0 }
];

async function getAll(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const q = `%${search}%`;
            const [rows] = await pool.query(
                'SELECT * FROM suppliers WHERE is_deleted = 0 AND (name LIKE ? OR phone LIKE ? OR email LIKE ?) ORDER BY supplier_id DESC',
                [q, q, q]
            );
            return res.json({ success: true, data: rows });
        } else {
            const q = search.toLowerCase();
            const filtered = mockSuppliers.filter(s =>
                s.is_deleted === 0 &&
                (s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.email.toLowerCase().includes(q))
            );
            return res.json({ success: true, data: filtered });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO suppliers (name, phone, email, address, is_deleted) VALUES (?, ?, ?, ?, 0)',
                [name, phone || '', email || '', address || '']
            );
            return res.json({ success: true, message: 'Supplier berhasil ditambahkan!', id: result.insertId });
        } else {
            const item = {
                supplier_id: Date.now(),
                name,
                phone: phone || '',
                email: email || '',
                address: address || '',
                is_deleted: 0
            };
            mockSuppliers.unshift(item);
            return res.json({ success: true, message: 'Supplier berhasil ditambahkan (Demo)!', id: item.supplier_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query(
                'UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ? WHERE supplier_id = ?',
                [name, phone || '', email || '', address || '', id]
            );
            return res.json({ success: true, message: 'Supplier berhasil diperbarui!' });
        } else {
            const item = mockSuppliers.find(s => s.supplier_id == id);
            if (item) {
                item.name = name;
                item.phone = phone || '';
                item.email = email || '';
                item.address = address || '';
            }
            return res.json({ success: true, message: 'Supplier berhasil diperbarui (Demo)!' });
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
            await pool.query('UPDATE suppliers SET is_deleted = 1 WHERE supplier_id = ?', [id]);
            return res.json({ success: true, message: 'Supplier berhasil dihapus!' });
        } else {
            const item = mockSuppliers.find(s => s.supplier_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Supplier berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, create, update, remove };

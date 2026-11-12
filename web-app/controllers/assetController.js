const { getPool, isDbConnected } = require('../config/database');

// Mock data store for offline preview
let mockAssets = [
    {
        asset_id: 1,
        barcode_code: 'AST-2026-001',
        name: 'Laptop Dell Latitude 3420',
        category_id: 1,
        category_name: 'Elektronik & IT',
        category_type: 'ASET',
        supplier_id: 1,
        supplier_name: 'PT Mitra Teknologi Solusi',
        location_id: 2,
        specification: 'Core i5 11th Gen, RAM 16GB, SSD 512GB',
        status: 'Tersedia',
        quantity: 5,
        unit: 'unit',
        created_at: '2026-05-10 10:00:00',
        is_deleted: 0
    },
    {
        asset_id: 2,
        barcode_code: 'AST-2026-002',
        name: 'Proyektor Epson EB-X500',
        category_id: 1,
        category_name: 'Elektronik & IT',
        category_type: 'ASET',
        supplier_id: 1,
        supplier_name: 'PT Mitra Teknologi Solusi',
        location_id: 1,
        specification: '3600 Lumens XGA 3LCD',
        status: 'Tersedia',
        quantity: 2,
        unit: 'unit',
        created_at: '2026-05-11 11:30:00',
        is_deleted: 0
    },
    {
        asset_id: 3,
        barcode_code: 'AST-2026-003',
        name: 'Kertas HVS A4 80gr PaperOne',
        category_id: 3,
        category_name: 'Alat Tulis Kantor (ATK)',
        category_type: 'CONSUMABLE',
        supplier_id: 2,
        supplier_name: 'CV Maju Jaya Abadi ATK',
        location_id: 1,
        specification: '1 Rim (500 Lembar) Warna Putih',
        status: 'Tersedia',
        quantity: 35,
        unit: 'rim',
        created_at: '2026-05-12 09:15:00',
        is_deleted: 0
    },
    {
        asset_id: 4,
        barcode_code: 'AST-2026-004',
        name: 'Kursi Kerja Ergonomis Mesh',
        category_id: 2,
        category_name: 'Furniture & Kantor',
        category_type: 'ASET',
        supplier_id: 2,
        supplier_name: 'CV Maju Jaya Abadi ATK',
        location_id: 3,
        specification: 'Tinggi bisa diatur, Lumbar support',
        status: 'Tersedia',
        quantity: 12,
        unit: 'unit',
        created_at: '2026-05-14 14:00:00',
        is_deleted: 0
    }
];

async function generateNextCode() {
    const year = new Date().getFullYear();
    const prefix = `AST-${year}-`;
    if (isDbConnected()) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT barcode_code FROM assets WHERE barcode_code LIKE ? ORDER BY asset_id DESC LIMIT 1',
            [`${prefix}%`]
        );
        if (rows.length > 0 && rows[0].barcode_code) {
            const lastCode = rows[0].barcode_code;
            const lastNum = parseInt(lastCode.substring(lastCode.lastIndexOf('-') + 1), 10);
            return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
        }
    } else {
        const matching = mockAssets.filter(a => a.barcode_code && a.barcode_code.startsWith(prefix));
        if (matching.length > 0) {
            const lastCode = matching[matching.length - 1].barcode_code;
            const lastNum = parseInt(lastCode.substring(lastCode.lastIndexOf('-') + 1), 10);
            return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
        }
    }
    return `${prefix}001`;
}

async function getNextCode(req, res) {
    try {
        const code = await generateNextCode();
        res.json({ success: true, code });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getAllAssets(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT a.*, c.name AS category_name, c.type AS category_type, s.name AS supplier_name, l.name AS location_name
                FROM assets a
                LEFT JOIN categories c ON a.category_id = c.category_id
                LEFT JOIN suppliers s ON a.supplier_id = s.supplier_id
                LEFT JOIN locations l ON a.location_id = l.location_id
                WHERE a.is_deleted = 0 AND (a.name LIKE ? OR a.barcode_code LIKE ? OR c.name LIKE ?)
                ORDER BY a.asset_id DESC
            `;
            const q = `%${search}%`;
            const [rows] = await pool.query(sql, [q, q, q]);
            return res.json({ success: true, data: rows });
        } else {
            const q = search.toLowerCase();
            const filtered = mockAssets.filter(a =>
                a.is_deleted === 0 &&
                (a.name.toLowerCase().includes(q) || (a.barcode_code && a.barcode_code.toLowerCase().includes(q)))
            );
            return res.json({ success: true, data: filtered });
        }
    } catch (err) {
        console.error('getAllAssets error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getAvailableForLoan(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT a.*, c.name AS category_name, c.type AS category_type, s.name AS supplier_name
                FROM assets a
                LEFT JOIN categories c ON a.category_id = c.category_id
                LEFT JOIN suppliers s ON a.supplier_id = s.supplier_id
                WHERE a.is_deleted = 0 AND (a.status = 'Tersedia' OR a.status = 'Idle' OR a.quantity > 0)
                ORDER BY a.name ASC
            `;
            const [rows] = await pool.query(sql);
            return res.json({ success: true, data: rows });
        } else {
            const available = mockAssets.filter(a => a.is_deleted === 0 && (a.status === 'Tersedia' || a.quantity > 0));
            return res.json({ success: true, data: available });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function createAsset(req, res) {
    let { barcode_code, name, category_id, supplier_id, location_id, specification, status, quantity, unit } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ success: false, message: 'Nama aset dan kategori wajib diisi!' });
    }

    try {
        if (!barcode_code) {
            barcode_code = await generateNextCode();
        }

        quantity = parseInt(quantity || 1, 10);
        status = status || (quantity > 0 ? 'Tersedia' : 'Habis');
        unit = unit || 'pcs';

        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                INSERT INTO assets (barcode_code, name, category_id, supplier_id, location_id, specification, status, quantity, unit, created_at, is_deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)
            `;
            const [result] = await pool.query(sql, [
                barcode_code,
                name,
                category_id,
                supplier_id || null,
                location_id || null,
                specification || '',
                status,
                quantity,
                unit
            ]);
            return res.json({ success: true, message: 'Aset berhasil ditambahkan!', id: result.insertId });
        } else {
            const newAsset = {
                asset_id: Date.now(),
                barcode_code,
                name,
                category_id: parseInt(category_id, 10),
                category_name: 'Kategori Mock',
                supplier_id: supplier_id ? parseInt(supplier_id, 10) : null,
                location_id: location_id ? parseInt(location_id, 10) : null,
                specification: specification || '',
                status,
                quantity,
                unit,
                created_at: new Date().toISOString(),
                is_deleted: 0
            };
            mockAssets.unshift(newAsset);
            return res.json({ success: true, message: 'Aset berhasil ditambahkan (Demo)', id: newAsset.asset_id });
        }
    } catch (err) {
        console.error('createAsset error:', err);
        return res.status(500).json({ success: false, message: 'Gagal menambahkan aset: ' + err.message });
    }
}

async function updateAsset(req, res) {
    const { id } = req.params;
    const { name, category_id, supplier_id, location_id, specification, status, quantity, unit } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ success: false, message: 'Nama dan kategori wajib diisi!' });
    }

    try {
        const qty = parseInt(quantity || 0, 10);
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                UPDATE assets 
                SET name = ?, category_id = ?, supplier_id = ?, location_id = ?, specification = ?, status = ?, quantity = ?, unit = ?
                WHERE asset_id = ?
            `;
            await pool.query(sql, [
                name,
                category_id,
                supplier_id || null,
                location_id || null,
                specification || '',
                status || (qty > 0 ? 'Tersedia' : 'Habis'),
                qty,
                unit || 'pcs',
                id
            ]);
            return res.json({ success: true, message: 'Data aset berhasil diperbarui!' });
        } else {
            const item = mockAssets.find(a => a.asset_id == id);
            if (item) {
                item.name = name;
                item.category_id = parseInt(category_id, 10);
                item.supplier_id = supplier_id ? parseInt(supplier_id, 10) : null;
                item.location_id = location_id ? parseInt(location_id, 10) : null;
                item.specification = specification || '';
                item.status = status || (qty > 0 ? 'Tersedia' : 'Habis');
                item.quantity = qty;
                item.unit = unit || 'pcs';
            }
            return res.json({ success: true, message: 'Data aset berhasil diperbarui (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal memperbarui aset: ' + err.message });
    }
}

async function deleteAsset(req, res) {
    const { id } = req.params;
    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE assets SET is_deleted = 1 WHERE asset_id = ?', [id]);
            return res.json({ success: true, message: 'Aset berhasil dihapus!' });
        } else {
            const item = mockAssets.find(a => a.asset_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Aset berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal menghapus aset: ' + err.message });
    }
}

module.exports = {
    getAllAssets,
    getAvailableForLoan,
    getNextCode,
    createAsset,
    updateAsset,
    deleteAsset,
    _mockAssets: mockAssets
};

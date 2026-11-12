const { getPool, isDbConnected } = require('../config/database');
const { _mockAssets } = require('./assetController');

async function getStockList(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT a.asset_id, a.barcode_code, a.name, a.quantity, a.unit, a.status,
                       c.name AS category_name, c.type AS category_type
                FROM assets a
                LEFT JOIN categories c ON a.category_id = c.category_id
                WHERE a.is_deleted = 0 AND (a.name LIKE ? OR a.barcode_code LIKE ?)
                ORDER BY a.name ASC
            `;
            const q = `%${search}%`;
            const [rows] = await pool.query(sql, [q, q]);
            return res.json({ success: true, data: rows });
        } else {
            const q = search.toLowerCase();
            const filtered = _mockAssets
                .filter(a => a.is_deleted === 0 && (a.name.toLowerCase().includes(q) || (a.barcode_code && a.barcode_code.toLowerCase().includes(q))))
                .map(a => ({
                    asset_id: a.asset_id,
                    barcode_code: a.barcode_code,
                    name: a.name,
                    quantity: a.quantity,
                    unit: a.unit,
                    status: a.status,
                    category_name: a.category_name,
                    category_type: a.category_type
                }));
            return res.json({ success: true, data: filtered });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function adjustStock(req, res) {
    const { asset_id, physical_qty, notes } = req.body;

    if (!asset_id || physical_qty === undefined || physical_qty === null) {
        return res.status(400).json({ success: false, message: 'ID Aset dan Jumlah Fisik wajib diisi!' });
    }

    const newQty = parseInt(physical_qty, 10);
    if (isNaN(newQty) || newQty < 0) {
        return res.status(400).json({ success: false, message: 'Jumlah fisik harus berupa bilangan bulat >= 0!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [assets] = await pool.query('SELECT * FROM assets WHERE asset_id = ? AND is_deleted = 0', [asset_id]);
            if (assets.length === 0) {
                return res.status(404).json({ success: false, message: 'Aset tidak ditemukan!' });
            }

            const asset = assets[0];
            let newStatus = asset.status;
            if (newQty === 0) {
                newStatus = 'Habis';
            } else if (newQty > 0 && asset.status === 'Habis') {
                newStatus = 'Tersedia';
            }

            await pool.query('UPDATE assets SET quantity = ?, status = ? WHERE asset_id = ?', [newQty, newStatus, asset_id]);
            return res.json({
                success: true,
                message: `Stok berhasil disesuaikan dari ${asset.quantity} menjadi ${newQty}!`
            });
        } else {
            const asset = _mockAssets.find(a => a.asset_id == asset_id);
            if (!asset) return res.status(404).json({ success: false, message: 'Aset tidak ditemukan!' });
            const oldQty = asset.quantity;
            asset.quantity = newQty;
            if (newQty === 0) asset.status = 'Habis';
            else if (newQty > 0 && asset.status === 'Habis') asset.status = 'Tersedia';

            return res.json({
                success: true,
                message: `Stok berhasil disesuaikan dari ${oldQty} menjadi ${newQty} (Demo)!`
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal melakukan penyesuaian stok: ' + err.message });
    }
}

module.exports = { getStockList, adjustStock };

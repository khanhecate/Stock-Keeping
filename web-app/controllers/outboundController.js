const { getPool, isDbConnected } = require('../config/database');
const { _mockAssets } = require('./assetController');

let mockOutbounds = [
    {
        outbound_id: 1,
        asset_id: 3,
        asset_name: 'Kertas HVS A4 80gr PaperOne',
        barcode_code: 'AST-2026-003',
        location_id: 3,
        location_name: 'Ruang Staff Lantai 2',
        quantity: 5,
        outbound_date: '2026-05-16',
        purpose: 'Kebutuhan cetak dokumen operasional bulanan'
    }
];

async function getAll(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT o.*, a.name AS asset_name, a.barcode_code, l.name AS location_name
                FROM outbounds o
                JOIN assets a ON o.asset_id = a.asset_id
                JOIN locations l ON o.location_id = l.location_id
                WHERE a.name LIKE ? OR a.barcode_code LIKE ? OR l.name LIKE ?
                ORDER BY o.outbound_date DESC, o.outbound_id DESC
            `;
            const q = `%${search}%`;
            const [rows] = await pool.query(sql, [q, q, q]);
            return res.json({ success: true, data: rows });
        } else {
            const q = search.toLowerCase();
            const filtered = mockOutbounds.filter(o =>
                o.asset_name.toLowerCase().includes(q) ||
                o.barcode_code.toLowerCase().includes(q) ||
                o.location_name.toLowerCase().includes(q)
            );
            return res.json({ success: true, data: filtered });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { asset_id, location_id, quantity, outbound_date, purpose } = req.body;

    if (!asset_id || !location_id || !quantity || !outbound_date) {
        return res.status(400).json({ success: false, message: 'Aset, lokasi tujuan, jumlah, dan tanggal keluar wajib diisi!' });
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
        return res.status(400).json({ success: false, message: 'Jumlah barang keluar minimal 1!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                const [assets] = await conn.query('SELECT * FROM assets WHERE asset_id = ? AND is_deleted = 0 FOR UPDATE', [asset_id]);
                if (assets.length === 0) {
                    await conn.rollback();
                    return res.status(404).json({ success: false, message: 'Aset tidak ditemukan!' });
                }

                const asset = assets[0];
                if (asset.quantity < qty) {
                    await conn.rollback();
                    return res.status(400).json({ success: false, message: `Stok tidak mencukupi! Sisa stok saat ini: ${asset.quantity}` });
                }

                const insertSql = `
                    INSERT INTO outbounds (asset_id, location_id, quantity, outbound_date, purpose)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const [result] = await conn.query(insertSql, [asset_id, location_id, qty, outbound_date, purpose || '']);

                const newQty = asset.quantity - qty;
                const newStatus = newQty === 0 ? 'Habis' : asset.status;
                await conn.query('UPDATE assets SET quantity = ?, status = ? WHERE asset_id = ?', [newQty, newStatus, asset_id]);

                await conn.commit();
                return res.json({ success: true, message: 'Pengeluaran barang berhasil dicatat!', id: result.insertId });
            } catch (txErr) {
                await conn.rollback();
                throw txErr;
            } finally {
                conn.release();
            }
        } else {
            const asset = _mockAssets.find(a => a.asset_id == asset_id);
            if (!asset || asset.quantity < qty) {
                return res.status(400).json({ success: false, message: 'Stok tidak mencukupi atau aset tidak ditemukan!' });
            }
            asset.quantity -= qty;
            if (asset.quantity === 0) asset.status = 'Habis';

            const newOut = {
                outbound_id: Date.now(),
                asset_id: parseInt(asset_id, 10),
                asset_name: asset.name,
                barcode_code: asset.barcode_code,
                location_id: parseInt(location_id, 10),
                location_name: 'Lokasi Kantor',
                quantity: qty,
                outbound_date,
                purpose: purpose || ''
            };
            mockOutbounds.unshift(newOut);
            return res.json({ success: true, message: 'Pengeluaran barang berhasil dicatat (Demo)!', id: newOut.outbound_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal mencatat pengeluaran barang: ' + err.message });
    }
}

module.exports = { getAll, create };

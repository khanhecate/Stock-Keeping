const { getPool, isDbConnected } = require('../config/database');
const { _mockAssets } = require('./assetController');

let mockLoans = [
    {
        loan_id: 1,
        pic_name: 'Budi Santoso',
        division: 'Marketing',
        asset_id: 1,
        asset_name: 'Laptop Dell Latitude 3420',
        barcode_code: 'AST-2026-001',
        location_destination: 'Ruang Rapat Garuda',
        loan_date: '2026-05-15',
        return_date_estimate: '2026-05-18',
        actual_return_date: null,
        purpose: 'Presentasi Proyek Klien',
        status: 'Dipinjam',
        quantity: 1,
        created_at: '2026-05-15 09:00:00'
    }
];

async function getAll(req, res) {
    const status = req.query.status || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            let sql = `
                SELECT l.*, a.barcode_code, a.name AS asset_name, c.type AS category_type
                FROM loans l
                JOIN assets a ON l.asset_id = a.asset_id
                JOIN categories c ON a.category_id = c.category_id
            `;
            const params = [];
            if (status) {
                sql += ' WHERE l.status = ?';
                params.push(status);
            }
            sql += ' ORDER BY l.loan_id DESC';

            const [rows] = await pool.query(sql, params);
            return res.json({ success: true, data: rows });
        } else {
            let data = mockLoans;
            if (status) {
                data = data.filter(l => l.status === status);
            }
            return res.json({ success: true, data });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { pic_name, division, asset_id, location_destination, loan_date, return_date_estimate, purpose, quantity } = req.body;

    if (!pic_name || !division || !asset_id || !loan_date) {
        return res.status(400).json({ success: false, message: 'Data peminjam, aset, dan tanggal pinjam wajib diisi!' });
    }

    const qty = parseInt(quantity || 1, 10);
    if (qty <= 0) {
        return res.status(400).json({ success: false, message: 'Jumlah peminjaman minimal 1!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                // 1. Check asset availability & current stock
                const [assets] = await conn.query('SELECT * FROM assets WHERE asset_id = ? AND is_deleted = 0 FOR UPDATE', [asset_id]);
                if (assets.length === 0) {
                    await conn.rollback();
                    return res.status(404).json({ success: false, message: 'Aset tidak ditemukan!' });
                }

                const asset = assets[0];
                if (asset.quantity < qty) {
                    await conn.rollback();
                    return res.status(400).json({ success: false, message: `Stok aset tidak mencukupi! Tersedia: ${asset.quantity}` });
                }

                // 2. Insert Loan
                const insertLoanSql = `
                    INSERT INTO loans (pic_name, division, asset_id, location_destination, loan_date, return_date_estimate, purpose, status, quantity)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Dipinjam', ?)
                `;
                const [loanResult] = await conn.query(insertLoanSql, [
                    pic_name,
                    division,
                    asset_id,
                    location_destination || '',
                    loan_date,
                    return_date_estimate || null,
                    purpose || '',
                    qty
                ]);

                // 3. Deduct Asset Quantity & Update Status if needed
                const newQty = asset.quantity - qty;
                const newStatus = newQty === 0 ? 'Dipinjam' : asset.status;
                await conn.query('UPDATE assets SET quantity = ?, status = ? WHERE asset_id = ?', [newQty, newStatus, asset_id]);

                await conn.commit();
                return res.json({ success: true, message: 'Peminjaman berhasil dicatat!', id: loanResult.insertId });
            } catch (txErr) {
                await conn.rollback();
                throw txErr;
            } finally {
                conn.release();
            }
        } else {
            // Mock mode
            const asset = _mockAssets.find(a => a.asset_id == asset_id);
            if (!asset || asset.quantity < qty) {
                return res.status(400).json({ success: false, message: 'Stok aset tidak mencukupi atau aset tidak ditemukan!' });
            }
            asset.quantity -= qty;
            if (asset.quantity === 0) asset.status = 'Dipinjam';

            const newLoan = {
                loan_id: Date.now(),
                pic_name,
                division,
                asset_id: parseInt(asset_id, 10),
                asset_name: asset.name,
                barcode_code: asset.barcode_code,
                location_destination: location_destination || '',
                loan_date,
                return_date_estimate: return_date_estimate || null,
                actual_return_date: null,
                purpose: purpose || '',
                status: 'Dipinjam',
                quantity: qty,
                created_at: new Date().toISOString()
            };
            mockLoans.unshift(newLoan);
            return res.json({ success: true, message: 'Peminjaman berhasil dicatat (Demo)!', id: newLoan.loan_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal mencatat peminjaman: ' + err.message });
    }
}

async function returnLoan(req, res) {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                const [loans] = await conn.query('SELECT * FROM loans WHERE loan_id = ? FOR UPDATE', [id]);
                if (loans.length === 0) {
                    await conn.rollback();
                    return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan!' });
                }

                const loan = loans[0];
                if (loan.status === 'Kembali') {
                    await conn.rollback();
                    return res.status(400).json({ success: false, message: 'Barang ini sudah dikembalikan sebelumnya!' });
                }

                // 1. Update loan status and actual return date
                await conn.query('UPDATE loans SET status = ?, actual_return_date = ? WHERE loan_id = ?', ['Kembali', today, id]);

                // 2. Restore asset quantity and status to 'Tersedia'
                await conn.query('UPDATE assets SET quantity = quantity + ?, status = ? WHERE asset_id = ?', [loan.quantity, 'Tersedia', loan.asset_id]);

                await conn.commit();
                return res.json({ success: true, message: 'Barang berhasil dikembalikan dan stok telah dipulihkan!' });
            } catch (txErr) {
                await conn.rollback();
                throw txErr;
            } finally {
                conn.release();
            }
        } else {
            const loan = mockLoans.find(l => l.loan_id == id);
            if (!loan) return res.status(404).json({ success: false, message: 'Data tidak ditemukan!' });
            loan.status = 'Kembali';
            loan.actual_return_date = today;

            const asset = _mockAssets.find(a => a.asset_id == loan.asset_id);
            if (asset) {
                asset.quantity += loan.quantity;
                asset.status = 'Tersedia';
            }
            return res.json({ success: true, message: 'Barang berhasil dikembalikan (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal memproses pengembalian: ' + err.message });
    }
}

module.exports = { getAll, create, returnLoan };

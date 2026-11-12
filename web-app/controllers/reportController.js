const { getPool, isDbConnected } = require('../config/database');
const ExcelJS = require('exceljs');

async function getAssetHistory(req, res) {
    const { start_date, end_date } = req.query;
    try {
        if (isDbConnected()) {
            const pool = getPool();
            let sql = `
                SELECT DATE(a.created_at) AS trans_date, a.barcode_code, a.name AS asset_name,
                       'Barang Masuk' AS trans_type, a.quantity, IFNULL(l.name, '-') AS location, 'Stok Awal / Registrasi' AS purpose
                FROM assets a
                LEFT JOIN locations l ON a.location_id = l.location_id
                WHERE a.is_deleted = 0

                UNION ALL

                SELECT o.outbound_date AS trans_date, a.barcode_code, a.name AS asset_name,
                       'Barang Keluar' AS trans_type, o.quantity, IFNULL(l.name, '-') AS location, o.purpose
                FROM outbounds o
                JOIN assets a ON o.asset_id = a.asset_id
                LEFT JOIN locations l ON o.location_id = l.location_id

                UNION ALL

                SELECT ln.loan_date AS trans_date, a.barcode_code, a.name AS asset_name,
                       CONCAT('Peminjaman (', ln.status, ')') AS trans_type, ln.quantity, IFNULL(ln.location_destination, '-') AS location,
                       CONCAT(ln.pic_name, ' (', ln.division, ') - ', IFNULL(ln.purpose, '')) AS purpose
                FROM loans ln
                JOIN assets a ON ln.asset_id = a.asset_id
            `;

            if (start_date && end_date) {
                sql = `SELECT * FROM (${sql}) AS history WHERE trans_date BETWEEN ? AND ? ORDER BY trans_date DESC`;
                const [rows] = await pool.query(sql, [start_date, end_date]);
                return res.json({ success: true, data: rows });
            } else {
                sql = `SELECT * FROM (${sql}) AS history ORDER BY trans_date DESC LIMIT 200`;
                const [rows] = await pool.query(sql);
                return res.json({ success: true, data: rows });
            }
        } else {
            // Mock sample
            const sampleHistory = [
                { trans_date: '2026-05-16', barcode_code: 'AST-2026-003', asset_name: 'Kertas HVS A4 80gr PaperOne', trans_type: 'Barang Keluar', quantity: 5, location: 'Ruang Staff Lantai 2', purpose: 'Kebutuhan cetak operasional' },
                { trans_date: '2026-05-15', barcode_code: 'AST-2026-001', asset_name: 'Laptop Dell Latitude 3420', trans_type: 'Peminjaman (Dipinjam)', quantity: 1, location: 'Ruang Rapat Garuda', purpose: 'Budi Santoso (Marketing) - Presentasi' },
                { trans_date: '2026-05-12', barcode_code: 'AST-2026-003', asset_name: 'Kertas HVS A4 80gr PaperOne', trans_type: 'Barang Masuk', quantity: 40, location: 'Gudang Utama Lantai 1', purpose: 'Stok Awal' },
                { trans_date: '2026-05-10', barcode_code: 'AST-2026-001', asset_name: 'Laptop Dell Latitude 3420', trans_type: 'Barang Masuk', quantity: 5, location: 'Ruang Server / IT', purpose: 'Stok Awal' }
            ];
            return res.json({ success: true, data: sampleHistory });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function exportExcel(req, res) {
    const { type } = req.query; // 'asset', 'loan', 'booking', 'stock'
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistem Inventory Kantor';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet('Laporan');

        if (type === 'loan') {
            sheet.columns = [
                { header: 'No', key: 'no', width: 6 },
                { header: 'Nama Peminjam (PIC)', key: 'pic', width: 22 },
                { header: 'Divisi', key: 'division', width: 18 },
                { header: 'Barcode', key: 'barcode', width: 16 },
                { header: 'Nama Aset', key: 'asset', width: 28 },
                { header: 'Qty', key: 'qty', width: 8 },
                { header: 'Lokasi Tujuan', key: 'loc', width: 22 },
                { header: 'Tgl Pinjam', key: 'date_loan', width: 14 },
                { header: 'Estimasi Kembali', key: 'date_return', width: 16 },
                { header: 'Status', key: 'status', width: 12 }
            ];

            if (isDbConnected()) {
                const pool = getPool();
                const [rows] = await pool.query(`
                    SELECT l.*, a.barcode_code, a.name AS asset_name 
                    FROM loans l JOIN assets a ON l.asset_id = a.asset_id 
                    ORDER BY l.loan_id DESC
                `);
                rows.forEach((r, idx) => {
                    sheet.addRow({
                        no: idx + 1,
                        pic: r.pic_name,
                        division: r.division,
                        barcode: r.barcode_code,
                        asset: r.asset_name,
                        qty: r.quantity,
                        loc: r.location_destination,
                        date_loan: r.loan_date,
                        date_return: r.return_date_estimate,
                        status: r.status
                    });
                });
            }
        } else if (type === 'booking') {
            sheet.columns = [
                { header: 'No', key: 'no', width: 6 },
                { header: 'Nama Ruangan', key: 'room', width: 24 },
                { header: 'Waktu Mulai', key: 'start', width: 20 },
                { header: 'Waktu Selesai', key: 'end', width: 20 },
                { header: 'PIC', key: 'pic', width: 20 },
                { header: 'Divisi', key: 'division', width: 18 },
                { header: 'Peserta', key: 'participants', width: 10 },
                { header: 'Keperluan', key: 'purpose', width: 30 },
                { header: 'Status', key: 'status', width: 14 }
            ];

            if (isDbConnected()) {
                const pool = getPool();
                const [rows] = await pool.query(`
                    SELECT b.*, r.name AS room_name 
                    FROM meeting_bookings b JOIN meeting_rooms r ON b.room_id = r.room_id 
                    ORDER BY b.start_time DESC
                `);
                rows.forEach((r, idx) => {
                    sheet.addRow({
                        no: idx + 1,
                        room: r.room_name,
                        start: r.start_time,
                        end: r.end_time,
                        pic: r.pic_name,
                        division: r.division,
                        participants: r.participants,
                        purpose: r.purpose,
                        status: r.status
                    });
                });
            }
        } else {
            // Default: Assets & Stock
            sheet.columns = [
                { header: 'No', key: 'no', width: 6 },
                { header: 'Barcode', key: 'barcode', width: 16 },
                { header: 'Nama Aset / Barang', key: 'name', width: 30 },
                { header: 'Kategori', key: 'category', width: 20 },
                { header: 'Stok', key: 'qty', width: 10 },
                { header: 'Satuan', key: 'unit', width: 10 },
                { header: 'Status', key: 'status', width: 14 },
                { header: 'Lokasi', key: 'location', width: 22 }
            ];

            if (isDbConnected()) {
                const pool = getPool();
                const [rows] = await pool.query(`
                    SELECT a.*, c.name AS category_name, l.name AS location_name 
                    FROM assets a 
                    LEFT JOIN categories c ON a.category_id = c.category_id 
                    LEFT JOIN locations l ON a.location_id = l.location_id 
                    WHERE a.is_deleted = 0 
                    ORDER BY a.name ASC
                `);
                rows.forEach((r, idx) => {
                    sheet.addRow({
                        no: idx + 1,
                        barcode: r.barcode_code,
                        name: r.name,
                        category: r.category_name,
                        qty: r.quantity,
                        unit: r.unit,
                        status: r.status,
                        location: r.location_name || '-'
                    });
                });
            }
        }

        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1E293B' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_${type || 'Inventory'}_${new Date().toISOString().split('T')[0]}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Excel Export error:', err);
        res.status(500).json({ success: false, message: 'Gagal mengekspor Excel: ' + err.message });
    }
}

module.exports = { getAssetHistory, exportExcel };

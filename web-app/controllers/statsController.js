const { getPool, isDbConnected } = require('../config/database');
const { _mockAssets } = require('./assetController');

async function getDashboardStats(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();

            // 1. Total Assets
            const [assetRows] = await pool.query('SELECT COUNT(*) AS total, SUM(quantity) AS total_qty FROM assets WHERE is_deleted = 0');
            const totalAssets = assetRows[0].total || 0;
            const totalQuantity = assetRows[0].total_qty || 0;

            // 2. Active Loans (Dipinjam)
            const [loanRows] = await pool.query("SELECT COUNT(*) AS active_loans FROM loans WHERE status = 'Dipinjam'");
            const activeLoans = loanRows[0].active_loans || 0;

            // 3. Today's Bookings
            const [bookingRows] = await pool.query(`
                SELECT COUNT(*) AS today_bookings 
                FROM meeting_bookings 
                WHERE DATE(start_time) = CURDATE() AND status != 'Rejected'
            `);
            const todayBookings = bookingRows[0].today_bookings || 0;

            // 4. Low/Empty Stock (qty <= 2)
            const [lowStockRows] = await pool.query('SELECT COUNT(*) AS low_stock FROM assets WHERE is_deleted = 0 AND quantity <= 2');
            const lowStock = lowStockRows[0].low_stock || 0;

            // 5. Recent Loans
            const [recentLoans] = await pool.query(`
                SELECT l.loan_id, l.pic_name, l.division, l.loan_date, l.status, a.name AS asset_name, a.barcode_code
                FROM loans l JOIN assets a ON l.asset_id = a.asset_id
                ORDER BY l.loan_id DESC LIMIT 5
            `);

            // 6. Today/Upcoming Bookings
            const [upcomingBookings] = await pool.query(`
                SELECT b.booking_id, b.pic_name, b.division, b.start_time, b.end_time, b.status, r.name AS room_name
                FROM meeting_bookings b JOIN meeting_rooms r ON b.room_id = r.room_id
                WHERE b.end_time >= NOW() AND b.status != 'Rejected'
                ORDER BY b.start_time ASC LIMIT 5
            `);

            // 7. Categories breakdown
            const [categoryStats] = await pool.query(`
                SELECT c.name, COUNT(a.asset_id) AS asset_count, IFNULL(SUM(a.quantity), 0) AS total_stock
                FROM categories c
                LEFT JOIN assets a ON c.category_id = a.category_id AND a.is_deleted = 0
                WHERE c.is_deleted = 0
                GROUP BY c.category_id, c.name
                ORDER BY asset_count DESC
            `);

            return res.json({
                success: true,
                stats: {
                    totalAssets,
                    totalQuantity,
                    activeLoans,
                    todayBookings,
                    lowStock
                },
                recentLoans,
                upcomingBookings,
                categoryStats
            });
        } else {
            // Mock stats for demo
            return res.json({
                success: true,
                stats: {
                    totalAssets: _mockAssets.filter(a => a.is_deleted === 0).length,
                    totalQuantity: _mockAssets.reduce((acc, a) => acc + a.quantity, 0),
                    activeLoans: 1,
                    todayBookings: 1,
                    lowStock: _mockAssets.filter(a => a.quantity <= 2).length
                },
                recentLoans: [
                    { loan_id: 1, pic_name: 'Budi Santoso', division: 'Marketing', loan_date: '2026-05-15', status: 'Dipinjam', asset_name: 'Laptop Dell Latitude 3420', barcode_code: 'AST-2026-001' }
                ],
                upcomingBookings: [
                    { booking_id: 1, pic_name: 'Dewi Lestari', division: 'HR', start_time: '2026-05-20 09:00:00', end_time: '2026-05-20 11:30:00', status: 'Approved', room_name: 'Ruang Rapat Garuda' }
                ],
                categoryStats: [
                    { name: 'Elektronik & IT', asset_count: 2, total_stock: 7 },
                    { name: 'Alat Tulis Kantor (ATK)', asset_count: 1, total_stock: 35 },
                    { name: 'Furniture & Kantor', asset_count: 1, total_stock: 12 }
                ]
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getDashboardStats };

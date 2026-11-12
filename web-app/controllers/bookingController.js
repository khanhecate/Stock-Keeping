const { getPool, isDbConnected } = require('../config/database');

let mockBookings = [
    {
        booking_id: 1,
        room_id: 1,
        room_name: 'Ruang Rapat Garuda',
        start_time: '2026-05-20 09:00:00',
        end_time: '2026-05-20 11:30:00',
        pic_name: 'Dewi Lestari',
        division: 'Human Resources',
        position: 'HR Manager',
        participants: 10,
        purpose: 'Townhall & Evaluasi Karyawan Kuartal 1',
        status: 'Approved',
        created_at: '2026-05-18 10:00:00'
    }
];

async function isRoomAvailable(roomId, startTime, endTime, excludeBookingId = null) {
    if (isDbConnected()) {
        const pool = getPool();
        let sql = `
            SELECT COUNT(*) AS conflict_count
            FROM meeting_bookings
            WHERE room_id = ?
              AND status != 'Rejected'
              AND start_time < ?
              AND end_time > ?
        `;
        const params = [roomId, endTime, startTime];
        if (excludeBookingId) {
            sql += ' AND booking_id != ?';
            params.push(excludeBookingId);
        }
        const [rows] = await pool.query(sql, params);
        return rows[0].conflict_count === 0;
    } else {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const conflict = mockBookings.find(b =>
            b.room_id == roomId &&
            b.status !== 'Rejected' &&
            (!excludeBookingId || b.booking_id != excludeBookingId) &&
            new Date(b.start_time).getTime() < end &&
            new Date(b.end_time).getTime() > start
        );
        return !conflict;
    }
}

async function getAll(req, res) {
    const status = req.query.status || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            let sql = `
                SELECT b.*, r.name AS room_name
                FROM meeting_bookings b
                JOIN meeting_rooms r ON b.room_id = r.room_id
            `;
            const params = [];
            if (status) {
                sql += ' WHERE b.status = ?';
                params.push(status);
            }
            sql += ' ORDER BY b.start_time DESC';
            const [rows] = await pool.query(sql, params);
            return res.json({ success: true, data: rows });
        } else {
            let data = mockBookings;
            if (status) data = data.filter(b => b.status === status);
            return res.json({ success: true, data });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function checkAvailability(req, res) {
    const { room_id, start_time, end_time } = req.query;
    if (!room_id || !start_time || !end_time) {
        return res.status(400).json({ success: false, message: 'Ruangan, waktu mulai, dan waktu selesai harus ditentukan!' });
    }

    try {
        const available = await isRoomAvailable(room_id, start_time, end_time);
        return res.json({ success: true, available });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { room_id, start_time, end_time, pic_name, division, position, participants, purpose, status } = req.body;

    if (!room_id || !start_time || !end_time || !pic_name) {
        return res.status(400).json({ success: false, message: 'Ruangan, waktu, dan PIC wajib diisi!' });
    }

    if (new Date(start_time) >= new Date(end_time)) {
        return res.status(400).json({ success: false, message: 'Waktu selesai harus lebih besar dari waktu mulai!' });
    }

    try {
        const available = await isRoomAvailable(room_id, start_time, end_time);
        if (!available) {
            return res.status(409).json({
                success: false,
                message: 'Jadwal bentrok! Ruangan sudah dibooking oleh PIC lain pada rentang jam tersebut.'
            });
        }

        const bookingStatus = status || 'Approved';

        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                INSERT INTO meeting_bookings (room_id, start_time, end_time, pic_name, division, position, participants, purpose, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            const [result] = await pool.query(sql, [
                room_id,
                start_time,
                end_time,
                pic_name,
                division || '',
                position || '',
                parseInt(participants || 1, 10),
                purpose || '',
                bookingStatus
            ]);
            return res.json({ success: true, message: 'Pemesanan ruangan berhasil disimpan!', id: result.insertId });
        } else {
            const newBooking = {
                booking_id: Date.now(),
                room_id: parseInt(room_id, 10),
                room_name: 'Ruang Rapat Kantor',
                start_time,
                end_time,
                pic_name,
                division: division || '',
                position: position || '',
                participants: parseInt(participants || 1, 10),
                purpose: purpose || '',
                status: bookingStatus,
                created_at: new Date().toISOString()
            };
            mockBookings.unshift(newBooking);
            return res.json({ success: true, message: 'Pemesanan ruangan berhasil disimpan (Demo)!', id: newBooking.booking_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Gagal membuat booking: ' + err.message });
    }
}

async function updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status baru wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE meeting_bookings SET status = ? WHERE booking_id = ?', [status, id]);
            return res.json({ success: true, message: `Status booking berhasil diubah menjadi ${status}!` });
        } else {
            const b = mockBookings.find(x => x.booking_id == id);
            if (b) b.status = status;
            return res.json({ success: true, message: `Status booking berhasil diubah menjadi ${status} (Demo)!` });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, checkAvailability, create, updateStatus };

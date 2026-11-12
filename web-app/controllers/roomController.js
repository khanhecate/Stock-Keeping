const { getPool, isDbConnected } = require('../config/database');

let mockRooms = [
    { room_id: 1, name: 'Ruang Rapat Garuda', description: 'Kapasitas 15 orang, Smart TV & Proyektor', is_deleted: 0 },
    { room_id: 2, name: 'Ruang Rapat Cendrawasih', description: 'Kapasitas 8 orang, Whiteboard & AC', is_deleted: 0 },
    { room_id: 3, name: 'Auditorium Utama', description: 'Kapasitas 50 orang, Sound system lengkap', is_deleted: 0 }
];

async function getAll(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM meeting_rooms WHERE is_deleted = 0 ORDER BY name ASC');
            return res.json({ success: true, data: rows });
        } else {
            return res.json({ success: true, data: mockRooms.filter(r => r.is_deleted === 0) });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama ruangan wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query('INSERT INTO meeting_rooms (name, description, is_deleted) VALUES (?, ?, 0)', [name, description || '']);
            return res.json({ success: true, message: 'Ruangan berhasil ditambahkan!', id: result.insertId });
        } else {
            const item = { room_id: Date.now(), name, description: description || '', is_deleted: 0 };
            mockRooms.push(item);
            return res.json({ success: true, message: 'Ruangan berhasil ditambahkan (Demo)!', id: item.room_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama ruangan wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE meeting_rooms SET name = ?, description = ? WHERE room_id = ?', [name, description || '', id]);
            return res.json({ success: true, message: 'Ruangan berhasil diperbarui!' });
        } else {
            const item = mockRooms.find(r => r.room_id == id);
            if (item) {
                item.name = name;
                item.description = description || '';
            }
            return res.json({ success: true, message: 'Ruangan berhasil diperbarui (Demo)!' });
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
            await pool.query('UPDATE meeting_rooms SET is_deleted = 1 WHERE room_id = ?', [id]);
            return res.json({ success: true, message: 'Ruangan berhasil dihapus!' });
        } else {
            const item = mockRooms.find(r => r.room_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Ruangan berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, create, update, remove };

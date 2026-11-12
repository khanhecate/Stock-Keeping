const { getPool, isDbConnected } = require('../config/database');

let mockLocations = [
    { location_id: 1, name: 'Gudang Utama Lantai 1', description: 'Pusat penyimpanan barang dan aset', is_deleted: 0 },
    { location_id: 2, name: 'Ruang Server / IT', description: 'Tempat perangkat jaringan dan IT', is_deleted: 0 },
    { location_id: 3, name: 'Ruang Staff Lantai 2', description: 'Area kerja operasional', is_deleted: 0 },
    { location_id: 4, name: 'Ruang Rapat Utama', description: 'Meeting room lantai 2', is_deleted: 0 }
];

async function getAll(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM locations WHERE is_deleted = 0 ORDER BY location_id DESC');
            return res.json({ success: true, data: rows });
        } else {
            return res.json({ success: true, data: mockLocations.filter(l => l.is_deleted === 0) });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama lokasi wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query('INSERT INTO locations (name, description, is_deleted) VALUES (?, ?, 0)', [name, description || '']);
            return res.json({ success: true, message: 'Lokasi berhasil ditambahkan!', id: result.insertId });
        } else {
            const item = { location_id: Date.now(), name, description: description || '', is_deleted: 0 };
            mockLocations.unshift(item);
            return res.json({ success: true, message: 'Lokasi berhasil ditambahkan (Demo)!', id: item.location_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama lokasi wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE locations SET name = ?, description = ? WHERE location_id = ?', [name, description || '', id]);
            return res.json({ success: true, message: 'Lokasi berhasil diperbarui!' });
        } else {
            const item = mockLocations.find(l => l.location_id == id);
            if (item) {
                item.name = name;
                item.description = description || '';
            }
            return res.json({ success: true, message: 'Lokasi berhasil diperbarui (Demo)!' });
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
            await pool.query('UPDATE locations SET is_deleted = 1 WHERE location_id = ?', [id]);
            return res.json({ success: true, message: 'Lokasi berhasil dihapus!' });
        } else {
            const item = mockLocations.find(l => l.location_id == id);
            if (item) item.is_deleted = 1;
            return res.json({ success: true, message: 'Lokasi berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getAll, create, update, remove };

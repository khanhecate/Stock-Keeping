const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
require('dotenv').config();

const { initDatabase, isDbConnected } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.use('/api', apiRoutes);

// Fallback for SPA routing
app.use((req, res) => {
    // If request asks for an API route that wasn't found
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper to get local LAN IP addresses
function getLocalIpAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

// Start server
app.listen(PORT, async () => {
    console.log('==========================================================');
    console.log('   SISTEM MANAJEMEN INVENTARIS & RUANGAN KANTOR (WEB)     ');
    console.log('==========================================================');
    console.log(`[Server] Berjalan di port : ${PORT}`);
    console.log(`[Server] Akses Lokal      : http://localhost:${PORT}`);
    
    const localIps = getLocalIpAddresses();
    if (localIps.length > 0) {
        console.log('[Server] Akses Jaringan LAN Kantor:');
        localIps.forEach(ip => console.log(`   👉 http://${ip}:${PORT}`));
    }
    console.log('----------------------------------------------------------');
    
    // Test DB connection & auto-initialize
    await initDatabase();
    console.log('==========================================================');
});

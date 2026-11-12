const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const assetController = require('../controllers/assetController');
const categoryController = require('../controllers/categoryController');
const roomController = require('../controllers/roomController');
const locationController = require('../controllers/locationController');
const statusController = require('../controllers/statusController');
const supplierController = require('../controllers/supplierController');
const loanController = require('../controllers/loanController');
const outboundController = require('../controllers/outboundController');
const bookingController = require('../controllers/bookingController');
const stockOpnameController = require('../controllers/stockOpnameController');
const reportController = require('../controllers/reportController');
const statsController = require('../controllers/statsController');

// 1. Auth & Status
router.post('/auth/login', authController.login);
router.get('/auth/profile', authController.getProfile);

// 2. Dashboard Statistics
router.get('/stats/dashboard', statsController.getDashboardStats);

// 3. Assets
router.get('/assets', assetController.getAllAssets);
router.get('/assets/available-for-loan', assetController.getAvailableForLoan);
router.get('/assets/next-code', assetController.getNextCode);
router.post('/assets', assetController.createAsset);
router.put('/assets/:id', assetController.updateAsset);
router.delete('/assets/:id', assetController.deleteAsset);

// 4. Categories
router.get('/categories', categoryController.getAll);
router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.remove);

// 5. Rooms
router.get('/rooms', roomController.getAll);
router.post('/rooms', roomController.create);
router.put('/rooms/:id', roomController.update);
router.delete('/rooms/:id', roomController.remove);

// 6. Locations
router.get('/locations', locationController.getAll);
router.post('/locations', locationController.create);
router.put('/locations/:id', locationController.update);
router.delete('/locations/:id', locationController.remove);

// 7. Statuses
router.get('/statuses', statusController.getAll);
router.post('/statuses', statusController.create);
router.put('/statuses/:id', statusController.update);
router.delete('/statuses/:id', statusController.remove);

// 8. Suppliers
router.get('/suppliers', supplierController.getAll);
router.post('/suppliers', supplierController.create);
router.put('/suppliers/:id', supplierController.update);
router.delete('/suppliers/:id', supplierController.remove);

// 9. Loans (Peminjaman & Pengembalian)
router.get('/loans', loanController.getAll);
router.post('/loans', loanController.create);
router.put('/loans/:id/return', loanController.returnLoan);

// 10. Outbounds (Barang Keluar)
router.get('/outbounds', outboundController.getAll);
router.post('/outbounds', outboundController.create);

// 11. Meeting Bookings (Pemesanan Ruangan)
router.get('/bookings', bookingController.getAll);
router.get('/bookings/check', bookingController.checkAvailability);
router.post('/bookings', bookingController.create);
router.put('/bookings/:id/status', bookingController.updateStatus);

// 12. Stock Opname
router.get('/stock-opname', stockOpnameController.getStockList);
router.post('/stock-opname/adjust', stockOpnameController.adjustStock);

// 13. Reports & Export
router.get('/reports/history', reportController.getAssetHistory);
router.get('/reports/export', reportController.exportExcel);

// 14. User Management
const userController = require('../controllers/userController');
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// 15. Access Roles & Permissions (Divisi & Level)
const accessController = require('../controllers/accessController');
router.get('/access', accessController.getAllAccess);
router.get('/access/:id', accessController.getAccessById);
router.post('/access', accessController.createAccess);
router.put('/access/:id', accessController.updateAccess);
router.delete('/access/:id', accessController.deleteAccess);

module.exports = router;

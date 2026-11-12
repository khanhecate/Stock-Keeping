-- ==========================================================
-- Database Schema for Inventory & Room Management System
-- Database Name: inventory_db
-- Compatible with MySQL 5.7+ / MariaDB / MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;

-- 1. Table: departments (Departemen / Divisi)
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department_id INT DEFAULT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Staff',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Table: department_permissions (Hak Akses Menu per Departemen)
CREATE TABLE IF NOT EXISTS department_permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    menu_key VARCHAR(50) NOT NULL,
    can_view TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_dept_menu (department_id, menu_key),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Table: categories
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'ASET', -- 'ASET' or 'CONSUMABLE'
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Table: locations
CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Table: statuses
CREATE TABLE IF NOT EXISTS statuses (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Table: suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Table: meeting_rooms
CREATE TABLE IF NOT EXISTS meeting_rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Table: assets
CREATE TABLE IF NOT EXISTS assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    barcode_code VARCHAR(100) UNIQUE,
    name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    supplier_id INT,
    location_id INT,
    specification TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Tersedia',
    quantity INT NOT NULL DEFAULT 1,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Table: loans (Peminjaman Aset)
CREATE TABLE IF NOT EXISTS loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    pic_name VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL,
    asset_id INT NOT NULL,
    location_destination VARCHAR(150),
    loan_date DATE NOT NULL,
    return_date_estimate DATE,
    actual_return_date DATE,
    purpose TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Dipinjam', -- 'Dipinjam' or 'Kembali'
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 11. Table: outbounds (Pengeluaran Barang / Mutasi)
CREATE TABLE IF NOT EXISTS outbounds (
    outbound_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    location_id INT NOT NULL,
    quantity INT NOT NULL,
    outbound_date DATE NOT NULL,
    purpose TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. Table: meeting_bookings (Pemesanan Ruangan)
CREATE TABLE IF NOT EXISTS meeting_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    division VARCHAR(100),
    position VARCHAR(100),
    participants INT NOT NULL DEFAULT 1,
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'Approved', -- 'Pending', 'Approved', 'Rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES meeting_rooms(room_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ==========================================================
-- SEED DATA (Default Initial Records)
-- ==========================================================

-- 1. Default Departments
INSERT INTO departments (department_id, name, description) VALUES
(1, 'IT', 'Information Technology - Administrator Sistem & Infrastruktur'),
(2, 'General Affairs', 'Pengelolaan Fasilitas, Aset Umum, dan Operasional Gedung'),
(3, 'Keuangan', 'Finance & Accounting Perusahaan'),
(4, 'Operasional', 'Staff Lapangan dan Operasional Harian')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Default Permissions for IT (Full Administrator Access)
INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES
(1, 'dashboard', 1),
(1, 'assets', 1),
(1, 'categories', 1),
(1, 'rooms', 1),
(1, 'locations', 1),
(1, 'statuses', 1),
(1, 'suppliers', 1),
(1, 'loans', 1),
(1, 'outbounds', 1),
(1, 'bookings', 1),
(1, 'stock-opname', 1),
(1, 'reports', 1),
(1, 'users', 1),
(1, 'departments', 1)
ON DUPLICATE KEY UPDATE can_view=VALUES(can_view);

-- 3. Default Permissions for General Affairs
INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES
(2, 'dashboard', 1),
(2, 'assets', 1),
(2, 'categories', 1),
(2, 'rooms', 1),
(2, 'locations', 1),
(2, 'statuses', 1),
(2, 'suppliers', 1),
(2, 'loans', 1),
(2, 'outbounds', 1),
(2, 'bookings', 1),
(2, 'stock-opname', 1),
(2, 'reports', 1)
ON DUPLICATE KEY UPDATE can_view=VALUES(can_view);

-- 4. Default Permissions for Operasional (Peminjaman & Booking saja)
INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES
(4, 'dashboard', 1),
(4, 'loans', 1),
(4, 'bookings', 1)
ON DUPLICATE KEY UPDATE can_view=VALUES(can_view);

-- 5. Default Permissions for Keuangan (Dashboard, Aset, Laporan)
INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES
(3, 'dashboard', 1),
(3, 'assets', 1),
(3, 'reports', 1)
ON DUPLICATE KEY UPDATE can_view=VALUES(can_view);

-- 6. Default Users (Password: admin123 / staff123)
INSERT INTO users (user_id, username, password, name, department_id, role, is_active)
VALUES 
(1, 'admin', 'admin123', 'Administrator IT', 1, 'Administrator', 1),
(2, 'staff_ga', 'staff123', 'Staff General Affairs', 2, 'Staff', 1),
(3, 'staff_opr', 'staff123', 'Staff Operasional', 4, 'Staff', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), department_id=VALUES(department_id), role=VALUES(role);

-- 7. Default Categories
INSERT INTO categories (category_id, name, type) VALUES
(1, 'Elektronik & IT', 'ASET'),
(2, 'Furniture & Kantor', 'ASET'),
(3, 'Alat Tulis Kantor (ATK)', 'CONSUMABLE'),
(4, 'Peralatan Kebersihan', 'CONSUMABLE'),
(5, 'Kendaraan Operasional', 'ASET')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. Default Locations
INSERT INTO locations (location_id, name, description) VALUES
(1, 'Gudang Utama Lantai 1', 'Pusat penyimpanan barang dan aset'),
(2, 'Ruang Server / IT', 'Tempat perangkat jaringan dan IT'),
(3, 'Ruang Staff Lantai 2', 'Area kerja operasional'),
(4, 'Ruang Rapat Utama', 'Meeting room lantai 2')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 9. Default Statuses
INSERT INTO statuses (status_id, name, description) VALUES
(1, 'Tersedia', 'Barang siap digunakan atau dipinjam'),
(2, 'Dipinjam', 'Barang sedang dibawa atau dipinjam oleh user/karyawan'),
(3, 'Rusak', 'Barang memerlukan perbaikan atau afkir'),
(4, 'Habis', 'Stok barang habis (untuk consumable)')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 10. Default Meeting Rooms
INSERT INTO meeting_rooms (room_id, name, description) VALUES
(1, 'Ruang Rapat Garuda', 'Kapasitas 15 orang, Smart TV & Proyektor'),
(2, 'Ruang Rapat Cendrawasih', 'Kapasitas 8 orang, Whiteboard & AC'),
(3, 'Auditorium Utama', 'Kapasitas 50 orang, Sound system lengkap')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 11. Default Suppliers
INSERT INTO suppliers (supplier_id, name, phone, email, address) VALUES
(1, 'PT Mitra Teknologi Solusi', '021-5551234', 'sales@mitratek.co.id', 'Jl. Jenderal Sudirman No. 45, Jakarta'),
(2, 'CV Maju Jaya Abadi ATK', '0812-3456-7890', 'contact@majujayaatk.com', 'Jl. Gatot Subroto Kav. 12, Jakarta')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 12. Sample Initial Assets
INSERT INTO assets (asset_id, barcode_code, name, category_id, supplier_id, location_id, specification, status, quantity, unit) VALUES
(1, 'AST-2026-001', 'Laptop Dell Latitude 3420', 1, 1, 2, 'Core i5 11th Gen, RAM 16GB, SSD 512GB', 'Tersedia', 5, 'unit'),
(2, 'AST-2026-002', 'Proyektor Epson EB-X500', 1, 1, 1, '3600 Lumens XGA 3LCD', 'Tersedia', 2, 'unit'),
(3, 'AST-2026-003', 'Kertas HVS A4 80gr PaperOne', 3, 2, 1, '1 Rim (500 Lembar) Warna Putih', 'Tersedia', 35, 'rim'),
(4, 'AST-2026-004', 'Kursi Kerja Ergonomis Mesh', 2, 2, 3, 'Tinggi bisa diatur, Lumbar support', 'Tersedia', 12, 'unit')
ON DUPLICATE KEY UPDATE name=VALUES(name);

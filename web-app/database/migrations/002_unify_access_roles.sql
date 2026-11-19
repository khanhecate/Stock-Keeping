-- Migrasi 002: satukan skema untuk Desktop (JavaFX) dan Web (Node) di satu DB inventory_db.
-- Idempotent dan hanya menambah. Kolom/tabel lama tidak diubah, jadi aplikasi desktop tetap jalan.
USE inventory_db;

CREATE TABLE IF NOT EXISTS access_roles (
    access_id INT AUTO_INCREMENT PRIMARY KEY,
    divisi VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'Staff',
    permissions LONGTEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE users ADD COLUMN IF NOT EXISTS access_id INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS divisi VARCHAR(100) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(50) NULL;

INSERT IGNORE INTO access_roles (access_id, divisi, level, permissions, is_deleted) VALUES
(1, 'Information Technology', 'Administrator', '["menu_dashboard","menu_master","menu_transaksi","menu_laporan","menu_akses","sub_asset","sub_category","sub_room","sub_location","sub_status","sub_supplier","sub_loan","sub_outbound","sub_booking","sub_stock_opname","sub_report_history","sub_report_loan","sub_report_booking","sub_user_list","sub_access_list"]', 0),
(2, 'HR & GA', 'Staff', '["menu_dashboard","menu_master","menu_transaksi","menu_laporan","sub_asset","sub_category","sub_room","sub_location","sub_status","sub_supplier","sub_loan","sub_outbound","sub_booking","sub_stock_opname","sub_report_history","sub_report_loan","sub_report_booking"]', 0),
(3, 'Operasional', 'Staff', '["menu_dashboard","menu_transaksi","sub_loan","sub_booking"]', 0),
(4, 'Accounting, FI & MIS', 'Staff', '["menu_dashboard","menu_master","menu_laporan","sub_asset","sub_category","sub_report_history","sub_report_loan"]', 0),
(5, 'Dewan Komisaris', 'Staff', '["menu_dashboard","menu_laporan","sub_report_history","sub_report_loan","sub_report_booking"]', 0),
(6, 'Direktur Utama', 'Staff', '["menu_dashboard","menu_transaksi","menu_laporan","sub_booking","sub_report_history","sub_report_loan","sub_report_booking"]', 0),
(7, 'Audit Intern', 'Staff', '["menu_dashboard","menu_transaksi","menu_laporan","sub_stock_opname","sub_report_history","sub_report_loan"]', 0),
(8, 'Collection & Remedial', 'Staff', '["menu_dashboard","menu_transaksi","sub_booking"]', 0),
(9, 'Kepatuhan & Manajemen Risiko', 'Staff', '["menu_dashboard","menu_laporan","sub_report_history"]', 0),
(10, 'Marketing Funding', 'Staff', '["menu_dashboard","menu_transaksi","sub_booking"]', 0);

-- Hubungkan user seed ke access_roles (hanya yang belum terhubung)
UPDATE users u JOIN access_roles a ON a.access_id = 1 SET u.access_id=a.access_id, u.divisi=a.divisi, u.level=a.level WHERE u.username='admin' AND u.access_id IS NULL;
UPDATE users u JOIN access_roles a ON a.access_id = 2 SET u.access_id=a.access_id, u.divisi=a.divisi, u.level=a.level WHERE u.username='staff_ga' AND u.access_id IS NULL;
UPDATE users u JOIN access_roles a ON a.access_id = 3 SET u.access_id=a.access_id, u.divisi=a.divisi, u.level=a.level WHERE u.username='staff_opr' AND u.access_id IS NULL;
-- Sinkronkan users.role (dibaca desktop) dengan level (dipakai web)
UPDATE users SET role = level WHERE level IS NOT NULL AND role <> level;

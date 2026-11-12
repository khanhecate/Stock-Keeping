# Sistem Manajemen Inventaris & Ruang Rapat Kantor (Versi Web)

Aplikasi web modern untuk manajemen inventaris kantor, sirkulasi peminjaman aset, pengeluaran barang habis pakai (ATK), dan pemesanan ruang rapat terintegrasi tanpa bentrok jadwal.

---

## 🚀 Fitur Utama
1. **Dashboard Metrik Real-Time:** Total aset, stok fisik, aset sedang dipinjam, agenda rapat hari ini.
2. **Master Data Lengkap:**
   - Data Aset / Barang (Auto-generate Barcode `AST-YYYY-XXX`)
   - Kategori (Klasifikasi `ASET` vs `CONSUMABLE`)
   - Ruang Rapat & Fasilitas
   - Lokasi Penyimpanan (Gudang, Lantai, Ruang Server)
   - Status & Rekanan Supplier / Vendor
3. **Sirkulasi & Transaksi:**
   - Peminjaman Aset (Deduct stok otomatis & validasi ketersediaan)
   - Pengembalian 1-Klik (Restorasi stok kembali ke gudang)
   - Pengeluaran Barang Habis Pakai (Outbound)
   - Reservasi Ruang Rapat dengan **Pendeteksi Bentrok Jadwal Otomatis (Collision Detection)**
   - Stock Opname (Audit stok riil vs sistem & penyesuaian terkontrol)
4. **Laporan & Ekspor:**
   - Ekspor data ke Microsoft Excel (`.xlsx`)
   - Pratinjau Cetak Fisik / PDF resmi berformat Kop Surat & tanda tangan pejabat terkait.
5. **Dukungan Presentasi & Dokumentasi:**
   - Slide Presentasi Interaktif (`Presentation_Slides.html`)
   - File Asli PowerPoint (`Presentasi_Sistem_Inventaris_Kantor.pptx`)
   - Buku Panduan Pengguna (`Manual_Book_Web.html`)

---

## 💻 Panduan Instalasi & Menjalankan di Server Kantor

### 1. Database MySQL
- Nyalakan service **MySQL** (misal lewat XAMPP).
- Import file skema: `web-app/database/schema.sql` ke MySQL.

### 2. Konfigurasi Lingkungan (.env)
Buka file `web-app/.env` dan sesuaikan koneksi database kantor:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_db
```

### 3. Menjalankan Aplikasi
Buka Command Prompt atau PowerShell di dalam folder `web-app`:
```bash
npm start
```

### 4. Mengakses Aplikasi
- **Dari komputer server:** [http://localhost:3000](http://localhost:3000)
- **Dari komputer staf di jaringan Wi-Fi / LAN kantor:** `http://[IP-Komputer-Server]:3000` (contoh: `http://192.168.1.15:3000`)

---

## 📊 File Presentasi & Panduan
- **Slide Presentasi Interaktif di Browser:** Buka [http://localhost:3000/Presentation_Slides.html](http://localhost:3000/Presentation_Slides.html) (tekan F11 untuk fullscreen).
- **File PowerPoint (.pptx):** Berada di root folder project: `Presentasi_Sistem_Inventaris_Kantor.pptx`.
- **Buku Panduan (Manual Book):** Buka [http://localhost:3000/Manual_Book_Web.html](http://localhost:3000/Manual_Book_Web.html) atau klik tombol cetak ke PDF.

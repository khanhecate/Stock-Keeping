# StockKeeping (Versi Web)

Antarmuka web untuk manajemen inventaris kantor, peminjaman aset, barang keluar, dan booking ruang rapat. Memakai database yang sama dengan aplikasi desktop.

Instalasi lengkap (macOS, Linux, Windows), konfigurasi, dan perbandingan fitur Web vs Desktop ada di [README utama](../README.md).

## Fitur
- Dashboard: total aset, total stok, pinjaman aktif, booking hari ini, stok menipis, pinjaman dan booking terbaru, stok per kategori.
- Master data: aset (barcode otomatis `AST-YYYY-XXX`), kategori, ruang rapat, lokasi, status, supplier.
- Peminjaman dan pengembalian aset dengan pengurangan dan pengembalian stok otomatis.
- Barang keluar (barang habis pakai).
- Booking ruang rapat dengan pengecekan bentrok jadwal dan persetujuan (`Pending`, `Approved`, `Rejected`).
- Stock opname.
- Manajemen user dan hak akses per divisi.
- Ekspor Excel (aset/stok, peminjaman, booking) dan pratinjau cetak dengan kolom tanda tangan.
- Mode gelap dan terang.

## Menjalankan

```bash
cd web-app
cp .env.example .env     # Windows: copy .env.example .env
npm install
npm start
```

Isi `DB_USER` dan `DB_PASSWORD` di `.env`. Impor database sekali: `mysql -u root -p < database/schema.sql`.

- Lokal: <http://localhost:3000>
- Dari komputer lain di LAN: `http://IP-KOMPUTER-SERVER:3000`

Login awal: `admin` / `admin123`. Ganti sebelum dipakai di luar uji coba.

## Struktur

| Folder | Isi |
|---|---|
| `server.js` | Entry point Express |
| `routes/api.js` | Daftar endpoint `/api/*` |
| `controllers/` | Logika tiap modul |
| `config/database.js` | Koneksi dan inisialisasi DB |
| `public/` | Frontend (HTML, CSS, JS) |
| `database/schema.sql` | Skema dan data awal |
| `database/migrations/` | Migrasi untuk database yang sudah ada |
| `scripts/` | Pembuat presentasi `.pptx` (`npm run generate-ppt`) |

## Peringatan
API belum memakai autentikasi di sisi server dan password disimpan polos. Jangan buka ke jaringan yang tidak dipercaya. Detail di [README utama](../README.md#catatan-keamanan).

## Dokumen
- Buku panduan web: `../Manual_Book_Web.html` (buka langsung sebagai file).
- Dokumen KKP dan presentasi: `../BERKAS_KKP_DAN_PANDUAN/`.

# StockKeeping

Sistem manajemen inventaris dan ruang rapat kantor. Satu database MySQL/MariaDB (`inventory_db`) dipakai oleh dua antarmuka:

| Antarmuka | Teknologi | Folder |
|---|---|---|
| **Desktop** | Java 17+, JavaFX 21, JDBC, JasperReports, Apache POI | `src/` |
| **Web** | Node.js 18+, Express 5, vanilla JS | `web-app/` |

## Daftar isi
- [Fitur](#fitur)
- [Perbandingan fitur Web vs Desktop](#perbandingan-fitur-web-vs-desktop)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Struktur project](#struktur-project)
- [Catatan keamanan](#catatan-keamanan)

---

## Fitur

Fitur yang tersedia di Web dan Desktop:

- **Login** dengan username dan password.
- **Master data:** aset/barang, kategori, lokasi penyimpanan, status, supplier, ruang rapat (tambah, ubah, hapus).
- **Barcode aset otomatis** dengan format `AST-YYYY-XXX`.
- **Peminjaman aset** dengan pengurangan stok otomatis dan **pengembalian** yang mengembalikan stok.
- **Barang keluar** (barang habis pakai).
- **Booking ruang rapat** dengan pengecekan bentrok jadwal.
- **Stock opname:** penyesuaian stok sistem terhadap stok fisik.
- **Laporan** ke Excel (`.xlsx`).

## Perbandingan fitur Web vs Desktop

Fitur yang **tidak sama** di dua antarmuka. Daftar ini berdasarkan pembacaan kode (route Express dan controller JavaFX), bukan uji klik manual.

### Hanya ada di Web, belum ada di Desktop

| Fitur | Di Web | Di Desktop |
|---|---|---|
| Dashboard statistik | Total aset, total stok, pinjaman aktif, booking hari ini, stok menipis (qty ≤ 2), pinjaman dan booking terbaru, stok per kategori | Hanya halaman sambutan |
| Manajemen user | Lihat, tambah, ubah, nonaktifkan user | Menu *List User*, *Register User*, *Log User* hanya halaman kosong |
| Ubah password | Ada | Menu *Ubah Password* hanya halaman kosong |
| Hak akses per divisi | Tabel `access_roles`, menu yang tampil mengikuti izin divisi | Menu *Permission* kosong. Semua user melihat semua menu, kolom `users.role` tidak dipakai untuk membatasi akses |
| Persetujuan booking | Status `Pending` lalu `Approved` atau `Rejected` | Booking langsung `Approved` |
| Akses banyak pengguna | Dibuka dari browser lewat LAN kantor | Satu mesin per instalasi |
| Mode gelap dan terang | Ada | Tidak ada |
| Mode demo tanpa database | Memakai data contoh di memori kalau DB mati | Gagal dengan pesan koneksi |

### Hanya ada di Desktop, belum ada di Web

| Fitur | Di Desktop | Di Web |
|---|---|---|
| Cetak PDF | Laporan aset, peminjaman, ruang rapat, dan stock opname lewat JasperReports (`src/main/resources/reports/*.jrxml`) | Pratinjau cetak HTML dari browser (bisa disimpan sebagai PDF lewat dialog cetak) |
| Selesaikan booking | Tombol di *List Room Booking* mengubah status jadi `Completed` | Tidak ada status `Completed` |
| Ekspor Excel stock opname dan riwayat aset | Ada | Ekspor Excel hanya untuk aset/stok, peminjaman, dan booking |

### Ketidakcocokan yang perlu diperbaiki

- **Booking `Completed` masih memblokir jadwal di Web.** Pengecekan bentrok di Web hanya mengabaikan status `Rejected`. Booking yang sudah diselesaikan lewat Desktop tetap dianggap bentrok.
- **Skema `departments` dan `department_permissions`** ada di `schema.sql` tapi tidak dipakai Web maupun Desktop. Hak akses sebenarnya memakai `access_roles`.
- **Password disimpan polos** di kedua aplikasi (lihat [Catatan keamanan](#catatan-keamanan)).

---

## Instalasi

### Yang dibutuhkan

| Komponen | Versi | Dipakai untuk |
|---|---|---|
| JDK | 17 atau lebih baru | Desktop |
| Maven | 3.9 atau lebih baru | Desktop (JavaFX diunduh Maven, tidak perlu pasang manual) |
| Node.js dan npm | Node 18 atau lebih baru | Web |
| MySQL 8 atau MariaDB 10.5+ | | Database bersama |

Bagian Web atau Desktop boleh dipasang salah satu, tapi database wajib ada.

> Langkah macOS sudah diuji di mesin pengembang. Langkah Windows dan Linux disusun dari dokumentasi masing-masing tool dan belum diuji. Nama paket bisa berbeda antar versi OS.

### 1. macOS

```bash
# Homebrew: https://brew.sh
brew install openjdk@21 maven node mariadb
brew services start mariadb

# Agar JDK 21 dikenali
sudo ln -sfn "$(brew --prefix openjdk@21)/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-21.jdk
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"

java -version && mvn -v && node -v
```

Tanpa Homebrew, Maven bisa dipasang ke `~/tools` dengan `./scripts/install-maven.sh` (butuh JDK 17+ yang sudah terpasang).

### 2. Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install -y openjdk-21-jdk maven mariadb-server libgtk-3-0
sudo systemctl enable --now mariadb

# Node.js 18+ (versi dari apt di Ubuntu lama bisa terlalu tua)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

java -version && mvn -v && node -v
```

Fedora: `sudo dnf install java-21-openjdk-devel maven nodejs mariadb-server gtk3` lalu `sudo systemctl enable --now mariadb`.

`libgtk-3-0` dibutuhkan JavaFX untuk menampilkan jendela. Di server tanpa layar, hanya Web yang bisa dijalankan.

### 3. Windows 10/11

Buka PowerShell sebagai pengguna biasa:

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
winget install OpenJS.NodeJS.LTS
winget install MariaDB.Server
```

Maven tidak selalu ada di winget. Pasang manual:

1. Unduh `apache-maven-3.9.x-bin.zip` dari <https://maven.apache.org/download.cgi>.
2. Ekstrak ke `C:\tools\apache-maven-3.9.x`.
3. Tambahkan `C:\tools\apache-maven-3.9.x\bin` ke **PATH** (Settings, System, About, Advanced system settings, Environment Variables).
4. Pastikan `JAVA_HOME` menunjuk ke folder JDK, misalnya `C:\Program Files\Eclipse Adoptium\jdk-21...`.

Buka PowerShell baru lalu cek:

```powershell
java -version; mvn -v; node -v
```

Alternatif: XAMPP (menyediakan MariaDB) boleh dipakai sebagai pengganti `MariaDB.Server`.

### 4. Siapkan database (semua OS)

Skema dan data awal ada di `web-app/database/schema.sql`. File ini membuat database `inventory_db`, 13 tabel, 10 divisi akses, dan 3 user contoh. Impor **sekali** saja:

```bash
mysql -u root -p < web-app/database/schema.sql
```

Windows PowerShell tidak mendukung `<`. Pakai:

```powershell
cmd /c "mysql -u root -p < web-app\database\schema.sql"
```

Buat user khusus aplikasi, jangan memakai `root`:

```sql
CREATE USER 'stockkeeping'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_INI';
GRANT ALL PRIVILEGES ON inventory_db.* TO 'stockkeeping'@'localhost';
FLUSH PRIVILEGES;
```

Kalau database lama kamu sudah ada dari versi sebelumnya, jalankan `web-app/database/migrations/002_unify_access_roles.sql` (MariaDB) untuk menambah tabel `access_roles` dan kolom `users.access_id`, `divisi`, `level` tanpa menghapus data.

### 5. Jalankan Web

```bash
cd web-app
cp .env.example .env        # Windows: copy .env.example .env
# edit .env: isi DB_USER, DB_PASSWORD
npm install
npm start
```

Buka <http://localhost:3000>. Dari komputer lain di jaringan yang sama: `http://IP-KOMPUTER-SERVER:3000`. Izinkan port 3000 di firewall jika perlu.

### 6. Jalankan Desktop

Desktop membaca koneksi dari environment variable. Tanpa variabel, ia memakai `localhost:3306`, user `root`, password kosong.

macOS dan Linux:

```bash
export DB_USER=stockkeeping DB_PASSWORD='GANTI_PASSWORD_INI'
mvn javafx:run
```

Windows PowerShell:

```powershell
$env:DB_USER="stockkeeping"; $env:DB_PASSWORD="GANTI_PASSWORD_INI"
mvn javafx:run
```

Windows CMD:

```cmd
set DB_USER=stockkeeping
set DB_PASSWORD=GANTI_PASSWORD_INI
mvn javafx:run
```

Build pertama mengunduh dependensi dan butuh beberapa menit.

### Login awal

| Username | Password | Divisi |
|---|---|---|
| `admin` | `admin123` | Information Technology (Administrator) |
| `staff_ga` | `staff123` | HR & GA |
| `staff_opr` | `staff123` | Operasional |

Ganti password ini sebelum dipakai di luar uji coba.

### Masalah umum

| Gejala | Penyebab dan solusi |
|---|---|
| `mvn: command not found` | Maven belum ada di PATH. Buka terminal baru setelah memasangnya. |
| `release version 17 not supported` | `mvn -v` menunjukkan JDK lama. Set `JAVA_HOME` ke JDK 17+. |
| `Gagal Koneksi Ke Database` (Desktop) | MySQL belum jalan, atau `DB_*` salah. Cek `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`. |
| `Access denied for user` | User DB belum dibuat atau tidak punya hak ke `inventory_db`. |
| Web menampilkan `Table '...access_roles' doesn't exist` | Database dibuat dari schema lama. Jalankan migrasi 002. |
| Jendela JavaFX tidak muncul di Linux | `libgtk-3-0` belum terpasang, atau tidak ada display. |
| Web: `Gagal terhubung ke MySQL` | Cek `web-app/.env`. Web tetap jalan dengan data contoh di memori, tapi data tidak tersimpan. |

---

## Konfigurasi

**Desktop** (environment variable, semuanya opsional):

| Variabel | Default |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_NAME` | `inventory_db` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | kosong |

**Web** (`web-app/.env`):

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `3000` | Port server |
| `DB_HOST` | `localhost` | |
| `DB_PORT` | `3306` | |
| `DB_USER` | `root` | |
| `DB_PASSWORD` | kosong | |
| `DB_NAME` | `inventory_db` | |
| `APP_NAME` | | Nama aplikasi |

`web-app/.env` sudah masuk `.gitignore`. Jangan di-commit.

## Struktur project

```
.
├── pom.xml                      # Build Desktop (Maven, JavaFX 21)
├── src/main/java/
│   ├── com/mycompany/inventorymanagement/   # MainApp (entry point)
│   └── com/inventory/{config,controller,dao,database,model,tools,view}/
├── src/main/resources/{fxml,reports,styles}/
├── scripts/                     # install-maven.sh, run-desktop.sh (baca DB dari env atau scripts/.env.local)
├── web-app/
│   ├── server.js                # Entry point Web
│   ├── routes/ controllers/ config/
│   ├── public/                  # Frontend (HTML, CSS, JS)
│   └── database/{schema.sql,migrations/}
└── BERKAS_KKP_DAN_PANDUAN/      # Manual dan presentasi
```

Nama package Java (`com.mycompany.inventorymanagement`, `com.inventory`) dan nama database (`inventory_db`) masih memakai nama lama.

## Catatan keamanan

- **Password disimpan dan dibandingkan sebagai teks polos** di Web dan Desktop. Sebelum dipakai di produksi, ganti dengan hash (bcrypt di Node, BCrypt atau Argon2 di Java).
- **API Web tidak meminta login.** Tidak ada sesi, token, atau middleware autentikasi. Siapa pun yang bisa menjangkau port 3000 dapat membaca atau mengubah data lewat `/api/*`, termasuk `/api/users` yang memuat password. Hak akses divisi hanya menyembunyikan menu di tampilan. Karena itu, jangan buka Web ke jaringan yang tidak dipercaya sebelum ada autentikasi di sisi server.
- Jangan memakai `root` MySQL untuk aplikasi.
- Jangan membuka port 3000 ke internet tanpa reverse proxy dan HTTPS.

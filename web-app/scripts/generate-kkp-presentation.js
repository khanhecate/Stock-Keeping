const pptxgen = require('pptxgenjs');
const path = require('path');

async function createKKPPresentation() {
    const pres = new pptxgen();

    // 16:9 widescreen layout
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Mahasiswa Praktik Kerja / KKP';
    pres.company = 'Sistem Informasi Inventaris Kantor';
    pres.title = 'Presentasi Rencana & Hasil Kuliah Kerja Praktik (KKP)';

    // Theme Colors
    const NAVY = '0F172A';
    const BLUE = '2563EB';
    const SKY = '0EA5E9';
    const SLATE = '475569';
    const GRAY = '64748B';
    const LIGHT_BG = 'F8FAFC';
    const WHITE = 'FFFFFF';
    const EMERALD = '10B981';
    const AMBER = 'F59E0B';

    const screenshotsDir = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\screenshots';

    // Helper: Standard slide header
    function addHeader(slide, title, subtitle) {
        slide.background = { color: LIGHT_BG };

        // Top accent line
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.1,
            fill: { color: BLUE }
        });

        // Title
        slide.addText(title, {
            x: 0.8, y: 0.45, w: 11.5, h: 0.55,
            fontSize: 21, fontFace: 'Arial', bold: true, color: NAVY
        });

        // Subtitle
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.8, y: 0.98, w: 11.5, h: 0.35,
                fontSize: 11.5, fontFace: 'Arial', color: GRAY
            });
        }

        // Bottom footer line
        slide.addText('Sistem Informasi Inventaris & Fasilitas Kantor | Kuliah Kerja Praktik (KKP)', {
            x: 0.8, y: 7.05, w: 8, h: 0.3,
            fontSize: 8.5, fontFace: 'Arial', color: GRAY
        });
        slide.addText('Rencana & Implementasi Sistem', {
            x: 9.2, y: 7.05, w: 3.3, h: 0.3,
            fontSize: 8.5, fontFace: 'Arial', align: 'right', color: GRAY
        });
    }

    // =========================================================================
    // SLIDE 1: COVER / TITLE SLIDE (Dark Navy Elegance)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: NAVY };

        // Top gradient accent bar
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.15,
            fill: { color: BLUE }
        });

        slide.addText('KULIAH KERJA PRAKTIK (KKP) / MAGANG', {
            x: 1.0, y: 1.3, w: 11.3, h: 0.4,
            fontSize: 13, fontFace: 'Arial', bold: true, color: SKY, letterSpacing: 2
        });

        slide.addText('RANCANG BANGUN SISTEM INFORMASI MANAJEMEN INVENTARIS & FASILITAS RUANGAN KANTOR', {
            x: 1.0, y: 1.8, w: 11.3, h: 1.5,
            fontSize: 26, fontFace: 'Arial', bold: true, color: WHITE, lineSpacing: 34
        });

        slide.addText('Digitalisasi Tata Kelola Aset, Sirkulasi Barang, Reservasi Fasilitas, dan Pengaturan Hak Akses Berbasis Grup Divisi (Synology NAS Group RBAC) pada Jaringan Lokal Kantor (On-Premise LAN)', {
            x: 1.0, y: 3.4, w: 11.0, h: 0.9,
            fontSize: 13, fontFace: 'Arial', color: '94A3B8', lineSpacing: 20
        });

        // Highlights boxes
        const feats = [
            { title: 'Platform Web Responsif', desc: 'Node.js Express + Vanilla Clean' },
            { title: 'Server On-Premise LAN', desc: 'Aman di Jaringan Internal Kantor' },
            { title: 'Synology NAS RBAC', desc: 'Hak Akses Otomatis per Divisi' }
        ];

        feats.forEach((f, idx) => {
            const bx = 1.0 + (idx * 3.8);
            slide.addShape(pres.ShapeType.rect, {
                x: bx, y: 4.6, w: 3.5, h: 1.4,
                fill: { color: '1E293B' },
                line: { color: '334155', width: 1 }
            });
            slide.addText(f.title, {
                x: bx + 0.2, y: 4.8, w: 3.1, h: 0.4,
                fontSize: 12, fontFace: 'Arial', bold: true, color: SKY
            });
            slide.addText(f.desc, {
                x: bx + 0.2, y: 5.25, w: 3.1, h: 0.6,
                fontSize: 10, fontFace: 'Arial', color: 'CBD5E1'
            });
        });

        slide.addText('Program Studi Teknik Informatika / Sistem Informasi — Tahun 2026', {
            x: 1.0, y: 6.8, w: 11.3, h: 0.4,
            fontSize: 10, fontFace: 'Arial', color: '64748B'
        });
    }

    // =========================================================================
    // SLIDE 2: LATAR BELAKANG MASALAH
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '1. Latar Belakang Masalah', 'Kendala operasional pengelolaan fasilitas & aset kantor yang melandasi proyek KKP');

        const problems = [
            {
                num: 'A',
                title: 'Aplikasi Desktop Single-User',
                desc: 'Sebelumnya sistem berbasis software desktop JavaFX yang hanya terinstal pada 1 komputer admin. Karyawan divisi lain tidak dapat melihat ketersediaan barang atau mengajukan pinjaman secara mandiri.'
            },
            {
                num: 'B',
                title: 'Bentrok Jadwal Ruang Rapat',
                desc: 'Pemesanan ruang pertemuan masih menggunakan whiteboard atau chat grup, sehingga sering terjadi jadwal tabrakan (double-booking) antar divisi pada jam kerja yang padat.'
            },
            {
                num: 'C',
                title: 'Selisih Stok Fisik vs Catatan',
                desc: 'Tanpa mekanisme Stock Opname berkala yang terintegrasi, inventaris barang habis pakai (ATK) sering mengalami selisih fisik yang tidak terlacak penanggung jawabnya.'
            },
            {
                num: 'D',
                title: 'Hak Akses Tidak Terstruktur',
                desc: 'Pemberian izin akses per user sangat merepotkan. Kantor membutuhkan sistem grup permission seperti Synology NAS: set izin di divisi, user baru langsung mewarisi akses.'
            }
        ];

        problems.forEach((p, idx) => {
            const x = 0.8 + ((idx % 2) * 5.8);
            const y = 1.5 + (Math.floor(idx / 2) * 2.6);

            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.5, h: 2.3,
                fill: { color: WHITE },
                line: { color: 'E2E8F0', width: 1.5 }
            });

            slide.addShape(pres.ShapeType.rect, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fill: { color: BLUE }
            });
            slide.addText(p.num, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fontSize: 14, fontFace: 'Arial', bold: true, color: WHITE, align: 'center'
            });

            slide.addText(p.title, {
                x: x + 1.1, y: y + 0.3, w: 4.1, h: 0.45,
                fontSize: 13.5, fontFace: 'Arial', bold: true, color: NAVY
            });

            slide.addText(p.desc, {
                x: x + 1.1, y: y + 0.8, w: 4.1, h: 1.3,
                fontSize: 10, fontFace: 'Arial', color: SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 3: TUJUAN & MANFAAT PRAKTIK KERJA (KKP)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '2. Tujuan & Manfaat Proyek KKP', 'Target capaian teknis dan dampak positif bagi instansi tempat praktik kerja');

        // Left box: Tujuan
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.5, w: 5.5, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('🎯 Tujuan Praktik Kerja (KKP)', {
            x: 1.1, y: 1.8, w: 4.9, h: 0.5,
            fontSize: 15, fontFace: 'Arial', bold: true, color: BLUE
        });

        const goals = [
            'Mengonversi seluruh modul inventaris desktop JavaFX menjadi Web Application responsif yang modern.',
            'Menyediakan server on-premise di dalam kantor sehingga dapat diakses seluruh PC staf via IP LAN lokal.',
            'Menerapkan skema Group RBAC (seperti Synology NAS) untuk memetakan hak akses per Divisi & Level kerja.',
            'Mencegah bentrok jadwal ruang rapat dengan algoritma validasi live overlapping check.',
            'Menyediakan rekapitulasi pelaporan otomatis dengan fitur Ekspor Excel dan Cetak Surat Dinas resmi.'
        ];
        goals.forEach((g, idx) => {
            slide.addText(`✔  ${g}`, {
                x: 1.1, y: 2.45 + (idx * 0.85), w: 4.9, h: 0.75,
                fontSize: 10.5, fontFace: 'Arial', color: SLATE, lineSpacing: 15
            });
        });

        // Right box: Manfaat
        slide.addShape(pres.ShapeType.rect, {
            x: 6.7, y: 1.5, w: 5.6, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('💼 Manfaat bagi Instansi & Mahasiswa', {
            x: 7.0, y: 1.8, w: 5.0, h: 0.5,
            fontSize: 15, fontFace: 'Arial', bold: true, color: EMERALD
        });

        const benefits = [
            'Bagi Divisi GA/Operasional: Efisiensi kerja, pelacakan fisik barang akurat, dan kontrol stok transparan.',
            'Bagi Seluruh Karyawan: Kemudahan mengecek stok barang dan booking ruang rapat dari meja masing-masing.',
            'Bagi Manajemen: Ketersediaan laporan berkala aset dan histori sirkulasi barang secara real-time.',
            'Bagi Keamanan Data: Data berada 100% di dalam kantor tanpa risiko kebocoran ke pihak ketiga (cloud luar).',
            'Bagi Mahasiswa: Pengalaman nyata merancang arsitektur web fullstack, database relasional, dan jaringan LAN.'
        ];
        benefits.forEach((b, idx) => {
            slide.addText(`★  ${b}`, {
                x: 7.0, y: 2.45 + (idx * 0.85), w: 5.0, h: 0.75,
                fontSize: 10.5, fontFace: 'Arial', color: SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 4: TOPOLOGI JARINGAN ON-PREMISE LAN
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '3. Arsitektur & Topologi Jaringan On-Premise LAN', 'Penerapan server internal kantor tanpa ketergantungan koneksi internet publik');

        // 3 Cards showing the architecture
        const techStack = [
            { title: 'Front-End Presentation', tech: 'HTML5, CSS3 Modern, Vanilla JS SPA', desc: 'Tampilan responsif, dark/light mode, micro-interactions, tanpa dependensi framework eksternal yang berat.' },
            { title: 'Back-End Application Service', tech: 'Node.js & Express.js REST API', desc: 'Pemrosesan bisnis logika, penanganan request concurrent, validasi tabrakan jadwal, dan export generator.' },
            { title: 'Data Persistence & Storage', tech: 'MySQL Relational Database', desc: 'Integritas data dengan Foreign Keys, JSON field untuk permission matrix dinamis, dan index optimal.' }
        ];

        techStack.forEach((t, idx) => {
            const x = 0.8 + (idx * 3.8);
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 1.5, w: 3.5, h: 2.5,
                fill: { color: WHITE },
                line: { color: 'E2E8F0', width: 1.5 }
            });
            slide.addText(t.title, {
                x: x + 0.2, y: 1.7, w: 3.1, h: 0.4,
                fontSize: 12, fontFace: 'Arial', bold: true, color: BLUE
            });
            slide.addText(t.tech, {
                x: x + 0.2, y: 2.15, w: 3.1, h: 0.4,
                fontSize: 10.5, fontFace: 'Arial', bold: true, color: NAVY
            });
            slide.addText(t.desc, {
                x: x + 0.2, y: 2.65, w: 3.1, h: 1.2,
                fontSize: 9.5, fontFace: 'Arial', color: SLATE, lineSpacing: 14
            });
        });

        // Bottom box: LAN Topology Diagram
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 4.3, w: 11.5, h: 2.4,
            fill: { color: '1E293B' }
        });
        slide.addText('TOPOLOGI AKSES JARINGAN LAN KANTOR', {
            x: 1.1, y: 4.5, w: 10.9, h: 0.35,
            fontSize: 11, fontFace: 'Arial', bold: true, color: SKY
        });

        const lanNodes = [
            { label: 'SERVER KANTOR\n(IP: 192.168.1.15:3000)', sub: 'Host Node.js & MySQL' },
            { label: 'SWITCH / ROUTER LAN\n(Jaringan Internal Kantor)', sub: 'DHCP & Local Routing' },
            { label: 'PC STAF GA & IT\n(Input Master & User)', sub: 'Akses via Web Browser' },
            { label: 'PC SELURUH DIVISI\n(Peminjaman & Booking)', sub: 'Akses Tanpa Perlu Install' }
        ];

        lanNodes.forEach((n, idx) => {
            const nx = 1.1 + (idx * 2.75);
            slide.addShape(pres.ShapeType.rect, {
                x: nx, y: 5.0, w: 2.5, h: 1.4,
                fill: { color: '0F172A' },
                line: { color: BLUE, width: 1.5 }
            });
            slide.addText(n.label, {
                x: nx + 0.1, y: 5.15, w: 2.3, h: 0.65,
                fontSize: 9.5, fontFace: 'Arial', bold: true, color: WHITE, align: 'center'
            });
            slide.addText(n.sub, {
                x: nx + 0.1, y: 5.85, w: 2.3, h: 0.45,
                fontSize: 8.5, fontFace: 'Arial', color: '94A3B8', align: 'center'
            });
        });
    }

    // =========================================================================
    // SLIDE 5: SKEMA HAK AKSES GRUP DIVISI (SYNOLOGY NAS STYLE)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '4. Skema Hak Akses Berbasis Grup Divisi (Synology NAS RBAC)', 'Penetapan hak akses terpusat pada Divisi; pegawai baru otomatis mewarisi seluruh izin aksesnya');

        // Left explanation
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.5, w: 4.8, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('Mekanisme Izin Grup Divisi', {
            x: 1.0, y: 1.75, w: 4.4, h: 0.4,
            fontSize: 14, fontFace: 'Arial', bold: true, color: BLUE
        });

        const rbacPoints = [
            'Model Synology NAS: Administrator tidak perlu mengklik izin menu per user. Cukup tentukan hak akses pada grup Divisi.',
            'Dua Kolom Matrix Perizinan: Memisahkan antara Menu Utama (Kiri) dan Submenu Teknis (Kanan).',
            'Otomatisasi Penugasan: Saat membuat user baru, cukup pilih Divisi & Level. User otomatis langsung dapat login dan melihat menu yang diizinkan.',
            'Sidebar Dinamis: Menu yang tidak diizinkan otomatis disembunyikan total dari pandangan user.',
            'Divisi IT Administrator memiliki akses penuh secara default untuk pemeliharaan sistem.'
        ];
        rbacPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 1.0, y: 2.3 + (idx * 0.85), w: 4.4, h: 0.8,
                fontSize: 9.5, fontFace: 'Arial', color: SLATE, lineSpacing: 14
            });
        });

        // Right side: Real screenshot of the Matrix Checklist
        slide.addShape(pres.ShapeType.rect, {
            x: 5.9, y: 1.5, w: 6.4, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('Tampilan Form Matrix Hak Akses (2 Kolom Menu & Submenu)', {
            x: 6.1, y: 1.7, w: 6.0, h: 0.35,
            fontSize: 11, fontFace: 'Arial', bold: true, color: NAVY
        });

        slide.addImage({
            path: path.join(screenshotsDir, '20_detail_permission_matrix.png'),
            x: 6.1, y: 2.1, w: 6.0, h: 4.4
        });
    }

    // =========================================================================
    // SLIDE 6: MODUL DASHBOARD UTAMA & STATISTIK
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '5. Modul Dashboard Utama & Monitoring Real-Time', 'Pusat pantauan terpadu untuk efisiensi monitoring sirkulasi barang dan fasilitas');

        // Screenshot on the left
        slide.addImage({
            path: path.join(screenshotsDir, '01_dashboard.png'),
            x: 0.8, y: 1.5, w: 6.6, h: 5.2
        });

        // Right side: Highlights
        slide.addShape(pres.ShapeType.rect, {
            x: 7.6, y: 1.5, w: 4.7, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('Fitur Utama Dashboard', {
            x: 7.9, y: 1.75, w: 4.1, h: 0.4,
            fontSize: 14, fontFace: 'Arial', bold: true, color: BLUE
        });

        const dashPoints = [
            'Kartu Statistik Real-Time: Total jenis aset, total fisik barang, jumlah aset yang sedang dipinjam, dan agenda rapat hari ini.',
            'Tabel Sirkulasi Cepat: Menampilkan transaksi peminjaman terbaru dengan status badge (Dipinjam / Kembali).',
            'Agenda Ruang Rapat: Menampilkan daftar rapat yang sedang dan akan berlangsung hari ini beserta PIC penanggung jawab.',
            'Distribusi Kategori: Diagram progres visual komposisi barang inventaris kantor.'
        ];
        dashPoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.9, y: 2.3 + (idx * 1.05), w: 4.1, h: 0.95,
                fontSize: 10, fontFace: 'Arial', color: SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 7: MODUL MASTER DATA INVENTARIS
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '6. Modul Pengelolaan Master Data Inventaris', 'Katalog aset komprehensif dengan kode barcode, kategori, dan lokasi penyimpanan');

        // Screenshot on the left
        slide.addImage({
            path: path.join(screenshotsDir, '02_data_aset.png'),
            x: 0.8, y: 1.5, w: 6.6, h: 5.2
        });

        // Right side: Highlights
        slide.addShape(pres.ShapeType.rect, {
            x: 7.6, y: 1.5, w: 4.7, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('Kelengkapan Master Data', {
            x: 7.9, y: 1.75, w: 4.1, h: 0.4,
            fontSize: 14, fontFace: 'Arial', bold: true, color: BLUE
        });

        const masterPoints = [
            'Data Aset (Barang): Kode barcode otomatis/manual, nama barang, jumlah fisik, satuan (unit/pcs/box), dan spesifikasi lengkap.',
            'Kategori Barang: Membedakan tipe Aset Tetap (tidak habis) dan Consumable (barang habis pakai seperti ATK/tinta printer).',
            'Ruang Rapat: Pendataan ruang meeting, kapasitas orang, dan fasilitas (Smart TV, AC, projector).',
            'Lokasi Penyimpanan: Gedung, lantai, dan lemari/gudang penyimpanan inventaris.',
            'Supplier / Vendor: Kontak resmi penyedia barang dan garansi resmi.'
        ];
        masterPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 7.9, y: 2.3 + (idx * 0.85), w: 4.1, h: 0.8,
                fontSize: 9.5, fontFace: 'Arial', color: SLATE, lineSpacing: 14
            });
        });
    }

    // =========================================================================
    // SLIDE 8: TRANSAKSI SIRKULASI & RESERVASI RUANG RAPAT
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '7. Sirkulasi Peminjaman & Deteksi Tabrakan Ruang Rapat', 'Pencegahan bentrok pemakaian fasilitas dan kontrol kepemilikan sementara barang');

        // 2 Screenshots Side-by-Side
        slide.addImage({
            path: path.join(screenshotsDir, '09_peminjaman_aset.png'),
            x: 0.8, y: 1.5, w: 5.6, h: 3.5
        });
        slide.addText('Tabel Transaksi Peminjaman & Pengembalian Aset', {
            x: 0.8, y: 5.1, w: 5.6, h: 0.3,
            fontSize: 9.5, fontFace: 'Arial', bold: true, color: NAVY, align: 'center'
        });

        slide.addImage({
            path: path.join(screenshotsDir, '12_booking_ruangan.png'),
            x: 6.7, y: 1.5, w: 5.6, h: 3.5
        });
        slide.addText('Jadwal Reservasi Ruang Rapat Kantor', {
            x: 6.7, y: 5.1, w: 5.6, h: 0.3,
            fontSize: 9.5, fontFace: 'Arial', bold: true, color: NAVY, align: 'center'
        });

        // Bottom highlights
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.5, w: 11.5, h: 1.3,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1 }
        });
        slide.addText('Keunggulan Fitur Sirkulasi & Booking:', {
            x: 1.0, y: 5.6, w: 11.1, h: 0.3,
            fontSize: 10.5, fontFace: 'Arial', bold: true, color: BLUE
        });
        slide.addText('1) Live Collision Detection: Sistem otomatis menolak reservasi jika ruangan, tanggal, dan rentang jam bentrok dengan jadwal rapat divisi lain.  |  2) Auto Stock Deduct: Stok barang yang dipinjam otomatis berkurang dan kembali saat dikembalikan.', {
            x: 1.0, y: 5.95, w: 11.1, h: 0.7,
            fontSize: 9, fontFace: 'Arial', color: SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 9: MODUL STOCK OPNAME & AUDIT BERKALA
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '8. Modul Stock Opname & Penyesuaian Audit Fisik', 'Mekanisme rekonsiliasi berkala stok fisik di gudang dengan catatan sistem');

        // Screenshot on the left
        slide.addImage({
            path: path.join(screenshotsDir, '14_stock_opname.png'),
            x: 0.8, y: 1.5, w: 6.6, h: 5.2
        });

        // Right side: Highlights
        slide.addShape(pres.ShapeType.rect, {
            x: 7.6, y: 1.5, w: 4.7, h: 5.2,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('Manfaat Stock Opname', {
            x: 7.9, y: 1.75, w: 4.1, h: 0.4,
            fontSize: 14, fontFace: 'Arial', bold: true, color: BLUE
        });

        const opnamePoints = [
            'Audit Berkala: Petunjuk operasional untuk petugas GA memeriksa fisik barang di gudang secara terjadwal.',
            'Kalkulasi Selisih Otomatis: Sistem langsung menghitung selisih fisik vs catatan (misal: -2 unit atau +1 unit).',
            'Alasan Penyesuaian Wajib: Setiap perubahan stok audit mewajibkan input keterangan (contoh: barang rusak dibuang, ditemukan di rak lain).',
            'Audit Trail Log: Menghindari manipulasi data stok dan menjamin transparansi saat pelaporan ke pimpinan.'
        ];
        opnamePoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.9, y: 2.3 + (idx * 1.05), w: 4.1, h: 0.95,
                fontSize: 10, fontFace: 'Arial', color: SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 10: PELAPORAN, EKSPOR EXCEL & CETAK DOKUMEN RESMI
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '9. Pelaporan Otomatis, Ekspor Excel & Cetak Dokumen Resmi', 'Menyediakan rekapan komprehensif yang siap diaudit dan ditandatangani pimpinan');

        // 2 Screenshots Side-by-Side
        slide.addImage({
            path: path.join(screenshotsDir, '15_laporan_dan_cetak.png'),
            x: 0.8, y: 1.5, w: 5.6, h: 3.5
        });
        slide.addText('Pusat Laporan & Ekspor Format Excel (.xls)', {
            x: 0.8, y: 5.1, w: 5.6, h: 0.3,
            fontSize: 9.5, fontFace: 'Arial', bold: true, color: NAVY, align: 'center'
        });

        slide.addImage({
            path: path.join(screenshotsDir, '16_modal_cetak_preview.png'),
            x: 6.7, y: 1.5, w: 5.6, h: 3.5
        });
        slide.addText('Pratinjau Cetak Fisik Ber-Kop Surat Dinas Resmi', {
            x: 6.7, y: 5.1, w: 5.6, h: 0.3,
            fontSize: 9.5, fontFace: 'Arial', bold: true, color: NAVY, align: 'center'
        });

        // Bottom highlights
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.5, w: 11.5, h: 1.3,
            fill: { color: WHITE },
            line: { color: 'CBD5E1', width: 1 }
        });
        slide.addText('Standar Output Dokumen:', {
            x: 1.0, y: 5.6, w: 11.1, h: 0.3,
            fontSize: 10.5, fontFace: 'Arial', bold: true, color: BLUE
        });
        slide.addText('1) Ekspor Excel: Menghasilkan tabel data mentah yang dapat diolah kembali oleh akuntansi/pimpinan.  |  2) Cetak Fisik / PDF: Standar dokumen kantor dengan kop dinas resmi dan kolom tanda tangan Mengetahui (Kepala Divisi) serta Petugas.', {
            x: 1.0, y: 5.95, w: 11.1, h: 0.7,
            fontSize: 9, fontFace: 'Arial', color: SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 11: HASIL TESTING & EVALUASI SISTEM (BLACKBOX)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '10. Hasil Pengujian Fungsional Sistem (Blackbox Testing)', 'Seluruh skenario pengujian fungsional dan hak akses telah divalidasi berhasil 100%');

        const testCases = [
            { no: '1', module: 'Manajemen Hak Akses', scenario: 'User Divisi Operasional login hanya bisa melihat Peminjaman & Booking', result: 'VALID (Sidebar otomatis menyaring menu)' },
            { no: '2', module: 'Peminjaman Aset', scenario: 'Meminjam barang dengan status tersedia dan memeriksa pengurangan stok', result: 'VALID (Stok fisik berkurang real-time)' },
            { no: '3', module: 'Booking Ruangan', scenario: 'Menginput pemesanan ruangan pada tanggal dan jam yang sama persis', result: 'VALID (Sistem menolak dengan alert bentrok)' },
            { no: '4', module: 'Stock Opname', scenario: 'Melakukan penyesuaian stok audit fisik dan menyimpan catatan alasan', result: 'VALID (Stok sistem terupdate ke fisik riil)' },
            { no: '5', module: 'Ekspor & Cetak', scenario: 'Mengunduh rekap Excel dan memunculkan pratinjau cetak kop resmi', result: 'VALID (Format file & tata letak rapi)' }
        ];

        // Table Header
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.5, w: 11.5, h: 0.5,
            fill: { color: NAVY }
        });
        slide.addText('No', { x: 0.9, y: 1.6, w: 0.6, h: 0.3, fontSize: 10, bold: true, color: WHITE });
        slide.addText('Modul Fungsional', { x: 1.6, y: 1.6, w: 2.5, h: 0.3, fontSize: 10, bold: true, color: WHITE });
        slide.addText('Skenario Pengujian', { x: 4.2, y: 1.6, w: 4.8, h: 0.3, fontSize: 10, bold: true, color: WHITE });
        slide.addText('Hasil Evaluasi', { x: 9.1, y: 1.6, w: 3.1, h: 0.3, fontSize: 10, bold: true, color: WHITE });

        testCases.forEach((tc, idx) => {
            const y = 2.05 + (idx * 0.9);
            slide.addShape(pres.ShapeType.rect, {
                x: 0.8, y: y, w: 11.5, h: 0.85,
                fill: { color: idx % 2 === 0 ? WHITE : LIGHT_BG },
                line: { color: 'E2E8F0', width: 1 }
            });
            slide.addText(tc.no, { x: 0.9, y: y + 0.25, w: 0.6, h: 0.35, fontSize: 10, bold: true, color: BLUE });
            slide.addText(tc.module, { x: 1.6, y: y + 0.25, w: 2.5, h: 0.35, fontSize: 10, bold: true, color: NAVY });
            slide.addText(tc.scenario, { x: 4.2, y: y + 0.15, w: 4.8, h: 0.55, fontSize: 9.5, color: SLATE, lineSpacing: 13 });
            slide.addText(tc.result, { x: 9.1, y: y + 0.25, w: 3.1, h: 0.35, fontSize: 9.5, bold: true, color: EMERALD });
        });
    }

    // =========================================================================
    // SLIDE 12: KESIMPULAN & PENUTUP (Q&A)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: NAVY };

        // Accent line
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.15,
            fill: { color: BLUE }
        });

        slide.addText('KESIMPULAN & PENUTUP', {
            x: 1.0, y: 1.0, w: 11.3, h: 0.4,
            fontSize: 13, fontFace: 'Arial', bold: true, color: SKY, letterSpacing: 2
        });

        slide.addText('Hasil Proyek Kuliah Kerja Praktik (KKP)', {
            x: 1.0, y: 1.45, w: 11.3, h: 0.6,
            fontSize: 24, fontFace: 'Arial', bold: true, color: WHITE
        });

        // 3 Conclusion Cards
        const conclusions = [
            {
                title: 'Transformasi Berhasil',
                desc: 'Aplikasi berhasil dimigrasi dari desktop ke web application on-premise responsif yang dapat diakses simultan oleh seluruh divisi kantor via LAN.'
            },
            {
                title: 'RBAC Ala Synology NAS',
                desc: 'Pemberian izin per divisi sangat mempermudah administrasi user: user baru tinggal dipilihkan divisi dan langsung siap bekerja.'
            },
            {
                title: 'Nol Tabrakan Jadwal & Selisih',
                desc: 'Fitur live collision detection dan modul stock opname berkala menjamin fasilitas dan aset fisik kantor terkelola secara akuntabel.'
            }
        ];

        conclusions.forEach((c, idx) => {
            const x = 1.0 + (idx * 3.8);
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 2.3, w: 3.5, h: 2.8,
                fill: { color: '1E293B' },
                line: { color: BLUE, width: 1.5 }
            });
            slide.addText(`0${idx + 1}`, {
                x: x + 0.3, y: 2.5, w: 2.9, h: 0.45,
                fontSize: 20, fontFace: 'Arial', bold: true, color: SKY
            });
            slide.addText(c.title, {
                x: x + 0.3, y: 3.0, w: 2.9, h: 0.4,
                fontSize: 13, fontFace: 'Arial', bold: true, color: WHITE
            });
            slide.addText(c.desc, {
                x: x + 0.3, y: 3.5, w: 2.9, h: 1.4,
                fontSize: 10, fontFace: 'Arial', color: 'CBD5E1', lineSpacing: 15
            });
        });

        // Q&A Box
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 5.4, w: 11.3, h: 1.3,
            fill: { color: '0F172A' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('Sesi Tanya Jawab (Q & A)', {
            x: 1.3, y: 5.55, w: 10.7, h: 0.35,
            fontSize: 14, fontFace: 'Arial', bold: true, color: EMERALD
        });
        slide.addText('Terima kasih kepada Dosen Pembimbing, Penguji KKP, dan Pimpinan Instansi atas bimbingan selama pelaksanaan Praktik Kerja.', {
            x: 1.3, y: 5.95, w: 10.7, h: 0.6,
            fontSize: 10.5, fontFace: 'Arial', color: '94A3B8'
        });
    }

    // Save to target directory
    const outputPath = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Rencana_KKP_Sistem_Inventaris.pptx';
    await pres.writeFile({ fileName: outputPath });
    console.log(`[SUCCESS] Presentation written to: ${outputPath}`);
}

createKKPPresentation().catch(err => {
    console.error('[ERROR] Failed to generate presentation:', err);
    process.exit(1);
});

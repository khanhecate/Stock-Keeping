const pptxgen = require('pptxgenjs');
const path = require('path');

async function createCleanKKPPresentation() {
    const pres = new pptxgen();

    // Widescreen 16:9 layout (13.333 x 7.5 inches)
    pres.layout = 'LAYOUT_WIDE';
    pres.author = 'Mahasiswa Praktik Kerja / KKP';
    pres.company = 'Sistem Informasi Manajemen Inventaris Kantor';
    pres.title = 'Presentasi Rencana & Implementasi Kuliah Kerja Praktik (KKP)';

    // Clean, Simple, Professional Corporate Palette (No over-the-top AI sci-fi colors)
    const C_WHITE     = 'FFFFFF';
    const C_BG_LIGHT  = 'F8FAFC';  // Clean crisp off-white
    const C_NAVY      = '0F172A';  // Primary dark slate for titles
    const C_SLATE     = '334155';  // Readable body text
    const C_MUTED     = '64748B';  // Secondary text / subtitles
    const C_BORDER    = 'E2E8F0';  // Clean subtle card border
    const C_BLUE      = '1E3A8A';  // Deep corporate blue
    const C_ACCENT    = '2563EB';  // Primary action blue
    const C_TEAL      = '0D9488';  // Clean teal
    const C_AMBER     = 'D97706';  // Warm amber for alerts
    const C_CARD_BG   = 'FFFFFF';

    const screenshotsDir = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\screenshots';

    // Helper: Standardized slide header strictly contained within bounds
    function addHeader(slide, title, subtitle) {
        slide.background = { color: C_BG_LIGHT };

        // Subtle top corporate bar (Width = 100%, Height = 0.08 in)
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.08,
            fill: { color: C_BLUE }
        });

        // Title (Strictly bounded: x = 0.8, w = 11.7 -> right edge = 12.5)
        slide.addText(title, {
            x: 0.8, y: 0.42, w: 11.7, h: 0.5,
            fontSize: 20, fontFace: 'Calibri', bold: true, color: C_NAVY
        });

        // Subtitle
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.8, y: 0.92, w: 11.7, h: 0.35,
                fontSize: 11, fontFace: 'Calibri', color: C_MUTED
            });
        }

        // Clean divider line
        slide.addShape(pres.ShapeType.line, {
            x: 0.8, y: 1.32, w: 11.7, h: 0,
            line: { color: C_BORDER, width: 1 }
        });

        // Footer lines (Strictly bounded: y = 7.05 to 7.35, inside 7.5 in canvas)
        slide.addText('Sistem Informasi Manajemen Inventaris & Fasilitas Kantor | Kuliah Kerja Praktik (KKP)', {
            x: 0.8, y: 7.05, w: 8.0, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', color: C_MUTED
        });
        slide.addText('Rencana & Implementasi Sistem', {
            x: 9.0, y: 7.05, w: 3.5, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', align: 'right', color: C_MUTED
        });
    }

    // =========================================================================
    // SLIDE 1: COVER / TITLE SLIDE (Clean, Elegant Corporate Navy)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: C_NAVY };

        // Accent top stripe
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.12,
            fill: { color: C_ACCENT }
        });

        // Category Tag
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 1.3, w: 4.8, h: 0.38,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('KULIAH KERJA PRAKTIK (KKP) / MAGANG', {
            x: 1.0, y: 1.3, w: 4.8, h: 0.38,
            fontSize: 10, fontFace: 'Calibri', bold: true, color: '93C5FD', align: 'center'
        });

        // Main Title
        slide.addText('Rancang Bangun Sistem Informasi\nManajemen Inventaris & Fasilitas Ruangan Kantor', {
            x: 1.0, y: 1.9, w: 11.3, h: 1.5,
            fontSize: 27, fontFace: 'Calibri', bold: true, color: C_WHITE, lineSpacing: 36
        });

        // Subtitle / Scope
        slide.addText('Digitalisasi Tata Kelola Aset, Sirkulasi Barang, Reservasi Fasilitas, dan Pengaturan Hak Akses Berbasis Grup Divisi (Synology NAS Group RBAC) pada Jaringan Lokal Kantor (On-Premise LAN)', {
            x: 1.0, y: 3.55, w: 11.3, h: 0.75,
            fontSize: 12.5, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 18
        });

        // 3 Key Feature Pills
        const pills = [
            { title: 'Platform Web Responsif', desc: 'Arsitektur Fullstack Clean SPA' },
            { title: 'Server On-Premise LAN', desc: 'Hosting Internal Kantor Tanpa Cloud' },
            { title: 'Synology NAS Group RBAC', desc: 'Izin Akses Terpusat per Divisi' }
        ];

        pills.forEach((p, idx) => {
            const px = 1.0 + (idx * 3.85);
            slide.addShape(pres.ShapeType.rect, {
                x: px, y: 4.65, w: 3.6, h: 1.3,
                fill: { color: '1E293B' },
                line: { color: '334155', width: 1 }
            });
            slide.addText(p.title, {
                x: px + 0.25, y: 4.85, w: 3.1, h: 0.35,
                fontSize: 11.5, fontFace: 'Calibri', bold: true, color: '60A5FA'
            });
            slide.addText(p.desc, {
                x: px + 0.25, y: 5.25, w: 3.1, h: 0.5,
                fontSize: 9.5, fontFace: 'Calibri', color: 'CBD5E1'
            });
        });

        // Footer info
        slide.addText('Program Studi Teknik Informatika / Sistem Informasi — Tahun 2026', {
            x: 1.0, y: 6.8, w: 11.3, h: 0.35,
            fontSize: 10, fontFace: 'Calibri', color: '64748B'
        });
    }

    // =========================================================================
    // SLIDE 2: GAMBARAN SINGKAT PROYEK (EXECUTIVE OVERVIEW)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Gambaran Singkat Proyek KKP (Executive Overview)', 'Ringkasan esensial: Permasalahan kantor, solusi sistem yang dibangun, dan hasil yang dicapai');

        const overviewCards = [
            {
                badge: 'TANTANGAN KANTOR (PROBLEM)',
                color: C_BLUE,
                title: 'Kendala Sistem Lama',
                points: [
                    'Sistem desktop lama hanya terpasang di 1 komputer admin GA, staf lain tidak bisa akses mandiri.',
                    'Pencatatan peminjaman aset masih berbasis buku manual / spreadsheet terpisah.',
                    'Jadwal ruang rapat sering bentrok (double-booking) akibat koordinasi via chat verbal.',
                    'Sering terjadi selisih stok fisik barang habis pakai (ATK) yang tidak terlacak.'
                ]
            },
            {
                badge: 'SOLUSI YANG DIBANGUN (SOLUTION)',
                color: C_ACCENT,
                title: 'Web App On-Premise LAN',
                points: [
                    'Konversi total ke Web Application responsif yang berjalan di server internal kantor.',
                    'Dapat diakses bersamaan oleh seluruh PC staf melalui browser via IP LAN (192.168.x.x:3000).',
                    'Katalog inventaris komprehensif dengan kode barcode, kategori, dan lokasi fisik.',
                    'Validasi otomatis live collision check untuk mencegah jadwal rapat tabrakan.'
                ]
            },
            {
                badge: 'INOVASI KUNCI (KEY INNOVATION)',
                color: C_TEAL,
                title: 'Synology NAS Group RBAC',
                points: [
                    'Pemberian izin menu dikonfigurasi per Divisi & Level kerja (bukan manual per user).',
                    'Saat mendaftarkan staf baru, cukup pilih Divisinya; hak akses langsung otomatis terwarisi.',
                    'Matrix checklist 2 kolom (Menu Utama di kiri dan Submenu spesifik di kanan).',
                    'Sidebar aplikasi otomatis menyaring dan hanya menampilkan menu yang diizinkan.'
                ]
            },
            {
                badge: 'HASIL & DAMPAK (IMPACT)',
                color: C_AMBER,
                title: 'Efisiensi & Akuntabilitas',
                points: [
                    'Efisiensi waktu kerja staf GA dan seluruh divisi hingga lebih dari 60%.',
                    'Nol insiden tabrakan jadwal pemakaian ruang rapat di lingkungan kantor.',
                    'Akurasi stok terjamin dengan modul audit berkala (Stock Opname terintegrasi).',
                    'Pelaporan instan: Ekspor file Excel (.xls) dan cetak dokumen dinas resmi ber-kop dinas.'
                ]
            }
        ];

        overviewCards.forEach((c, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 0.8 + (col * 5.95);
            const y = 1.55 + (row * 2.6);

            // Container Box (Width = 5.75, Height = 2.4 -> Total x = 12.5, Total y = 6.55)
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 2.4,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            // Top Header Line on Card
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 0.35,
                fill: { color: c.color }
            });
            slide.addText(c.badge, {
                x: x + 0.2, y: y + 0.05, w: 5.35, h: 0.25,
                fontSize: 9, fontFace: 'Calibri', bold: true, color: C_WHITE
            });

            // Card Title
            slide.addText(c.title, {
                x: x + 0.25, y: y + 0.45, w: 5.25, h: 0.35,
                fontSize: 12.5, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            // Points
            c.points.forEach((pt, pIdx) => {
                slide.addText(`•  ${pt}`, {
                    x: x + 0.25, y: y + 0.82 + (pIdx * 0.36), w: 5.25, h: 0.34,
                    fontSize: 8.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 11
                });
            });
        });
    }

    // =========================================================================
    // SLIDE 3: PEMETAAN MODUL SISTEM (SYSTEM & MODULE MAPPING)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Pemetaan Modul Sistem (System & Module Mapping)', 'Diagram hierarki arsitektur dan pembagian fungsi dalam 4 pilar sistem yang saling terintegrasi');

        // Top Main Engine Box (Width = 11.7, Height = 0.85 -> x = 0.8 to 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 11.7, h: 0.85,
            fill: { color: C_NAVY }
        });
        slide.addText('CORE ENGINE: SISTEM INFORMASI MANAJEMEN INVENTARIS & FASILITAS KANTOR', {
            x: 1.0, y: 1.65, w: 11.3, h: 0.35,
            fontSize: 13, fontFace: 'Calibri', bold: true, color: C_WHITE, align: 'center'
        });
        slide.addText('Arsitektur Fullstack On-Premise LAN | Node.js Express Engine | Database MySQL Relasional', {
            x: 1.0, y: 2.02, w: 11.3, h: 0.28,
            fontSize: 9.5, fontFace: 'Calibri', color: '94A3B8', align: 'center'
        });

        // 4 Pillar Columns
        const pillars = [
            {
                num: 'PILAR 1',
                title: 'Keamanan & RBAC',
                color: C_BLUE,
                items: [
                    'Grup Divisi & Level Jabatan',
                    'Model Izin Synology NAS',
                    'Matrix 2 Kolom Menu & Submenu',
                    'Sidebar Filtering Otomatis',
                    'Audit Trail Sesi Pengguna'
                ]
            },
            {
                num: 'PILAR 2',
                title: 'Master Data Kantor',
                color: C_ACCENT,
                items: [
                    'Katalog Aset & Barcode Unik',
                    'Aset Tetap vs Consumable (ATK)',
                    'Ruang Rapat & Fasilitas',
                    'Lokasi Gedung & Lemari Simpan',
                    'Status Barang & Vendor Rekanan'
                ]
            },
            {
                num: 'PILAR 3',
                title: 'Sirkulasi & Operasional',
                color: C_TEAL,
                items: [
                    'Peminjaman & PIC Peminjam',
                    'Pengembalian & Pemulihan Stok',
                    'Barang Keluar (Habis Pakai)',
                    'Booking Ruangan Anti-Bentrok',
                    'Audit Fisik Stock Opname'
                ]
            },
            {
                num: 'PILAR 4',
                title: 'Pelaporan & Audit',
                color: C_AMBER,
                items: [
                    'Log Sirkulasi Inventaris Lengkap',
                    'Ekspor Spreadsheet Excel (.xls)',
                    'Pratinjau Cetak Surat Dinas',
                    'Format Kop Surat Kantor Resmi',
                    'Kolom Tanda Tangan Pimpinan'
                ]
            }
        ];

        pillars.forEach((p, idx) => {
            const px = 0.8 + (idx * 2.98); // 0.8, 3.78, 6.76, 9.74 -> 9.74 + 2.76 = 12.5 (Within bounds!)
            const py = 2.65;
            const pw = 2.76;
            const ph = 3.25;

            // Pillar Card Box
            slide.addShape(pres.ShapeType.rect, {
                x: px, y: py, w: pw, h: ph,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            // Card Header
            slide.addShape(pres.ShapeType.rect, {
                x: px, y: py, w: pw, h: 0.65,
                fill: { color: p.color }
            });
            slide.addText(p.num, {
                x: px + 0.1, y: py + 0.08, w: pw - 0.2, h: 0.2,
                fontSize: 8.5, fontFace: 'Calibri', bold: true, color: 'E2E8F0', align: 'center'
            });
            slide.addText(p.title, {
                x: px + 0.1, y: py + 0.28, w: pw - 0.2, h: 0.3,
                fontSize: 11, fontFace: 'Calibri', bold: true, color: C_WHITE, align: 'center'
            });

            // Items List
            p.items.forEach((item, iIdx) => {
                slide.addText(`✔  ${item}`, {
                    x: px + 0.2, y: py + 0.8 + (iIdx * 0.46), w: pw - 0.4, h: 0.4,
                    fontSize: 8.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 12
                });
            });
        });

        // Bottom Summary Banner (Width = 11.7, Height = 0.75 -> Total y = 6.75, Within 7.5 in!)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 6.05, w: 11.7, h: 0.75,
            fill: { color: 'F1F5F9' },
            line: { color: C_BORDER, width: 1 }
        });
        slide.addText('Alur Kerja Terpadu: Dari penetapan izin divisi oleh IT, pengadaan aset oleh GA, peminjaman oleh staf, hingga rekapitulasi audit manajemen, seluruh proses terintegrasi otomatis dalam satu database relasional terpusat.', {
            x: 1.0, y: 6.12, w: 11.3, h: 0.6,
            fontSize: 9.2, fontFace: 'Calibri', color: C_NAVY, lineSpacing: 13
        });
    }

    // =========================================================================
    // SLIDE 4: LATAR BELAKANG & IDENTIFIKASI MASALAH
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '1. Latar Belakang & Identifikasi Masalah', 'Kondisi operasional eksisting yang melandasi urgensi pengembangan sistem web');

        const problems = [
            {
                code: 'MASALAH 1',
                title: 'Aplikasi Desktop Single-User',
                desc: 'Sebelumnya sistem berbasis software desktop JavaFX yang hanya terpasang di 1 komputer kantor. Karyawan divisi lain tidak dapat memeriksa stok atau mengajukan pinjaman secara mandiri.'
            },
            {
                code: 'MASALAH 2',
                title: 'Bentrok Jadwal Ruang Rapat',
                desc: 'Pemesanan ruangan dilakukan melalui chat grup atau whiteboard fisik, sehingga sering terjadi jadwal ganda (double-booking) antar divisi pada jam kerja padat.'
            },
            {
                code: 'MASALAH 3',
                title: 'Selisih Stok Fisik vs Catatan',
                desc: 'Tanpa mekanisme Stock Opname berkala yang terintegrasi, inventaris barang habis pakai (ATK) sering mengalami selisih fisik yang tidak terlacak penanggung jawabnya.'
            },
            {
                code: 'MASALAH 4',
                title: 'Pengaturan Izin Akses Manual',
                desc: 'Pemberian izin per user sangat merepotkan. Kantor membutuhkan skema permission grup seperti Synology NAS: set izin per divisi, user baru langsung mewarisi akses.'
            }
        ];

        problems.forEach((p, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 0.8 + (col * 5.95);
            const y = 1.55 + (row * 2.6);

            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 2.35,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            slide.addShape(pres.ShapeType.rect, {
                x: x + 0.3, y: y + 0.3, w: 1.3, h: 0.32,
                fill: { color: 'FEE2E2' },
                line: { color: 'FECACA', width: 1 }
            });
            slide.addText(p.code, {
                x: x + 0.3, y: y + 0.3, w: 1.3, h: 0.32,
                fontSize: 8.5, fontFace: 'Calibri', bold: true, color: '991B1B', align: 'center'
            });

            slide.addText(p.title, {
                x: x + 1.8, y: y + 0.28, w: 3.65, h: 0.35,
                fontSize: 12.5, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            slide.addText(p.desc, {
                x: x + 0.3, y: y + 0.78, w: 5.15, h: 1.4,
                fontSize: 9.5, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
            });
        });
    }

    // =========================================================================
    // SLIDE 5: TUJUAN & MANFAAT PRAKTIK KERJA
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '2. Tujuan & Manfaat Proyek KKP', 'Target capaian implementasi dan dampak nilai tambah bagi instansi tempat praktik kerja');

        // Left box: Tujuan (Width = 5.75)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 5.75, h: 5.15,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('🎯 Tujuan Praktik Kerja (KKP)', {
            x: 1.1, y: 1.8, w: 5.15, h: 0.45,
            fontSize: 14, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const goals = [
            'Mengonversi modul desktop JavaFX menjadi Web Application responsif yang modern.',
            'Menyediakan server on-premise di dalam kantor agar dapat diakses seluruh staf via IP LAN lokal.',
            'Menerapkan skema Group RBAC (seperti Synology NAS) untuk hak akses per Divisi & Level kerja.',
            'Mencegah bentrok jadwal ruang rapat dengan validasi otomatis overlapping check.',
            'Menyediakan rekapitulasi pelaporan otomatis dengan Ekspor Excel dan Cetak Surat Dinas resmi.'
        ];
        goals.forEach((g, idx) => {
            slide.addText(`✔  ${g}`, {
                x: 1.1, y: 2.45 + (idx * 0.82), w: 5.15, h: 0.72,
                fontSize: 10, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
            });
        });

        // Right box: Manfaat (Width = 5.75, x = 6.75 -> Total x = 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 6.75, y: 1.55, w: 5.75, h: 5.15,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('💼 Manfaat bagi Instansi & Pengguna', {
            x: 7.05, y: 1.8, w: 5.15, h: 0.45,
            fontSize: 14, fontFace: 'Calibri', bold: true, color: C_TEAL
        });

        const benefits = [
            'Bagi Divisi GA/Operasional: Efisiensi waktu pencatatan dan kontrol stok fisik yang transparan.',
            'Bagi Seluruh Karyawan: Kemudahan melihat ketersediaan barang dan booking ruang rapat langsung dari meja kerja.',
            'Bagi Manajemen: Ketersediaan laporan berkala aset dan histori sirkulasi secara real-time.',
            'Bagi Keamanan Data: Data 100% tersimpan aman di server internal kantor tanpa risiko kebocoran cloud publik.',
            'Bagi Mahasiswa: Pengalaman nyata membangun arsitektur web fullstack dan administrasi jaringan LAN.'
        ];
        benefits.forEach((b, idx) => {
            slide.addText(`★  ${b}`, {
                x: 7.05, y: 2.45 + (idx * 0.82), w: 5.15, h: 0.72,
                fontSize: 10, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
            });
        });
    }

    // =========================================================================
    // SLIDE 6: TOPOLOGI JARINGAN ON-PREMISE LAN
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '3. Topologi Jaringan On-Premise LAN Kantor', 'Skema penerapan server internal kantor yang aman, cepat, dan independen dari internet publik');

        // 3 Cards Upper Row (Width = 3.75 each)
        const techStack = [
            { title: 'Front-End Presentation', tech: 'HTML5, CSS3 Modern, Vanilla JS SPA', desc: 'Antarmuka responsif tanpa dependensi framework luar yang berat, waktu muat instan (< 100ms).' },
            { title: 'Back-End Application Service', tech: 'Node.js & Express.js REST API', desc: 'Menangani multi-request bersamaan, validasi bentrok jadwal rapat, dan generator berkas dinas.' },
            { title: 'Data Persistence & Storage', tech: 'MySQL Relational Database', desc: 'Integritas relasional dengan Foreign Keys, JSON field untuk permission matrix, dan pencadangan mudah.' }
        ];

        techStack.forEach((t, idx) => {
            const x = 0.8 + (idx * 3.98); // 0.8, 4.78, 8.76 -> 8.76 + 3.74 = 12.5 (Strict bounds!)
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 1.55, w: 3.74, h: 2.35,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });
            slide.addText(t.title, {
                x: x + 0.25, y: 1.75, w: 3.24, h: 0.35,
                fontSize: 12, fontFace: 'Calibri', bold: true, color: C_BLUE
            });
            slide.addText(t.tech, {
                x: x + 0.25, y: 2.15, w: 3.24, h: 0.35,
                fontSize: 10, fontFace: 'Calibri', bold: true, color: C_NAVY
            });
            slide.addText(t.desc, {
                x: x + 0.25, y: 2.58, w: 3.24, h: 1.15,
                fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13
            });
        });

        // Bottom Box: LAN Topology Box (Width = 11.7, Height = 2.45 -> Total y = 6.65, Within 7.5 in!)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 4.15, w: 11.7, h: 2.55,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('ARSITEKTUR AKSES JARINGAN LOKAL KANTOR (ON-PREMISE LAN)', {
            x: 1.1, y: 4.35, w: 11.1, h: 0.3,
            fontSize: 11, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const lanNodes = [
            { label: 'SERVER KANTOR\n(IP: 192.168.1.15:3000)', sub: 'Host Node.js & MySQL' },
            { label: 'SWITCH / ROUTER LAN\n(Jaringan Lokal Kantor)', sub: 'DHCP & Local IP Routing' },
            { label: 'PC STAF GA & IT\n(Input Master & User)', sub: 'Akses via Web Browser' },
            { label: 'PC SELURUH DIVISI\n(Peminjaman & Booking)', sub: 'Akses Tanpa Install App' }
        ];

        lanNodes.forEach((n, idx) => {
            const nx = 1.1 + (idx * 2.8);
            slide.addShape(pres.ShapeType.rect, {
                x: nx, y: 4.8, w: 2.55, h: 1.6,
                fill: { color: 'F8FAFC' },
                line: { color: C_BORDER, width: 1.5 }
            });
            slide.addText(n.label, {
                x: nx + 0.1, y: 4.98, w: 2.35, h: 0.7,
                fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
            });
            slide.addText(n.sub, {
                x: nx + 0.1, y: 5.75, w: 2.35, h: 0.45,
                fontSize: 8.5, fontFace: 'Calibri', color: C_MUTED, align: 'center'
            });
        });
    }

    // =========================================================================
    // SLIDE 7: SKEMA HAK AKSES GRUP DIVISI (SYNOLOGY NAS RBAC)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '4. Hak Akses Berbasis Grup Divisi (Synology NAS RBAC)', 'Penetapan hak akses terpusat pada Divisi; pegawai baru otomatis mewarisi seluruh izin aksesnya');

        // Left explanation card (x = 0.8, w = 5.0, h = 5.0 -> x + w = 5.8)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Mekanisme Izin Grup Divisi', {
            x: 1.05, y: 1.8, w: 4.5, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const rbacPoints = [
            'Model Synology NAS: Administrator tidak perlu mengklik izin menu per user. Cukup tentukan hak akses satu kali pada grup Divisi.',
            'Dua Kolom Matrix Perizinan: Memisahkan antara Menu Utama (Kiri) dan Submenu Spesifik (Kanan).',
            'Otomatisasi Penugasan: Saat membuat user baru, cukup pilih Divisinya. User otomatis langsung mewarisi izin akses yang ditentukan.',
            'Sidebar Dinamis: Menu yang tidak diizinkan otomatis disembunyikan total dari pandangan user.',
            'Divisi IT Administrator memiliki akses penuh secara default untuk pemeliharaan sistem.'
        ];
        rbacPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 1.05, y: 2.35 + (idx * 0.82), w: 4.5, h: 0.75,
                fontSize: 9.5, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
            });
        });

        // Right side: Real screenshot of the Matrix Checklist (x = 6.1, w = 6.4, h = 5.1 -> Total x = 12.5, Strict bounds!)
        slide.addShape(pres.ShapeType.rect, {
            x: 6.1, y: 1.55, w: 6.4, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Tampilan Form Matrix Hak Akses (2 Kolom Menu & Submenu)', {
            x: 6.3, y: 1.7, w: 6.0, h: 0.35,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_NAVY
        });

        slide.addImage({
            path: path.join(screenshotsDir, '20_detail_permission_matrix.png'),
            x: 6.3, y: 2.1, w: 6.0, h: 4.35
        });
    }

    // =========================================================================
    // SLIDE 8: MODUL DASHBOARD UTAMA
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '5. Modul Dashboard Utama & Monitoring Real-Time', 'Pusat pantauan terpadu untuk efisiensi monitoring sirkulasi barang dan fasilitas');

        // Screenshot on the left (x = 0.8, w = 6.4, h = 5.1 -> x + w = 7.2)
        slide.addImage({
            path: path.join(screenshotsDir, '01_dashboard.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side: Highlights (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5, Total y = 6.65. PERFECT!)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Fitur Utama Dashboard', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const dashPoints = [
            'Kartu Statistik Real-Time: Total jenis aset, total fisik barang, jumlah aset yang sedang dipinjam, dan agenda rapat hari ini.',
            'Tabel Sirkulasi Cepat: Menampilkan transaksi peminjaman terbaru dengan status badge (Dipinjam / Kembali).',
            'Agenda Ruang Rapat: Menampilkan daftar rapat yang sedang dan akan berlangsung hari ini beserta PIC penanggung jawab.',
            'Distribusi Kategori: Diagram progres visual komposisi barang inventaris kantor.'
        ];
        dashPoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 9: MODUL MASTER DATA INVENTARIS (FIXED PADDING & LAYOUT!)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '6. Modul Pengelolaan Master Data Inventaris', 'Katalog aset komprehensif dengan kode barcode, kategori, dan lokasi penyimpanan');

        // Screenshot on the left (x = 0.8, w = 6.4, h = 5.1 -> Total x = 7.2)
        slide.addImage({
            path: path.join(screenshotsDir, '02_data_aset.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side card (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5, Total y = 6.65. Fits inside slide boundary perfectly!)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Kelengkapan Master Data', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const masterPoints = [
            'Data Aset (Barang): Kode barcode otomatis/manual, nama barang, jumlah fisik, satuan (unit/pcs/box), dan spesifikasi lengkap.',
            'Kategori Barang: Membedakan tipe Aset Tetap (tidak habis) dan Consumable (barang habis pakai seperti ATK/tinta printer).',
            'Ruang Rapat: Pendataan ruang meeting, kapasitas orang, dan fasilitas pendukung (Smart TV, AC, projector).',
            'Lokasi Penyimpanan: Gedung, lantai, dan lemari/gudang penyimpanan inventaris.',
            'Supplier / Vendor: Kontak resmi penyedia barang dan masa garansi resmi.'
        ];
        masterPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 0.84), w: 4.4, h: 0.78,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13
            });
        });
    }

    // =========================================================================
    // SLIDE 10: TRANSAKSI SIRKULASI & RESERVASI RUANG RAPAT
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '7. Sirkulasi Peminjaman & Deteksi Tabrakan Ruang Rapat', 'Pencegahan bentrok pemakaian fasilitas dan kontrol kepemilikan sementara barang');

        // 2 Screenshots Side-by-Side strictly within bounds
        slide.addImage({
            path: path.join(screenshotsDir, '09_peminjaman_aset.png'),
            x: 0.8, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Tabel Transaksi Peminjaman & Pengembalian Aset', {
            x: 0.8, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        slide.addImage({
            path: path.join(screenshotsDir, '12_booking_ruangan.png'),
            x: 6.85, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Jadwal Reservasi Ruang Rapat Kantor', {
            x: 6.85, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        // Bottom highlights (Width = 11.7, Height = 1.3 -> Total y = 6.65, Fits inside 7.5 in!)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.35, w: 11.7, h: 1.3,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Keunggulan Fitur Sirkulasi & Booking:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Live Collision Detection: Sistem otomatis menolak reservasi jika ruangan, tanggal, dan rentang jam bentrok dengan jadwal rapat divisi lain.  |  2) Auto Stock Deduct: Stok barang yang dipinjam otomatis berkurang dan kembali saat dikembalikan.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 11: MODUL STOCK OPNAME & AUDIT BERKALA
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '8. Modul Stock Opname & Penyesuaian Audit Fisik', 'Mekanisme rekonsiliasi berkala stok fisik di gudang dengan catatan sistem');

        // Screenshot on the left
        slide.addImage({
            path: path.join(screenshotsDir, '14_stock_opname.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side card (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5, Fits inside bounds!)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Manfaat Stock Opname', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const opnamePoints = [
            'Audit Berkala: Petunjuk operasional bagi petugas GA memeriksa fisik barang di gudang secara terjadwal.',
            'Kalkulasi Selisih Otomatis: Sistem langsung menghitung selisih fisik vs catatan sistem secara akurat.',
            'Alasan Penyesuaian Wajib: Setiap perubahan stok audit mewajibkan input keterangan penyesuaian (contoh: barang rusak dibuang, ditemukan di rak belakang).',
            'Audit Trail Log: Menghindari manipulasi data stok dan menjamin transparansi saat pelaporan ke pimpinan.'
        ];
        opnamePoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 12: PELAPORAN, EKSPOR EXCEL & CETAK DOKUMEN RESMI
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '9. Pelaporan Otomatis, Ekspor Excel & Cetak Dokumen Resmi', 'Menyediakan rekapan komprehensif yang siap diaudit dan ditandatangani pimpinan');

        // 2 Screenshots Side-by-Side strictly within bounds
        slide.addImage({
            path: path.join(screenshotsDir, '15_laporan_dan_cetak.png'),
            x: 0.8, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Pusat Laporan & Ekspor Format Excel (.xls)', {
            x: 0.8, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        slide.addImage({
            path: path.join(screenshotsDir, '16_modal_cetak_preview.png'),
            x: 6.85, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Pratinjau Cetak Fisik Ber-Kop Surat Dinas Resmi', {
            x: 6.85, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        // Bottom highlights (Width = 11.7, Height = 1.3 -> Total y = 6.65, Fits inside 7.5 in!)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.35, w: 11.7, h: 1.3,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Standar Output Dokumen:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Ekspor Excel: Menghasilkan tabel data mentah yang dapat diolah kembali oleh akuntansi/pimpinan.  |  2) Cetak Fisik / PDF: Standar dokumen kantor dengan kop dinas resmi dan kolom tanda tangan Mengetahui (Kepala Divisi) serta Petugas.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 13: HASIL TESTING & EVALUASI SISTEM (BLACKBOX)
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

        // Table Header (Width = 11.7)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 11.7, h: 0.45,
            fill: { color: C_NAVY }
        });
        slide.addText('No', { x: 0.9, y: 1.62, w: 0.6, h: 0.3, fontSize: 9.5, bold: true, color: C_WHITE });
        slide.addText('Modul Fungsional', { x: 1.6, y: 1.62, w: 2.5, h: 0.3, fontSize: 9.5, bold: true, color: C_WHITE });
        slide.addText('Skenario Pengujian', { x: 4.2, y: 1.62, w: 4.8, h: 0.3, fontSize: 9.5, bold: true, color: C_WHITE });
        slide.addText('Hasil Evaluasi', { x: 9.1, y: 1.62, w: 3.3, h: 0.3, fontSize: 9.5, bold: true, color: C_WHITE });

        testCases.forEach((tc, idx) => {
            const y = 2.05 + (idx * 0.9);
            slide.addShape(pres.ShapeType.rect, {
                x: 0.8, y: y, w: 11.7, h: 0.82,
                fill: { color: idx % 2 === 0 ? C_WHITE : 'F8FAFC' },
                line: { color: C_BORDER, width: 1 }
            });
            slide.addText(tc.no, { x: 0.9, y: y + 0.22, w: 0.6, h: 0.35, fontSize: 9.5, bold: true, color: C_BLUE });
            slide.addText(tc.module, { x: 1.6, y: y + 0.22, w: 2.5, h: 0.35, fontSize: 9.5, bold: true, color: C_NAVY });
            slide.addText(tc.scenario, { x: 4.2, y: y + 0.12, w: 4.8, h: 0.55, fontSize: 9, color: C_SLATE, lineSpacing: 13 });
            slide.addText(tc.result, { x: 9.1, y: y + 0.22, w: 3.3, h: 0.35, fontSize: 9.2, bold: true, color: C_TEAL });
        });
    }

    // =========================================================================
    // SLIDE 14: KESIMPULAN & PENUTUP (Q&A)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: C_NAVY };

        // Accent top line
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.12,
            fill: { color: C_ACCENT }
        });

        slide.addText('KESIMPULAN & PENUTUP', {
            x: 1.0, y: 0.95, w: 11.3, h: 0.35,
            fontSize: 12, fontFace: 'Calibri', bold: true, color: '93C5FD', letterSpacing: 2
        });

        slide.addText('Hasil Capaian Proyek Kuliah Kerja Praktik (KKP)', {
            x: 1.0, y: 1.35, w: 11.3, h: 0.55,
            fontSize: 23, fontFace: 'Calibri', bold: true, color: C_WHITE
        });

        // 3 Conclusion Cards
        const conclusions = [
            {
                title: 'Transformasi Berhasil',
                desc: 'Aplikasi sukses dimigrasi dari desktop ke web on-premise responsif yang dapat diakses simultan oleh seluruh staf via LAN kantor.'
            },
            {
                title: 'RBAC Ala Synology NAS',
                desc: 'Pemberian izin per divisi sangat mempermudah administrasi user: user baru tinggal dipilihkan divisi dan langsung siap bekerja.'
            },
            {
                title: 'Nol Bentrok & Selisih',
                desc: 'Fitur live collision detection dan modul stock opname berkala menjamin fasilitas dan aset fisik kantor terkelola secara akuntabel.'
            }
        ];

        conclusions.forEach((c, idx) => {
            const x = 1.0 + (idx * 3.85);
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 2.15, w: 3.6, h: 2.9,
                fill: { color: '1E293B' },
                line: { color: '334155', width: 1.5 }
            });
            slide.addText(`0${idx + 1}`, {
                x: x + 0.3, y: 2.35, w: 3.0, h: 0.45,
                fontSize: 20, fontFace: 'Calibri', bold: true, color: '60A5FA'
            });
            slide.addText(c.title, {
                x: x + 0.3, y: 2.85, w: 3.0, h: 0.35,
                fontSize: 13, fontFace: 'Calibri', bold: true, color: C_WHITE
            });
            slide.addText(c.desc, {
                x: x + 0.3, y: 3.35, w: 3.0, h: 1.5,
                fontSize: 9.5, fontFace: 'Calibri', color: 'CBD5E1', lineSpacing: 15
            });
        });

        // Q&A Box
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 5.35, w: 11.3, h: 1.4,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('Sesi Tanya Jawab (Q & A)', {
            x: 1.3, y: 5.5, w: 10.7, h: 0.35,
            fontSize: 14, fontFace: 'Calibri', bold: true, color: '34D399'
        });
        slide.addText('Terima kasih kepada Dosen Pembimbing, Dosen Penguji KKP, dan Pimpinan Instansi atas bimbingan dan kesempatan yang diberikan selama pelaksanaan Praktik Kerja.', {
            x: 1.3, y: 5.9, w: 10.7, h: 0.65,
            fontSize: 10, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 14
        });
    }

    // Save directly to the dedicated directory
    const targetMain = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Rencana_KKP_Sistem_Inventaris.pptx';
    const targetRev = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Rencana_KKP_Sistem_Inventaris_Revisi.pptx';

    await pres.writeFile({ fileName: targetRev });
    console.log(`[SUCCESS] Presentation written to: ${targetRev}`);

    try {
        await pres.writeFile({ fileName: targetMain });
        console.log(`[SUCCESS] Main presentation updated at: ${targetMain}`);
    } catch (e) {
        console.log(`[INFO] Main file was locked by PowerPoint, saved to ${targetRev}`);
    }
}

createCleanKKPPresentation().catch(err => {
    console.error('[ERROR] Failed to generate presentation:', err);
    process.exit(1);
});

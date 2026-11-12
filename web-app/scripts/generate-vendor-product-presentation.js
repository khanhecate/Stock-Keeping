const pptxgen = require('pptxgenjs');
const path = require('path');

async function createVendorProductPresentation() {
    const pres = new pptxgen();

    // Widescreen 16:9 layout (13.333 x 7.5 inches)
    pres.layout = 'LAYOUT_WIDE';
    pres.author = 'Software Solution Provider';
    pres.company = 'Enterprise Office Management Solution';
    pres.title = 'Presentasi Produk: Sistem Manajemen Inventaris & Fasilitas Kantor';

    // Professional Corporate Product Pitch Palette (Clean, Elegant, Trustworthy)
    const C_WHITE     = 'FFFFFF';
    const C_BG_LIGHT  = 'F8FAFC';  // Crisp clean off-white background
    const C_NAVY      = '0F172A';  // Slate Navy for high-contrast titles
    const C_SLATE     = '334155';  // Readable neutral body text
    const C_MUTED     = '64748B';  // Secondary text / subtitles
    const C_BORDER    = 'CBD5E1';  // Subtle card border
    const C_BLUE      = '1E3A8A';  // Deep corporate blue
    const C_ACCENT    = '2563EB';  // Primary action blue
    const C_TEAL      = '0D9488';  // Fresh corporate teal
    const C_AMBER     = 'D97706';  // Warm accent
    const C_CARD_BG   = 'FFFFFF';

    const screenshotsDir = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\screenshots';

    // Helper: Standardized slide header strictly contained within bounds
    function addHeader(slide, title, subtitle) {
        slide.background = { color: C_BG_LIGHT };

        // Top corporate blue accent bar
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
        slide.addText('Sistem Informasi Manajemen Inventaris & Fasilitas Ruangan Kantor | Product Presentation', {
            x: 0.8, y: 7.05, w: 8.0, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', color: C_MUTED
        });
        slide.addText('Solusi Digital Perusahaan', {
            x: 9.0, y: 7.05, w: 3.5, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', align: 'right', color: C_MUTED
        });
    }

    // =========================================================================
    // SLIDE 1: COVER / TITLE SLIDE (Vendor Product Pitch)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: C_NAVY };

        // Accent top stripe
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.12,
            fill: { color: C_ACCENT }
        });

        // Product Category Tag
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 1.3, w: 5.5, h: 0.38,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('ENTERPRISE OFFICE & ASSET MANAGEMENT SOLUTION', {
            x: 1.0, y: 1.3, w: 5.5, h: 0.38,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: '93C5FD', align: 'center'
        });

        // Main Title
        slide.addText('Sistem Manajemen Inventaris\n& Fasilitas Ruangan Kantor', {
            x: 1.0, y: 1.9, w: 11.3, h: 1.5,
            fontSize: 27, fontFace: 'Calibri', bold: true, color: C_WHITE, lineSpacing: 36
        });

        // Subtitle / Scope
        slide.addText('Solusi Terpadu Berbasis Web untuk Pengelolaan Aset Perusahaan, Sirkulasi Peminjaman Barang, Reservasi Ruang Pertemuan Anti-Bentrok, serta Kontrol Audit Stok Secara Real-Time.', {
            x: 1.0, y: 3.55, w: 11.3, h: 0.75,
            fontSize: 12.5, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 18
        });

        // 3 Key Product Highlights
        const highlights = [
            { title: 'Akses Web Fleksibel', desc: 'Server Internal Kantor / Cloud Server' },
            { title: 'Kontrol & Approval Terpadu', desc: 'Peminjaman, Booking & Audit Stok' },
            { title: 'Hak Akses Dinamis', desc: 'Menu Otomatis Menyesuaikan Jabatan' }
        ];

        highlights.forEach((h, idx) => {
            const hx = 1.0 + (idx * 3.85);
            slide.addShape(pres.ShapeType.rect, {
                x: hx, y: 4.65, w: 3.6, h: 1.3,
                fill: { color: '1E293B' },
                line: { color: '334155', width: 1 }
            });
            slide.addText(h.title, {
                x: hx + 0.25, y: 4.85, w: 3.1, h: 0.35,
                fontSize: 11.5, fontFace: 'Calibri', bold: true, color: '60A5FA'
            });
            slide.addText(h.desc, {
                x: hx + 0.25, y: 5.25, w: 3.1, h: 0.5,
                fontSize: 9.5, fontFace: 'Calibri', color: 'CBD5E1'
            });
        });

        // Footer info
        slide.addText('Presentasi Produk & Solusi Perusahaan | Dilengkapi Sesi Demo Langsung Aplikasi', {
            x: 1.0, y: 6.8, w: 11.3, h: 0.35,
            fontSize: 10, fontFace: 'Calibri', color: '64748B'
        });
    }

    // =========================================================================
    // SLIDE 2: MASALAH OPERASIONAL YANG KAMI SELESAIKAN (WHY THIS PRODUCT?)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '1. Tantangan Operasional Perusahaan yang Kami Selesaikan', 'Masalah umum yang sering dialami karyawan dan manajemen terkait fasilitas kantor serta inventaris barang');

        const problems = [
            {
                tag: 'BENTROK RUANG MEETING',
                color: C_BLUE,
                title: 'Jadwal Rapat Tabrakan & Ruangan Penuh',
                desc: 'Karyawan kesulitan mengecek ketersediaan ruang pertemuan secara langsung. Koordinasi manual sering memicu jadwal bentrok (double-booking) saat rapat mendesak bersama klien atau pimpinan sudah siap dimulai.'
            },
            {
                tag: 'FASILITAS BELUM SIAP',
                color: C_AMBER,
                title: 'Ketiadaan Stok Unit Peralatan Rapat',
                desc: 'Saat pertemuan penting akan dimulai, peralatan pendukung (proyektor, pointer, mic wireless, kabel HDMI, laptop cadangan) sering tidak siap, unitnya tidak diketahui ada di mana, atau stoknya habis.'
            },
            {
                tag: 'ASET TIDAK TERLACAK',
                color: C_TEAL,
                title: 'Peminjaman Barang Tanpa Kontrol PIC',
                desc: 'Peralatan kantor sering berpindah tangan tanpa pencatatan PIC penanggung jawab dan batas waktu pengembalian yang jelas. Akibatnya barang rawan hilang, tercecer, atau terlambat dikembalikan.'
            },
            {
                tag: 'AUDIT STOK BERAT',
                color: C_NAVY,
                title: 'Selisih Fisik Barang & Rekapitulasi Manual',
                desc: 'Pencatatan menggunakan spreadsheet terpisah rawan human-error. Manajemen kesulitan mengetahui nilai aset nyata, dan sering terjadi selisih stok fisik saat audit inventaris berkala.'
            }
        ];

        problems.forEach((p, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 0.8 + (col * 5.95);
            const y = 1.55 + (row * 2.6);

            // Container Box (Width = 5.75, Height = 2.4)
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 2.4,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            // Tag Header
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 0.35,
                fill: { color: p.color }
            });
            slide.addText(p.tag, {
                x: x + 0.2, y: y + 0.05, w: 5.35, h: 0.25,
                fontSize: 9, fontFace: 'Calibri', bold: true, color: C_WHITE
            });

            // Title
            slide.addText(p.title, {
                x: x + 0.25, y: y + 0.45, w: 5.25, h: 0.35,
                fontSize: 12, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            // Desc
            slide.addText(p.desc, {
                x: x + 0.25, y: y + 0.85, w: 5.25, h: 1.35,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13.5
            });
        });
    }

    // =========================================================================
    // SLIDE 3: SOLUSI PRODUK (SOLUSI TERPADU INVENTARIS & FASILITAS)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '2. Solusi Produk: Sistem Terpadu Inventaris & Fasilitas', 'Platform digital terpusat untuk mempermudah operasional karyawan sekaligus kontrol penuh manajemen');

        const solutions = [
            {
                num: '01',
                title: 'Akses Web Fleksibel Tanpa Instalasi',
                desc: 'Aplikasi berbasis web modern. Dapat dibuka langsung dari web browser di komputer/laptop mana saja tanpa instalasi aplikasi klien. Fleksibel dipasang di komputer server internal kantor (Local Server) maupun cloud hosting.'
            },
            {
                num: '02',
                title: 'Katalog Ketersediaan Stok Real-Time',
                desc: 'Transparansi penuh atas seluruh inventaris: karyawan dan admin dapat langsung melihat berapa unit barang yang sedang ready, sedang dipinjam, atau dalam perbaikan sebelum mengajukan permintaan.'
            },
            {
                num: '03',
                title: 'Reservasi Ruang Rapat Anti-Bentrok',
                desc: 'Sistem memiliki validasi pintar (Live Collision Check): menolak otomatis jika ruangan dan jam yang dipilih beririsan dengan rapat lain, menjamin nol insiden bentrok jadwal rapat di kantor.'
            },
            {
                num: '04',
                title: 'Alur Approval & Pengembalian Otomatis',
                desc: 'Setiap pergerakan barang memiliki penanggung jawab (PIC) dan batas waktu kembali. Stok fisik di sistem otomatis berkurang saat diserahkan dan otomatis pulih kembali saat barang dikembalikan.'
            }
        ];

        solutions.forEach((s, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 0.8 + (col * 5.95);
            const y = 1.55 + (row * 2.6);

            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 2.4,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            // Circle Number
            slide.addShape(pres.ShapeType.ellipse, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fill: { color: C_BLUE }
            });
            slide.addText(s.num, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fontSize: 13, fontFace: 'Calibri', bold: true, color: C_WHITE, align: 'center'
            });

            // Title
            slide.addText(s.title, {
                x: x + 1.1, y: y + 0.3, w: 4.35, h: 0.45,
                fontSize: 12.5, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            // Desc
            slide.addText(s.desc, {
                x: x + 1.1, y: y + 0.82, w: 4.35, h: 1.35,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13.5
            });
        });
    }

    // =========================================================================
    // SLIDE 4: CARA KERJA SISTEM & ALUR APPROVAL OPERASIONAL (PRODUCT WORKFLOW)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '3. Cara Kerja Sistem: Alur Operasional & Mekanisme Approval', 'Proses terstruktur bagaimana staf mengajukan kebutuhan dan bagaimana sistem menyetujui serta mengontrol aset');

        const workflows = [
            {
                title: 'Alur 1: Peminjaman & Pengembalian Aset',
                color: C_BLUE,
                steps: [
                    '1. Cek Ketersediaan: Karyawan melihat stok unit yang ready di katalog aset perusahaan.',
                    '2. Pengajuan Pinjam: Karyawan memilih barang, memasukkan nama PIC, divisi, dan estimasi tanggal kembali.',
                    '3. Verifikasi & Approval: Admin menyetujui penyerahan barang fisik; stok di sistem otomatis berkurang.',
                    '4. Pengembalian: Saat barang diserahkan kembali, admin klik "Proses Kembali" & stok unit pulih otomatis.'
                ]
            },
            {
                title: 'Alur 2: Reservasi Ruang Rapat (Room Booking)',
                color: C_TEAL,
                steps: [
                    '1. Pilih Ruangan & Waktu: Karyawan menentukan tanggal, jam mulai, dan jam selesai meeting.',
                    '2. Validasi Anti-Bentrok: Sistem otomatis memeriksa ketersediaan jam secara real-time.',
                    '3. Konfirmasi Jadwal: Rapat terdaftar resmi dengan status Approved pada kalender jadwal kantor.',
                    '4. Agenda Dashboard: Jadwal rapat hari ini langsung tampil di monitor/dashboard seluruh kantor.'
                ]
            },
            {
                title: 'Alur 3: Pengeluaran Barang Habis Pakai (Outbound)',
                color: C_AMBER,
                steps: [
                    '1. Permintaan Perlengkapan: Unit kerja meminta kebutuhan barang habis pakai (ATK, baterai, spidol).',
                    '2. Pencatatan Pengeluaran: Admin mencatat kuantitas barang keluar dan unit kerja pemohon.',
                    '3. Mutasi Stok: Stok gudang berkurang permanen tanpa status pengembalian.',
                    '4. Rekapitulasi Digital: Seluruh mutasi pengeluaran tersimpan rapi untuk pertanggungjawaban audit.'
                ]
            }
        ];

        workflows.forEach((w, idx) => {
            const x = 0.8 + (idx * 3.98); // 0.8, 4.78, 8.76 -> 8.76 + 3.74 = 12.5 (Within bounds!)
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 1.55, w: 3.74, h: 5.15,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            // Card Header
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: 1.55, w: 3.74, h: 0.55,
                fill: { color: w.color }
            });
            slide.addText(w.title, {
                x: x + 0.15, y: 1.65, w: 3.44, h: 0.35,
                fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_WHITE, align: 'center'
            });

            // Steps
            w.steps.forEach((st, sIdx) => {
                slide.addText(st, {
                    x: x + 0.25, y: 2.35 + (sIdx * 1.15), w: 3.24, h: 1.05,
                    fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13
                });
            });
        });
    }

    // =========================================================================
    // SLIDE 5: PENGATURAN HAK AKSES PENGGUNA (ROLE-BASED PERMISSION)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '4. Pengaturan Hak Akses Pengguna (Role-Based Access Control)', 'Sistem izin akses berbasis grup divisi; setiap pegawai otomatis mewarisi hak akses sesuai tugas kerjanya');

        // Left explanation card (x = 0.8, w = 5.0, h = 5.1 -> x + w = 5.8)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Cara Kerja Sistem Permission', {
            x: 1.05, y: 1.8, w: 4.5, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const rbacPoints = [
            'Pengaturan Izin Terpusat per Divisi: Hak akses dikonfigurasi per grup unit kerja & level jabatan, bukan satu per satu per pegawai.',
            'Pendaftaran User Praktis: Saat mendaftarkan pegawai baru, cukup pilih grup kerjanya; seluruh hak menu otomatis langsung aktif.',
            'Menu Adaptif Otomatis: Karyawan operasional hanya melihat menu peminjaman dan booking. Menu master data dan laporan audit tersembunyi otomatis.',
            'Akses Admin & Pimpinan: Administrator memegang kendali penuh atas master aset, approval, dan audit stok; pimpinan memegang hak akses laporan.',
            'Matrix Perizinan Fleksibel: Dilengkapi matriks 2 kolom untuk menentukan menu utama dan submenu yang diizinkan secara granular.'
        ];
        rbacPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 1.05, y: 2.35 + (idx * 0.82), w: 4.5, h: 0.75,
                fontSize: 9.5, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
            });
        });

        // Right side: Real screenshot of the Matrix Checklist (x = 6.1, w = 6.4, h = 5.1 -> Total x = 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 6.1, y: 1.55, w: 6.4, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Tampilan Form Matriks Hak Akses (Menu Utama & Submenu)', {
            x: 6.3, y: 1.7, w: 6.0, h: 0.35,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_NAVY
        });

        slide.addImage({
            path: path.join(screenshotsDir, '20_detail_permission_matrix.png'),
            x: 6.3, y: 2.1, w: 6.0, h: 4.35
        });
    }

    // =========================================================================
    // SLIDE 6: MODUL DASHBOARD UTAMA (PUSAT MONITORING REAL-TIME)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '5. Modul Dashboard: Pusat Kontrol & Monitoring Real-Time', 'Ringkasan visual status inventaris dan agenda fasilitas kantor dalam satu layar terpadu');

        // Screenshot on the left (x = 0.8, w = 6.4, h = 5.1 -> Total x = 7.2)
        slide.addImage({
            path: path.join(screenshotsDir, '01_dashboard.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side: Highlights (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Kemampuan Utama Dashboard', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const dashPoints = [
            '4 Kartu Indikator Kunci (KPI): Menampilkan total jenis aset terdaftar, akumulasi fisik seluruh stok barang, jumlah aset yang sedang dipinjam, dan agenda meeting hari ini.',
            'Tabel Sirkulasi Cepat: Memantau aktivitas peminjaman terbaru secara transparan dengan badge status (Dipinjam / Kembali).',
            'Agenda Ruang Rapat Hari Ini: Memastikan ruang meeting mana saja yang terisi hari ini, jam pemakaian, dan PIC penanggung jawab.',
            'Grafik Distribusi Kategori: Diagram visual sebaran komposisi aset kantor (elektronik, perabot, perlengkapan kerja).'
        ];
        dashPoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 7: MODUL KATALOG MASTER DATA INVENTARIS
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '6. Modul Pengelolaan Master Data Inventaris & Fasilitas', 'Katalog aset terstruktur lengkap dengan barcode unik, kategori, spesifikasi, dan lokasi gudang');

        // Screenshot on the left (x = 0.8, w = 6.4, h = 5.1 -> Total x = 7.2)
        slide.addImage({
            path: path.join(screenshotsDir, '02_data_aset.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side card (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Fitur Master Data', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const masterPoints = [
            'Katalog Data Aset: Kode barcode unik (otomatis/manual), nama barang, kuantitas fisik, satuan unit, dan catatan spesifikasi lengkap.',
            'Klasifikasi Cerdas: Memisahkan Aset Tetap (Laptop, Proyektor, AC, Kursi) dengan Consumable (barang habis pakai seperti kertas & tinta).',
            'Master Ruang Pertemuan: Mendata ruang meeting kantor, kapasitas orang, dan fasilitas penunjang (Smart TV, AC, proyektor).',
            'Lokasi Penyimpanan: Mendata letak fisik aset di kantor (Lantai, Gudang Utama, Ruang Server, Lemari Arsip).',
            'Rekanan Supplier / Vendor: Kontak resmi penyedia pengadaan barang dan layanan garansi perbaikan.'
        ];
        masterPoints.forEach((p, idx) => {
            slide.addText(`•  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 0.84), w: 4.4, h: 0.78,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13
            });
        });
    }

    // =========================================================================
    // SLIDE 8: TRANSAKSI SIRKULASI & RESERVASI RUANG RAPAT
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '7. Sirkulasi Peminjaman & Reservasi Ruang Rapat Anti-Bentrok', 'Menghilangkan risiko bentrok jadwal pertemuan dan memastikan seluruh barang kantor aman terlacak');

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

        // Bottom highlights (Width = 11.7, Height = 1.3 -> Total y = 6.65)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.35, w: 11.7, h: 1.3,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Keunggulan Fitur Sirkulasi & Booking:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Deteksi Bentrok Pintar (Live Collision Check): Sistem menolak otomatis jika ada dua reservasi di ruangan yang sama pada jam yang beririsan.  |  2) Kontrol PIC Penanggung Jawab: Setiap aset yang keluar kantor tercatat jelas peminjamnya sehingga barang tidak akan hilang tanpa jejak.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 9: MODUL STOCK OPNAME (AUDIT FISIK GUDANG BERKALA)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '8. Modul Stock Opname: Rekonsiliasi Audit Fisik Berkala', 'Mencocokkan jumlah stok fisik nyata di gudang dengan catatan sistem secara cepat dan akurat');

        // Screenshot on the left
        slide.addImage({
            path: path.join(screenshotsDir, '14_stock_opname.png'),
            x: 0.8, y: 1.55, w: 6.4, h: 5.1
        });

        // Right side card (x = 7.5, w = 5.0, h = 5.1 -> Total x = 12.5)
        slide.addShape(pres.ShapeType.rect, {
            x: 7.5, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Fitur Audit Stock Opname', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const opnamePoints = [
            'Audit Fisik Berkala Cepat: Petugas inspeksi cukup membuka modul Stock Opname saat menghitung fisik barang di gudang secara bulanan atau semesteran.',
            'Kalkulasi Selisih Otomatis: Sistem langsung mengkalkulasi selisih fisik vs catatan (misal: -1 unit atau +2 unit) secara instan tanpa hitung manual.',
            'Wajib Input Alasan Penyesuaian: Setiap perubahan stok audit mewajibkan catatan keterangan (contoh: barang rusak di-afkir, ditemukan di rak belakang).',
            'Riwayat Audit Akuntabel: Seluruh histori penyesuaian tercatat permanen, memberikan bukti transparan saat diaudit oleh akuntansi atau pimpinan perusahaan.'
        ];
        opnamePoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 10: PELAPORAN, EKSPOR EXCEL & CETAK DOKUMEN RESMI
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '9. Pelaporan Otomatis, Ekspor Excel & Format Cetak Resmi', 'Menyediakan rekapan berkas siap cetak bertanda tangan dan ekspor data spreadsheet lengkap');

        // 2 Screenshots Side-by-Side strictly within bounds
        slide.addImage({
            path: path.join(screenshotsDir, '15_laporan_dan_cetak.png'),
            x: 0.8, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Pusat Laporan & Ekspor File Excel (.xls)', {
            x: 0.8, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        slide.addImage({
            path: path.join(screenshotsDir, '16_modal_cetak_preview.png'),
            x: 6.85, y: 1.55, w: 5.65, h: 3.3
        });
        slide.addText('Pratinjau Cetak Ber-Kop Surat Resmi Kantor', {
            x: 6.85, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        // Bottom highlights (Width = 11.7, Height = 1.3 -> Total y = 6.65)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.35, w: 11.7, h: 1.3,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Standar Output Pelaporan:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Ekspor Excel Sekali Klik: Unduh rekapitulasi sirkulasi barang, pemakaian ruang meeting, dan posisi stok fisik dalam format .xls untuk pengolahan lanjutan.  |  2) Format Cetak Dinas Resmi: Dilengkapi kop surat resmi perusahaan dan kolom tanda tangan Mengetahui (Pimpinan) serta Petugas.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 11: KEUNGGULAN KOMPETITIF & NILAI INVESTASI PRODUK
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '10. Nilai Tambah & Keunggulan Solusi bagi Perusahaan', 'Dampak positif nyata terhadap produktivitas kerja, keamanan data, dan efisiensi anggaran kantor');

        const benefits = [
            {
                num: '1',
                title: 'Produktivitas Kerja Meningkat',
                desc: 'Karyawan dapat memeriksa ketersediaan aset dan mereservasi ruang pertemuan secara mandiri dari meja kerja tanpa membuang waktu koordinasi berbelit.'
            },
            {
                num: '2',
                title: 'Nol Insiden Jadwal Bentrok',
                desc: 'Validasi otomatis sistem memastikan tidak ada lagi dua rapat penting yang tabrakan di ruangan yang sama. Persiapan fasilitas rapat selalu tepat waktu.'
            },
            {
                num: '3',
                title: 'Penghematan Anggaran Aset',
                desc: 'Kontrol sirkulasi yang ketat dan modul audit berkala mencegah kehilangan aset serta meniadakan pembelian barang inventaris ganda yang tidak diperlukan.'
            },
            {
                num: '4',
                title: 'Keamanan & Kepemilikan Data Penuh',
                desc: 'Aplikasi dapat di-hosting di server internal kantor sendiri (On-Premise LAN) tanpa risiko kebocoran data keluar, atau di cloud hosting sesuai kebutuhan.'
            }
        ];

        benefits.forEach((b, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 0.8 + (col * 5.95);
            const y = 1.55 + (row * 2.6);

            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 2.4,
                fill: { color: C_CARD_BG },
                line: { color: C_BORDER, width: 1.5 }
            });

            slide.addShape(pres.ShapeType.ellipse, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fill: { color: C_BLUE }
            });
            slide.addText(b.num, {
                x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6,
                fontSize: 13, fontFace: 'Calibri', bold: true, color: C_WHITE, align: 'center'
            });

            slide.addText(b.title, {
                x: x + 1.1, y: y + 0.3, w: 4.35, h: 0.45,
                fontSize: 12.5, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            slide.addText(b.desc, {
                x: x + 1.1, y: y + 0.82, w: 4.35, h: 1.35,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13.5
            });
        });
    }

    // =========================================================================
    // SLIDE 12: PENUTUP & SESI DEMO APLIKASI
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: C_NAVY };

        // Accent top line
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.12,
            fill: { color: C_ACCENT }
        });

        slide.addText('KESIMPULAN & SESI DEMO APLIKASI', {
            x: 1.0, y: 0.95, w: 11.3, h: 0.35,
            fontSize: 12, fontFace: 'Calibri', bold: true, color: '93C5FD', letterSpacing: 2
        });

        slide.addText('Solusi Siap Digunakan untuk Transformasi Fasilitas Kantor', {
            x: 1.0, y: 1.35, w: 11.3, h: 0.55,
            fontSize: 23, fontFace: 'Calibri', bold: true, color: C_WHITE
        });

        // 3 Summary Cards
        const summaries = [
            {
                title: 'Solusi All-in-One Fasilitas',
                desc: 'Mengintegrasikan pencatatan aset barang kantor dan reservasi ruang rapat dalam satu sistem web yang praktis dan anti-bentrok.'
            },
            {
                title: 'Izin Akses Adaptif & Aman',
                desc: 'Pengaturan izin per grup kerja menjamin setiap staf hanya mengakses fitur yang berhak, menjaga kerapian dan integritas data.'
            },
            {
                title: 'Audit & Pelaporan Instan',
                desc: 'Modul Stock Opname dan Cetak Surat Dinas Resmi memastikan tata kelola fasilitas kantor selalu akuntabel dan siap audit manajemen.'
            }
        ];

        summaries.forEach((c, idx) => {
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

        // Demo & Discussion Call to Action Box
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 5.35, w: 11.3, h: 1.4,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('Sesi Live Demo Aplikasi & Diskusi Solusi (Q & A)', {
            x: 1.3, y: 5.5, w: 10.7, h: 0.35,
            fontSize: 14, fontFace: 'Calibri', bold: true, color: '34D399'
        });
        slide.addText('Mari kita saksikan secara langsung demonstrasi fitur aplikasi: mulai dari proses cek stok barang, alur peminjaman unit, simulasi booking ruang rapat anti-bentrok, hingga pencetakan dokumen resmi.', {
            x: 1.3, y: 5.9, w: 10.7, h: 0.65,
            fontSize: 10, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 14
        });
    }

    // Save directly to the dedicated directory
    const targetFile = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Produk_Sistem_Inventaris_Kantor.pptx';
    await pres.writeFile({ fileName: targetFile });
    console.log(`[SUCCESS] Vendor Product Presentation written to: ${targetFile}`);
}

createVendorProductPresentation().catch(err => {
    console.error('[ERROR] Failed to generate presentation:', err);
    process.exit(1);
});

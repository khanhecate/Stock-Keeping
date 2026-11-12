const pptxgen = require('pptxgenjs');
const path = require('path');

async function createGAPresentation() {
    const pres = new pptxgen();

    // Widescreen 16:9 layout (13.333 x 7.5 inches)
    pres.layout = 'LAYOUT_WIDE';
    pres.author = 'General Affairs & Operasional Kantor';
    pres.company = 'Sistem Informasi Manajemen Inventaris Kantor';
    pres.title = 'Presentasi Solusi Sistem Manajemen Inventaris & Fasilitas Ruangan Kantor';

    // Simple, Clean, Non-AI Corporate Palette (Light & Crisp)
    const C_WHITE     = 'FFFFFF';
    const C_BG_LIGHT  = 'F8FAFC';  // Crisp clean off-white
    const C_NAVY      = '0F172A';  // Deep slate navy for titles
    const C_SLATE     = '334155';  // High-readability body text
    const C_MUTED     = '64748B';  // Secondary text / subtitles
    const C_BORDER    = 'CBD5E1';  // Subtle card border
    const C_BLUE      = '1E3A8A';  // Classic corporate blue
    const C_ACCENT    = '2563EB';  // Primary action blue
    const C_TEAL      = '0D9488';  // Clean corporate teal
    const C_AMBER     = 'D97706';  // Warm amber
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
        slide.addText('Sistem Informasi Manajemen Inventaris & Fasilitas Kantor | Panduan Operasional Tim GA', {
            x: 0.8, y: 7.05, w: 8.0, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', color: C_MUTED
        });
        slide.addText('Divisi General Affairs & Operasional', {
            x: 9.0, y: 7.05, w: 3.5, h: 0.3,
            fontSize: 8.5, fontFace: 'Calibri', align: 'right', color: C_MUTED
        });
    }

    // =========================================================================
    // SLIDE 1: COVER / TITLE SLIDE (Clean Corporate Navy)
    // =========================================================================
    {
        const slide = pres.addSlide();
        slide.background = { color: C_NAVY };

        // Accent top stripe
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.12,
            fill: { color: C_ACCENT }
        });

        // Target Tag
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 1.3, w: 5.2, h: 0.38,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('SOLUSI OPERASIONAL DIVISI GENERAL AFFAIRS (GA)', {
            x: 1.0, y: 1.3, w: 5.2, h: 0.38,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: '93C5FD', align: 'center'
        });

        // Main Title
        slide.addText('Sistem Informasi Manajemen Inventaris\n& Fasilitas Ruangan Kantor', {
            x: 1.0, y: 1.9, w: 11.3, h: 1.5,
            fontSize: 27, fontFace: 'Calibri', bold: true, color: C_WHITE, lineSpacing: 36
        });

        // Subtitle / Scope
        slide.addText('Solusi Berbasis Web untuk Mempermudah Karyawan Melakukan Peminjaman Barang, Reservasi Ruang Rapat Anti-Bentrok, dan Membantu Tim GA dalam Kontrol Stok Fisik serta Rekapitulasi Laporan.', {
            x: 1.0, y: 3.55, w: 11.3, h: 0.75,
            fontSize: 12.5, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 18
        });

        // 3 Key Operational Pillars
        const pills = [
            { title: 'Akses Web Fleksibel', desc: 'Dapat di Server Kantor Sendiri / Hosting' },
            { title: 'Kontrol Stok & Approval', desc: 'Peminjaman, Pengembalian & Audit GA' },
            { title: 'Izin Akses per Divisi', desc: 'Menu Otomatis Menyesuaikan Jabatan' }
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
        slide.addText('General Affairs & Tim Operasional Kantor — Panduan Presentasi Fungsional Sistem', {
            x: 1.0, y: 6.8, w: 11.3, h: 0.35,
            fontSize: 10, fontFace: 'Calibri', color: '64748B'
        });
    }

    // =========================================================================
    // SLIDE 2: LATAR BELAKANG KEBUTUHAN KARYAWAN & TIM GA (CUSTOMER-BASED)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '1. Latar Belakang Masalah (Kebutuhan Nyata di Kantor)', 'Kendala operasional sehari-hari yang dihadapi karyawan saat butuh ruangan rapat dan peralatan kantor');

        const problems = [
            {
                tag: 'KENDALA RUANG MEETING',
                color: C_BLUE,
                title: 'Butuh Rapat Mendesak tapi Ruangan Bentrok',
                desc: 'Karyawan sering kesulitan mengecek ruangan meeting mana yang sedang kosong. Koordinasi via chat grup atau verbal sering terlambat, berujung pada jadwal rapat yang tabrakan (double-booking) saat klien atau pimpinan sudah hadir.'
            },
            {
                tag: 'KENDALA STOK & FASILITAS',
                color: C_AMBER,
                title: 'Fasilitas Penunjang Belum Siap / Stok Unit Tidak Jelas',
                desc: 'Saat butuh peralatan rapat (proyektor, mic wireless, kabel HDMI, pointer, laptop presentasi), karyawan tidak tahu di mana barangnya berada dan berapa unit yang tersedia, sehingga persiapan rapat terganggu.'
            },
            {
                tag: 'KENDALA PINJAM BARANG',
                color: C_TEAL,
                title: 'Peminjaman Antar Staf Tidak Tercatat Rapi',
                desc: 'Barang inventaris sering dipinjam tanpa pencatatan PIC penanggung jawab yang jelas. Akibatnya tim GA kesulitan melacak siapa yang membawa barang dan kapan estimasi barang tersebut dikembalikan ke gudang.'
            },
            {
                tag: 'KENDALA AUDIT TIM GA',
                color: C_NAVY,
                title: 'Beban Rekapitulasi Manual & Selisih Stok',
                desc: 'Tim GA repot merekap manual menggunakan catatan kertas atau file spreadsheet terpisah. Ketika ada audit pimpinan atau opname bulanan, sering terjadi selisih jumlah fisik barang yang sulit dicari penyebabnya.'
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

            // Tag Header Line
            slide.addShape(pres.ShapeType.rect, {
                x: x, y: y, w: 5.75, h: 0.35,
                fill: { color: p.color }
            });
            slide.addText(p.tag, {
                x: x + 0.2, y: y + 0.05, w: 5.35, h: 0.25,
                fontSize: 9, fontFace: 'Calibri', bold: true, color: C_WHITE
            });

            // Card Title
            slide.addText(p.title, {
                x: x + 0.25, y: y + 0.45, w: 5.25, h: 0.35,
                fontSize: 12, fontFace: 'Calibri', bold: true, color: C_NAVY
            });

            // Description
            slide.addText(p.desc, {
                x: x + 0.25, y: y + 0.85, w: 5.25, h: 1.35,
                fontSize: 9.3, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 13.5
            });
        });
    }

    // =========================================================================
    // SLIDE 3: SOLUSI YANG DIHADIRKAN (SOLUSI TERPADU TIM GA & KARYAWAN)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '2. Solusi yang Dihadirkan: Sistem Inventaris & Ruangan Terpadu', 'Memberikan kemudahan bagi karyawan sekaligus kontrol penuh bagi Tim General Affairs');

        const solutions = [
            {
                num: '01',
                title: 'Akses Web Fleksibel dari Mana Saja',
                desc: 'Aplikasi berbasis web modern. Karyawan dapat membuka sistem langsung dari browser di meja kerja tanpa instalasi. Dapat dipasang di komputer server internal kantor sendiri maupun cloud hosting.'
            },
            {
                num: '02',
                title: 'Cek Ketersediaan Stok Unit Real-Time',
                desc: 'Karyawan dan tim GA dapat langsung melihat katalog barang secara transparan: tahu persis berapa unit fisik yang ready, sedang dipinjam, atau sedang dalam perbaikan sebelum mengajukan pinjaman.'
            },
            {
                num: '03',
                title: 'Reservasi Ruang Rapat Anti-Bentrok',
                desc: 'Sistem memiliki validasi otomatis: jika ruangan dan jam yang dipilih sudah dipesan divisi lain, sistem langsung memberi peringatan sehingga tidak akan ada dua rapat tabrakan di ruangan yang sama.'
            },
            {
                num: '04',
                title: 'Kontrol Approval & Pengembalian Rapi',
                desc: 'Setiap pengeluaran barang dan peminjaman fasilitas tercatat nama PIC penanggung jawab, divisi, dan batas tanggal kembali. Stok fisik di sistem otomatis berkurang dan pulih saat dikembalikan.'
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
    // SLIDE 4: ALUR KERJA OPERASIONAL & KONTROL APPROVAL TIM GA
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '3. Alur Kerja Operasional & Sistem Approval', 'Bagaimana staf mengajukan kebutuhan dan bagaimana Tim GA menyetujui serta mengontrol aset');

        const workflows = [
            {
                title: 'Alur 1: Peminjaman & Pengembalian Aset',
                color: C_BLUE,
                steps: [
                    '1. Karyawan Cek Ketersediaan: Melihat stok unit barang yang ready di katalog aset.',
                    '2. Input Peminjaman: Memilih barang, memasukkan nama PIC, Divisi, dan estimasi tanggal kembali.',
                    '3. Validasi & Approval GA: Tim GA menyerahkan unit fisik, stok di sistem otomatis berkurang.',
                    '4. Pengembalian: Saat barang diserahkan kembali, petugas GA klik "Proses Kembali" & stok pulih otomatis.'
                ]
            },
            {
                title: 'Alur 2: Reservasi Ruang Rapat (Meeting Booking)',
                color: C_TEAL,
                steps: [
                    '1. Karyawan Pilih Ruangan & Waktu: Menentukan tanggal, jam mulai, dan jam selesai meeting.',
                    '2. Pengecekan Tabrakan Otomatis: Sistem langsung memvalidasi jadwal ruangan secara real-time.',
                    '3. Approval & Konfirmasi: Jadwal rapat terdaftar resmi dengan status Approved di agenda kantor.',
                    '4. Monitoring Agenda: Jadwal rapat hari ini langsung tampil di widget dashboard kantor.'
                ]
            },
            {
                title: 'Alur 3: Pengeluaran Barang Habis Pakai (ATK / Outbound)',
                color: C_AMBER,
                steps: [
                    '1. Permintaan Divisi: Divisi kantor meminta perlengkapan kerja (kertas HVS, spidol, baterai).',
                    '2. Pencatatan Outbound: Tim GA mencatat jumlah unit keluar dan divisi tujuan pemakaian.',
                    '3. Mutasi Stok: Stok gudang berkurang permanen tanpa status pengembalian.',
                    '4. Riwayat Mutasi: Seluruh pengeluaran ATK tercatat lengkap untuk rekap bulanan GA.'
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
    // SLIDE 5: PENGATURAN HAK AKSES BERBASIS GRUP DIVISI (PERMISSION SYSTEM)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '4. Pengaturan Hak Akses Berbasis Grup Divisi (Permission)', 'Menu dan hak akses diatur per Divisi; user baru otomatis mewarisi izin sesuai unit kerjanya');

        // Left explanation card (x = 0.8, w = 5.0, h = 5.1 -> x + w = 5.8)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.55, w: 5.0, h: 5.1,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Cara Kerja Hak Akses (Permission)', {
            x: 1.05, y: 1.8, w: 4.5, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const rbacPoints = [
            'Izin Berbasis Grup Divisi: Pengaturan menu disetel per Divisi kerja & Level jabatan, bukan repot satu per satu per pegawai.',
            'Pendaftaran Pegawai Praktis: Saat staf baru dibuat akunnya, cukup pilih Divisinya; seluruh hak menu otomatis langsung aktif.',
            'Tampilan Menu Dinamis: Karyawan divisi biasa hanya melihat menu Peminjaman & Booking. Menu master data dan laporan otomatis disembunyikan.',
            'Tim GA & Administrator: Memegang kendali penuh atas data aset, approval sirkulasi, penyesuaian stok fisik, dan ekspor dokumen.',
            'Matrix 2 Kolom: Kolom kiri mengatur Menu Utama, kolom kanan mengatur Submenu teknis secara fleksibel.'
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
        slide.addText('Form Matrix Pengaturan Hak Akses (Menu Utama & Submenu)', {
            x: 6.3, y: 1.7, w: 6.0, h: 0.35,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_NAVY
        });

        slide.addImage({
            path: path.join(screenshotsDir, '20_detail_permission_matrix.png'),
            x: 6.3, y: 2.1, w: 6.0, h: 4.35
        });
    }

    // =========================================================================
    // SLIDE 6: MODUL DASHBOARD UTAMA (PUSAT PANTAUAN TIM GA)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '5. Modul Dashboard Utama (Pusat Pantauan Tim GA)', 'Ringkasan operasional real-time untuk memantau sirkulasi barang dan agenda pertemuan kantor');

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
        slide.addText('Fungsi Dashboard bagi Tim GA', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const dashPoints = [
            '4 Kartu Indikator Utama: Mengetahui dalam sekejap total jenis aset, total kuantitas unit fisik di kantor, barang yang sedang dipinjam, dan agenda meeting hari ini.',
            'Tabel Sirkulasi Cepat: Langsung melihat 5 aktivitas peminjaman terakhir lengkap dengan nama PIC peminjam dan status barang.',
            'Agenda Rapat Hari Ini: Memastikan ruang rapat mana saja yang terisi hari ini, jam pelaksanaan, dan siapa penanggung jawabnya.',
            'Distribusi Kategori Barang: Grafik komposisi inventaris kantor untuk memantau sebaran aset elektronik, perabot, dan perlengkapan kerja.'
        ];
        dashPoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 7: MODUL MASTER DATA INVENTARIS & FASILITAS KANTOR
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '6. Modul Pengelolaan Master Data Inventaris', 'Katalog data aset lengkap dengan pemisahan barang tetap vs habis pakai dan lokasi gudang');

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
        slide.addText('Kelengkapan Master Data GA', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const masterPoints = [
            'Katalog Aset (Barang): Kode barcode aset, nama barang, jumlah fisik, satuan (unit/pcs/box), dan spesifikasi teknis barang.',
            'Pemisahan Kategori Jelas: Membedakan Aset Tetap (Laptop, Proyektor, Kursi Kerja) dengan Consumable (ATK habis pakai seperti kertas & tinta).',
            'Daftar Ruang Rapat: Mendata ruangan meeting kantor beserta kapasitas orang dan fasilitas pendukung (AC, Smart TV, Projector).',
            'Lokasi Penyimpanan: Mendata letak fisik barang (Lantai 1, Ruang GA, Gudang Utama, Lemari Arsip).',
            'Supplier / Rekanan Vendor: Menyimpan kontak penyedia pengadaan barang dan layanan servis garansi resmi.'
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
        addHeader(slide, '7. Sirkulasi Peminjaman & Reservasi Ruang Rapat Anti-Bentrok', 'Menghilangkan risiko bentrok jadwal ruangan dan memastikan barang kantor aman terlacak');

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
        slide.addText('Fitur Unggulan bagi Tim GA:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Deteksi Tabrakan Jam Otomatis: Sistem menolak jika ada dua rapat di ruangan yang sama pada jam yang beririsan.  |  2) Kontrol PIC Peminjam: Setiap aset yang keluar gudang tercatat nama penanggung jawabnya sehingga tidak ada barang hilang tanpa jejak.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 9: MODUL STOCK OPNAME (AUDIT FISIK GUDANG BERKALA)
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '8. Modul Stock Opname (Audit Fisik Gudang Berkala)', 'Membantu Tim GA mencocokkan stok fisik di gudang dengan catatan sistem secara akurat');

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
        slide.addText('Manfaat Stock Opname bagi GA', {
            x: 7.8, y: 1.8, w: 4.4, h: 0.4,
            fontSize: 13.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });

        const opnamePoints = [
            'Audit Terjadwal Cepat: Petugas GA cukup membuka menu Stock Opname saat melakukan inspeksi fisik bulanan atau semesteran di gudang.',
            'Kalkulasi Selisih Otomatis: Sistem langsung menghitung selisih fisik vs catatan (misal: -1 unit atau +2 unit) tanpa perlu hitung manual.',
            'Wajib Catatan Penyesuaian: Setiap perubahan stok fisik mewajibkan alasan jelas (contoh: barang rusak di-afkir, ditemukan di rak belakang).',
            'Riwayat Audit Transparan: Laporan selisih tersimpan rapi, sehingga Tim GA memiliki bukti kuat saat diaudit oleh bagian akuntansi atau pimpinan.'
        ];
        opnamePoints.forEach((p, idx) => {
            slide.addText(`✔  ${p}`, {
                x: 7.8, y: 2.35 + (idx * 1.05), w: 4.4, h: 0.95,
                fontSize: 9.8, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 15
            });
        });
    }

    // =========================================================================
    // SLIDE 10: PELAPORAN, EKSPOR EXCEL & CETAK SURAT DINAS RESMI
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '9. Pelaporan Otomatis, Ekspor Excel & Cetak Surat Dinas', 'Menyediakan rekapan berkas siap print bertanda tangan dan ekspor data spreadsheet');

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
        slide.addText('Pratinjau Cetak Ber-Kop Surat Dinas Resmi', {
            x: 6.85, y: 4.95, w: 5.65, h: 0.3,
            fontSize: 9.5, fontFace: 'Calibri', bold: true, color: C_NAVY, align: 'center'
        });

        // Bottom highlights (Width = 11.7, Height = 1.3 -> Total y = 6.65)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 5.35, w: 11.7, h: 1.3,
            fill: { color: C_CARD_BG },
            line: { color: C_BORDER, width: 1.5 }
        });
        slide.addText('Standar Output Laporan Tim GA:', {
            x: 1.05, y: 5.48, w: 11.2, h: 0.3,
            fontSize: 10.5, fontFace: 'Calibri', bold: true, color: C_BLUE
        });
        slide.addText('1) Ekspor Excel Sekali Klik: Unduh rekapitulasi peminjaman, booking ruangan, dan stok barang dalam file .xls untuk olah data lebih lanjut.  |  2) Format Cetak Dinas Resmi: Dilengkapi kop surat dinas dan kolom tanda tangan Mengetahui (Kepala Divisi GA) serta Petugas.', {
            x: 1.05, y: 5.82, w: 11.2, h: 0.65,
            fontSize: 9, fontFace: 'Calibri', color: C_SLATE, lineSpacing: 14
        });
    }

    // =========================================================================
    // SLIDE 11: NILAI TAMBAH & MANFAAT BAGI TIM GA DAN KANTOR
    // =========================================================================
    {
        const slide = pres.addSlide();
        addHeader(slide, '10. Nilai Tambah & Manfaat Operasional bagi Kantor', 'Transformasi positif dalam tata kelola fasilitas kerja, akuntabilitas aset, dan efisiensi waktu');

        const benefits = [
            {
                num: '1',
                title: 'Bagi Karyawan Kantor',
                desc: 'Kemudahan melihat stok barang dan mereservasi ruang meeting secara mandiri tanpa birokrasi berbelit. Nol insiden jadwal rapat tabrakan.'
            },
            {
                num: '2',
                title: 'Bagi Tim General Affairs (GA)',
                desc: 'Beban administrasi berkurang drastis (> 60%). Kontrol stok fisik akurat, pelacakan pengembalian barang tertib, dan proses audit opname sangat mudah.'
            },
            {
                num: '3',
                title: 'Bagi Pimpinan & Manajemen',
                desc: 'Visibilitas dan akuntabilitas penuh atas seluruh aset kantor. Laporan sirkulasi barang dan utilisasi ruang rapat tersedia sewaktu-waktu secara transparan.'
            },
            {
                num: '4',
                title: 'Fleksibilitas Infrastruktur',
                desc: 'Sistem dapat dijalankan pada komputer server internal kantor (LAN) tanpa biaya langganan cloud luar, atau dapat pula di-online-kan di hosting server sesuai kebutuhan.'
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
    // SLIDE 12: KESIMPULAN & PENUTUP (SESI DISKUSI TIM GA)
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

        slide.addText('Sistem Siap Diimplementasikan untuk Mendukung Operasional Kantor', {
            x: 1.0, y: 1.35, w: 11.3, h: 0.55,
            fontSize: 23, fontFace: 'Calibri', bold: true, color: C_WHITE
        });

        // 3 Summary Cards
        const summaries = [
            {
                title: 'Solusi Terpadu Fasilitas',
                desc: 'Menggabungkan pengelolaan aset kantor dan reservasi ruang rapat dalam satu sistem web yang praktis dan anti-bentrok.'
            },
            {
                title: 'Hak Akses Tertib per Divisi',
                desc: 'Pemberian izin per divisi menjamin setiap karyawan hanya mengakses fitur yang relevan, menjaga keamanan dan kerapian data.'
            },
            {
                title: 'Akuntabilitas & Audit Siap',
                desc: 'Dengan fitur Stock Opname dan Cetak Surat Dinas Resmi, pelaporan pertanggungjawaban aset ke pimpinan menjadi cepat dan akurat.'
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

        // Q&A Box
        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 5.35, w: 11.3, h: 1.4,
            fill: { color: '1E293B' },
            line: { color: '334155', width: 1 }
        });
        slide.addText('Sesi Diskusi & Tanya Jawab (Q & A)', {
            x: 1.3, y: 5.5, w: 10.7, h: 0.35,
            fontSize: 14, fontFace: 'Calibri', bold: true, color: '34D399'
        });
        slide.addText('Terima kasih kepada Tim General Affairs (GA) dan Manajemen Kantor atas waktu dan masukan yang diberikan. Sistem ini dirancang untuk terus berkembang sesuai kebutuhan operasional kantor.', {
            x: 1.3, y: 5.9, w: 10.7, h: 0.65,
            fontSize: 10, fontFace: 'Calibri', color: '94A3B8', lineSpacing: 14
        });
    }

    // Save outputs
    const targetGA = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Sistem_Inventaris_Kantor_GA.pptx';
    const targetRev = 'D:\\KAMPUS\\Pemrograman_Visual\\InventoryManagement\\BERKAS_KKP_DAN_PANDUAN\\Presentasi_Rencana_KKP_Sistem_Inventaris_Revisi.pptx';

    await pres.writeFile({ fileName: targetGA });
    console.log(`[SUCCESS] Presentation written to: ${targetGA}`);

    try {
        await pres.writeFile({ fileName: targetRev });
        console.log(`[SUCCESS] Also updated: ${targetRev}`);
    } catch (e) {
        console.log(`[INFO] targetRev was locked by PowerPoint: ${e.message}`);
    }
}

createGAPresentation().catch(err => {
    console.error('[ERROR] Failed to generate presentation:', err);
    process.exit(1);
});

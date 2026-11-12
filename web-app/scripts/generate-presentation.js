const pptxgen = require('pptxgenjs');
const path = require('path');

async function createPresentation() {
    const pres = new pptxgen();

    // 16:9 widescreen layout
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'General Affairs & IT Department';
    pres.company = 'Internal Office System';
    pres.title = 'Presentasi Pengenalan Sistem Inventaris & Ruangan Kantor';

    // Theme Colors
    const NAVY = '0F172A';
    const BLUE = '2563EB';
    const SKY = '0EA5E9';
    const GRAY = '64748B';
    const LIGHT_BG = 'F8FAFC';
    const WHITE = 'FFFFFF';
    const EMERALD = '10B981';

    // Helper: Add standard slide header
    function addHeader(slide, title, subtitle) {
        slide.background = { color: LIGHT_BG };

        // Top accent line
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.1,
            fill: { color: BLUE }
        });

        // Title
        slide.addText(title, {
            x: 0.8, y: 0.5, w: 11.5, h: 0.6,
            fontSize: 22, fontFace: 'Arial', bold: true, color: NAVY
        });

        // Subtitle
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.8, y: 1.05, w: 11.5, h: 0.4,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        }

        // Bottom footer line
        slide.addText('Sistem Manajemen Inventaris & Ruangan Kantor (Web Version)', {
            x: 0.8, y: 7.0, w: 8, h: 0.3,
            fontSize: 9, fontFace: 'Arial', color: GRAY
        });
    }

    // ==========================================
    // SLIDE 1: COVER
    // ==========================================
    {
        const slide = pres.addSlide();
        slide.background = { color: NAVY };

        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.8, w: 0.15, h: 3.2,
            fill: { color: SKY }
        });

        slide.addText('SISTEM MANAJEMEN INVENTARIS\n& RUANG RAPAT KANTOR', {
            x: 1.2, y: 1.8, w: 10.5, h: 1.6,
            fontSize: 32, fontFace: 'Arial', bold: true, color: WHITE
        });

        slide.addText('Platform Berbasis Web untuk Pengelolaan Aset, Sirkulasi Barang,\ndan Reservasi Fasilitas Kantor Secara Terintegrasi', {
            x: 1.2, y: 3.5, w: 10, h: 0.8,
            fontSize: 16, fontFace: 'Arial', color: '94A3B8'
        });

        slide.addText('DIVISI GENERAL AFFAIRS & IT • LOCAL ON-PREMISE SERVER', {
            x: 1.2, y: 4.6, w: 10, h: 0.4,
            fontSize: 12, fontFace: 'Arial', bold: true, color: SKY
        });
    }

    // ==========================================
    // SLIDE 2: LATAR BELAKANG & TANTANGAN
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Latar Belakang & Tantangan Operasional', 'Masalah pengelolaan aset dan fasilitas yang sering dihadapi kantor');

        const problems = [
            { title: 'Pencatatan Aset Manual & Tersebar', desc: 'Aset sering dicatat di spreadsheet terpisah sehingga data stok riil dan lokasi barang tidak sinkron.' },
            { title: 'Peminjaman Barang Tidak Terlacak', desc: 'Barang yang dipinjam karyawan sering lupa dikembalikan atau sulit melacak siapa penanggung jawabnya (PIC).' },
            { title: 'Jadwal Ruang Rapat Bentrok', desc: 'Dua divisi sering menggunakan ruang rapat di waktu bersamaan karena tidak ada sistem validasi jadwal terpusat.' },
            { title: 'Stok Habis Tanpa Terdeteksi', desc: 'Barang habis pakai (ATK, kertas) mendadak kosong saat dibutuhkan karena tidak ada audit stock opname rutin.' }
        ];

        problems.forEach((p, idx) => {
            const x = 0.8 + (idx % 2) * 5.8;
            const y = 1.8 + Math.floor(idx / 2) * 2.3;

            slide.addShape(pres.ShapeType.roundRect, {
                x, y, w: 5.4, h: 2.0, r: 0.15,
                fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
            });

            slide.addText(`0${idx + 1}. ${p.title}`, {
                x: x + 0.3, y: y + 0.25, w: 4.8, h: 0.4,
                fontSize: 14, fontFace: 'Arial', bold: true, color: NAVY
            });

            slide.addText(p.desc, {
                x: x + 0.3, y: y + 0.75, w: 4.8, h: 1.0,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 3: SOLUSI: APLIKASI WEB ON-PREMISE
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Solusi: Transformasi ke Sistem Berbasis Web', 'Keunggulan implementasi web server intranet di jaringan kantor');

        const solutions = [
            { icon: '🌐', title: 'Akses Fleksibel Tanpa Instalasi', desc: 'Seluruh karyawan kantor dapat mengakses sistem cukup lewat web browser (Chrome/Edge) tanpa harus install Java/JRE.' },
            { icon: '🔒', title: 'Data Aman di Server Internal Kantor', desc: 'Database dan server berada di dalam jaringan lokal kantor (On-Premise Intranet), menjaga kerahasiaan data perusahaan.' },
            { icon: '⚡', title: 'Sinkronisasi Real-Time', desc: 'Perubahan stok, approval peminjaman, dan reservasi ruangan langsung terupdate seketika di seluruh komputer staf.' },
            { icon: '🖨️', title: 'Reporting & Export Lengkap', desc: 'Mendukung cetak bukti fisik berformat resmi kantor (PDF) serta ekspor tabel ke Microsoft Excel (.xlsx).' }
        ];

        solutions.forEach((s, idx) => {
            const x = 0.8 + (idx % 2) * 5.8;
            const y = 1.8 + Math.floor(idx / 2) * 2.3;

            slide.addShape(pres.ShapeType.roundRect, {
                x, y, w: 5.4, h: 2.0, r: 0.15,
                fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
            });

            slide.addText(`${s.icon}  ${s.title}`, {
                x: x + 0.3, y: y + 0.25, w: 4.8, h: 0.4,
                fontSize: 14, fontFace: 'Arial', bold: true, color: BLUE
            });

            slide.addText(s.desc, {
                x: x + 0.3, y: y + 0.75, w: 4.8, h: 1.0,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 4: ARSITEKTUR & TEKNOLOGI
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Arsitektur & Spesifikasi Teknologi', 'Dibangun dengan fondasi teknologi yang stabil, cepat, dan mudah dipelihara');

        const layers = [
            { name: 'Frontend (Client)', tech: 'HTML5, Modern Vanilla CSS, JavaScript ES6+', desc: 'Ringan, responsif, dukungan Dark/Light mode, modal interaktif, notifikasi real-time.' },
            { name: 'Backend (Server)', tech: 'Node.js & Express.js Engine', desc: 'RESTful API modular, penanganan transaksi concurrent, collision check jadwal rapat.' },
            { name: 'Database (Storage)', tech: 'MySQL / MariaDB (Database: inventory_db)', desc: 'Skema relasional lengkap, soft-delete data protection, siap skala besar.' },
            { name: 'Deployment (Hosting)', tech: 'Server Lokal / PC Kantor (Port 3000)', desc: 'Dapat dijalankan di Windows Server, PC Kantor biasa, maupun Linux Server.' }
        ];

        layers.forEach((l, idx) => {
            const y = 1.8 + idx * 1.25;

            slide.addShape(pres.ShapeType.roundRect, {
                x: 0.8, y, w: 11.6, h: 1.1, r: 0.1,
                fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
            });

            slide.addText(l.name, {
                x: 1.1, y: y + 0.15, w: 2.8, h: 0.35,
                fontSize: 13, fontFace: 'Arial', bold: true, color: NAVY
            });

            slide.addText(l.tech, {
                x: 1.1, y: y + 0.55, w: 2.8, h: 0.35,
                fontSize: 11, fontFace: 'Arial', bold: true, color: BLUE
            });

            slide.addText(l.desc, {
                x: 4.2, y: y + 0.25, w: 7.8, h: 0.6,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 5: FITUR MASTER DATA & ASET
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Modul 1: Manajemen Master Data & Aset', 'Pengorganisasian data referensi dan katalog barang inventaris');

        const features = [
            'Auto-Generate Barcode: Kode unik otomatis (contoh: AST-2026-001) untuk pelacakan mudah.',
            'Klasifikasi Ganda: Memisahkan kategori ASET (barang tahan lama) dan CONSUMABLE (barang habis pakai).',
            'Master Data Terpadu: Ruang Rapat, Lokasi Penyimpanan (Gudang/Lantai), Status, dan Supplier Vendor.',
            'Soft Delete Protection: Data tidak terhapus permanen melainkan diarsipkan demi keamanan audit.'
        ];

        slide.addShape(pres.ShapeType.roundRect, {
            x: 0.8, y: 1.8, w: 11.6, h: 4.8, r: 0.15,
            fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
        });

        features.forEach((f, idx) => {
            const [boldPart, normalPart] = f.split(': ');
            slide.addText([
                { text: `✔  ${boldPart}: `, options: { bold: true, color: NAVY, fontSize: 13.5 } },
                { text: normalPart, options: { color: GRAY, fontSize: 13 } }
            ], {
                x: 1.2, y: 2.2 + idx * 1.05, w: 10.8, h: 0.8
            });
        });
    }

    // ==========================================
    // SLIDE 6: FITUR SIRKULASI & TRANSAKSI
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Modul 2: Peminjaman & Pengeluaran Barang', 'Pengendalian sirkulasi barang masuk, keluar, dan peminjaman staf');

        const flows = [
            { step: '1. Peminjaman Aset', desc: 'Pencatatan PIC, Divisi, tanggal pinjam, dan estimasi kembali. Stok aset di sistem otomatis berkurang secara aman.' },
            { step: '2. Pengembalian Aset', desc: 'Cukup 1-klik tombol "Kembalikan", status peminjaman selesai dan stok aset otomatis dipulihkan ke posisi semula.' },
            { step: '3. Barang Keluar (Outbound)', desc: 'Pencatatan barang habis pakai (ATK, kertas, peralatan kebersihan) lengkap dengan lokasi tujuan dan alasan pengeluaran.' }
        ];

        flows.forEach((flow, idx) => {
            const x = 0.8 + idx * 3.95;
            slide.addShape(pres.ShapeType.roundRect, {
                x, y: 1.8, w: 3.7, h: 4.8, r: 0.15,
                fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
            });

            slide.addText(flow.step, {
                x: x + 0.3, y: 2.2, w: 3.1, h: 0.5,
                fontSize: 15, fontFace: 'Arial', bold: true, color: BLUE
            });

            slide.addText(flow.desc, {
                x: x + 0.3, y: 2.8, w: 3.1, h: 3.2,
                fontSize: 13, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 7: FITUR RESERVASI RUANG RAPAT
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Modul 3: Reservasi Ruang Rapat & Anti-Bentrok', 'Manajemen penggunaan fasilitas rapat dengan validasi otomatis');

        const roomPoints = [
            { title: 'Deteksi Bentrok Jam Otomatis', desc: 'Sistem secara otomatis menolak dan memperingatkan pengguna jika ruangan sudah dipesan pada rentang jam yang sama.' },
            { title: 'Transparansi Jadwal Pertemuan', desc: 'Daftar rapat hari ini dan mendatang ditampilkan jelas di Dashboard utama sehingga staf dapat merencanakan kegiatan.' },
            { title: 'Data Pemesanan Lengkap', desc: 'Mencakup nama PIC, divisi, jabatan, estimasi jumlah peserta, serta agenda/tujuan pertemuan.' },
            { title: 'Approval Alur Kerja', desc: 'Mendukung status Pending, Approved, dan Rejected untuk kontrol fasilitas yang lebih tertib.' }
        ];

        roomPoints.forEach((p, idx) => {
            const x = 0.8 + (idx % 2) * 5.8;
            const y = 1.8 + Math.floor(idx / 2) * 2.3;

            slide.addShape(pres.ShapeType.roundRect, {
                x, y, w: 5.4, h: 2.0, r: 0.15,
                fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
            });

            slide.addText(p.title, {
                x: x + 0.3, y: y + 0.25, w: 4.8, h: 0.4,
                fontSize: 14, fontFace: 'Arial', bold: true, color: NAVY
            });

            slide.addText(p.desc, {
                x: x + 0.3, y: y + 0.75, w: 4.8, h: 1.0,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 8: STOCK OPNAME & AUDIT
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Modul 4: Stock Opname & Penyesuaian Stok', 'Fitur audit fisik periodik untuk menjaga akurasi pembukuan inventaris');

        slide.addShape(pres.ShapeType.roundRect, {
            x: 0.8, y: 1.8, w: 11.6, h: 4.8, r: 0.15,
            fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
        });

        const opnameSteps = [
            '1. Pengecekan Fisik: Petugas gudang menghitung jumlah fisik barang di lokasi penyimpanan.',
            '2. Komparasi Sistem: Sistem menampilkan stok tercatat vs stok riil yang diinput petugas.',
            '3. Penyesuaian Terkontrol: Menyesuaikan stok sistem dengan catatan alasan selisih barang.',
            '4. Otomatisasi Status: Jika stok hasil opname menjadi 0, status otomatis berubah menjadi "Habis". Jika stok kembali ada, status berubah menjadi "Tersedia".'
        ];

        opnameSteps.forEach((step, idx) => {
            slide.addText(step, {
                x: 1.3, y: 2.2 + idx * 1.05, w: 10.6, h: 0.8,
                fontSize: 13.5, fontFace: 'Arial', color: NAVY
            });
        });
    }

    // ==========================================
    // SLIDE 9: PELAPORAN, EXCEL & CETAK
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Modul 5: Pelaporan, Ekspor Excel & Cetak PDF', 'Penyajian laporan profesional siap cetak dan olah data lanjutan');

        const reports = [
            { title: 'Ekspor Excel (.xlsx)', desc: 'Seluruh data laporan (Peminjaman, Booking, Mutasi, Aset) dapat diekspor langsung ke spreadsheet Excel dengan header terformat rapi.' },
            { title: 'Cetak Dokumen Resmi (PDF/Print)', desc: 'Tersedia template cetak fisik lengkap dengan Kop Surat Perusahaan, informasi tanggal cetak, dan kolom tanda tangan Mengetahui (GA/IT) & Petugas.' },
            { title: 'Log Riwayat Lengkap (Audit Trail)', desc: 'Rekapitulasi sirkulasi barang masuk, barang keluar, dan peminjaman dalam satu tampilan terpusat.' }
        ];

        reports.forEach((r, idx) => {
            const y = 1.8 + idx * 1.6;
            slide.addShape(pres.ShapeType.roundRect, {
                x: 0.8, y, w: 11.6, h: 1.4, r: 0.15,
                fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
            });

            slide.addText(r.title, {
                x: 1.2, y: y + 0.2, w: 10.8, h: 0.4,
                fontSize: 15, fontFace: 'Arial', bold: true, color: BLUE
            });

            slide.addText(r.desc, {
                x: 1.2, y: y + 0.65, w: 10.8, h: 0.6,
                fontSize: 12.5, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 10: CARA HOSTING DI SERVER KANTOR
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Panduan Hosting di Server Lokal Kantor', 'Langkah mudah menjalankan sistem pada PC Server intranet kantor');

        const steps = [
            { step: 'Langkah 1: Siapkan Database', desc: 'Nyalakan MySQL (via XAMPP). Buat database "inventory_db" dan import file database/schema.sql.' },
            { step: 'Langkah 2: Konfigurasi .env', desc: 'Sesuaikan konfigurasi DB_HOST=localhost, DB_USER=root, DB_PASSWORD di file .env.' },
            { step: 'Langkah 3: Jalankan Web Server', desc: 'Buka PowerShell / Command Prompt di folder web-app, lalu jalankan: npm start.' },
            { step: 'Langkah 4: Akses dari Komputer Lain', desc: 'Karyawan di LAN kantor cukup membuka browser dan mengetik: http://[IP-Server]:3000' }
        ];

        steps.forEach((s, idx) => {
            const x = 0.8 + (idx % 2) * 5.8;
            const y = 1.8 + Math.floor(idx / 2) * 2.3;

            slide.addShape(pres.ShapeType.roundRect, {
                x, y, w: 5.4, h: 2.0, r: 0.15,
                fill: { color: WHITE }, line: { color: 'E2E8F0', width: 1 }
            });

            slide.addText(s.step, {
                x: x + 0.3, y: y + 0.25, w: 4.8, h: 0.4,
                fontSize: 14, fontFace: 'Arial', bold: true, color: NAVY
            });

            slide.addText(s.desc, {
                x: x + 0.3, y: y + 0.75, w: 4.8, h: 1.0,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 11: ROADMAP & PENGEMBANGAN LANJUTAN
    // ==========================================
    {
        const slide = pres.addSlide();
        addHeader(slide, 'Roadmap & Potensi Penambahan Fitur', 'Aplikasi dirancang modular sehingga mudah diperluas sesuai kebutuhan kantor');

        const roadmap = [
            { title: 'Integrasi Barcode / QR Scanner Kamera', desc: 'Scan barcode fisik langsung menggunakan kamera laptop atau smartphone petugas saat serah terima barang.' },
            { title: 'Notifikasi Otomatis WhatsApp / Email', desc: 'Pengingat otomatis (reminder) kepada staf saat batas waktu pengembalian barang pinjaman mendekat.' },
            { title: 'Integrasi Single Sign-On (Active Directory / LDAP)', desc: 'Karyawan login menggunakan akun email kantor resmi tanpa perlu membuat akun terpisah.' },
            { title: 'Multi-Gudang / Cabang (Multi-Branch)', desc: 'Pengelolaan inventaris untuk kantor yang memiliki lebih dari satu gedung atau cabang operasional.' }
        ];

        roadmap.forEach((r, idx) => {
            const x = 0.8 + (idx % 2) * 5.8;
            const y = 1.8 + Math.floor(idx / 2) * 2.3;

            slide.addShape(pres.ShapeType.roundRect, {
                x, y, w: 5.4, h: 2.0, r: 0.15,
                fill: { color: WHITE }, line: { color: 'CBD5E1', width: 1 }
            });

            slide.addText(`🚀 ${r.title}`, {
                x: x + 0.3, y: y + 0.25, w: 4.8, h: 0.4,
                fontSize: 13.5, fontFace: 'Arial', bold: true, color: BLUE
            });

            slide.addText(r.desc, {
                x: x + 0.3, y: y + 0.75, w: 4.8, h: 1.0,
                fontSize: 12, fontFace: 'Arial', color: GRAY
            });
        });
    }

    // ==========================================
    // SLIDE 12: CLOSING
    // ==========================================
    {
        const slide = pres.addSlide();
        slide.background = { color: NAVY };

        slide.addText('TERIMA KASIH', {
            x: 1.0, y: 2.5, w: 11.3, h: 1.0,
            fontSize: 40, fontFace: 'Arial', bold: true, color: WHITE, align: 'center'
        });

        slide.addText('Sistem Manajemen Inventaris & Ruang Rapat Kantor Siap Diimplementasikan', {
            x: 1.0, y: 3.6, w: 11.3, h: 0.6,
            fontSize: 16, fontFace: 'Arial', color: SKY, align: 'center'
        });

        slide.addText('Sesi Tanya Jawab (Q & A) & Diskusi Tambahan Kebutuhan Kantor', {
            x: 1.0, y: 4.4, w: 11.3, h: 0.4,
            fontSize: 13, fontFace: 'Arial', color: '94A3B8', align: 'center'
        });
    }

    // Output file to both root and web-app folder
    const outputPath = path.join(__dirname, '../../Presentasi_Sistem_Inventaris_Kantor.pptx');
    await pres.writeFile({ fileName: outputPath });
    console.log(`[Presentation] File PPTX berhasil dibuat: ${outputPath}`);

    // Also copy to web-app/public for direct browser download if desired
    const publicPath = path.join(__dirname, '../public/Presentasi_Sistem_Inventaris_Kantor.pptx');
    await pres.writeFile({ fileName: publicPath });
    console.log(`[Presentation] File PPTX publik berhasil dibuat: ${publicPath}`);
}

createPresentation().catch(err => {
    console.error('Error generating presentation:', err);
    process.exit(1);
});

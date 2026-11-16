# FitTrack — Fitness & Fat Loss Tracker

PWA berbahasa Indonesia untuk mencatat nutrisi, latihan, berat badan, ukuran tubuh, dan aktivitas lari.

## Fitur
- Dashboard target awal: 2.100 kkal dan 150 g protein per hari.
- Jurnal makanan dengan kalkulasi kalori/protein.
- Checklist jadwal latihan mingguan.
- Catatan berat badan dan grafik sederhana.
- Catatan lingkar paha dan pinggang.
- GPS run tracker dengan pilihan target 5 km dan 10 km.
- Penghitungan jarak, durasi, pace, kecepatan, akurasi GPS, serta estimasi kalori aktivitas.
- Riwayat sesi lari dan ringkasan kalori aktivitas harian.
- Service worker untuk akses offline setelah kunjungan pertama.
- Data tersimpan lokal di browser/perangkat (localStorage).

## GPS dan kalori
- Tracking memakai Geolocation API browser dengan high accuracy; izinkan akses lokasi dan gunakan HTTPS.
- Jarak dihitung dari koordinat GPS berturut-turut. Titik dengan akurasi lebih buruk dari 35 meter diabaikan; perpindahan yang tampak tidak wajar juga difilter.
- Kalori adalah estimasi berbasis berat badan terakhir yang dicatat, durasi, dan kategori intensitas/kecepatan (MET), bukan pengukuran langsung.
- Untuk hasil lebih baik, lari di area terbuka dan biarkan aplikasi tetap terbuka dengan layar menyala. GPS dapat kurang akurat di gedung, terowongan, atau area dengan gedung tinggi.

## Menjalankan lokal
```bash
python -m http.server 8080
```
Buka http://localhost:8080. GPS browser membutuhkan secure context (HTTPS atau localhost).

## Deploy ke GitHub Pages
1. Buka Settings → Pages.
2. Pada Source, pilih GitHub Actions.
3. Push perubahan ke branch main untuk memicu workflow deploy.
4. Buka URL Pages dan pilih Add to Home Screen / Install App di perangkat.

## Catatan
- Ini PWA, bukan aplikasi medis atau pengganti perangkat GPS olahraga khusus.
- Data tersimpan lokal dan belum tersinkron antarperangkat.
- Target kalori/protein dan estimasi kalori aktivitas perlu dievaluasi sesuai kondisi dan hasil aktual.

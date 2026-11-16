# FitTrack — Fitness & Fat Loss Tracker

PWA berbahasa Indonesia untuk mencatat nutrisi, latihan mingguan, berat badan, dan ukuran tubuh.

## Fitur
- Dashboard target awal: 2.100 kkal dan 150 g protein per hari.
- Jurnal makanan dengan kalkulasi kalori/protein.
- Checklist jadwal latihan mingguan.
- Catatan berat badan dan grafik sederhana.
- Catatan lingkar paha dan pinggang.
- Service worker untuk akses offline setelah kunjungan pertama.
- Data tersimpan lokal di browser perangkat (localStorage).

## Menjalankan lokal
```bash
python -m http.server 8080
```
Buka http://localhost:8080.

## Deploy ke GitHub Pages
1. Buka Settings → Pages.
2. Pilih Deploy from a branch, branch main, folder / (root).
3. Simpan, lalu buka URL Pages di browser HP.
4. Pilih Add to Home Screen / Install App.

## Catatan
- Ini starter PWA, bukan aplikasi medis.
- Data tersimpan lokal dan belum tersinkron antarperangkat.
- Target kalori dan protein adalah estimasi awal yang perlu dievaluasi.
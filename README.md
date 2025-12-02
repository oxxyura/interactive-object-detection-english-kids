🎯 Vision English
Aplikasi pembelajaran kosakata bahasa Inggris interaktif berbasis Computer Vision dan Object Detection

Vision English adalah aplikasi web yang membantu pengguna belajar kosakata bahasa Inggris melalui deteksi objek real-time﻿. Aplikasi ini mengenali objek sehari-hari melalui kamera, menampilkan nama dalam bahasa Inggris, memutar audio pengucapan, dan memberikan latihan pronunciation﻿ interaktif.​

✨ Fitur Utama
🎯 Object Detection
Deteksi objek real-time﻿ menggunakan kamera perangkat (smartphone/PC)

Mendukung 25 objek sehari-hari seperti pisang, mangkuk, gunting, tomat, sendok

Menggunakan YOLO-OBB untuk deteksi akurat​

Konfigurasi threshold﻿ untuk setiap kelas objek

🔊 Pembelajaran Audio
Audio pengucapan untuk setiap kosakata bahasa Inggris

Fallback﻿ ke Text-to-Speech browser jika file audio tidak tersedia

Fitur "🔊 Dengarkan" untuk mendengarkan pengucapan yang benar

🎤 Latihan Pengucapan
Sistem speech recognition﻿ untuk menilai pengucapan pengguna

Feedback﻿ langsung: ✅ Benar / ❌ Salah

Suara notifikasi untuk setiap aksi (mic on﻿, benar, salah)

Batasan waktu rekam (5 detik)

🎨 UI/UX yang Menarik
Splash screen﻿ dengan animasi interaktif

Antarmuka responsif (mobile & desktop)

Animasi loading﻿ dan transisi yang halus

Popup﻿ informasi dan feedback﻿ yang intuitif

📱 Fitur Bantuan
Daftar lengkap objek yang dapat dideteksi

Petunjuk penggunaan yang jelas

Tombol bantuan dengan ikon "?" yang mudah diakses

🛠️ Teknologi yang Digunakan
Backend
Flask - Python web framework

YOLO-OBB - Object Detection model​

PyTorch - Deep Learning framework

OpenCV - Computer Vision processing​

Frontend
HTML5, CSS3, JavaScript

Web Speech API - Speech Recognition & Synthesis

MediaDevices API - Camera access

CSS Animations - UI effects

Asset
File audio MP3 untuk setiap kosakata

Efek suara untuk feedback﻿ (correct/wrong/mic_on)

Ikon dan gambar visual

📁 Struktur Proyek
text
vision-english/
├── app_obb.py              # Server Flask utama
├── models/
│   └── best.pt             # Model YOLO-OBB terlatih
├── templates/
│   ├── splash.html         # Halaman splash screen
│   └── main.html           # Halaman utama aplikasi
├── static/
│   ├── audio/              # File audio pengucapan (.mp3)
│   │   ├── banana.mp3
│   │   ├── spoon.mp3
│   │   └── ...
│   ├── sounds/             # Efek suara
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   └── mic_on.mp3
│   └── icons/              # Ikon aplikasi
└── README.md               # Dokumentasi ini

🚀 Instalasi dan Menjalankan
Prasyarat
Python 3.7+

pip (Python package manager)

Web browser modern dengan akses kamera dan mikrofon

Langkah Instalasi
Clone repository

bash
git clone <repository-url>
cd vision-english
Instal dependensi Python

bash
pip install flask torch torchvision ultralytics opencv-python numpy
Siapkan model YOLO-OBB

Letakkan file model best.pt di folder models/

Pastikan model sudah dilatih untuk kelas objek yang didukung

Siapkan file audio

Buat folder static/audio/

Tambahkan file MP3 untuk setiap kosakata dengan format: nama_inggris.mp3

Contoh: banana.mp3, spoon.mp3, tomato.mp3

Jalankan server Flask

bash
python app_obb.py
Akses aplikasi

Buka browser dan kunjungi: http://localhost:5000

Izinkan akses kamera dan mikrofon saat diminta

📊 Kelas Objek yang Didukung
Aplikasi dapat mendeteksi 25+ objek sehari-hari:

Bahasa Inggris	Bahasa Indonesia
banana	pisang,
bowl	mangkuk,
coin	koin
cucumber	mentimun,
cup	cangkir,
eraser	penghapus,
fork	garpu,
glass	gelas,
hair comb	sisir rambut,
hanger	gantungan baju,
long purple eggplant	terong ungu panjang,
nail clippers	pemotong kuku,
pen	pena,
pencil	pensil,
pencil sharpener	serutan pensil,
phone charger	charger hp,
plastic water bottle	botol air plastik,
plate	piring,
ruler	penggaris,
rupiah banknote	uang kertas rupiah,
scissors	gunting,
snake fruit	salak,
spoon	sendok,
tomato	tomat,
whiteboard marker	spidol papan tulis,

🎮 Cara Menggunakan
Buka aplikasi di browser

Izinkan akses kamera

Arahkan kamera ke objek yang ingin dipelajari

Tekan tombol deteksi (tombol bulat besar)

Dengarkan pengucapan dengan menekan tombol 🔊

Latih pengucapan dengan menekan tombol 🎤

Ucapkan kata yang diminta dalam bahasa Inggris

Terima feedback﻿ dari sistem

⚙️ Konfigurasi
Threshold Deteksi
python
CLASS_THRESHOLDS = {
    'default': 0.7  # Minimum confidence score
}
Terjemahan Bahasa
python
CLASS_TRANSLATIONS = {
    'banana': 'pisang',
    'spoon': 'sendok',
    # ... tambahkan terjemahan lainnya
}
Koreksi Nama Kelas
python
CLASS_CORRECTIONS = {
    'nail clipper': 'nail clippers',
    # ... koreksi lainnya
}
🚨 Troubleshooting
Masalah Kamera
Pastikan browser memiliki izin akses kamera

Periksa apakah kamera sedang digunakan aplikasi lain

Coba refresh﻿ halaman

Masalah Audio
Periksa volume perangkat

Pastikan file audio tersedia di folder static/audio/

Browser harus mendukung Web Audio API

Masalah Speech Recognition
Hanya berfungsi di browser yang mendukung Web Speech API

Chrome dan Edge memiliki dukungan terbaik

Pastikan mikrofon terhubung dan diizinkan

Masalah Model
Verifikasi model best.pt ada di folder models/

Pastikan PyTorch dan CUDA (jika menggunakan GPU) terinstal dengan benar

Cek log server untuk pesan error

📱 Browser yang Didukung
✅ Google Chrome (rekomendasi)

✅ Microsoft Edge

⚠️ Mozilla Firefox (dengan beberapa batasan)

⚠️ Safari (dengan batasan pada Speech Recognition)

🔧 Pengembangan
Menambahkan Kelas Baru
Latih model dengan kelas baru
Update file best.pt
Tambahkan terjemahan di CLASS_TRANSLATIONS
Tambahkan file audio di static/audio/
Update daftar di halaman bantuan

Customisasi UI
Edit file splash.html dan main.html untuk tampilan
Modifikasi CSS di bagian <style> untuk desain
Tambahkan animasi di bagian JavaScript

Optimasi Performa
Gunakan GPU untuk inferensi yang lebih cepat
Kompres file audio untuk loading﻿ lebih cepat
Gunakan CDN untuk font dan library

🤝 Kontribusi
Kontribusi sangat diterima! Silakan ikuti langkah berikut:

Fork repository
-Buat branch﻿ fitur (git checkout -b fitur-baru)
-Commit﻿ perubahan (git commit -m 'Menambahkan fitur')
-Push﻿ ke branch﻿ (git push origin fitur-baru)
-Buat Pull Request﻿

📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.

👥 Kontak
Untuk pertanyaan, bug report﻿, atau saran:
Email: [muhammadarifmukti@gmail.com]
Issues: GitHub Issues
Whatsapp : 085158094475

🙏 Acknowledgments
Model YOLO-OBB dari Ultralytics

Web Speech API dari W3C

Inspirasi dari berbagai aplikasi pembelajaran bahasa

⭐ Jika proyek ini bermanfaat, jangan lupa berikan bintang di GitHub!

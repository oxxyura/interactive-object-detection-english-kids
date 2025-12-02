<p align="center"> <img src="URL_TO_YOUR_PROJECT_LOGO_OR_BANNER" alt="Vision English Banner" width="700"> </p> <h1 align="center">Vision English</h1> <p align="center"> <strong>Belajar Bahasa Inggris jadi lebih mudah dan interaktif dengan kekuatan Computer Vision.</strong> <br> Cukup arahkan kamera, deteksi objek, dengarkan pengucapannya, dan latih pelafalan Anda! </p> <p align="center"> <img alt="Python Version" src="https://img.shields.io/badge/python-3.7%2B-blue"> <img alt="Framework" src="https://img.shields.io/badge/framework-Flask-black"> <img alt="Deep Learning" src="https://img.shields.io/badge/engine-PyTorch%20%26%20YOLO--OBB-orange"> <img alt="License" src="https://img.shields.io/badge/license-MIT-green"> </p>
<p align="center"> <img src="URL_TO_YOUR_APP_DEMO_GIF" alt="Demonstrasi Aplikasi Vision English" width="600"> <br> <em>(Contoh penggunaan aplikasi Vision English)</em> </p>
✨ Fitur Unggulan
👁️ Deteksi Objek Real-Time﻿: Menggunakan model YOLO-OBB untuk mengenali 25+ objek secara akurat melalui kamera perangkat Anda.​

🗣️ Latihan Pengucapan Interaktif: Dapatkan feedback﻿ ✅ / ❌ secara langsung saat Anda melatih pelafalan bahasa Inggris menggunakan Web Speech API.

🎧 Audio Berkualitas: Setiap kosakata dilengkapi dengan audio pengucapan yang jernih. Jika gagal, fitur Text-to-Speech akan menjadi cadangan.

📱 Desain Responsif & Modern: Antarmuka yang ramah pengguna, bekerja dengan baik di desktop maupun perangkat seluler.

⚙️ Mudah Dikonfigurasi: Sesuaikan threshold﻿ deteksi, tambahkan terjemahan, dan koreksi nama kelas dengan mudah langsung dari kode.

🚀 Memulai
Prasyarat
Python 3.7+

pip (Manajer paket Python)

Browser modern (Chrome/Edge direkomendasikan) dengan izin akses kamera & mikrofon.

Langkah Instalasi & Menjalankan
Clone Repository

bash
git clone https://github.com/username/vision-english.git
cd vision-english
Instal Dependensi

bash
pip install -r requirements.txt
# Atau instal manual:
# pip install flask torch torchvision ultralytics opencv-python numpy
Setup Model & Aset

Letakkan model best.pt Anda di dalam direktori models/.

Isi direktori static/audio/ dengan file .mp3 untuk setiap kosakata (contoh: banana.mp3).

Jalankan Aplikasi

bash
python app_obb.py
Akses Aplikasi
Buka browser dan navigasi ke http://localhost:5000. Berikan izin untuk kamera dan mikrofon saat diminta.

🛠️ Tumpukan Teknologi (Tech Stack﻿)
Kategori	Teknologi
Backend	Flask, PyTorch, YOLO-OBB, OpenCV
Frontend	HTML5, CSS3, JavaScript, Web Speech API, MediaDevices API
Infrastruktur	Python 3.7+

🤝 Berkontribusi
Kami sangat terbuka untuk kontribusi! Jika Anda ingin membantu, silakan:

Fork repositori ini.

Buat Branch Baru (git checkout -b fitur-keren-baru).

Lakukan perubahan dan Commit (git commit -m 'Menambahkan fitur keren baru').

Push ke branch Anda (git push origin fitur-keren-baru).

Buat Pull Request.

📄 Lisensi
Proyek ini berada di bawah Lisensi MIT. Lihat file LICENSE untuk detail lebih lanjut.

📧 Kontak
Punya pertanyaan atau masukan?

Buka Issue di repositori GitHub ini.

Hubungi via Email: muhammadarifmukti@gmail.com.

<p align="center"> Dibuat dengan ❤️ untuk para pembelajar bahasa. <br> <strong>Jangan lupa berikan ⭐ jika Anda menyukai proyek ini!</strong> </p>

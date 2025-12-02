# 📸 Interactive Object Detection using YOLO11 for Vocabulary and Pronunciation Enhancement in Elementary School English

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-green?style=for-the-badge&logo=flask&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-OBB-yellow?style=for-the-badge)

> Aplikasi web sederhana untuk mendeteksi objek secara *real-time* menggunakan model YOLO11 Oriented Bounding Box (OBB), lengkap dengan pelafalan suara dalam bahasa Inggris dan bahasa Indonesia.

---

## 📖 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Struktur Folder](#-struktur-folder)
- [Instalasi & Penggunaan](#-instalasi--penggunaan)
- [Dukungan GPU](#-dukungan-gpu)
- [Lisensi](#-lisensi)

---

## 🧐 Tentang Proyek

Proyek ini dirancang untuk membantu pengguna (khususnya anak-anak atau pembelajar bahasa) mengenali nama-nama objek di sekitar mereka. Menggunakan kamera perangkat, aplikasi akan memindai objek, memberikan label dalam **Bahasa Indonesia**, dan dapat memutar **audio pelafalan** nama objek tersebut.

Dibangun dengan **Flask** sebagai backend dan **YOLOv8/11 OBB** untuk deteksi objek dengan orientasi yang presisi.

---

## ✨ Fitur Utama
- 📷 **Deteksi Real-time**: Menggunakan kamera web atau kamera ponsel.
- 🔄 **Oriented Bounding Box**: Deteksi objek yang miring atau berputar dengan lebih akurat.
- 🇮🇩 **Bahasa Indonesia**: Output nama kelas langsung diterjemahkan.
- 🔊 **Fitur Suara**: Klik tombol untuk mendengarkan nama objek.
- 🚀 **Ringan**: Antarmuka sederhana dan responsif.

---

## 📂 Struktur Folder

Pastikan susunan file Anda terlihat seperti ini agar aplikasi berjalan lancar:

/my-yolo-app
│
├── 📁 models
│ └── best.pt # File model YOLO hasil training Anda
│
├── 📁 static
│ └── 📁 audio
│ ├── pisang.mp3 # File audio per kelas objek
│ ├── mangkuk.mp3
│ └── ...
│
├── 📁 templates
│ ├── main.html # Halaman utama (kamera & hasil)
│ └── splash.html # Halaman pembuka
│
├── app_obb.py # Server utama Flask
├── requirements.txt # Daftar pustaka Python
└── README.md # Dokumentasi ini

text

---

## 🛠 Instalasi & Penggunaan

Ikuti langkah-langkah ini untuk menjalankan aplikasi dari nol.

### 1. Clone atau Unduh Repository
git clone https://github.com/oxxyura/interactive-object-detection-english-kids

cd interactive-object-detection-english-kids

text

### 2. Siapkan Virtual Environment
Disarankan menggunakan lingkungan virtual agar instalasi bersih.

**Windows:**
python -m venv venv
.\venv\Scripts\activate

text

**Mac/Linux:**
python3 -m venv venv
source venv/bin/activate

text

### 3. Instal Dependensi
Instal semua pustaka yang dibutuhkan:
pip install -r requirements.txt

text
*Jika belum ada `requirements.txt`, instal manual:*
pip install flask ultralytics opencv-python numpy

text

### 4. Siapkan Model & Audio
- Pastikan file model (`best.pt`) sudah ada di folder `models/`.
- Pastikan file suara (`.mp3`) sudah ada di folder `static/audio/`.

### 5. Jalankan Aplikasi
python app_obb.py

text
Akses aplikasi di browser melalui:
👉 [**http://127.0.0.1:5000/**](localhost:5000)

---

## ⚡ Dukungan GPU (Opsional)

Agar deteksi berjalan lebih cepat (FPS tinggi), gunakan GPU NVIDIA. Anda perlu menginstal **PyTorch versi CUDA**.

Hapus PyTorch lama (jika ada), lalu jalankan:
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118

text
*(Sesuaikan `cu118` dengan versi CUDA di driver VGA Anda)*

---

## 📜 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---
*Dibuat dengan ❤️ untuk edukasi.*

from flask import Flask, request, jsonify, render_template, send_from_directory
import base64, numpy as np, cv2, torch, os, time

app = Flask(__name__, template_folder='templates')
AUDIO_FOLDER = os.path.join('static', 'audio')

# =============================
# Terjemahan nama kelas ke Bahasa Indonesia
CLASS_TRANSLATIONS = {
    'banana': 'pisang',
    'bowl': 'mangkuk',
    'coin': 'koin',
    'cucumber': 'mentimun',
    'cup': 'cangkir',
    'eraser': 'penghapus',
    'fork': 'garpu',
    'glass': 'gelas',
    'hair comb': 'sisir rambut',
    'hanger': 'gantungan baju',
    'long purple eggplant': 'terong ungu panjang',
    'purple eggplant': 'terong ungu',
    'nail clippers': 'pemotong kuku',
    'pen': 'pena',
    'pencil': 'pensil',
    'pencil sharpener': 'serutan pensil',
    'phone charger': 'charger hp',
    'plastic water bottle': 'botol air plastik',
    'plate': 'piring',
    'ruler': 'penggaris',
    'rupiah banknote': 'uang kertas rupiah',
    'scissors': 'gunting',
    'snake fruit': 'salak',
    'spoon': 'sendok',
    'tomato': 'tomat',
    'whiteboard marker': 'spidol papan tulis'
}

# =============================
# Koreksi nama kelas agar seragam
CLASS_CORRECTIONS = {
    'nail clipper': 'nail clippers',
}

# =============================
# Threshold untuk semua kelas 
CLASS_THRESHOLDS = {
    # Jika kelas tidak tercantum gunakan default
    'default': 0.7
}

# =============================
# Load model YOLO-OBB
try:
    from ultralytics import YOLO
    # Ganti dengan path ke model YOLO-OBB Anda
    model = YOLO('models/best.pt')  # Load model OBB

    # Deteksi device
    if torch.cuda.is_available():
        model.to('cuda')
        device_name = torch.cuda.get_device_name(0)
        print(f"[INFO] Model dimuat di GPU: {device_name}")
    else:
        device_name = "CPU"
        print("[INFO] Model dimuat di CPU")

except Exception as e:
    print(f"[ERROR] Gagal memuat model: {e}")
    model = None
    device_name = "Tidak tersedia"

@app.route('/')
def index():
    return render_template('splash.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/detect', methods=['POST'])
def detect():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'Data gambar tidak ditemukan'}), 400

    # Decode gambar dari base64
    try:
        image_data = data['image'].split(',')[1]
        img_bytes = base64.b64decode(image_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({'error': f'Kesalahan saat membaca gambar: {str(e)}'}), 500

    detections = []

    # ----------------------------
    # Deteksi dengan Model OBB
    if model:
        try:
            # Mulai stopwatch untuk kecepatan inferensi
            start_time = time.perf_counter()

            # Proses inferensi
            results = model(img, verbose=False)

            # Hitung durasi inferensi
            infer_time_ms = (time.perf_counter() - start_time) * 1000  # dalam ms
            fps = 1000 / infer_time_ms if infer_time_ms > 0 else 0

            # Tampilkan info di terminal
            print(f"[INFO] Device yang digunakan: {device_name}")
            print(f"[INFO] Kecepatan inferensi: {infer_time_ms:.2f} ms/gambar ({fps:.1f} FPS)")

            # Ambil hasil deteksi
            for r in results:
                if r.obb is not None:  # Pastikan ada deteksi OBB
                    for box in r.obb.data:
                        # Format: [x, y, w, h, rot, conf, cls] (N x 7)
                        x, y, w, h, rot, conf, cls = box
                        class_name = model.names[int(cls)]
                        corrected_class = CLASS_CORRECTIONS.get(class_name, class_name)

                        # Ambil threshold sesuai kelas
                        th = CLASS_THRESHOLDS.get(corrected_class, CLASS_THRESHOLDS['default'])

                        if float(conf) >= th:
                            detections.append({
                                'class': corrected_class,
                                'confidence': float(conf),
                                'model': 'obb_model',
                                'center': [float(x), float(y)],
                                'size': [float(w), float(h)],
                                'rotation': float(rot)  # Sudut rotasi dalam radian
                            })
        except Exception as e:
            print(f"[ERROR] OBB model detection error: {str(e)}")

    # Jika tidak ada deteksi
    if not detections:
        return jsonify({'error': '⛔ Tidak Ada Objek Yang Terdeteksi'}), 500

    return jsonify({'detections': detections, 'translations': CLASS_TRANSLATIONS})

@app.route('/static/audio/<filename>')
def audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

if __name__ == '__main__':
    os.makedirs(AUDIO_FOLDER, exist_ok=True)
    print("[INFO] Server Flask berjalan...")
    app.run(debug=True, host='0.0.0.0')

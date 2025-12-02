document.addEventListener('DOMContentLoaded', () => {
    // ========== CONSTANTS ==========
    const PRONUNCIATION_THRESHOLD = 0.7;
    const MAX_RECORDING_DURATION = 5000; // 5 seconds
    const SUPPORTED_LANGUAGES = ['en-US', 'id-ID'];

    // ========== DOM ELEMENTS ==========
    const elements = {
        video: document.getElementById('video'),
        canvas: document.getElementById('canvas'),
        uploadedImage: document.getElementById('uploadedImage'),
        uploadedCanvas: document.getElementById('uploadedCanvas'),
        captureBtn: document.getElementById('captureBtn'),
        uploadInput: document.getElementById('uploadInput'),
        clearUploadBtn: document.getElementById('clearUploadBtn'),
        retrySpeechBtn: document.getElementById('retrySpeechBtn'),
        uploadedWrapper: document.getElementById('uploadedWrapper'),
        audioControls: document.getElementById('audioControls'),
        pronounceButtonsDiv: document.getElementById('pronounceButtons'),
        loadingDiv: document.getElementById('loading'),
        noDetectionMessage: document.getElementById('noDetectionMessage'),
        popupOverlay: document.getElementById('popupOverlay'),
        pronunciationModal: document.getElementById('pronunciationModal'),
        modalMic: document.getElementById('modalMic'),
        modalSpoken: document.getElementById('modalSpoken'),
        modalFeedback: document.getElementById('modalFeedback'),
        modalWord: document.getElementById('modalWord'),
        languageSelector: document.getElementById('languageSelector')
    };

    // Initialize canvas contexts
    elements.ctx = elements.canvas.getContext('2d');
    elements.uploadedCtx = elements.uploadedCanvas.getContext('2d');

    // ========== APPLICATION STATE ==========
    const state = {
        lastDetectionData: null,
        currentTargetWord: "",
        recognition: null,
        stream: null,
        mediaRecorder: null,
        audioChunks: [],
        isRecognizing: false,
        selectedLanguage: 'en-US',
        isNativeRecognitionSupported: !!(
            window.SpeechRecognition || window.webkitSpeechRecognition
        )
    };

    // ========== INITIALIZATION ==========
    function init() {
        setupWebcam();
        setupEventListeners();
        initSpeechRecognition();
        setupLanguageSelector();
    }

    function setupLanguageSelector() {
        if (elements.languageSelector) {
            elements.languageSelector.addEventListener('change', (e) => {
                state.selectedLanguage = e.target.value;
                if (state.recognition) {
                    state.recognition.lang = state.selectedLanguage;
                }
            });
        }
    }

    // ========== MEDIA HANDLING ==========
    async function setupWebcam() {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Camera API not available');
            }

            state.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            elements.video.srcObject = state.stream;
            await elements.video.play();
            elements.video.addEventListener('loadedmetadata', handleResize);
        } catch (error) {
            console.error('Camera error:', error);
            showUserMessage('Camera access denied or not available. Please use image upload instead.', 'error');
        }
    }

    function stopWebcam() {
        if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop());
            state.stream = null;
        }
    }

    // ========== IMAGE PROCESSING ==========
    async function captureImage() {
        try {
            elements.video.pause();
            elements.ctx.drawImage(elements.video, 0, 0, elements.canvas.width, elements.canvas.height);

            const blob = await canvasToBlob(elements.canvas);
            const detectionData = await detectObjects(blob);

            if (detectionData) {
                state.lastDetectionData = detectionData;
                updateUIWithDetections(detectionData, elements.canvas, elements.ctx);
            }
        } catch (error) {
            console.error('Capture error:', error);
            showUserMessage('Failed to capture image or detect objects.', 'error');
        } finally {
            elements.video.play().catch(e => console.error('Video play error:', e));
        }
    }

    async function uploadImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await readFileAsURL(file);
            await loadImage(elements.uploadedImage, imageUrl);

            resizeUploadedImage();
            elements.uploadedWrapper.classList.remove('hidden');
            elements.clearUploadBtn.classList.remove('hidden');

            const detectionData = await detectObjects(file);
            if (detectionData) {
                state.lastDetectionData = detectionData;
                updateUIWithDetections(detectionData, elements.uploadedImage, elements.uploadedCtx);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showUserMessage('Failed to process image or detect objects.', 'error');
        }
    }

    async function detectObjects(imageData) {
        const formData = new FormData();
        formData.append('image', imageData, 'image.jpg');

        showLoading(true);
        try {
            const response = await fetch('/detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Detection error:', error);
            throw error;
        } finally {
            showLoading(false);
        }
    }

    // ========== UI UPDATES ==========
    function updateUIWithDetections(data, imageElement, context) {
        const canvasElement = context.canvas;
        const hasDetections = data?.detections?.length > 0;

        elements.noDetectionMessage.classList.toggle('hidden', hasDetections);
        elements.audioControls.classList.toggle('hidden', !hasDetections);

        if (!hasDetections) {
            clearCanvas(context, canvasElement);
            if (imageElement === elements.uploadedImage && elements.uploadedImage.src) {
                context.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);
            }
            elements.pronounceButtonsDiv.innerHTML = '';
            return;
        }

        drawBoundingBoxes(imageElement, data.detections, context, canvasElement);
        createPronunciationButtons(data.detections);
    }

    function clearCanvas(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawBoundingBoxes(imageElement, detections, context, canvasElement) {
        clearCanvas(context, canvasElement);
        context.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);

        context.lineWidth = 3;
        context.textBaseline = 'top';
        context.font = 'bold 16px "Comic Neue"';

        detections.forEach(det => {
            if (!imageElement.naturalWidth || !imageElement.naturalHeight) {
                console.warn('Image natural dimensions not available for drawing bounding boxes.');
                return;
            }

            const [x1, y1, x2, y2] = det.bbox.map(coord =>
                coord * (canvasElement.width / imageElement.naturalWidth)
            );

            // Draw label with English text
            drawLabel(context, x1, y1 - 22, det.label, '#4169e1', 22);
            
            // Draw bounding box
            context.strokeStyle = '#ff4500';
            context.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // Draw Indonesian translation below
            context.font = '14px "Comic Neue"';
            drawLabel(context, x1, y1, det.translation, 'rgba(0,0,0,0.7)', 18);
            
            context.font = 'bold 20px "Comic Neue"';
        });
    }

    function drawLabel(context, x, y, text, bgColor, height) {
        context.fillStyle = bgColor;
        const textWidth = context.measureText(text).width;
        context.fillRect(x, y, textWidth + 10, height);

        context.fillStyle = 'white';
        context.fillText(text, x + 5, y + (height === 22 ? 2 : 0));
    }

    function createPronunciationButtons(detections) {
        elements.pronounceButtonsDiv.innerHTML = '';

        const uniqueDetections = [...new Map(
            detections.map(det => [det.label, det])
        ).values()];

        uniqueDetections.forEach(det => {
            const group = document.createElement('div');
            group.className = 'pronounce-btn-group';

            const englishLabel = document.createElement('div');
            englishLabel.className = 'translation-text';
            englishLabel.textContent = ` ${det.translation}`;
            englishLabel.style.color = '#4169e1';
            englishLabel.style.fontSize = '20px'; 

            const englishBtn = document.createElement('button');
            englishBtn.className = 'pronounce-btn';
            englishBtn.textContent = `🔊 ${det.label}`;
            englishBtn.style.backgroundColor = '#4169e1';
            englishBtn.style.fontSize = '18px';
            englishBtn.addEventListener('click', () => playAudio(det.label));

            const testBtn = document.createElement('button');
            testBtn.className = 'pronounce-btn';
            testBtn.textContent = '🎤 Test Pronunciation';
            testBtn.style.backgroundColor = '#32cd32';
            testBtn.style.fontSize = '18px'; 
            testBtn.addEventListener('click', () => startPronunciationTest(det.label));

            group.append(englishLabel, englishBtn, testBtn);
            elements.pronounceButtonsDiv.appendChild(group);
        });
    }

    // ========== AUDIO FUNCTIONS ==========
    function playAudio(text) {
        const audioFile = `/static/audio/${text.toLowerCase().replace(/\s+/g, '_')}.mp3`;
        const audio = new Audio(audioFile);

        audio.play().catch(error => {
            console.error(`Error playing audio for "${text}":`, error);
            showUserMessage(`Could not play audio for "${text}". Make sure the audio file exists at ${audioFile}`, 'error');
        });
    }

    // ========== SPEECH RECOGNITION ==========
    function initSpeechRecognition() {
        if (state.isNativeRecognitionSupported) {
            initNativeRecognition();
        } else {
            console.log('Native Web Speech API not supported, using fallback method');
            initFallbackRecognition();
        }
    }

    function initNativeRecognition() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        state.recognition = new Recognition();
        
        state.recognition.continuous = false;
        state.recognition.interimResults = false;
        state.recognition.maxAlternatives = 1;
        state.recognition.lang = state.selectedLanguage;

        state.recognition.onstart = () => {
            state.isRecognizing = true;
            updateRecognitionUI('listening');
        };

        state.recognition.onresult = (event) => {
            const spoken = cleanSpeechText(event.results[0][0].transcript);
            checkPronunciationResult(state.currentTargetWord, spoken);
        };

        state.recognition.onerror = (event) => {
            console.error('Native recognition error:', event);
            if (event.error === 'not-allowed') {
                initFallbackRecognition();
            } else {
                updateRecognitionUI('error', event.error);
            }
        };

        state.recognition.onend = () => {
            state.isRecognizing = false;
        };
    }

    function initFallbackRecognition() {
        console.log('Initializing fallback recognition');
        state.mediaRecorder = null;
        state.audioChunks = [];
        updateRecognitionUI('fallback');
    }

    async function startFallbackRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            state.mediaRecorder = new MediaRecorder(stream);
            state.audioChunks = [];
            
            state.mediaRecorder.ondataavailable = (e) => {
                state.audioChunks.push(e.data);
            };
            
            state.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
                await processAudioWithBackend(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            state.mediaRecorder.start();
            updateRecognitionUI('listening');
            
            setTimeout(() => {
                if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
                    state.mediaRecorder.stop();
                }
            }, MAX_RECORDING_DURATION);
        } catch (error) {
            console.error('Error starting fallback recording:', error);
            updateRecognitionUI('error', error.message);
        }
    }

    async function processAudioWithBackend(audioBlob) {
        showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            
            const response = await fetch('/recognize-speech', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Server error');
            }
            
            const result = await response.json();
            checkPronunciationResult(state.currentTargetWord, result.text);
        } catch (error) {
            console.error('Backend recognition error:', error);
            updateRecognitionUI('error', 'Recognition failed');
            const accuracy = calculateAccuracy('', state.currentTargetWord);
            updateSpeechResult('', accuracy);
        } finally {
            showLoading(false);
        }
    }

    async function checkPronunciationResult(expected, spoken) {
        try {
            const response = await fetch('/check-pronunciation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    spoken: spoken,
                    expected: expected
                })
            });
            
            if (!response.ok) {
                throw new Error('Pronunciation check failed');
            }
            
            const result = await response.json();
            updateSpeechResult(spoken, result.accuracy);
        } catch (error) {
            console.error('Error checking pronunciation:', error);
            const accuracy = calculateAccuracy(spoken, expected);
            updateSpeechResult(spoken, accuracy);
        }
    }

    function updateRecognitionUI(state, errorMessage = '') {
        switch (state) {
            case 'listening':
                elements.modalMic.textContent = '🎧';
                elements.modalSpoken.textContent = 'Listening... Speak now.';
                elements.modalFeedback.textContent = '';
                elements.retrySpeechBtn.disabled = true;
                break;
                
            case 'fallback':
                elements.modalMic.textContent = '⏺️';
                elements.modalSpoken.textContent = 'Press and hold to record (5 seconds max)';
                elements.modalFeedback.textContent = '';
                elements.retrySpeechBtn.textContent = '🎤 Hold to Record';
                elements.retrySpeechBtn.disabled = false;
                break;
                
            case 'error':
                elements.modalMic.textContent = '❌';
                elements.modalSpoken.textContent = `Error: ${errorMessage}`;
                elements.modalFeedback.innerHTML = `<span style="color:red;">Error: ${errorMessage}. Please try again.</span>`;
                elements.retrySpeechBtn.disabled = false;
                break;
                
            default:
                elements.modalMic.textContent = '🎤';
                elements.retrySpeechBtn.disabled = false;
        }
    }

    // ========== PRONUNCIATION TEST ==========
    function startPronunciationTest(word) {
        state.currentTargetWord = word;
        elements.modalWord.textContent = word;
        showModal(true);
        
        if (state.isNativeRecognitionSupported) {
            runNativeSpeechTest();
        } else {
            updateRecognitionUI('fallback');
        }
    }

    function runNativeSpeechTest() {
        try {
            if (state.recognition) {
                state.recognition.stop(); // Stop any ongoing recognition
                setTimeout(() => {
                    state.recognition.start();
                }, 100);
            }
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            updateRecognitionUI('error', error.message);
        }
    }

    function updateSpeechResult(spoken, accuracy) {
        const percent = (accuracy * 100).toFixed(1);
        elements.modalSpoken.textContent = spoken ? `You said: "${spoken}"` : 'No speech detected';

        if (accuracy >= PRONUNCIATION_THRESHOLD) {
            elements.modalFeedback.innerHTML =
                `✅ <span style="color:green;">Correct!<br>Accuracy: ${percent}%</span>`;
        } else {
            elements.modalFeedback.innerHTML =
                `❌ <span style="color:red;">Try again<br>Accuracy: ${percent}%</span>`;
        }
        
        elements.retrySpeechBtn.disabled = false;
    }

    // ========== UTILITY FUNCTIONS ==========
    function cleanSpeechText(text) {
        return text ? text.toLowerCase().trim().replace(/[.,!?;]/g, '') : '';
    }

    function calculateAccuracy(spoken, expected) {
        if (!spoken || !expected) return 0;

        const longer = spoken.length > expected.length ? spoken : expected;
        const shorter = spoken.length > expected.length ? expected : spoken;
        const longerLen = longer.length;

        if (longerLen === 0) return 1.0;

        return (longerLen - calculateEditDistance(longer, shorter)) / longerLen;
    }

    function calculateEditDistance(a, b) {
        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));

        for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = b[i - 1] === a[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[b.length][a.length];
    }

    async function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas to Blob conversion failed'));
            }, 'image/jpeg', 0.9);
        });
    }

    async function readFileAsURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsDataURL(file);
        });
    }

    async function loadImage(imgElement, src) {
        return new Promise((resolve, reject) => {
            imgElement.onload = () => resolve();
            imgElement.onerror = (e) => reject(new Error(`Failed to load image: ${e.type}`));
            imgElement.src = src;
        });
    }

    function resizeUploadedImage() {
        if (!elements.uploadedImage.src) return;

        const containerWidth = elements.uploadedImage.parentElement.clientWidth;
        const aspectRatio = elements.uploadedImage.naturalWidth / elements.uploadedImage.naturalHeight;

        let width = containerWidth;
        let height = width / aspectRatio;

        const maxHeight = window.innerHeight * 0.7;
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        elements.uploadedCanvas.width = width;
        elements.uploadedCanvas.height = height;
        elements.uploadedImage.width = width;
        elements.uploadedImage.height = height;

        if (!state.lastDetectionData) {
            elements.uploadedCtx.clearRect(0, 0, width, height);
            elements.uploadedCtx.drawImage(elements.uploadedImage, 0, 0, width, height);
        }
    }

    function handleResize() {
        resizeVideoElements();
        if (elements.uploadedImage.src) {
            resizeUploadedImage();
            if (state.lastDetectionData) {
                updateUIWithDetections(state.lastDetectionData, elements.uploadedImage, elements.uploadedCtx);
            }
        }
        if (state.stream && !elements.uploadedImage.src && state.lastDetectionData) {
            updateUIWithDetections(state.lastDetectionData, elements.video, elements.ctx);
        }
    }

    function resizeVideoElements() {
        if (!elements.video.videoWidth || !elements.video.videoHeight) return;

        const aspectRatio = elements.video.videoWidth / elements.video.videoHeight;
        const width = elements.video.parentElement.clientWidth;
        elements.video.width = width;
        elements.video.height = width / aspectRatio;
        elements.canvas.width = width;
        elements.canvas.height = width / aspectRatio;
    }

    function showLoading(show) {
        elements.loadingDiv.classList.toggle('hidden', !show);
    }

    function showModal(show) {
        elements.popupOverlay.classList.toggle('hidden', !show);
        elements.pronunciationModal.classList.toggle('hidden', !show);
        
        if (!show && state.isRecognizing) {
            if (state.recognition) {
                state.recognition.stop();
            }
            if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
                state.mediaRecorder.stop();
            }
        }
    }

    function clearUpload() {
        elements.uploadedWrapper.classList.add('hidden');
        elements.clearUploadBtn.classList.add('hidden');
        elements.audioControls.classList.add('hidden');
        elements.noDetectionMessage.classList.add('hidden');
        elements.uploadInput.value = '';
        elements.uploadedCtx.clearRect(0, 0, elements.uploadedCanvas.width, elements.uploadedCanvas.height);
        state.lastDetectionData = null;
        elements.pronounceButtonsDiv.innerHTML = '';
    }

    function showUserMessage(message, type = 'info') {
        const color = type === 'error' ? 'red' : 'blue';
        alert(`[${type.toUpperCase()}] ${message}`);
    }

    // ========== EVENT HANDLERS ==========
    function setupEventListeners() {
        // Image handling
        elements.captureBtn.addEventListener('click', captureImage);
        elements.uploadInput.addEventListener('change', uploadImage);
        elements.clearUploadBtn.addEventListener('click', clearUpload);
        
        // Speech recognition
        elements.retrySpeechBtn.addEventListener('click', () => {
            if (state.isNativeRecognitionSupported) {
                runNativeSpeechTest();
            } else {
                startFallbackRecording();
            }
        });
        
        // Touch events for mobile devices
        elements.retrySpeechBtn.addEventListener('touchstart', (e) => {
            if (!state.isNativeRecognitionSupported) {
                e.preventDefault();
                startFallbackRecording();
            }
        });
        
        elements.retrySpeechBtn.addEventListener('touchend', (e) => {
            if (!state.isNativeRecognitionSupported && state.mediaRecorder?.state === 'recording') {
                e.preventDefault();
                state.mediaRecorder.stop();
            }
        });

        // Modal handling
        document.querySelector('.close-btn').addEventListener('click', () => showModal(false));
        elements.popupOverlay.addEventListener('click', (e) => {
            if (e.target === elements.popupOverlay) {
                showModal(false);
            }
        });

        // Window events
        window.addEventListener('resize', handleResize);
        window.addEventListener('beforeunload', stopWebcam);
    }

    // ========== INITIALIZE APP ==========
    init();
});
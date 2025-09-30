import os
import re
import tempfile
import traceback
import subprocess
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# audio & models
import soundfile as sf

try:
    from transformers import pipeline
except Exception:
    pipeline = None  # we'll report if it's missing

# Hugging Face API client
try:
    from huggingface_hub import InferenceClient
except ImportError:
    InferenceClient = None

# ---- CONFIG: update ffmpeg_path if different ----
FFMPEG_PATH = r"C:\Users\lexxley\Desktop\ffmpeg-8.0-essentials_build\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"

# load env
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")  # Hugging Face API key (required for cloud translation)

app = Flask(__name__)

# ============== ASR PIPELINE (Whisper) ==============
ASR_MODEL = os.getenv("ASR_MODEL", "openai/whisper-small")  # default: small (works on CPU)
asr_pipeline = None
if pipeline is not None:
    try:
        print(f"Loading ASR pipeline model: {ASR_MODEL} (this may take a while)...")
        asr_pipeline = pipeline("automatic-speech-recognition", model=ASR_MODEL)
        print("✅ ASR pipeline loaded.")
    except Exception as e:
        print("❌ Failed to load ASR pipeline:", e)
        traceback.print_exc()
        asr_pipeline = None
else:
    print("transformers.pipeline not available — install 'transformers' and 'torch'.")

# ============== HUGGING FACE TRANSLATION CLIENT ==============
translator_client = None
if HF_API_KEY and InferenceClient is not None:
    try:
        translator_client = InferenceClient(api_key=HF_API_KEY)
        print("✅ Connected to Hugging Face Inference API.")
    except Exception as e:
        print("❌ Failed to init Hugging Face client:", e)
else:
    print("⚠️ Hugging Face InferenceClient not available or API key missing.")

# --------- Utility functions ----------
def convert_to_wav(input_path, output_path):
    """Convert audio file to WAV using ffmpeg"""
    try:
        subprocess.run(
            [FFMPEG_PATH, "-i", input_path, "-ar", "16000", "-ac", "1", output_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except Exception as e:
        raise RuntimeError(f"ffmpeg conversion failed: {str(e)}")


def generate_health_advice(translated_text: str):
    """Rule-based health advice generator (expanded)"""
    text = translated_text.lower()

    if any(word in text for word in ["fever", "temperature", "hot", "chills"]):
        return "You may have an infection. Rest, drink plenty of fluids, and seek medical attention if the fever is high or persistent.", True

    elif any(word in text for word in ["headache", "migraine"]):
        return "This could be a tension headache or migraine. Rest, drink water, and avoid stress. See a doctor if it becomes severe.", False

    elif any(word in text for word in ["chest pain", "difficulty breathing", "breathless", "tight chest"]):
        return "This may be serious. Please seek emergency medical care immediately!", True

    elif any(word in text for word in ["stomach", "abdominal", "tummy", "belly pain"]):
        return "You may be experiencing a digestive issue. Avoid heavy meals, stay hydrated, and consult a doctor if the pain is severe or persistent.", False

    elif any(word in text for word in ["body pain", "all over my body", "whole body", "aching all over"]):
        return "You may be experiencing body aches. Rest, drink water, and see a doctor if it persists.", False

    elif any(word in text for word in ["cough", "sore throat", "cold", "flu"]):
        return "This may be a respiratory infection. Rest, stay hydrated, and seek medical advice if symptoms worsen.", False

    elif any(word in text for word in ["dizzy", "dizziness", "lightheaded", "faint"]):
        return "Dizziness could be caused by dehydration, low blood sugar, or other issues. Sit down, hydrate, and consult a doctor if it continues.", False

    elif any(word in text for word in ["fatigue", "tired", "weakness"]):
        return "Fatigue may result from stress, poor sleep, or illness. Rest, eat nutritious meals, and see a doctor if it persists.", False

    else:
        return "Monitor your symptoms. If they worsen, consult a healthcare provider.", False


# ============== ROUTES ==============
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    audio_file = request.files["audio"]
    filename = secure_filename(audio_file.filename) or "upload.webm"
    webm_path = None
    wav_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as ta:
            audio_file.save(ta.name)
            webm_path = ta.name

        # Convert webm → wav with ffmpeg
        wav_path = webm_path.replace(".webm", ".wav")
        convert_to_wav(webm_path, wav_path)

        if asr_pipeline is None:
            return jsonify({"error": "ASR model not loaded. Install transformers & torch or set ASR_MODEL env var."}), 500

        print(f"Running ASR on {wav_path} ...")
        result = asr_pipeline(wav_path)
        transcription = (result.get("text") if isinstance(result, dict) else getattr(result, "text", "")) or ""
        transcription = transcription.strip()

        if not transcription:
            return jsonify({"error": "Transcription returned empty text."}), 500

        return jsonify({"transcription": transcription})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

    finally:
        for p in (webm_path, wav_path):
            try:
                if p and os.path.exists(p):
                    os.remove(p)
            except Exception as cleanup_error:
                print("Cleanup error:", cleanup_error)


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "").strip()
    lang = data.get("lang", "en")

    if not text:
        return jsonify({"error": "No text provided."}), 400

    translated_text = text  # fallback: original text

    try:
        if translator_client:
            model_map = {
                "fr": "Helsinki-NLP/opus-mt-fr-en",
                "es": "Helsinki-NLP/opus-mt-es-en",
                "ig": "Helsinki-NLP/opus-mt-ig-en",  # ✅ Igbo
                "yo": "Helsinki-NLP/opus-mt-yo-en",  # ✅ Yoruba
                "ha": "Helsinki-NLP/opus-mt-ha-en",  # ✅ Hausa
                "en": None
            }
            model_id = model_map.get(lang)

            if model_id:
                response = translator_client.post(
                    f"/models/{model_id}",
                    json={"inputs": text}
                )
                if isinstance(response, list) and "translation_text" in response[0]:
                    translated_text = response[0]["translation_text"]
    except Exception as e:
        print("Translation error:", e)

    advice, urgent = generate_health_advice(translated_text)

    return jsonify({
        "translated_text": translated_text,
        "health_advice": advice,
        "urgent": urgent
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "asr_loaded": asr_pipeline is not None})


# ============== RUN SERVER ==============
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

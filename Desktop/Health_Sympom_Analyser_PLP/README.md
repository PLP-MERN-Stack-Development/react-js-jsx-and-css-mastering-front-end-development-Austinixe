🌍 Healthcare Symptom Translator

A Flask web application that helps patients and healthcare providers break language barriers when describing health symptoms.

The app:

🎙️ Converts speech to text (using Whisper ASR).

🌐 Translates symptoms into English (via Hugging Face API).

💡 Provides rule-based health advice for common symptoms.

📱 Works with text or audio input, with a clean web interface.

🚀 Features

Multilingual Input: Supports English, French, Spanish, Igbo, Yoruba, and Hausa.

Voice Support: Record or upload audio files for transcription.

Translation API: Uses Hugging Face models for translation (with safe fallback).

Health Guidance: Generates simple, rule-based advice from translated symptoms.

Responsive UI: Works on desktop and mobile.

Error Handling: Graceful fallback when models or API are unavailable.

🛠️ Tech Stack

Backend: Flask (Python)

AI Models:

Whisper
 for speech recognition

Helsinki-NLP Translation Models
 via Hugging Face Inference API

Frontend: HTML, CSS, JavaScript

Audio Processing: FFmpeg, SoundFile

Environment Config: Python dotenv

📂 Project Structure
project/
│── app.py              # Flask backend
│── templates/
│   └── index.html      # Frontend HTML
│── static/
│   ├── style.css       # Styles
│   └── script.js       # Frontend logic
│── .env                # API keys (ignored in git)
│── requirements.txt    # Dependencies

⚙️ Setup & Installation

Clone the repository

git clone https://github.com/yourusername/healthcare-translator.git
cd healthcare-translator


Create virtual environment (recommended)

python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows


Install dependencies

pip install -r requirements.txt


Install FFmpeg (ensure ffmpeg is installed and path set in app.py).

Set up .env file
Create a .env file in the project root:

HF_API_KEY=your_huggingface_api_key_here
ASR_MODEL=openai/whisper-small


Run the app

python app.py


App will run on: http://127.0.0.1:5000/

🖼️ Screenshots
Translation Page

(User enters or records symptoms, app translates and provides advice)

📝 Original: A na m-enwe mgbu n’ime afọ m
🌍 Translated: I am having stomach pain
💡 Health Advice: Monitor your symptoms. If they worsen, consult a healthcare provider.

🧪 Example Usage

Input (French):

J’ai mal à la tête


Output:

Translated: I have a headache
Advice: This could be a tension headache or migraine. Drink water, rest, and avoid stress.


Input (Igbo):

A na m-enwe mgbu n’ime afọ m


Output:

Translated: I am having stomach pain
Advice: Monitor your symptoms. If they worsen, consult a healthcare provider.

⚠️ Limitations

Translation quality depends on Hugging Face models.

Requires internet for Hugging Face API calls.

Rule-based advice is not a medical diagnosis — consult real healthcare professionals.

📧 Contact

Developer: Augustine Omonakro

📩 Email: lexxley59@gmail.com

🌐 Project for: Power Learn Project (PLP) Final Submission

✨ This project demonstrates applied AI for healthcare accessibility — bridging language gaps between patients and providers.
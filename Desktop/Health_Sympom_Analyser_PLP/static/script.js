// DOM Elements
const translateBtn = document.getElementById("translateBtn");
const clearBtn = document.getElementById("clearBtn");
const userText = document.getElementById("userText");
const languageSelect = document.getElementById("languageSelect");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMsg = document.getElementById("errorMsg");
const chatContainer = document.getElementById("chatContainer");

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingStatus = document.getElementById("recordingStatus");
const audioUpload = document.getElementById("audioUpload");
const audioPlayback = document.getElementById("audioPlayback");

let mediaRecorder;
let audioChunks = [];

// Utility: show/hide loading
function setLoading(state) {
  loadingIndicator.style.display = state ? "block" : "none";
}

// Utility: show error
function showError(message) {
  errorMsg.textContent = message;
  if (message) console.error(message);
}

// Handle translation
translateBtn.addEventListener("click", async () => {
  const text = userText.value.trim();
  const lang = languageSelect.value;

  if (!text) {
    showError("⚠️ Please enter your symptoms first.");
    return;
  }

  showError("");
  setLoading(true);

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang })
    });

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      showError(data.error);
      return;
    }

    // Display results
    chatContainer.innerHTML = `
      <div class="result-block">
        <p><strong>📝 Original:</strong> ${text}</p>
        <p><strong>🌍 Translated:</strong> ${data.translated_text}</p>
        <p><strong>💡 Health Advice:</strong> ${data.health_advice}</p>
        ${data.translated_text === text ? "<p class='warn'>⚠️ Translation not available, showing original text.</p>" : ""}
      </div>
    `;
  } catch (err) {
    setLoading(false);
    showError("❌ Failed to translate. Check your server.");
  }
});

// Handle clear
clearBtn.addEventListener("click", () => {
  userText.value = "";
  chatContainer.innerHTML = "";
  showError("");
});

// Audio recording
recordBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      setLoading(true);
      try {
        const res = await fetch("/transcribe", { method: "POST", body: formData });
        const data = await res.json();
        setLoading(false);

        if (data.error) {
          showError(data.error);
        } else {
          userText.value = data.transcription;
          chatContainer.innerHTML = `<p><strong>🗣️ Transcribed:</strong> ${data.transcription}</p>`;
        }
      } catch (err) {
        setLoading(false);
        showError("❌ Transcription failed.");
      }
    };

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    recordingStatus.textContent = "Recording... 🎙️";
  } catch (err) {
    showError("❌ Microphone access denied.");
  }
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
  recordingStatus.textContent = "Stopped.";
});

// Handle audio upload
audioUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("audio", file);

  setLoading(true);
  try {
    const res = await fetch("/transcribe", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      showError(data.error);
    } else {
      userText.value = data.transcription;
      chatContainer.innerHTML = `<p><strong>🗣️ Transcribed:</strong> ${data.transcription}</p>`;
      audioPlayback.src = URL.createObjectURL(file);
      audioPlayback.style.display = "block";
    }
  } catch (err) {
    setLoading(false);
    showError("❌ Upload failed.");
  }
});

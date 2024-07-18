const startStopBtn = document.getElementById('startStopBtn');
const keepBtn = document.getElementById('keepBtn');
const languageSelect = document.getElementById('languageSelect');
const textInput = document.getElementById('textInput');
const displayText = document.getElementById('displayText');
const speechOutput = document.getElementById('speechOutput');

let recognition;
let isListening = false;
let lines = [];
let currentLineIndex = 0;
let isLineCorrect = false;

//copy text
function copyText() {
    const textToCopy = document.getElementById('textToCopy').innerText;
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
  
    tempTextArea.select();
    document.execCommand('copy');
  
    document.body.removeChild(tempTextArea);
  
    textInput.value = textToCopy;

    const sentences = splitIntoSentences(textInput.value);
    lines = removeSpeakerLabels(sentences);

    currentLineIndex = 0;
    updateDisplayText();
    keepBtn.disabled = false;
}

textInput.addEventListener('input', () => {
    const sentences = splitIntoSentences(textInput.value);
    lines = removeSpeakerLabels(sentences);

    currentLineIndex = 0;
    updateDisplayText();
    keepBtn.disabled = false;
});

function splitIntoSentences(text) {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [];
}

function removeSpeakerLabels(sentences) {
    return sentences.map(sentence => {
        return sentence.replace(/^\s*[A-Z]\s*:\s*/, '').trim();
    });
}

function normalizeText(text) {
    return text.toLowerCase().replace(/[.,?!:"']/g, '').replace(/\s+/g, ' ').trim();
}

function updateDisplayText() {
    if (currentLineIndex < lines.length) {
        displayText.textContent = lines[currentLineIndex];
        displayText.classList.remove('correct-text'); // Remove any existing classes
    } else {
        displayText.textContent = 'All lines have been read.';
        startStopBtn.disabled = true;
        keepBtn.disabled = true;
    }
}

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        startStopBtn.innerHTML = `<span style="color: rgb(255, 0, 0);">Stop</span><span class="material-icons" style="color: rgb(255, 0, 0);">
        mic_external_on
        </span>`;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        const inputText = normalizeText(lines[currentLineIndex]);
        const spokenText = normalizeText(transcript);
        const inputWords = inputText.split(' ');
        const spokenWords = spokenText.split(' ');

        let resultHTML = '';
        isLineCorrect = true; // Assume correct unless proven otherwise

        for (let i = 0; i < inputWords.length; i++) {
            if (spokenWords[i] && spokenWords[i] === inputWords[i]) {
                resultHTML += `<span style="color: green;">${inputWords[i]}</span> `;
            } else {
                isLineCorrect = false;
                resultHTML += `<span style="color: red;">${spokenWords[i] || ''}</span> `;
            }
        }

        speechOutput.innerHTML = resultHTML;

        if (isLineCorrect) {
            currentLineIndex++;
            updateDisplayText();
            speechOutput.innerHTML = '';
            displayText.classList.add('correct-text'); // Add 'correct-text' class for correct display
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        isListening = false;
        startStopBtn.innerHTML = `<span>Start</span><span class="material-icons">
        mic_external_on
        </span>`;
    };
}

startStopBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.lang = languageSelect.value; // Set language based on user selection
        recognition.start();
    }
});

keepBtn.addEventListener('click', () => {
    if (currentLineIndex < lines.length - 1) {
        currentLineIndex++;
        updateDisplayText();
        speechOutput.innerHTML = '';
    }
});

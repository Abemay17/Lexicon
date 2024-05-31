document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle icon classes
    function toggleIcon(button, regularClass, solidClass) {
        const icon = button.querySelector('i');
        if (icon.classList.contains(regularClass)) {
            icon.classList.remove(regularClass);
            icon.classList.add(solidClass);
        } else {
            icon.classList.remove(solidClass);
            icon.classList.add(regularClass);
        }
    }

    // Add event listeners to all bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.bookmark-button');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleIcon(this, 'fa-regular', 'fa-solid');
        });
    });

    // Add event listeners to all like buttons
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleIcon(this, 'fa-regular', 'fa-solid');
        });
    });

    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Create an array to hold recognition instances for each word
        const recognitions = [];
        // Get all word entries
        const wordEntries = document.querySelectorAll('.word-entry'); // Represents each word on the page
        // Variable to track the current word index
        let currentWordIndex = 0;
        let wordsPronouncedCorrectly = 0;

        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const resetButton = document.getElementById('reset-button');

        // Iterate through each word entry on the page
        wordEntries.forEach((entry, index) => {
            // Create a new SpeechRecognition object for each word
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

            // Set language for recognition
            recognition.lang = 'en-US';

            // Add event listener for when speech recognition results are available
            recognition.onresult = function(event) {
                // Retrieve the transcribed speech from the event
                const transcript = event.results[0][0].transcript.trim().toLowerCase();
                // Get the current word being displayed
                const currentWord = entry.querySelector('h2').textContent.trim().toLowerCase();
                // Check if the transcript matches the current word
                if (transcript === currentWord) {
                    // If the user pronounces the word correctly
                    alert('You pronounced it correctly!');
                    updateProgressBar();
                } else {
                    // If the user doesn't pronounce the word correctly
                    alert("Didn't pronounce the word correctly. (" + transcript + ") Try again!");
                }
            };

            // Add recognition instance to the array
            recognitions.push(recognition);

            // Function to start speech recognition for the corresponding word
            entry.querySelector('.btn').addEventListener('click', () => {
                recognitions[index].start();
            });
        });

        // Function to update the progress bar
        function updateProgressBar() {
            wordsPronouncedCorrectly++;
            const progress = (wordsPronouncedCorrectly / wordEntries.length) * 100;
            progressBar.value = progress;
            progressText.textContent = `${Math.round(progress)}%`;

            if (wordsPronouncedCorrectly === wordEntries.length) {
                alert('You finished learning all the words!');
            }
        }

        // Function to reset the progress bar
        function resetProgressBar() {
            wordsPronouncedCorrectly = 0;
            progressBar.value = 0;
            progressText.textContent = '0%';
            currentWordIndex = 0;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Function to scroll to the next word
        function scrollToNextWord() {
            currentWordIndex = (currentWordIndex + 1) % wordEntries.length;
            const nextWordEntry = wordEntries[currentWordIndex];
            const offset = -100; // Adjust this value as needed to align properly
            const elementPosition = nextWordEntry.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition + offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Add event listener to the next word button
        document.querySelectorAll('#next-word-button').forEach(button => {
            button.addEventListener('click', scrollToNextWord);
        });

        // Add event listener to the reset button
        resetButton.addEventListener('click', resetProgressBar);
    }
});

function searchWord() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const wordEntries = document.querySelectorAll('.word-entry');
    let found = false;

    wordEntries.forEach(entry => {
        const word = entry.querySelector('h2').innerText.toLowerCase();
        if (word.includes(searchTerm)) {
            entry.scrollIntoView({ behavior: 'smooth' });
            found = true;
        }
    });

    if (!found) {
        alert('No searches found');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Function to open the modal
    function openAddWordModal() {
        document.getElementById('add-word-modal').style.display = 'block';
    }

    // Function to close the modal
    function closeAddWordModal() {
        document.getElementById('add-word-modal').style.display = 'none';
    }

    // Attach the open modal function to the button
    document.getElementById('add-word-button').onclick = openAddWordModal;

    // Function to handle the form submission
    document.getElementById('add-word-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const word = document.getElementById('word').value;
        const pronunciation = document.getElementById('pronunciation').value;
        const definition = document.getElementById('definition').value;
        const sentence = document.getElementById('sentence').value;

        // Create a new word element with the same structure and classes
        const wordEntry = document.createElement('div');
        wordEntry.className = 'word-entry';
        wordEntry.innerHTML = `
            <div id="word-container">
                <h2>
                    <button class="btn" onclick="startRecognition()">
                        <i class="fa-solid fa-microphone"></i>
                    </button> ${word}
                </h2>
            </div>
            <audio id="audio-${word.toLowerCase()}" src="${word.toLowerCase()}.mp3"></audio>
            <h3>
                <button class="icon-button" onclick="document.getElementById('audio-${word.toLowerCase()}').play()">
                    <i class="fa-solid fa-volume-high"></i>
                </button> ${pronunciation}
            </h3>
            <h3>(adj.) ${definition}</h3>
            <p>(${sentence})</p>
            <button id="next-word-button"><i class="fa-solid fa-angle-down"></i></button>
            <div class="action-buttons">
                <button class="bookmark-button"><i class="fa-regular fa-bookmark"></i></button>
                <button class="like-button" onclick="likeWord('${word}')"><i class="fa-regular fa-heart"></i></button>
            </div>
        `;

        // Append the new word to the words container
        const wordsContainer = document.getElementById('words-container');
        if (wordsContainer) {
            wordsContainer.appendChild(wordEntry);
        } else {
            console.error('words-container element not found');
        }

        // Clear the form
        document.getElementById('add-word-form').reset();

        // Close the modal
        closeAddWordModal();
    });

    // Close the modal when the user clicks outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('add-word-modal');
        if (event.target === modal) {
            closeAddWordModal();
        }
    };
});

// Function to start recognition (Replace with actual implementation)
function startRecognition() {
    console.log('Start recognition');
}


// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to all like and bookmark buttons
    const likeButtons = document.querySelectorAll('.like-button');
    const bookmarkButtons = document.querySelectorAll('.bookmark-button');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const word = button.closest('.word-entry').getAttribute('data-word');
            addToList('liked-words-list', word);
        });
    });

    bookmarkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const word = button.closest('.word-entry').getAttribute('data-word');
            addToList('bookmarked-words-list', word);
        });
    });

    function addToList(listId, word) {
        const list = document.getElementById(listId);
        const listItem = document.createElement('li');
        listItem.textContent = word;
        list.appendChild(listItem);
    }
});

function likeWord(word) {
    addToList('liked-words-list', word);
}

function bookmarkWord(word) {
    addToList('bookmarked-words-list', word);
}


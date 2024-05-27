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


let likedWords = [];

function likeWord(word) {
    if (!likedWords.includes(word)) {
        likedWords.push(word);
    }
}

function showLikedWords() {
    const dropdownContent = document.getElementById('liked-words-dropdown');
    dropdownContent.innerHTML = '';

    likedWords.forEach(word => {
        const listItem = document.createElement('div');
        listItem.textContent = word;
        dropdownContent.appendChild(listItem);
    });
}
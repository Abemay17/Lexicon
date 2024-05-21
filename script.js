// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create an array to hold recognition instances for each word
    const recognitions = [];
    // Get all word entries
    const wordEntries = document.querySelectorAll('.word-entry'); //Represents each word on the page
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

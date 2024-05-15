// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create an array to hold recognition instances for each word
    const recognitions = [];
    // Get all word entries
    const wordEntries = document.querySelectorAll('.word-entry');
    // Variable to track the current word index
    let currentWordIndex = 0;

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

    // Function to scroll to the next word
    function scrollToNextWord() {
        currentWordIndex = (currentWordIndex + 1) % wordEntries.length;
        const nextWordEntry = wordEntries[currentWordIndex];
        const offset = -3000; // Adjust this value as needed to align properly
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
}

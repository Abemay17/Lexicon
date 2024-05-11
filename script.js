// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create an array to hold recognition instances for each word
    const recognitions = [];

    // Iterate through each word entry on the page
    document.querySelectorAll('.word-entry').forEach((entry, index) => {
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
}

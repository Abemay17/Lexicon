  // Check if the browser supports the Web Speech API
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Add event listener for when speech recognition results are available
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        // Display the transcribed speech in a text box or alert
        alert('You said: ' + transcript);
    };

    // Function to start speech recognition
    function startRecognition() {
        recognition.start();
    }
}
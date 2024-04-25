// Wait for the DOM content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the input field, button, and feedback container
    const guessInput = document.getElementById('guess-letter-input');
    const guessButton = document.getElementById('guess-button');
    const feedbackContainer = document.getElementById('feedback-container');

    // Define the correct word and initialize variables
    const correctWord = "TENACIOUS";
    let remainingGuesses = 6;
    let guessedLetters = [];

    // Add event listener to the guess button
    guessButton.addEventListener('click', function () {
        // Get the guessed letter from the input field
        const guessedLetter = guessInput.value.toUpperCase();

        // Clear the input field
        guessInput.value = '';

        // Check if the guessed letter has already been guessed
        if (guessedLetters.includes(guessedLetter)) {
            displayFeedback("You already guessed this letter.", "warning");
            return;
        }

        // Add the guessed letter to the list of guessed letters
        guessedLetters.push(guessedLetter);

        // Check if the guessed letter is correct
        if (correctWord.includes(guessedLetter)) {
            // Display feedback for correct guess
            displayFeedback(`Correct guess: ${guessedLetter}`, "success");
        } else {
            // Display feedback for incorrect guess
            remainingGuesses--;
            displayFeedback(`Incorrect guess: ${guessedLetter}`, "error");
            displayFeedback(`Remaining guesses: ${remainingGuesses}`, "info");
        }

        // Check if the user has won or lost
        if (remainingGuesses === 0) {
            endGame("You ran out of guesses! The word was TENACIOUS.");
        } else if (isWordGuessed()) {
            endGame("Congratulations! You guessed the word TENACIOUS!");
        }
    });

    // Function to display feedback to the user
    function displayFeedback(message, type) {
        const feedbackMessage = document.createElement('p');
        feedbackMessage.textContent = message;
        feedbackMessage.classList.add(type);
        feedbackContainer.appendChild(feedbackMessage);
    }

    // Function to check if the word has been fully guessed
    function isWordGuessed() {
        return correctWord.split('').every(letter => guessedLetters.includes(letter));
    }

    // Function to end the game
    function endGame(message) {
        displayFeedback(message, "result");
        // Disable the input field and button to prevent further guesses
        guessInput.disabled = true;
        guessButton.disabled = true;
    }
});

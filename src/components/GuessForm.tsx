import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';

interface GuessFormProps {
  currentGuess: string;
  setCurrentGuess: React.Dispatch<React.SetStateAction<string>>;
  onGuess: () => void;
  gameOver: boolean;
  gameStarted: boolean;
  onSubmit: () => void; 
}

const GuessForm: React.FC<GuessFormProps> = ({
  currentGuess,
  setCurrentGuess,
  onGuess,
  gameOver,
  gameStarted,
  onSubmit,
}) => {
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValidInput = /^\d{0,5}$/.test(value);
  
    setCurrentGuess(value);
    setIsValid(isValidInput);
  
    // Prevent default form submission when Enter is pressed
    /*if (value.length === 5) {
      event.preventDefault();
    }*/
  };  

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid && !gameOver && gameStarted) {
      onGuess();
      setCurrentGuess(''); // Clear the input field after submission
    }
  };

  // Focus on the input field when 'New Game' is pressed and the game has started
  /*useEffect(() => {
    if (gameStarted && !gameOver) {
      const inputElement = document.getElementById('guess-input') as HTMLInputElement | null;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [gameStarted, gameOver]);*/

  return (
    <form onSubmit={handleSubmit}>
      <input
        className=''
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        placeholder="Enter your guess"
        disabled={!gameStarted || gameOver}
      />
      <button className='new-game-button' id='guess-btn' type="submit" disabled={!isValid || gameOver || !gameStarted}>
        Guess
      </button>
      <button type="submit" style={{ display: 'none' }} tabIndex={-1}>
        Submit
      </button>
    </form>
  );
};

export default GuessForm;

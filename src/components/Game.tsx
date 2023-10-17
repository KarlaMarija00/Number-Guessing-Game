import React, { useState, useEffect } from 'react';
import { auth, getUserProfile, db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import '../styles.css';
import GuessForm from './GuessForm';
import ScoreTable from './ScoreTable';

const NUM_DIGITS = 5;

interface Guess {
  guess: string;
  cdcps: number;
  cdwps: number;
  score: number;
}

function Game() {

  function generateSecretNumber() {
    let number = '';
    for (let i = 0; i < NUM_DIGITS; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  }

  const [secretNumber, setSecretNumber] = useState(generateSecretNumber());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [bestTime, setBestTime] = useState(0);

  useEffect(() => {
    if (auth.currentUser) {
      getUserProfile(auth.currentUser.uid)
        .then((userData) => {
          if (userData && userData.highScore) {
            setHighScore(userData.highScore);
          }
          if (userData && userData.bestTime) {
            setBestTime(userData.bestTime);
          }
        })
        .catch((error) => {
          console.error('Error getting user profile:', error);
        });
    }
  }, []);

  useEffect(() => {
    setSecretNumber(generateSecretNumber());
  }, []);

  useEffect(() => {
    if (!gameOver) {
      setSecretNumber(generateSecretNumber());
    }
  }, [gameOver]);

  const startNewGame = () => {
    setSecretNumber(generateSecretNumber());
    setGuesses([]);
    setCurrentScore(0);
    setCurrentGuess('');
    alert('Good luck!');
    setGameOver(false);
    setGameStarted(true);
    setTimeRemaining(0);
    startTimer();
  };

  console.log(secretNumber);

  const startTimer = () => {
    clearInterval(timerInterval!);
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handleSubmit = () => {
    if (currentGuess.length === NUM_DIGITS && /^\d+$/.test(currentGuess) && !gameOver) {
      handleGuess();
    }
  };  

  useEffect(() => {
    if (!gameOver && gameStarted) {
      startTimer();
    } else if (gameOver) {
      clearInterval(timerInterval!);
    }
  }, [gameOver, gameStarted]);

  const calculateScore = (cdcps: number, cdwps: number, numGuesses: number) => {
    const pointsCDCP = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 500];
    const pointsCDWP = [2000, 1875, 1750, 1625, 1500, 1375, 1250, 1125, 1000, 875, 750, 625, 500, 375, 250, 125];

    return cdcps * pointsCDCP[numGuesses] + cdwps * pointsCDWP[numGuesses];
  };

  const calculateCDCP = (secret: string, guess: string) => {
    let count = 0;
    for (let i = 0; i < NUM_DIGITS; i++) {
      if (secret[i] === guess[i]) {
        count++;
      }
    }
    return count;
  };

  const calculateCDWP = (secret: string, guess: string) => {
    let count = 0;
    let secretCopy = secret.split('');
    let guessCopy = guess.split('');

    for (let i = 0; i < NUM_DIGITS; i++) {
      if (secretCopy[i] === guessCopy[i]) {
        secretCopy[i] = guessCopy[i] = 'X';
      }
    }

    for (let i = 0; i < NUM_DIGITS; i++) {
      if (secretCopy[i] !== 'X' && guessCopy.includes(secretCopy[i])) {
        guessCopy[guessCopy.indexOf(secretCopy[i])] = 'X';
        count++;
      }
    }

    return count;
  };

  const handleGameOver = (finalScore: number, elapsedTime: number) => {
    
    if (auth.currentUser) {
      if (finalScore > highScore) {
        // Update the high score state
        setHighScore(finalScore);
  
        // Update the high score in Firestore
        const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
        setDoc(userRef, { highScore: finalScore }, { merge: true })
          .then(() => {
            console.log('High score updated in Firestore');
          })
          .catch((error) => {
            console.error('Error updating high score in Firestore:', error);
          });
      }

      if (elapsedTime < bestTime || bestTime === 0) {
        setBestTime(elapsedTime);

        const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
        setDoc(userRef, { bestTime: elapsedTime }, { merge: true })
          .then(() => {
            console.log('Best time updated in Firestore');
          })
          .catch((error) => {
            console.error('Error updating best time in Firestore:', error);
          });
      }
    }
  };
  
  const handleGuess = () => {
    if (currentGuess.length !== NUM_DIGITS || !/^\d+$/.test(currentGuess)) {
      alert('Please enter a valid 5-digit number.');
      return;
    }
  
    const cdcps = calculateCDCP(secretNumber, currentGuess);
    const cdwps = calculateCDWP(secretNumber, currentGuess);
    const numGuesses = guesses.length;
    const score = calculateScore(cdcps, cdwps, numGuesses);
  
    const updatedGuesses = [
      ...guesses,
      {
        guess: currentGuess,
        cdcps: cdcps,
        cdwps: cdwps,
        score: score,
      },
    ];
  
    setGuesses(updatedGuesses);
    setCurrentScore(score);
    setCurrentGuess('');
    
    if (currentGuess === secretNumber || numGuesses >= 14) {
      setGameOver(true);
      clearInterval(timerInterval!);
      if (currentGuess === secretNumber) {
        alert(`Congratulations! You guessed the secret number in ${numGuesses + 1} tries.`);
        handleGameOver(score, timeRemaining); // Pass both score and timeRemaining
      } else {
        alert(`Game over! The secret number was ${secretNumber}.`);
        handleGameOver(score, 0); // Pass both 0 and timeRemaining
      }      
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="game-container">
      <button className="new-game-button" onClick={startNewGame}>
        New Game
      </button>
      <div className='game-fixed'>
        <div className="game-content" id='game-fixed'>
          <div className="game-info">
            <p className="best-time">Best Time: {formatTime(bestTime)} | High Score: {highScore}</p>
            <p className="current-score">Current Score: {currentScore}</p>
            <p className="time-remaining">Elapsed Time: {formatTime(timeRemaining)}</p>
          </div>
          <GuessForm
            currentGuess={currentGuess}
            setCurrentGuess={setCurrentGuess}
            onGuess={handleGuess}
            gameOver={gameOver}
            gameStarted={gameStarted}
            onSubmit={handleSubmit}
          />
          <ScoreTable guesses={guesses} />
        </div>
      </div>
    </div>
  );
}

export default Game;

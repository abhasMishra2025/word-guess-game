'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';


const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


const WordGame = () => {
  const words = ['INNOVATE', 'DYNAMIC', 'ADVENTURE', 'KNOWLEDGE', 'STRATEGY'];


  // variables
  const [word, setWord] = useState<string>('');
  const [displayWord, setDisplayWord] = useState<string>('');
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [hint, setHint] = useState<string>('');
  const [gametracker, setGametracker] = useState<'win' | 'fail' | null>(null);


  // random word generate from user
  useEffect(() => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setDisplayWord('_'.repeat(newWord.length));
  }, []); // Run this only once when the component mounts on the client


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setIsGameActive(false);
      setGametracker('fail');
    }
    return () => clearInterval(interval);
  }, [isGameActive, timer]);


  const handleLetterClick = (letter: string) => {
    if (!isGameActive || incorrectGuesses.includes(letter) || displayWord.includes(letter)) return;


    if (word.includes(letter)) {
      const newDisplay = word
        .split('')
        .map((char, idx) => (char === letter ? letter : displayWord[idx]))
        .join('');
      setDisplayWord(newDisplay);
      if (newDisplay === word) {
        setScore(score + 1);
        setGametracker('win');
        setIsGameActive(false);
      }
    } else {
      setIncorrectGuesses([...incorrectGuesses, letter]);
    }
  };


  const startGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setDisplayWord('_'.repeat(newWord.length));
    setIncorrectGuesses([]);
    setTimer(60);
    setIsGameActive(true);
    setGametracker(null);
    setHint('');
  };


  const resetGame = () => {
    setDisplayWord('_'.repeat(word.length));
    setIncorrectGuesses([]);
    setTimer(60);
    setIsGameActive(false);
    setScore(0);
    setGametracker(null);
    setHint('');
  };


  const showHint = () => {
    const vowels = word.split('').filter((char) => 'AEIOU'.includes(char));
    setHint(
      `The word starts with '${word[0]}', ends with '${word[word.length - 1]}', and contains ${vowels.length} vowel(s).`
    );
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Word Challenge</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-2xl font-mono tracking-widest mb-4">{displayWord.split('').join(' ')}</p>
          <div className="grid grid-cols-7 gap-2">
            {ALPHABET.map((letter) => (
              <Button
                key={letter}
                className={`w-10 h-10 ${incorrectGuesses.includes(letter) ? 'bg-red-500' : ''}`}
                onClick={() => handleLetterClick(letter)}
                disabled={!isGameActive}
              >
                {letter}
              </Button>
            ))}
          </div>
          <Button onClick={startGame} className="mt-4 w-full" disabled={isGameActive}>
            Start New Game
          </Button>
          <Button onClick={resetGame} className="mt-2 w-full" variant="destructive">
            Reset Game
          </Button>
          <Button onClick={showHint} className="mt-2 w-full" variant="outline">
            Get Hint
          </Button>
          <p className="mt-4 text-blue-600">{hint}</p>
          <p className="mt-4 font-semibold">Score: {score}</p>
          <p className="font-semibold">Time Left: {timer} sec</p>
          <Progress value={(timer / 60) * 100} className="mt-4 w-full" />
        </CardContent>
      </Card>


      {gametracker && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {gametracker === 'win' ? 'Congratulations, You Won the game!' : 'You Lost game!'}
            </h2>
            <p className="mb-4">{gametracker === 'win' ? 'Correct guess!' : 'Try again soon!'}</p>
            <Button
              onClick={() => {
                setGametracker(null);
                startGame();
              }}
              className="w-full mt-4"
            >
              Play Again
            </Button>
            <Button
              onClick={resetGame}
              variant="destructive"
              className="w-full mt-2"
            >
              Reset Game
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


export default WordGame;

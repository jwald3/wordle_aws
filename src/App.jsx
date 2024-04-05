import React, { useState } from "react";
import "./App.css";
import AlphabetContainer from "./components/AlphabetContainer";
import GuessContainer from "./components/GuessContainer";
import axios from "axios";
import { useEffect } from "react";

function App() {
    const [gameId, setGameId] = useState("");
    const [letterCount, setLetterCount] = useState(5); // Default to 5 letters
    const [hardMode, setHardMode] = useState(false); // Default to easy mode
    const [guesses, setGuesses] = useState([]);
    const [letters, setLetters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentGuess, setCurrentGuess] = useState("");
    const [answer, setAnswer] = useState("");
    
    useEffect(() => {
        getGameState(gameId);
    }, [gameId]);
    
    const newGame = async (letterCount, hardMode) => {
        const url = "http://localhost:5000/wordle";
        setAnswer(""); // Reset answer before making a new request  
        setErrorMessage(""); // Reset error message before making a new request

        try {
            const response = await axios.post(url, { letter_count: parseInt(letterCount), hard_mode: hardMode });

            if (response.status === 200) {
                setGameId(response.data.game_id);
            } else {
                setErrorMessage("Failed to create a new game");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    }
    
    const handleGuess = async (guess, game_id) => {
        const url = `http://localhost:5000/wordle/${game_id}/guess`;
        setErrorMessage(""); // Reset error message before making a new request
    
        try {
            const response = await axios.post(url, { guess: guess });
            if (response.status === 200) {
                // re-fetch the game state
                getGameState(game_id);
                setCurrentGuess(""); // Clear the input field on successful guess
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    }
    
    const getGameState = async (game_id) => {
        const url = `http://localhost:5000/wordle/${game_id}`;
        setErrorMessage(""); // Reset error message before making a new request
    
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const data = response.data;

                console.log(data)

                setGuesses(data.guesses_formatted);
                setLetters(data.letter_bank);
                setLetterCount(data.letter_count);

                // if the game is over, set the answer
                if (data.game_over) {
                    setAnswer(data.solution);
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <div className="new-game-dashboard" style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",

            }}>
                <label htmlFor="letter-count">Number of letters:</label>
                <input
                    type="number"
                    id="letter-count"
                    value={letterCount}
                    min="5"
                    max="8"
                    onChange={(e) => setLetterCount(e.target.value)}
                />
                <label htmlFor="hard-mode">Hard mode:</label>
                <input
                    type="checkbox"
                    id="hard-mode"
                    checked={hardMode}
                    onChange={(e) => setHardMode(e.target.checked)}
                />
                <button onClick={() => newGame(letterCount, hardMode)}>New Game</button>
            </div>
            <div className="text-input">
                <input type="text" placeholder="Enter a word" value={currentGuess} onChange={(e) => setCurrentGuess(e.target.value)}/>
                <button onClick={() => handleGuess(currentGuess, gameId)}>
                    Submit
                </button>
            </div>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <GuessContainer number_of_letters={letterCount} guesses={guesses} />
            {answer && <div className="answer">The answer was: {answer}</div>}
            <AlphabetContainer letters={letters} />
        </div>
    );
}

export default App;

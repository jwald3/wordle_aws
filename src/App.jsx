import React, { useState } from "react";
import "./App.css";
import AlphabetContainer from "./components/AlphabetContainer";
import GuessContainer from "./components/GuessContainer";
import FlagIcon from "@mui/icons-material/Flag";
import axios from "axios";
import { useEffect } from "react";
import { getToken, saveToken, removeToken } from "./utils/tokenService"; // Utilities to manage tokens
import AuthForm from "./components/AuthForm";

function App() {
    const [gameId, setGameId] = useState("");
    const [letterCountField, setLetterCountField] = useState(5);
    const [letterCount, setLetterCount] = useState(5); // Default to 5 letters
    const [hardModeField, setHardModeField] = useState(false);
    const [hardMode, setHardMode] = useState(false); // Default to easy mode
    const [guesses, setGuesses] = useState([]);
    const [letters, setLetters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentGuess, setCurrentGuess] = useState("");
    const [answer, setAnswer] = useState("");
    const [gameOver, setGameOver] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const apiUrl = "https://chimpcodes.pythonanywhere.com/wordle"
    // const apiUrl = "http://127.0.0.1:5000";

    useEffect(() => {
        getGameState(gameId);
    }, [gameId]);

    const handleLogin = (token) => {
        saveToken(token); // Save the token using your utility function
        setIsAuthenticated(true); // Update your authentication state
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}/login`, {
                username,
                password,
            });
            if (response.status === 200 && response.data.token) {
                saveToken(response.data.token); // Save the token using your utility function
                // Optionally, set state here if you need the token in your components
            }
        } catch (error) {
            console.error("Login failed: ", error);
            // Handle login error
        }
    };

    const newGame = async () => {
        const url = `${apiUrl}/wordle`; // Ensure this is the correct endpoint
        setAnswer("");
        setErrorMessage("");

        const letterCountToSend = parseInt(letterCountField); // Use local variable for request
        const hardModeToSend = hardModeField; // Use local variable for request

        try {
            const response = await axios.post(
                url,
                { letter_count: letterCountToSend, hard_mode: hardModeToSend },
                {
                    headers: {
                        "Content-Type": "application/json", // Also, it should be 'Content-Type', not 'ContentType'
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setGameId(response.data.game_id);
            setLetterCount(letterCountToSend);
            setHardMode(hardModeToSend);
        } catch (error) {
            console.error("Error while creating a new game:", error);
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const handleGuess = async (guess, game_id) => {
        const url = `${apiUrl}/wordle/${game_id}/guess`;
        setErrorMessage(""); // Reset error message before making a new request

        try {
            const dataToSend = { guess: guess };
            const response = await axios.post(url, dataToSend, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.status === 200) {
                // re-fetch the game state
                getGameState(game_id);
                setCurrentGuess(""); // Clear the input field on successful guess
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const surrenderGame = async (game_id) => {
        const url = `${apiUrl}/wordle/${game_id}/surrender`;
        setErrorMessage(""); // Reset error message before making a new request

        try {
            const response = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (response.status === 200) {
                // re-fetch the game state
                getGameState(game_id);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const getGameState = async (game_id) => {
        const url = `${apiUrl}/wordle/${game_id}`;
        setErrorMessage(""); // Reset error message before making a new request

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;

                setGuesses(data.guesses_formatted);
                setLetters(data.letter_bank);
                setLetterCount(data.letter_count);
                setGameOver(data.game_over);

                // if the game is over, set the answer
                if (data.game_over) {
                    setAnswer(data.solution);
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const getAllGames = async () => {
        const url = apiUrl + "wordle";
        setErrorMessage(""); // Reset error message before making a new request

        try {
            const response = await makeAuthenticatedRequest("get", url);
            if (response.status === 200) {
                console.log(response.data);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <div>
            {!isAuthenticated ? (
                <AuthForm onLogin={handleLogin} />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <div
                        className="new-game-dashboard"
                        style={{
                            display: "flex",
                            gap: "20px",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <label htmlFor="letter-count">Number of letters:</label>
                        <input
                            type="number"
                            id="letter-count"
                            value={letterCountField}
                            min="5"
                            max="8"
                            onChange={(e) =>
                                setLetterCountField(e.target.value)
                            }
                        />
                        <label htmlFor="hard-mode">Hard mode:</label>
                        <input
                            type="checkbox"
                            id="hard-mode"
                            checked={hardModeField}
                            onChange={(e) => setHardModeField(e.target.checked)}
                        />
                        <button onClick={() => newGame()}>New Game</button>
                    </div>
                    {gameId && (
                        <>
                            <div
                                className="text-input"
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                    width: "100%",
                                    height: "50px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter a word"
                                    value={currentGuess}
                                    onChange={(e) =>
                                        setCurrentGuess(e.target.value)
                                    }
                                    disabled={gameOver}
                                />
                                <button
                                    onClick={() =>
                                        handleGuess(currentGuess, gameId)
                                    }
                                    disabled={gameOver}
                                >
                                    Submit
                                </button>
                                {/* Flag icon button to surrender */}
                                <button
                                    onClick={() => surrenderGame(gameId)}
                                    disabled={gameOver}
                                >
                                    <FlagIcon />
                                </button>
                            </div>
                            {errorMessage && (
                                <div className="error">{errorMessage}</div>
                            )}
                            <GuessContainer
                                number_of_letters={letterCount}
                                guesses={guesses}
                                gameOver={gameOver}
                            />
                            {answer && (
                                <div className="answer">
                                    The answer was: {answer}
                                </div>
                            )}
                            <AlphabetContainer letters={letters} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

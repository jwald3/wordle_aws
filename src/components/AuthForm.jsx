// AuthForm.js
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AuthForm = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://127.0.0.1:5000/${isLogin ? "login" : "register"}`;
        try {
            const response = await axios.post(url, {
                username,
                password,
            });
            if (response.data.token) {
                onLogin(response.data.token);
            } else {
                console.error("Authentication failed.");
            }
        } catch (error) {
            console.error(
                "Error during authentication:",
                error.response?.data?.message || error.message
            );
        }
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need to register?" : "Already have an account?"}
            </button>
        </div>
    );
};

AuthForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default AuthForm;

import PropTypes from "prop-types";
import GuessLetterTray from "./GuessLetterTray";

const GuessContainer = ({ number_of_letters, guesses }) => {
    // there will be (number_of_letters + 1) GuessLetterTray components. Guesses is an array of arrays of objects that'll be used to populate the GuessLetterTray components.
    // Not every GuessLetterTray will be populated with guesses. Some will be empty.

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
            }}
        >
            {Array(number_of_letters + 1)
                .fill()
                .map((_, index) => {
                    return (
                        <GuessLetterTray
                            key={index}
                            number_of_letters={number_of_letters}
                            guess={guesses[index] || []}
                        />
                    );
                })}
        </div>
    );
};

GuessContainer.propTypes = {
    number_of_letters: PropTypes.number.isRequired,
    guesses: PropTypes.arrayOf(
        PropTypes.shape({
            correct_position: PropTypes.bool.isRequired,
            in_solution: PropTypes.bool.isRequired,
            letter: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default GuessContainer;

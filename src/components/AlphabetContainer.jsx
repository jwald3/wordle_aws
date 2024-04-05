import PropTypes from "prop-types";
import AlphabetTile from "./AlphabetTile";
import "./AlphabetContainer.css";

const parseLetterForClass = (letter) => {
    if (letter.in_position) {
        return "in_position";
    } else if (letter.in_solution) {
        return "in_solution";
    } else {
        if (letter.used) {
            return "not_in_solution";
        } else {
            return "unused";
        }
    }
};

const AlphabetContainer = ({ letters }) => {
    return (
        <div className="alphabet-tray">
            <div className="row-1">
                {letters.slice(0, 9).map((letter, index) => (
                    <AlphabetTile
                        key={index}
                        letterValue={letter.letter}
                        status={parseLetterForClass(letter)}
                    />
                ))}
            </div>
            <div className="row-2">
                {letters.slice(9, 17).map((letter, index) => (
                    <AlphabetTile
                        key={index}
                        letterValue={letter.letter}
                        status={parseLetterForClass(letter)}
                    />
                ))}
            </div>
            <div className="row-3">
                {letters.slice(17, 26).map((letter, index) => (
                    <AlphabetTile
                        key={index}
                        letterValue={letter.letter}
                        status={parseLetterForClass(letter)}
                    />
                ))}
            </div>
        </div>
    );
};

AlphabetContainer.PropTypes = {
    letters: PropTypes.arrayOf(
        PropTypes.shape({
            in_solution: PropTypes.bool,
            letter: PropTypes.string,
            used: PropTypes.bool,
        })
    ).isRequired,
};

export default AlphabetContainer;

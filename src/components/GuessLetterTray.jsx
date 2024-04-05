import PropTypes from 'prop-types';
import './GuessLetterTray.css';
import AlphabetTile from './AlphabetTile';

const GuessLetterTray = ({ number_of_letters, guess }) => {
    return (
        // a container that contains a word guessed by the player
        <div className="guess-letter-tray">
            {guess.map((letter, index) => {
                let status;
                if (letter.correct_position) {
                    status = "in_position";
                } else if (letter.in_solution) {
                    status = "in_solution";
                } else {
                    status = "not_in_solution";
                }
                return <AlphabetTile key={index} letterValue={letter.letter} status={status} />;
            })}
            {Array(number_of_letters - guess.length).fill().map((_, index) => (
                <AlphabetTile key={index} letterValue="" status="empty" />
            ))}
        </div>
    )
}

GuessLetterTray.propTypes = {
    number_of_letters: PropTypes.number.isRequired,
    guess: PropTypes.arrayOf(PropTypes.shape({
        correct_position: PropTypes.bool.isRequired,
        in_solution: PropTypes.bool.isRequired,
        letter: PropTypes.string.isRequired
    })).isRequired
}

export default GuessLetterTray
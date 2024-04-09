import PropTypes from 'prop-types';
import './AlphabetTile.css';

const AlphabetTile = ({ letterValue, status}) => {
    // status can be unused, used, in_solution, or correct_position. Switch statement to determine the class name
    let className = "";

    switch (status) {
        case "not_in_solution":
            className = "not_in_solution";
            break;
        case "in_solution":
            className = "in_solution";
            break;
        case "in_position":
            className = "in_position";
            break;
        case "empty":
            className = "empty";
            break;
        case "passed":
            className = "passed";
            break;
        default:
            break;
    }
    
    return (
        // the class should be a tile with a letter value and a status
        <div className={`tile ${className}`}>
            {letterValue}
        </div>
    )
}

AlphabetTile.propTypes = {
    letterValue: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
}

export default AlphabetTile
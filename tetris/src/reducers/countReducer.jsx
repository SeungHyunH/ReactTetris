// Define the initial state
const initialState = {
    color: 'black',
    number: 0
};

function counter(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'INCREMENT': 
            return {
                ...state,
                number: state.number + 1
            };
        case 'DECREMENT':
            return {
                ...state,
                number: state.number - 1
            };
        case 'SET_COLOR':
            return {
                ...state,
                color: action.color
            };
        default:
            return state;
    }
};

export default counter;
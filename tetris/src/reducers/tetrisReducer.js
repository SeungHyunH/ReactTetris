// Define the initial state
const initialState = {
    board: Array.from(Array(10),()=>Array(20).fill(false)),
    pos : [0,0]
};

function tetrisFunc(state = initialState, action) {
    switch (action.type) {
        case 'MOVE_LEFT': 
            return {
                ...state,
                pos: [state.pos[0] - 1,state.pos[1]]
            };
        case 'MOVE_RIGHT':
            return {
                ...state,
                pos: [state.pos[0] + 1,state.pos[1]]
            };
        case 'MOVE_UP': 
            return {
                ...state,
                pos: [state.pos[0],state.pos[1] - 1]
            };
        case 'MOVE_DOWN':
            return {
                ...state,
                pos: [state.pos[0],state.pos[1] + 1]
            };

        case 'SET_BOARD':
                return {
                    ...state,
                    board: action.board
                };
                
        case 'SET_POS':
            return {
                ...state,
                pos: action.pos
            };

        default:
            return state;
    }
};

export default tetrisFunc;
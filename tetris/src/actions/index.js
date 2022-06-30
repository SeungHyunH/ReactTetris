import * as types from "./ActionTypes";
export const moveLeft = () => ({
	type: types.MOVE_LEFT,
});
export const moveRight = () => ({
	type: types.MOVE_RIGHT,
});

export const moveUp = () => ({
	type: types.MOVE_UP,
});

export const moveDown = () => ({
	type: types.MOVE_DOWN,
});

export const setBoard = (board) => ({
	type: types.SET_BOARD,
	board
});

export const setPos = (pos) => ({
	type: types.SET_POS,
	pos
});
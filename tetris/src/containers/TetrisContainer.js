import Board from "../components/Board";
import * as actions from "../actions";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    board: state.board,
    pos: state.pos,
});

const mapDispatchToProps = (dispatch) => ({
    onMoveLeft: () => dispatch(actions.moveLeft()),
    onMoveRight: () => dispatch(actions.moveRight()),
    onMoveUp: () => dispatch(actions.moveUp()),
    onMoveDown: () => dispatch(actions.moveDown()),
    onSetBoard: (board) => {
        dispatch(actions.setBoard(board));
    },
    onSetPos: (pos) => {
        dispatch(actions.setPos(pos));
    },
});

const TetrisContainer = connect(mapStateToProps, mapDispatchToProps)(Board);

export default TetrisContainer;
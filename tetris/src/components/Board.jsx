import React, {useRef,useEffect} from 'react';
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from 'styled-components';
import { moveDown } from '../actions';

const Board = ({onMoveLeft,onMoveRight,onMoveUp,onMoveDown,onSetBoard,onSetPos}) => {
    const canvas = useRef(null);
    const CANVAS_WIDTH = document.documentElement.clientWidth/4;
    const CANVAS_HEIGHT = document.documentElement.clientWidth/2;
    const BLOCK_SIZE = CANVAS_WIDTH/10;
    const pos = useSelector((state) => state.tetrisFunc.pos);
    const board = useSelector((state) => state.tetrisFunc.board);
    const time = useRef({start: 0, elapsed: 0, level: 1000});
    function CanvasInit(){
        const ctx = canvas.current.getContext("2d");
        ctx.canvas.width = CANVAS_WIDTH+1;
        ctx.canvas.height = CANVAS_HEIGHT+1;
        ctx.lineWidth=1;
        ctx.strokeStyle='#000000';
        ctx.fillStyle='#FFFFFF';
        for(let i = 0; i < 10 ; i++){
            for(let j = 0; j < 20; j++){
                ctx.fillRect(i*BLOCK_SIZE+1,j*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
                ctx.strokeRect(i*BLOCK_SIZE+0.5,j*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
            }
        }
        ctx.fillStyle='#FF6D6A';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    }

    function MoveRight(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FFFFFF';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
            ctx.strokeRect(i*BLOCK_SIZE+0.5,pos[1]*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
        }

        onMoveRight();

        ctx.fillStyle='#FF6D6A';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    }

    function MoveLeft(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FFFFFF';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
            ctx.strokeRect(i*BLOCK_SIZE+0.5,pos[1]*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
        }
        onMoveLeft();
        ctx.fillStyle='#FF6D6A';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    }

    function MoveUp(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FFFFFF';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
            ctx.strokeRect(i*BLOCK_SIZE+0.5,pos[1]*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
        }
        onMoveUp();
        ctx.fillStyle='#FF6D6A';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    }

    
    function MoveDown(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FFFFFF';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
            ctx.strokeRect(i*BLOCK_SIZE+0.5,pos[1]*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
        }
        onMoveDown();
        ctx.fillStyle='#FF6D6A';
        for(let i = pos[0]; i < pos[0]+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,pos[1]*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    }

    function animate(now = 0){
        // 지난 시간을 업데이트한다.
        time.current.elapsed = now - time.current.start;
        // 지난 시간이 현재 레벨의 시간을 초과했는지 확인한다.
        if (time.current.elapsed > time.current.level) {
            // 현재 시간을 다시 측정한다.
            time.current.start = now;
            MoveDown();
        };
        
        requestAnimationFrame(animate);
    }

    useEffect(()=>{
        CanvasInit();
        animate();
    })

    return (
        <Container>
            <ButtonContainer>
                <Button onClick={MoveRight}>오른쪽</Button>
                <Button onClick={MoveLeft}>왼쪽</Button>
                <Button onClick={MoveUp}>위쪽</Button>
                <Button onClick={MoveDown}>아래쪽</Button>
                <Button onClick={CanvasInit}>캔퍼스그리기</Button>
                <Button onClick={()=>onSetPos([0,0])}>좌표초기화</Button>
                <div>X좌표 : {pos[0]}</div>
                <div>Y좌표 : {pos[1]}</div>
            </ButtonContainer>
            <canvas ref = {canvas}/>
            <div style={{width:'300px'}}/>
        </Container>
    )
}

Board.propTypes = {
    pos: PropTypes.array,
    board: PropTypes.array,
    onMoveLeft: PropTypes.func,
    onMoveRight: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    onSetBoard: PropTypes.func,
    onSetPos: PropTypes.func,
    
};

Board.defaultProps = {
    pos: [0,0],
    board: Array.from(Array(10),()=>Array(20).fill(false)),
    onMoveLeft: () => console.warn("onMoveLeft not defined"),
    onMoveRight: () => console.warn("onMoveRight not defined"),
    onMoveUp: () => console.warn("onMoveUp not defined"),
    onMoveDown: () => console.warn("onMoveDown not defined"),
    onSetBoard: () => console.warn("onSetBoard not defined"),
    onSetPos: () => console.warn("onSetPos not defined"),
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Button = styled.button`
    width: 300px;
    height: 50px;
    margin: 20px;
`
export default Board
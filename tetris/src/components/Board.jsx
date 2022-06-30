import React, {useRef,useEffect} from 'react';
import styled from 'styled-components';

const Board = () => {
    const canvas = useRef(null);
    const CANVAS_WIDTH = document.documentElement.clientWidth/4;
    const CANVAS_HEIGHT = document.documentElement.clientWidth/2;
    const BLOCK_SIZE = CANVAS_WIDTH/10;
    useEffect(()=>{
        const ctx = canvas.current.getContext("2d");
        ctx.canvas.width = CANVAS_WIDTH+1;
        ctx.canvas.height = CANVAS_HEIGHT+1;
        ctx.lineWidth=1;
        ctx.strokeStyle='#000000';
        for(let x = 0; x < 10 ; x++){
            for(let y = 0; y < 20; y++){
                ctx.strokeRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE)
            }
        }

        ctx.fillStyle='#FF6D6A';
        for(let x = 0; x < 4; x++){
            ctx.fillRect(x*BLOCK_SIZE+0.5,19*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
        }
    })
    return (
        <CanvasContainer>
            <canvas ref = {canvas}/>
        </CanvasContainer>
    )
}
const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
`
export default Board
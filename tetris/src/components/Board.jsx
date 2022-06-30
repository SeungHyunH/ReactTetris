import React, {useRef,useEffect} from 'react';
import styled from 'styled-components';

const Board = () => {
    const canvas = useRef(null);
    const CANVAS_WIDTH = document.documentElement.clientWidth/4;
    const CANVAS_HEIGHT = document.documentElement.clientWidth/2;
    const BLOCK_SIZE = CANVAS_WIDTH/10;
    const pos = useRef({x:0,y:0});

    useEffect(()=>{
        const ctx = canvas.current.getContext("2d");
        ctx.canvas.width = CANVAS_WIDTH+1;
        ctx.canvas.height = CANVAS_HEIGHT+1;
        ctx.lineWidth=1;
        ctx.strokeStyle='#000000';
        ctx.fillStyle='#FFFFFF';
        for(let i = 0; i < 10 ; i++){
            for(let j = 0; j < 20; j++){
                ctx.fillRect(i*BLOCK_SIZE+1,j*BLOCK_SIZE+1,BLOCK_SIZE,BLOCK_SIZE);
                ctx.strokeRect(i*BLOCK_SIZE+0.5,j*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
            }
        }

        ctx.fillStyle='#FF6D6A';
        for(let i = pos.current['x']; i < pos.current['x']+4; i++){
            ctx.fillRect(i*BLOCK_SIZE+1,19*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
        }
    })
    return (
        <>
            <button onClick={()=>{
                const ctx = canvas.current.getContext("2d");
                ctx.fillStyle='#FFFFFF';
                for(let i = pos.current['x']; i < pos.current['x']+4; i++){
                    ctx.fillRect(i*BLOCK_SIZE+1,19*BLOCK_SIZE+1,BLOCK_SIZE,BLOCK_SIZE);
                    ctx.strokeRect(i*BLOCK_SIZE+0.5,19*BLOCK_SIZE+0.5,BLOCK_SIZE-1,BLOCK_SIZE-1);
                }
                pos.current['x']=pos.current['x']+1;
                ctx.fillStyle='#FF6D6A';
                for(let i = pos.current['x']; i < pos.current['x']+4; i++){
                    ctx.fillRect(i*BLOCK_SIZE+1,19*BLOCK_SIZE+1,BLOCK_SIZE-2,BLOCK_SIZE-2);
                }
            }}>TEST</button>
            <CanvasContainer>
                <canvas ref = {canvas}/>
            </CanvasContainer>
        </>
    )
}
const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
`
export default Board
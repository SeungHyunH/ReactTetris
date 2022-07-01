import React, {useRef,useEffect} from 'react';
import styled from 'styled-components';
import BLOCK from '../util/block';
const Board = () => {
    const canvas = useRef(null);
    const CANVAS_WIDTH = useRef(document.documentElement.clientWidth/4);
    const CANVAS_HEIGHT = useRef(document.documentElement.clientWidth/2);
    const BLOCK_SIZE = useRef(CANVAS_WIDTH.current/10);
    const pos = useRef([2,2]);
    const time = useRef({start: 0, elapsed: 0, level: 1000});
    const currentBlock = useRef(BLOCK[0]);
    const currentRotate = useRef(0);
    const blockList = useRef(null);
    const board = useRef(Array.from(Array(10),()=>Array(20).fill(false)))
    const moveStop = useRef(false);

    function Draw(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FF6D6A';
        const halfBlockSize = (currentBlock.current.length-1)/2
        for(let i = 0; i < currentBlock.current.length; i++){
            for(let j = 0; j < currentBlock.current.length; j++){
                if(currentBlock.current[j][i]){
                    ctx.fillRect((i+pos.current[0]-halfBlockSize)*BLOCK_SIZE.current+1,(j+pos.current[1]-halfBlockSize)*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                }
            }
        }
    }

    function Erase(){
        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle='#FFFFFF';
        const halfBlockSize = (currentBlock.current.length-1)/2
        for(let i = 0; i < currentBlock.current.length; i++){
            for(let j = 0; j < currentBlock.current.length; j++){
                if(currentBlock.current[j][i]){
                    ctx.fillRect((i+pos.current[0]-halfBlockSize)*BLOCK_SIZE.current+1,(j+pos.current[1]-halfBlockSize)*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                }
            }
        }
    }

    function CanvasInit(){
        const ctx = canvas.current.getContext("2d");
        ctx.canvas.width = CANVAS_WIDTH.current+1;
        ctx.canvas.height = CANVAS_HEIGHT.current+1;
        ctx.lineWidth=1;
        ctx.strokeStyle='#000000';
        ctx.fillStyle='#FFFFFF';
        for(let i = 0; i < 10 ; i++){
            for(let j = 0; j < 20; j++){
                ctx.fillRect(i*BLOCK_SIZE.current+1,j*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                ctx.strokeRect(i*BLOCK_SIZE.current+0.5,j*BLOCK_SIZE.current+0.5,BLOCK_SIZE.current-1,BLOCK_SIZE.current-1);
            }
        }
        Draw();
    }

    function MoveRight(){
        const ctx = canvas.current.getContext("2d");
        Erase(ctx);
        pos.current[0]+=1;
        if(Collide()){pos.current[0]-=1;}
        Draw(ctx);
    }

    function MoveLeft(){
        const ctx = canvas.current.getContext("2d");
        Erase(ctx);
        pos.current[0]-=1;
        if(Collide()){pos.current[0]+=1;}
        Draw(ctx);
    }

    function MoveUp(){
        const ctx = canvas.current.getContext("2d");
        Erase(ctx);
        pos.current[1]-=1;
        if(Collide()){moveStop.current=true;pos.current[1]+=1;}
        Draw(ctx);
    }

    
    function MoveDown(){
        const ctx = canvas.current.getContext("2d");
        Erase(ctx);
        pos.current[1]+=1;
        if(Collide()){moveStop.current=true;pos.current[1]-=1;}
        Draw(ctx);
    }

    function Collide(){
        const halfBlockSize = (currentBlock.current.length-1)/2
        for(let i = 0; i < currentBlock.current.length; i++){
            for(let j = 0; j < currentBlock.current.length; j++){
                const nx = i+pos.current[0]-halfBlockSize;
                const ny = j+pos.current[1]-halfBlockSize;
                if((currentBlock.current[j][i] &&(nx<0||nx>9||ny<0||ny>=19||board.current[j][i]))){
                    return true;
                }
            }
        }
        return false;
    }

    function animate(now = 0){
        if(moveStop.current){return;}
        // 지난 시간을 업데이트한다.
        time.current.elapsed = now - time.current.start;
        // 지난 시간이 현재 레벨의 시간을 초과했는지 확인한다.
        if (time.current.elapsed > time.current.level) {
            // 현재 시간을 다시 측정한다.
            time.current.start = now;
            MoveDown();
        }
        requestAnimationFrame(animate);
    }

    useEffect(()=>{
        CanvasInit();
        animate();
    },[])

    return (
        <Container>
            <ButtonContainer>
                <Button onClick={MoveRight}>오른쪽</Button>
                <Button onClick={MoveLeft}>왼쪽</Button>
                <Button onClick={MoveUp}>위쪽</Button>
                <Button onClick={MoveDown}>아래쪽</Button>
                <Button onClick={CanvasInit}>캔퍼스그리기</Button>
                <Button onClick={()=>{pos.current=[2,2];CanvasInit();}}>좌표초기화</Button>
                <Button onClick={()=>alert(pos.current)}>좌표출력</Button>
                <Button onClick={()=>moveStop.current=true}>멈추기</Button>
                <Button onClick={()=>{moveStop.current=false;animate();}}>시작</Button>
            </ButtonContainer>
            <canvas ref = {canvas}/>
            <div style={{width:'300px'}}/>
        </Container>
    )
}

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
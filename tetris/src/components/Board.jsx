import React, {useRef,useEffect} from 'react';
import styled from 'styled-components';
import BLOCK from '../util/block';
import * as kick from '../util/kickData';
import POS from '../util/posData';
const Board = () => {
    const canvas = useRef(null);
    const CANVAS_WIDTH = useRef(document.documentElement.clientWidth/4);
    const CANVAS_HEIGHT = useRef(document.documentElement.clientWidth/2);
    const BLOCK_SIZE = useRef(CANVAS_WIDTH.current/10);
    const pos = useRef(null);
    const time = useRef({start: 0, elapsed: 0, level: 1000});
    const currentBlock = useRef(null);
    const currentBlockIndex = useRef(null);
    const currentRotate = useRef(null);
    const blockList = useRef(Array.from(Array(7),(_,idx)=>idx));
    const board = useRef(Array.from(Array(20),()=>Array(10).fill(false)))
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

    function CanvasDraw(){
        const ctx = canvas.current.getContext("2d");
        ctx.strokeStyle='#000000';
        for(let i = 0; i < 10 ; i++){
            for(let j = 0; j < 20; j++){
                if(board.current[j][i]){
                    ctx.fillStyle='#FF6D6A'; 
                }else{
                    ctx.fillStyle='#FFFFFF';
                }
                ctx.fillRect(i*BLOCK_SIZE.current+1,j*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                ctx.strokeRect(i*BLOCK_SIZE.current+0.5,j*BLOCK_SIZE.current+0.5,BLOCK_SIZE.current-1,BLOCK_SIZE.current-1);
            }
        }
    }

    function GenerateBlock(){
        let randomIndex = Math.floor((window.crypto.getRandomValues(new Uint32Array(1))/4294967296)*7);
        currentBlockIndex.current = blockList.current.splice(randomIndex,1)[0];
        currentBlock.current = BLOCK[currentBlockIndex.current];
        currentRotate.current = 0;
        pos.current=[...POS[currentBlockIndex.current]];
        if(blockList.current.length === 0){
            blockList.current = Array.from(Array(7),(_,idx)=>idx);
        }
    }

    function MoveRight(){
        Erase();
        pos.current[0]+=1;
        if(Collide()===1){pos.current[0]-=1;}
        Draw();
    }

    function MoveLeft(){
        Erase();
        pos.current[0]-=1;
        if(Collide()===1){pos.current[0]+=1;}
        Draw();
    }

    function MoveUp(){
        Erase();
        pos.current[1]-=1;
        if(Collide()===1){moveStop.current=true;pos.current[1]+=1;}
        Draw();
    }

    
    function MoveDown(){
        Erase();
        pos.current[1]+=1;
        switch(Collide()){
            case 0://??? ???????????????
                break;
            case 2://??? ????????? ????????? ????????? ???
                pos.current[1]-=1;
                const ctx = canvas.current.getContext("2d");
                ctx.fillStyle='#FF6D6A';
                const halfBlockSize = (currentBlock.current.length-1)/2;
                for(let i = 0; i < currentBlock.current.length; i++){
                    for(let j = 0; j < currentBlock.current.length; j++){
                        const nx = i+pos.current[0]-halfBlockSize;
                        const ny = j+pos.current[1]-halfBlockSize;
                        if(currentBlock.current[j][i]){
                            board.current[ny][nx]=true;
                            ctx.fillRect(nx*BLOCK_SIZE.current+1,ny*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                        }
                    }
                }

                //???????????? ????????????
                LineCheck();

                //???????????????
                GenerateBlock();
                break;
            case 3://????????????
                moveStop.current=true;
                pos.current[1]-=1;
                alert('????????????');
                break;
            default:
                break;
        }
        Draw();
    }

    function MoveFloor(){
        Erase();
        let result = Collide();
        while(result === 0){
            pos.current[1]+=1;
            result = Collide();
        }
        if(result === 2){//????????? ?????? or ??? ???????????? ??????
            pos.current[1]-=1;
            const ctx = canvas.current.getContext("2d");
            ctx.fillStyle='#FF6D6A';

            //????????? ??????????????? ?????? ??? ?????????
            const halfBlockSize = (currentBlock.current.length-1)/2;
            for(let i = 0; i < currentBlock.current.length; i++){
                for(let j = 0; j < currentBlock.current.length; j++){
                    const nx = i+pos.current[0]-halfBlockSize;
                    const ny = j+pos.current[1]-halfBlockSize;
                    if(currentBlock.current[j][i]){
                        board.current[ny][nx]=true;
                        ctx.fillRect(nx*BLOCK_SIZE.current+1,ny*BLOCK_SIZE.current+1,BLOCK_SIZE.current-2,BLOCK_SIZE.current-2);
                    }
                }
            }

            //???????????? ????????????
            LineCheck();

            //?????? ?????????
            GenerateBlock();
        }else{//?????? ?????????
            pos.current[1]-=1;
            moveStop.current=true;
            alert('????????????');
        }
        Draw();
    }

    function LineCheck(){
        const halfBlockSize = (currentBlock.current.length-1)/2;
        for(let i = pos.current[1]+halfBlockSize; i >= pos.current[1]-halfBlockSize; i--){
            let check = true;
            if(i > 19||i<0){continue;}
            for(let j = 0; j < 10; j++){
                if(!board.current[i][j]){check=false;break;}
            }
            if(check){
                board.current.splice(i,1);
                board.current.splice(0,0,Array(10).fill(false));
                CanvasDraw();
            }
        }
    }

    function Rotate(){
        Erase();
        const returnBlock = Array.from(Array(currentBlock.current.length),()=>Array(currentBlock.current.length).fill(0));
        for (let i = currentBlock.current.length - 1; i >= 0; i--) {
            for (let j = currentBlock.current.length - 1; j >= 0; j--) {
              returnBlock[i][j] = currentBlock.current[currentBlock.current.length - j - 1][i];
            }
        }
        const halfBlockSize = (currentBlock.current.length-1)/2;
        switch(currentBlockIndex.current){
            case 0://I
                for(let i = 0; i < 5; i++){
                    const nx = kick.KICK_DATA_I[currentRotate.current][i][0];
                    const ny = kick.KICK_DATA_I[currentRotate.current][i][1];
                    let isRotate = true;
                    for(let x = 0; x < returnBlock.length; x++){
                        for(let y = 0; y < returnBlock.length; y++){
                            if(returnBlock[y][x]){
                                const tx = nx + x +pos.current[0]-halfBlockSize;
                                const ty = ny + y +pos.current[1]-halfBlockSize;
                                if(tx<0||tx>9||ty<0||ty>19||board.current[ty][tx]){
                                    isRotate = false;
                                    break;
                                }
                            }
                        }
                        if(!isRotate){
                            break;
                        }
                    }
                    if(isRotate){//?????? ?????????
                        pos.current[0]+=nx;
                        pos.current[1]+=ny;
                        currentBlock.current = returnBlock;
                        currentRotate.current = (currentRotate.current+1)%4;
                        break;
                    }
                }
                break;
            case 3://O
                break;
            default://?????????
                for(let i = 0; i < 5; i++){
                    const nx = kick.KICK_DATA[currentRotate.current][i][0];
                    const ny = kick.KICK_DATA[currentRotate.current][i][1];
                    let isRotate = true;
                    for(let x = 0; x < returnBlock.length; x++){
                        for(let y = 0; y < returnBlock.length; y++){
                            if(returnBlock[y][x]){
                                const tx = nx + x +pos.current[0]-halfBlockSize;
                                const ty = ny + y +pos.current[1]-halfBlockSize;
                                if(tx<0||tx>9||ty<0||ty>19||board.current[ty][tx]){
                                    isRotate = false;
                                    break;
                                }
                            }
                        }
                        if(!isRotate){
                            break;
                        }
                    }
                    if(isRotate){//?????? ?????????
                        pos.current[0]+=nx;
                        pos.current[1]+=ny;
                        currentBlock.current = returnBlock;
                        currentRotate.current = (currentRotate.current+1)%4;
                        break;
                    }
                }            
                break;
        }
        Draw();
    }

    function Collide(){
        const halfBlockSize = (currentBlock.current.length-1)/2;
        for(let i = 0; i < currentBlock.current.length; i++){
            for(let j = 0; j < currentBlock.current.length; j++){
                const nx = i+pos.current[0]-halfBlockSize;
                const ny = j+pos.current[1]-halfBlockSize;
                if(currentBlock.current[j][i]){
                    if(nx<0||nx>9||ny<0){
                        return 1;
                    }else if(ny>19||board.current[ny][nx]){//??????
                        if(currentBlockIndex.current === 0){ //I????????????, ?????? Y????????? 1???????????? ???????????? => ????????? ?????? Y????????? 1??? ?????????????????? ??????????????? ??????????????? 1??? ?????????
                            if(pos.current[1]=== 1){return 3;}
                        }else{ //I????????? ?????????, ??????Y????????? 2????????? ????????????
                            if(pos.current[1]=== 2){return 3;}
                        }
                        return 2;
                    }
                }
            }
        }
        return 0;
    }

    function animate(now = 0){
        if(moveStop.current){return;}
        // ?????? ????????? ??????????????????.
        time.current.elapsed = now - time.current.start;
        // ?????? ????????? ?????? ????????? ????????? ??????????????? ????????????.
        if (time.current.elapsed > time.current.level) {
            // ?????? ????????? ?????? ????????????.
            time.current.start = now;
            MoveDown();
        }
        requestAnimationFrame(animate);
    }

    useEffect(()=>{
        GenerateBlock();
        CanvasInit();
        animate();
    },[])

    return (
        <Container>
            <ButtonContainer>
                <Button onClick={MoveRight}>?????????</Button>
                <Button onClick={MoveLeft}>??????</Button>
                <Button onClick={MoveUp}>??????</Button>
                <Button onClick={MoveDown}>?????????</Button>
                <Button onClick={MoveFloor}>??? ????????? ??????</Button>
                <Button onClick={CanvasInit}>??????????????????</Button>
                <Button onClick={()=>{pos.current=[2,2];CanvasInit();}}>???????????????</Button>
                <Button onClick={()=>alert(pos.current)}>????????????</Button>
                <Button onClick={()=>moveStop.current=true}>?????????</Button>
                <Button onClick={()=>{moveStop.current=false;animate();}}>??????</Button>
            </ButtonContainer>
            <canvas ref = {canvas}/>
            <ButtonContainer>
                <Button onClick={Rotate}>??????</Button>
                <Button onClick={GenerateBlock}>????????????</Button>
                <Button onClick={MoveDown}>?????????</Button>
                <Button onClick={MoveFloor}>??? ????????? ??????</Button>
                <Button onClick={CanvasInit}>??????????????????</Button>
                <Button onClick={()=>{pos.current=[2,2];CanvasInit();}}>???????????????</Button>
                <Button onClick={()=>alert(pos.current)}>????????????</Button>
                <Button onClick={()=>moveStop.current=true}>?????????</Button>
                <Button onClick={()=>{moveStop.current=false;animate();}}>??????</Button>
            </ButtonContainer>
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
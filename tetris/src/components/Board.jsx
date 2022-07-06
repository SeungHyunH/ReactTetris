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
            case 0://안 부딛쳤을때
                break;
            case 2://맨 아래나 블록에 닿았을 때
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

                //라인삭제 검사함수
                LineCheck();

                //좌표초기화
                GenerateBlock();
                break;
            case 3://게임종료
                moveStop.current=true;
                pos.current[1]-=1;
                alert('게임종료');
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
        if(result === 2){//블록과 충돌 or 맨 아래벽과 충돌
            pos.current[1]-=1;
            const ctx = canvas.current.getContext("2d");
            ctx.fillStyle='#FF6D6A';

            //보드에 현재블록을 추가 및 그리기
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

            //라인삭제 검사함수
            LineCheck();

            //좌표 초기화
            GenerateBlock();
        }else{//게임 종료시
            pos.current[1]-=1;
            moveStop.current=true;
            alert('게임종료');
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
                    if(isRotate){//회전 성공시
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
            default://나머지
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
                    if(isRotate){//회전 성공시
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
                    }else if(ny>19||board.current[ny][nx]){//충돌
                        if(currentBlockIndex.current === 0){ //I블록이고, 중심 Y좌표가 1인경경우 게임종료 => 충돌시 항상 Y좌표를 1칸 내린상태에서 검사함으로 실제좌표와 1이 차이남
                            if(pos.current[1]=== 1){return 3;}
                        }else{ //I블록이 아니고, 중심Y좌표가 2인경우 게임종료
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
        GenerateBlock();
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
                <Button onClick={MoveFloor}>맨 아래로 놓기</Button>
                <Button onClick={CanvasInit}>캔퍼스그리기</Button>
                <Button onClick={()=>{pos.current=[2,2];CanvasInit();}}>좌표초기화</Button>
                <Button onClick={()=>alert(pos.current)}>좌표출력</Button>
                <Button onClick={()=>moveStop.current=true}>멈추기</Button>
                <Button onClick={()=>{moveStop.current=false;animate();}}>시작</Button>
            </ButtonContainer>
            <canvas ref = {canvas}/>
            <ButtonContainer>
                <Button onClick={Rotate}>회전</Button>
                <Button onClick={GenerateBlock}>블록생성</Button>
                <Button onClick={MoveDown}>아래쪽</Button>
                <Button onClick={MoveFloor}>맨 아래로 놓기</Button>
                <Button onClick={CanvasInit}>캔퍼스그리기</Button>
                <Button onClick={()=>{pos.current=[2,2];CanvasInit();}}>좌표초기화</Button>
                <Button onClick={()=>alert(pos.current)}>좌표출력</Button>
                <Button onClick={()=>moveStop.current=true}>멈추기</Button>
                <Button onClick={()=>{moveStop.current=false;animate();}}>시작</Button>
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
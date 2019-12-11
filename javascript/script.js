let canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 800;
let ctx = canvas.getContext("2d");

const colnum = 25;
const rownum = colnum;
const cellwidth = canvas.width/colnum;
const cellheight = canvas.height/rownum
let startPos = new Position();
let endPos = new Position();
let grid = []; //2d array that stores info about cells in the grid.

let stack = []; //with this we remember all points we've been to

//First we set all 
for(let i=0; i<=rownum; i++){
    grid[i] = [];
    for(let j=0; j<=colnum; j++){
        grid[i][j] = {
            hasLine: [],
            visited: false
        };
        for(let k=0; k<4; k++){
            grid[i][j].hasLine[k] = true;
        }
    }
}
ctx.strokeStyle = "red";

startPos = randomEdgeCell();
grid[startPos.x][startPos.y].visited = true;
stack[0] = new Position(startPos.x, startPos.y);
ctx.beginPath();
ctx.rect(startPos.x*cellwidth, startPos.y*cellheight, cellwidth, cellheight);
ctx.fill();
ctx.beginPath();
ctx.moveTo(startPos.x*cellwidth+cellwidth/2, startPos.y*cellheight+cellheight/2);
someLoop: while(true){
    while(true){
        let tempPos = new Position(stack[stack.length-1].x, stack[stack.length-1].y);
        let direction = Math.trunc(Math.random()*4);
        switch(direction){
            case 0:
                tempPos.y = stack[stack.length-1].y-1;
                break;
            case 1:
                tempPos.x = stack[stack.length-1].x+1;
                break;
            case 2:
                tempPos.y = stack[stack.length-1].y+1;
                break;
            case 3:
                tempPos.x = stack[stack.length-1].x-1;
                break;
            default:
                console.log("this shouldn't happen");
                break;
        }
        if(!hasEmptyNeighbour(stack[stack.length-1])){
            console.log("infinite loop detected");
            ctx.stroke();
            backtrack();
            if(stack.length <= 0){
                break someLoop;
            }
            ctx.moveTo(stack[stack.length-1].x*cellwidth+cellwidth/2, stack[stack.length-1].y*cellheight+cellheight/2);
        }
        if(tempPos.x>=0 && tempPos.y>=0 && tempPos.x<colnum && tempPos.y<rownum && !grid[tempPos.x][tempPos.y].visited){
            grid[tempPos.x][tempPos.y].visited = true;
            ctx.stroke();
            stack.push(new Position(tempPos.x, tempPos.y));
            //ctx.lineTo(stack[stack.length-1].x*cellwidth+cellwidth/2, stack[stack.length-1].y*cellheight+cellheight/2); //this line shows how cells are connected
            setLines();
            break;
        }
    }
}
endPos = randomEdgeCell();
ctx.fillStyle = "orange";
ctx.beginPath();
ctx.rect(endPos.x*cellwidth, endPos.y*cellheight, cellwidth, cellheight);
ctx.fill();

function backtrack(){
    if(hasEmptyNeighbour(stack[stack.length-1])){;
        return;
    }
    else{
        stack.pop();
        if(stack.length <= 0){
            console.log("end the program");
            return;
        }
        backtrack();
    }
    
}
function hasEmptyNeighbour(cell){
    if(cell.y-1>=0 && !grid[cell.x][cell.y-1].visited)
        return true;
    else if(cell.x+1<colnum && !grid[cell.x+1][cell.y].visited)
        return true;
    else if(cell.y+1<rownum && !grid[cell.x][cell.y+1].visited)
        return true;
    else if(cell.x-1>=0 && !grid[cell.x-1][cell.y].visited)
        return true;
    return false;
}

function setLines(){
    for(let i=1; i<stack.length; i++){
        if(stack[i].y > stack[i-1].y){
            grid[stack[i-1].x][stack[i-1].y].hasLine[2] = false;
            grid[stack[i].x][stack[i].y].hasLine[0] = false;
        }
        if(stack[i].y < stack[i-1].y){
            grid[stack[i-1].x][stack[i-1].y].hasLine[0] = false;
            grid[stack[i].x][stack[i].y].hasLine[2] = false;
        }
        if(stack[i].x > stack[i-1].x){
            grid[stack[i-1].x][stack[i-1].y].hasLine[1] = false;
            grid[stack[i].x][stack[i].y].hasLine[3] = false;
        }
        if(stack[i].x < stack[i-1].x){
            grid[stack[i-1].x][stack[i-1].y].hasLine[3] = false;
            grid[stack[i].x][stack[i].y].hasLine[1] = false;
        }
    }
}


//ctx.stroke();
drawMaze("black", "green");
function drawMaze(strokeColor, fillColor){
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    for(let i=0; i<grid.length; i++){
        for(let j=0; j<grid[i].length; j++){
            ctx.beginPath();
            ctx.moveTo(i*cellwidth,j*cellheight);
            if(grid[i][j].hasLine[0])
                ctx.lineTo((i+1)*cellwidth, j*cellheight);
            else
                ctx.moveTo((i+1)*cellwidth, j*cellheight);
            if(grid[i][j].hasLine[1])
                ctx.lineTo((i+1)*cellwidth, (j+1)*cellheight);
            else
                ctx.moveTo((i+1)*cellwidth, (j+1)*cellheight);
            if(grid[i][j].hasLine[2])
                ctx.lineTo(i*cellwidth, (j+1)*cellheight);
            else
                ctx.moveTo(i*cellwidth, (j+1)*cellheight);
            if(grid[i][j].hasLine[3])
                ctx.lineTo(i*cellwidth, j*cellheight);
            else
                ctx.moveTo(i*cellwidth, j*cellheight);
            ctx.stroke();
        }
    }
}
function randomEdgeCell(){
    let pos = new Position();
    switch(Math.trunc(Math.random()*2)){
        case 0: //That means we start on top or on bottom
            pos.x = Math.trunc(Math.random()*2);
            pos.y = Math.trunc(Math.random()*rownum);
            if(pos.x >= 1)
                pos.x = rownum-1;
            break;
        case 1: //That means we start on left or right
            pos.x = Math.trunc(Math.random()*colnum);
            pos.y = Math.trunc(Math.random()*2);
            if(pos.y >= 1)
                pos.y = colnum-1;
            break;
    }
    return pos;
}



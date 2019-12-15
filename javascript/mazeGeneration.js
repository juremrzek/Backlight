let canvas = document.getElementById("canvas");
canvas.width = 1200;
canvas.height = 800;
let ctx = canvas.getContext("2d");
let mazeColor = "white";

const colnum = 10;
const rownum = colnum;
const cellwidth = canvas.height/colnum/2;
const cellheight = canvas.height/colnum/2;
let startPos = new Position();
let endPos = new Position();
let grid = []; //2d array that stores info about cells in the grid.
let stack = []; //with this we remember all points we've been to

let lines = []; //to know where the lines are for later collisions

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
startPos = randomEdgeCell();
grid[startPos.x][startPos.y].visited = true;
stack[0] = new Position(startPos.x, startPos.y);
ctx.beginPath();
//ctx.rect(startPos.x*cellwidth, startPos.y*cellheight, cellwidth, cellheight);
ctx.fill();
outerLoop: while(true){
    //let mazeIsGenerated = false;
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
        }
        if(!hasEmptyNeighbour(stack[stack.length-1])){
            console.log("backtracking...");
            ctx.stroke();
            backtrack();
            if(stack.length <= 0){
                //mazeIsGenerated = true;
                console.log("The maze has been generated");
                break outerLoop;
            }
            ctx.moveTo(stack[stack.length-1].x*cellwidth+cellwidth/2, stack[stack.length-1].y*cellheight+cellheight/2);
        }
        if(tempPos.x>=0 && tempPos.y>=0 && tempPos.x<colnum && tempPos.y<rownum && !grid[tempPos.x][tempPos.y].visited){
            grid[tempPos.x][tempPos.y].visited = true;
            ctx.beginPath();
            ctx.moveTo(stack[stack.length-1].x*cellwidth+cellwidth/2, stack[stack.length-1].y*cellheight+cellheight/2);
            stack.push(new Position(tempPos.x, tempPos.y));
            //ctx.lineTo(stack[stack.length-1].x*cellwidth+cellwidth/2, stack[stack.length-1].y*cellheight+cellheight/2); //just debug lines
            ctx.stroke();
            setLines(); //removes the walls between all connecting cells
            break;
        }
    }
}
endPos = randomEdgeCell();
//createAnOpening(startPos);
//createAnOpening(endPos);
calculateLines();

function backtrack(){
    if(hasEmptyNeighbour(stack[stack.length-1])){;
        return;
    }
    else{
        stack.pop();
        if(stack.length <= 0){
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
function drawMaze(strokeColor, fillcolor){
    ctx.fillStyle=fillcolor;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.height/2, canvas.height/2);
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.p1.x, line.p1.y);
            ctx.lineTo(line.p2.x, line.p2.y);
            ctx.stroke();
    });
}
function calculateLines(){
    for(let i=0; i<grid.length-1; i++){
        for(let j=0; j<grid[i].length-1; j++){
            if(grid[i][j].hasLine[0])
                lines.push(new Line(new Point(i*cellwidth,j*cellheight),new Point((i+1)*cellwidth, j*cellheight)));
            if(grid[i][j].hasLine[1])
                lines.push(new Line(new Point((i+1)*cellwidth, j*cellheight),new Point((i+1)*cellwidth, (j+1)*cellheight)));
            if(grid[i][j].hasLine[2])
                lines.push(new Line(new Point((i+1)*cellwidth, (j+1)*cellheight),new Point(i*cellwidth, (j+1)*cellheight)));
            if(grid[i][j].hasLine[3])
                lines.push(new Line(new Point(i*cellwidth, (j+1)*cellheight),new Point(i*cellwidth, j*cellheight)));
        }
    }
}
function randomEdgeCell(){
    let pos = new Position();
    switch(Math.trunc(Math.random()*2)){
        case 0: //That means we start on top or on bottom
            pos.x = Math.trunc(Math.random()*2);
            pos.y = Math.trunc(Math.random()*rownum);
            if(pos.x == 1)
                pos.x = colnum-1;
            break;
        case 1: //That means we start on left or right
            pos.x = Math.trunc(Math.random()*colnum);
            pos.y = Math.trunc(Math.random()*2);
            if(pos.y == 1)
                pos.y = rownum-1;
            break;
    }
    return pos;
}
function createAnOpening(pos){ //????
    if(pos.y == 0)
        grid[pos.x][pos.y].hasLine[0] = false;
    else if(pos.x == rownum-1)
        grid[pos.x][pos.y].hasLine[1] = false;
    else if(pos.y == colnum-1)
        grid[pos.x][pos.y].hasLine[2] = false;
    else if(pos.x == 0)
        grid[pos.x][pos.y].hasLine[3] = false;
}



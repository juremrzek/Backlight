let player = new Player(cellwidth/2, cellheight/2, 1/colnum*5, cellheight/10);
ctx.fillStyle = "red";
mainLoop();
function mainLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze("black");
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + Math.cos(toRadians(player.angle))*player.r, player.y - Math.sin(toRadians(player.angle))*player.r);
    ctx.stroke();
    if(player.canMove){
        if(player.up){
        player.y -= Math.sin(toRadians(player.angle))*player.speed;
        player.x += Math.cos(toRadians(player.angle))*player.speed;
        }
        if(player.down){
            player.y += Math.sin(toRadians(player.angle))*player.speed;
            player.x -= Math.cos( toRadians(player.angle))*player.speed;
        }
        if(player.left)
            player.angle += 2;
        if(player.right)
            player.angle -= 2;
        if(player.angle >= 360)
            player.angle = 0;
    }
    let canMove = true;
    lines.forEach((line)=>{
        for(let t=0; t<1; t+=0.1){
            if(intersects(player.x, player.y, player.r, line.p1.x + (line.p2.x-line.p1.x)*t, line.p1.y + (line.p2.y-line.p1.y)*t)){
                canMove = false;
                if(player.up){
                    player.y += Math.sin(toRadians(player.angle))*player.speed;
                    player.x -= Math.cos( toRadians(player.angle))*player.speed;
                }
                else{
                    player.y -= Math.sin(toRadians(player.angle))*player.speed;
                    player.x += Math.cos(toRadians(player.angle))*player.speed;
                }
            }
        }
    });
    player.canMove = canMove;
    window.requestAnimationFrame(mainLoop);
}


window.addEventListener("keydown", (event) => {
    key = event.keyCode;
    //console.log(key);
    if(key == 87)
        player.up = true;
    if(key == 83)
        player.down = true;
    if(key == 39)
        player.right = true;
    if(key == 37)
        player.left = true;
});
window.addEventListener("keyup", (event)=>{
    key = event.keyCode;
    if(key == 87)
        player.up = false;
    if(key == 83)
        player.down = false;
    if(key == 39)
        player.right = false;
    if(key == 37)
        player.left = false;
    //if(key == )
});
function toRadians(degrees){
  return degrees * (Math.PI/180);
}
function distanceBetweenPoints(p1, p2){
    let x = Math.abs(p1.x - p2.x);
    let y = Math.abs(p1.y - p2.y);
    return Math.trunc(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)));
}
function intersects(x, y, r, x1, y1){ //does a circle intersect with a line?
    if(distanceBetweenPoints(new Point(x, y), new Point(x1, y1)) < r){
        return true;
    }
    else{
        return false;
    }
}
let player = new Player(startPos.x*cellwidth+cellwidth/2, startPos.y*cellheight+cellheight/2, 1/colnum*5, cellheight/5);
ctx.fillStyle = "red";
let ray = [];
let rayLength = 200;
let numberOfRays = 60;
for(let i=0; i<numberOfRays; i++){
    let tempray = new Ray(player.x, player.y);
    tempray.collidedPoints = [];
    ray.push(tempray);
}
mainLoop();
function mainLoop(){
    if(player.up){
    player.y -= Math.sin(toRadians(player.angle))*player.speed;
    player.x += Math.cos(toRadians(player.angle))*player.speed;
    }
    if(player.down){
        player.y += Math.sin(toRadians(player.angle))*player.speed;
        player.x -= Math.cos( toRadians(player.angle))*player.speed;
    }
    if(player.canTurn){
        if(player.left)
            player.angle += 2;
        if(player.right)
            player.angle -= 2;
        if(player.angle >= 360)
            player.angle = 0;
    }
    for(let i=0; i<numberOfRays; i++){
        ray[i].position = new Point(player.x, player.y);
        ray[i].collidedPoints = [];
        ray[i].turnTowards(player.x+Math.cos(toRadians(player.angle+(i-numberOfRays/2))), player.y-Math.sin(toRadians(player.angle+(i-numberOfRays/2))));
    }
    lines.forEach((line)=>{
        for(let i=0; i<numberOfRays; i++){
            if(ray[i].intersects(line)){
                ray[i].collidedPoints.push(ray[i].intersects(line));
            }
        }
        for(let t=0; t<1; t+=0.1){
            if(intersects(player.x, player.y, player.r, line.p1.x + (line.p2.x-line.p1.x)*t, line.p1.y + (line.p2.y-line.p1.y)*t)){
                if(player.up){
                    player.y += Math.sin(toRadians(player.angle))*player.speed;
                    player.x -= Math.cos(toRadians(player.angle))*player.speed;
                }
                else{
                    player.y -= Math.sin(toRadians(player.angle))*player.speed;
                    player.x += Math.cos(toRadians(player.angle))*player.speed;
                }
            }
        }
    });
    for(let i=0; i<numberOfRays; i++){
        let closestPoint;
        let minDistance = 99999;
        for(let j=0; j<ray[i].collidedPoints.length; j++){
            if(distanceBetweenPoints(player, ray[i].collidedPoints[j])<minDistance){
                minDistance = distanceBetweenPoints(player, ray[i].collidedPoints[j]);
                closestPoint = ray[i].collidedPoints[j];
            }
        }
        if(closestPoint){
            ray[i].closestPoint = closestPoint;
        }
    }
    //Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    let gradient = ctx.createLinearGradient(0, canvas.height/2, 0, canvas.height*2);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "yellow");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);



    drawFirstPerson(mazeColor);
    drawMaze(mazeColor, "black");
    drawPlayer("white");
    drawRays("yellow");
    window.requestAnimationFrame(mainLoop);
}


window.addEventListener("keydown", (event) => {
    key = event.keyCode;
    //console.log(key);
    if(key == 87 || key == 38)
        player.up = true;
    if(key == 83 || key == 40)
        player.down = true;
    if(key == 39 || key == 68)
        player.right = true;
    if(key == 37 || key == 65)
        player.left = true;
});
window.addEventListener("keyup", (event)=>{
    key = event.keyCode;
    if(key == 87 || key == 38)
        player.up = false;
    if(key == 83 || key == 40)
        player.down = false;
    if(key == 39 || key == 68)
        player.right = false;
    if(key == 37 || key == 65)
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
function intersects(x, y, r, x1, y1){ //does a circle intersect with a point?
    if(distanceBetweenPoints(new Point(x, y), new Point(x1, y1)) <= r){
        return true;
    }
    else{
        return false;
    }
}
function drawFirstPerson(color){
    for(let i=0; i<numberOfRays; i++){
        let shade = 255/distanceBetweenPoints(player, ray[i].closestPoint)*15;
        red = "rgb("+shade+", "+shade+", 0)";
        ctx.fillStyle = red;
        ctx.beginPath();
        let screenSize = 100/distanceBetweenPoints(player, ray[i].closestPoint)*100;
        ctx.rect(canvas.width-(1200/numberOfRays)*(i+1), 400-(screenSize/2), 1200/numberOfRays, screenSize);
        ctx.fill();
    }
}
function drawPlayer(color){
    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.arc(player.x, player.y, player.r, 0, 2*Math.PI);
    ctx.stroke();
}
function drawRays(color){
    for(let i=0; i<numberOfRays; i++){
        ctx.strokeStyle=color;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(ray[i].closestPoint.x, ray[i].closestPoint.y);
        ctx.stroke();
    }
}
function gameStart(){
    player = new Player(startPos.x*cellwidth+cellwidth/2, startPos.y*cellheight+cellheight/2, 1/colnum*4, cellheight/6);
    ctx.fillStyle = "red";
    ray = [];
    numberOfRays = 80;
    for(let i=0; i<numberOfRays; i++){
        let tempRay = new Ray(player.x, player.y);
        tempRay.collidedPoints = [];
        ray.push(tempRay);
    }
    previousPlayerPoint = new Point(player.x, player.y);
    mainLoop();
    function mainLoop(){
        player.direction.x = 0;
        player.direction.y = 0;
        let tempLine = new Line();
        lines.forEach((line)=>{
            let distance = player.distanceFrom(line);
            if(distance < player.r){
                tempLine = line;
            }
        });
        
        if(player.turnLeft)
            player.angle -= 2;
        if(player.turnRight)
            player.angle += 2;
        if(player.angle >= 360)
            player.angle = 0;

        if(player.up){
            player.direction.y += -Math.sin(toRadians(player.angle));
            player.direction.x += Math.cos(toRadians(player.angle));
        }
        if(player.down){
            player.direction.y += Math.sin(toRadians(player.angle));
            player.direction.x += -Math.cos(toRadians(player.angle));
        }
        if(player.left){
            player.direction.y += -Math.sin(toRadians(player.angle+90));
            player.direction.x += Math.cos(toRadians(player.angle+90));
        }
        if(player.right){
            player.direction.y += Math.sin(toRadians(player.angle+90));
            player.direction.x += -Math.cos(toRadians(player.angle+90));
        }
        if(player.direction.y < -1)
            player.direction.y += 1;
        if(player.direction.y > 1)
            player.direction.y -= 1;


        for(let i=0; i<numberOfRays; i++){
            ray[i].position = new Point(player.x, player.y);
            ray[i].collidedPoints = [];
        }
        lines.forEach((line)=>{
            for(let i=0; i<numberOfRays; i++){
                if(ray[i].intersects(line)){
                    ray[i].collidedPoints.push(ray[i].intersects(line));
                    if(line.isEndpoint){
                        ray[i].collidedPoints[ray[i].collidedPoints.length-1].isEndpoint = true;
                    }
                }
            }
        });
        for(let i=0; i<numberOfRays; i++){
            if(ray[i].collidedPoints.length > 0){
                const points = ray[i].collidedPoints.map(e => ({point:e, distance:distanceBetweenPoints(player, e)}))
                const sortedPoints = points.sort((a,b) => a.distance - b.distance)
                ray[i].closestPoint = sortedPoints[0].point;
            }
            ray[i].turnTowards(player.x+Math.cos(toRadians(player.angle+(i-numberOfRays/2))), player.y-Math.sin(toRadians(player.angle+(i-numberOfRays/2))));
        }
        if(!tempLine.p1){
            previousPlayerPoint.x = player.x;
            previousPlayerPoint.y = player.y;
        }
        player.x = previousPlayerPoint.x;
        player.y = previousPlayerPoint.y;

        player.x += player.direction.x*player.speed;
        player.y += player.direction.y*player.speed;
        

        //Draw everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        
        //Create a floor gradient
        let gradient = ctx.createLinearGradient(0, canvas.height/2, 0, canvas.height*2);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(0.1, "#0c0c0c");
        gradient.addColorStop(1, "yellow");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

        drawFirstPerson(mazeColor);
        drawMaze(mazeColor, "black");

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.rect(endPos.x*cellwidth, endPos.y*cellheight, cellwidth, cellheight);
        ctx.fill();

        drawPlayer("black", "white");
        drawRays("yellow");

        //Draw a hand with flashlight
        let flashlight = new Image();
        flashlight.src = "img/flashlight.png";
        flashlight.width = flashlight.naturalWidth*1.3;
        flashlight.height = flashlight.naturalHeight*1.3;
        ctx.drawImage(flashlight, canvas.width-flashlight.width, canvas.height - flashlight.height, flashlight.width, flashlight.height);

        window.requestAnimationFrame(mainLoop);
    }

    window.addEventListener("keydown", (event) => {
        key = event.keyCode;
        if(key == 87 || key == 38)
            player.up = true;
        if(key == 83 || key == 40)
            player.down = true;
        if(key == 68)
            player.right = true;
        if(key == 65)
            player.left = true;
        if(key == 39)
            player.turnLeft = true;
        if(key == 37)
            player.turnRight = true;  
    });
    window.addEventListener("keyup", (event)=>{
        key = event.keyCode;
        if(key == 87 || key == 38)
            player.up = false;
        if(key == 83 || key == 40)
            player.down = false;
        if(key == 68)
            player.right = false;
        if(key == 65)
            player.left = false;
        if(key == 39)
            player.turnLeft = false;
        if(key == 37)
            player.turnRight = false;
    });
}


function toRadians(degrees){
  return degrees * (Math.PI/180);
}
function toDegrees(radians){
  return radians * (180/Math.PI);
}
function distanceBetweenPoints(p1, p2){
    let x = Math.abs(p1.x - p2.x);
    let y = Math.abs(p1.y - p2.y);
    return Math.trunc(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)));
}
function drawFirstPerson(color){
    for(let i=0; i<numberOfRays; i++){
        distance = distanceBetweenPoints(player, ray[i].closestPoint);
        let shade = 200/distance*10;
        if(ray[i].closestPoint.isEndpoint){
            color = "rgb("+"0"+", "+shade+", 0)";
        }
        else{
            color = "rgb("+shade+", "+shade+", 0)";
        }
        
            //idkgradeimddddddddddddd
        if(distance > 40)
                color = "rgb("+shade+", "+shade+", "+shade+")";
        ctx.fillStyle = color;
        ctx.beginPath();
        let wallSize = 10000/distance;
        let wallWidth = 1200/numberOfRays;
        ctx.rect(canvas.width-(1200/numberOfRays)*(i+1), 400-(wallSize/2), wallWidth, wallSize);
        ctx.fill();
    }              
}
function drawPlayer(fillColor, strokeColor){
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.arc(player.x, player.y, player.r, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
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
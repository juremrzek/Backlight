function gameStart(){
    player = new Player(startPos.x*cellwidth+cellwidth/2, startPos.y*cellheight+cellheight/2, 1/colnum*8, cellheight/6, 4);
    boxesCollected = 0;
    boxSize = 8;
    numberOfBoxes = 20;
    boxes = [];
    boxColor = "#4343c3";
    let boxOffset = 2;
    score = 0; //gets calculated at the end
    let i=0;
    isMapped = false;
    mappedCount = 0; //how many times did the player open map?
    let mapDate; //so we know when to close the map
    boxLoop: while(i<numberOfBoxes){
        let randomXCell = Math.trunc(Math.random()*colnum);
        let randomYCell = Math.trunc(Math.random()*colnum);
        for(let j=0; j<i; j++){
            if(randomXCell*cellheight+boxOffset==boxes[j].x && randomYCell*cellheight+boxOffset==boxes[j].y){
                continue boxLoop;
            }
        }
        boxes.push(new Box(randomXCell*cellheight+boxOffset,randomYCell*cellheight+boxOffset,boxSize,i));
        i++;
    }
    for(let i=0; i<boxes.length; i++){
        boxes[i].setLines();
    }

    ray = [];
    numberOfRays = 80;
    pause = false;
    pauseFlag = 0;
    playerHasWon = false;
    for(let i=0; i<numberOfRays; i++){
        let tempRay = new Ray(player.x, player.y);
        tempRay.collidedPoints = [];
        ray.push(tempRay);
    }
    previousPlayerPoint = new Point(player.x, player.y);
    let originalDate = new Date();
    seconds = 0;
    minutes = 0;
    mainLoop();
    function mainLoop(){
        player.direction.x = 0;
        player.direction.y = 0;
        let tempLine = new Line();
        for(let i=0; i<lines.length; i++){ //collisions with wall
            let line = lines[i];
            let distance = player.distanceFrom(line);
            if(distance < player.r){
                if(line.type == "box"){
                    for(let j=lines.length-1; j>=0; j--){
                        if(line.boxNum == lines[j].boxNum){
                            lines.splice(j, 1);
                        }
                    }
                    boxes[line.boxNum].isVisible = false;
                    boxesCollected += 1;
                }
                if(line.type == "endpoint"){
                    playerHasWon = true;
                }
                tempLine = line;
            }
        };
        
        if(player.turnLeft)
            player.angle -= player.rotateSpeed;
        if(player.turnRight)
            player.angle += player.rotateSpeed;
        if(player.angle >= 360)
            player.angle = 0;

        if(player.up){
            player.direction.y -= Math.sin(toRadians(player.angle));
            player.direction.x += Math.cos(toRadians(player.angle));
        }
        if(player.down){
            player.direction.y += Math.sin(toRadians(player.angle));
            player.direction.x -= Math.cos(toRadians(player.angle));
        }
        if(player.left){
            player.direction.y -= Math.sin(toRadians(player.angle+90));
            player.direction.x += Math.cos(toRadians(player.angle+90));
        }
        if(player.right){
            player.direction.y += Math.sin(toRadians(player.angle+90));
            player.direction.x -= Math.cos(toRadians(player.angle+90));
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
                if(ray[i].intersectsLine(line)){
                    ray[i].collidedPoints.push(ray[i].intersectsLine(line));
                    if(line.type == "endpoint"){
                        ray[i].collidedPoints[ray[i].collidedPoints.length-1].type = "endpoint";
                    }
                    if(line.type == "box"){
                        ray[i].collidedPoints[ray[i].collidedPoints.length-1].type = "box";
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
        drawCanvas();

        if(!pause)
            if(playerHasWon)
                winLoop();
            else
                setTimeout(mainLoop, 10);
        else{
            pauseOptions = [];
            pauseOptions[0] = "Resume";
            pauseOptions[1] = "Return to menu";
            pauseFlag = 0;
            pauseLoop();
        }
        //writeScore();
        
        let now = new Date();
        // Find the distance between now and the count down date
        let timeDifference = now-originalDate
        if(Math.trunc(timeDifference/1000)>=1){
            seconds++;
            originalDate = new Date();
        }
        if(seconds >= 60){
            minutes++;
            seconds = 0;
        }
        if((now-mapDate)/1000>=2)
            isMapped = false;
        
        ctx.fillStyle = "black";
        ctx.rect(750, 0, 1300, 160);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "40px Audiowide";
        ctx.fillText("Time: "+minutes + " min " + seconds+" sec", 760, 60);
        ctx.fillText("Boxes collected: "+boxesCollected, 760, 130);
    }
    function pauseLoop(){
        ctx.clearRect(canvas.width/2-305, canvas.height/2-155, 610, 310);
        ctx.beginPath();
        ctx.fillStyle = "#fff200";
        ctx.fillRect(canvas.width/2-305, canvas.height/2-155, 610, 310);
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width/2-300, canvas.height/2-150, 600, 300);
        ctx.fillStyle = "white";
        if(pauseFlag >= pauseOptions.length)
            pauseFlag = 0;
        if(pauseFlag < 0)
            pauseFlag = 1;
        for(let i=0; i<pauseOptions.length; i++){
            if(pauseOptions[i] == pauseOptions[pauseFlag])
                ctx.fillStyle = "#fff200";
            else
                ctx.fillStyle = "white";
            ctx.font = "50px Audiowide";
            ctx.fillText(pauseOptions[i],canvas.width/2-300+85, canvas.height/2-40+100*i);
        }
        
        if(pause)
            window.requestAnimationFrame(pauseLoop);
        else
            mainLoop();
    }

    window.addEventListener("keydown", (event) => {
        key = event.keyCode;
        if(playerHasWon)
            if(key == 13 || key == 32)
                location.reload();
        //console.log(key);
        if(key == 87 || key == 38){
            if(pause)
                pauseFlag++;
            player.up = true;
        }
        if(key == 83 || key == 40){
            if(pause)
                pauseFlag++;
            player.down = true;
        }
        if(key == 68)
            player.right = true;
        if(key == 65)
            player.left = true;
        if(key == 39)
            player.turnLeft = true;
        if(key == 37)
            player.turnRight = true;
        if(key == 27){
            isMapped = false;
            pause = !pause;
            drawCanvas();
        }
        if(key == 13 || key == 32){
            switch(pauseFlag){
                case 0:
                    pause = false;
                    break;
                case 1:
                    location.reload();
                    break;
            }
            
        }
        if(key == 77){ //M
            isMapped = true;
            mappedCount++;
            mapDate = new Date();
        }
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
        let shade = -Math.sqrt(distance*200)+190;
        if(ray[i].closestPoint.type == "endpoint"){
            color = "rgb("+"0"+", "+shade+", 0)";
        }
        else if(ray[i].closestPoint.type == "box"){
            //color = "rgb(0, 0, "+shade+")";
            //color = "rgb(0,"+shade+", "+shade/2+")";
            color = "rgb("+shade/3+", "+shade/3+", "+shade+")";
        }
        
        else{
            color = "rgb("+shade+", "+shade+", "+shade+")";
        }
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
function winLoop(){
    score = Math.trunc(8000+12000/(minutes*60+seconds)+boxesCollected*100-mappedCount*200);
    ctx.fillStyle = "white";
    ctx.font = "80px Audiowide";
    ctx.clearRect(canvas.width/2-325, canvas.height/2-205, 650, 460);
    ctx.beginPath();
    ctx.fillStyle = "#fff200";
    ctx.fillRect(canvas.width/2-325, canvas.height/2-205, 650, 460);
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width/2-320, canvas.height/2-200, 640, 450);
    ctx.fillStyle = "white";
    ctx.fillText("You won!", canvas.width/2-200, canvas.height/3+50);
    ctx.font = "40px Audiowide";
    ctx.fillText("You gained "+score+" points!", canvas.width/2-270, canvas.height/3+180);
    ctx.font = "30px Audiowide";
    ctx.fillText("Press enter or space to continue", canvas.width/2-270, canvas.height/3+300);
}
function drawFloor(){
     //Create a floor gradient
     let gradient = ctx.createLinearGradient(0, canvas.height/2, 0, canvas.height*2);
     gradient.addColorStop(0, "black");
     gradient.addColorStop(0.9, "white");
     ctx.fillStyle = gradient;
     ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);
}
function drawMap(){
    drawMaze(mazeColor, "black");
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.rect(endPos.x*cellwidth, endPos.y*cellheight, cellwidth, cellheight);
    ctx.fill();
    drawPlayer("black", "white");
    drawRays("yellow");
    for(let i=0; i<boxes.length; i++){
        if(boxes[i].isVisible){
            ctx.beginPath();
            ctx.fillStyle = boxColor;
            ctx.fillRect(boxes[i].x, boxes[i].y, boxSize, boxSize);
        }
    }
}
function drawCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        
        drawFloor();
        drawFirstPerson(mazeColor);
        if(isMapped)
            drawMap();
        ctx.beginPath();
            
        //Draw a hand with flashlight
        let flashlight = new Image();
        flashlight.src = "img/flashlight.png";
        flashlight.width = flashlight.naturalWidth*1.3;
        flashlight.height = flashlight.naturalHeight*1.3;
        ctx.drawImage(flashlight, canvas.width-flashlight.width, canvas.height - flashlight.height, flashlight.width, flashlight.height);
}
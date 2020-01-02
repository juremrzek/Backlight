class Line{
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
        this.type = ""; //if type is "", that means it's a regular wall
    }
}
class Point{ //Point stores actual coordinates on canvas
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
class Position{ //Position stores just the position on the grid (x - from 0 to number of cells in a row)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Player{
    constructor(x, y, speed, r){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = new Point(0,0);
        this.r = r;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.angle = 90;
        this.collidedPoints = [];
        this.closestPoint;
    }
    distanceFrom(line, type){
        let x = player.x;
        let y = player.y;
        let x1 = line.p1.x;
        let y1 = line.p1.y;
        let x2 = line.p2.x;
        let y2 = line.p2.y;

        let A = x - x1;
        let B = y - y1;
        let C = x2 - x1;
        let D = y2 - y1;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0)
            param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        let dx = x - xx;
        let dy = y - yy;
        if(type == "x")
            return Math.abs(dx);
        if(type == "y")
            return Math.abs(dy);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}
class Ray{
    constructor(x1, y1){
        this.position = new Point(x1, y1);
        this.direction = new Point(1, 1);
        this.collidedPoints = [];
        this.closestPoint;
        this.type = ""; //again, "" is for colliding with walls
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.direction.x*10, this.position.y + this.direction.y*10);
        ctx.stroke();
    }
    intersects(line){
        const x1 = line.p1.x;
        const y1 = line.p1.y;
        const x2 = line.p2.x;
        const y2 = line.p2.y;

        const x3 = this.position.x;
        const y3 = this.position.y;
        const x4 = this.position.x + this.direction.x;
        const y4 = this.position.y + this.direction.y;

        const denominator = (x1 - x2)*(y3 - y4)-(y1 - y2)*(x3 - x4); //you get t and you by deviding something with this denominator
        if(denominator == 0){ //this would mean the lines are parallel and they will never intersect
            return; //we don't want devision by 0 so we jump out
        }
        const t = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4))/denominator;
        const u = -((x1 - x2)*(y1 - y3) - (y1 - y2)*(x1 - x3))/denominator;

        if(t>=0 && t<=1 && u>=0){
            const pointOfIntersection = new Point(x1+t*(x2-x1), y1+t*(y2-y1));
            return pointOfIntersection;
        }
        else {
            return;
        }
    }
    turnTowards(x, y){
        this.direction.x = x - this.position.x;
        this.direction.y = y - this.position.y;
    }
}
class Enemy{
    constructor(x,y,width){
        this.x = x;
        this.y = y;
        //this.img 
        this.img = new Image();
        this.time = 0; //so we know when to switch frames to animate
        this.width = width;
    }
    setImg(imgsrc){
        this.imgsrc = imgsrc
        this.img.src = imgsrc;
    }
}
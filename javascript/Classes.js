class Line{
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
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
        this.r = r;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.angle = 0;
        this.canMove = true;
        this.canTurn = true;
    }
}
class Ray{
    constructor(x1, y1){
        this.position = new Point(x1, y1);
        this.direction = new Point(1, 1); //this is a direction of a vector
        this.collidedPoints = [];
        this.closestPoint;
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.direction.x*10, this.position.y + this.direction.y*10);
        ctx.stroke();
    }
    intersects(line){
        let x1 = line.p1.x;
        let y1 = line.p1.y;
        let x2 = line.p2.x;
        let y2 = line.p2.y;

        let x3 = this.position.x;
        let y3 = this.position.y;
        let x4 = this.position.x + this.direction.x;
        let y4 = this.position.y + this.direction.y;

        let denominator = (x1 - x2)*(y3 - y4)-(y1 - y2)*(x3 - x4); //you get t and you by deviding something with this denominator
        if(denominator == 0){ //this would mean the lines are parallel and they will never intersect
            return; //we don't want devision by 0 so we jump out
        }
        let t = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4))/denominator;
        let u = -((x1 - x2)*(y1 - y3) - (y1 - y2)*(x1 - x3))/denominator;

        if(t>=0 && t<=1 && u>=0){
            let pointOfIntersection = new Point(x1+t*(x2-x1), y1+t*(y2-y1));
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
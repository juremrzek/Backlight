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
    }
}
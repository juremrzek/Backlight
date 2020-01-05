let optionFlag = 0;
let options = [];
options[0] = "Start game";
options[1] = "Options";
options[2] = "About";
let menu = true;

ctx.font = "60px Arial";
ctx.fillStyle = "yellow";
drawMenu();
function drawMenu(){
    if(optionFlag >= options.length)
        optionFlag = 0;
    if(optionFlag < 0)
        optionFlag = options.length-1;
    for(let i=0; i<options.length; i++){
        ctx.fillText(options[i], canvas.width/2-100, canvas.height/2-150+150*i);
    }
    let pointer = new Image();
    pointer.src = "img/pointer.png";
    pointer.onload = () => {
        pointer.width = pointer.naturalWidth / 13;
        pointer.height = pointer.naturalHeight / 11;
        ctx.drawImage(pointer, canvas.width/2-200, canvas.height/4+150*optionFlag, pointer.width, pointer.height);
    }
}
window.addEventListener("keydown", (event) => {
    if(menu){
        key = event.keyCode;
        //console.log(key);
        if(key == 87 || key == 38){
            optionFlag--;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMenu();
        }
        if(key == 83 || key == 40){
            optionFlag++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMenu();
        }
        if(key == 13 || key == 32){
            switch(optionFlag){
                case 0:
                    generateMaze();
                    menu = false;
                    break;
                case 1:
                    console.log("options");
                    break;
                case 2:
                    console.log("about");
                    break;
            }
            
        }
    }
});
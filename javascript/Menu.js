let optionFlag = 0;
let options = [];
options[0] = "Start game";
options[1] = "How to play";
options[2] = "About";
let menu = true;
ctx.fillStyle = "white";
ctx.font = "60px Arial";
drawMenu();
function drawMenu(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(optionFlag >= options.length)
        optionFlag = 0;
    if(optionFlag < 0)
        optionFlag = options.length-1;
    for(let i=0; i<options.length; i++){
        if(options[i] == options[optionFlag])
            ctx.fillStyle = "#fff200";
        else
            ctx.fillStyle = "white";
        ctx.fillText(options[i], canvas.width/2-100, canvas.height/3+100+150*i);
    }
    let title = new Image();
    title.src = "img/title.png";
    title.onload = () => {
        title.width = title.naturalWidth/1.5;
        title.height = title.naturalHeight/1.5;
        ctx.drawImage(title, canvas.width/4, canvas.height/20, title.width, title.height);
    }
    let pointer = new Image();
    pointer.src = "img/pointer.png";
    pointer.onload = () => {
        pointer.width = pointer.naturalWidth / 13;
        pointer.height = pointer.naturalHeight / 11;
        ctx.drawImage(pointer, canvas.width/2-200, canvas.height/3+50+150*optionFlag, pointer.width, pointer.height);
    }
}
window.addEventListener("keydown", (event) => {
    key = event.keyCode;
    if(menu){
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
                    menu = false;
                    generateMaze();
                    break;
                case 1:
                    menu = false;
                    howTo();
                    break;
                case 2:
                    menu = false;
                    about();
                    break;
            }
            
        }
    }
    else{
        if(optionFlag != 0){
            if(key == 13 || key == 32){
                console.log("i mean it should");
                location.reload();
            }
        }
                
    }
});

function howTo(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "45px Arial";
    ctx.fillText("The player can be moved by pressing WASD keys.", 80, 150);
    ctx.fillText("Use the left and right arrow key to turn around.", 80, 250);
    ctx.fillText("To finish the game, you must get to to the finish line,", 80, 350);
    ctx.fillText("which is on a green colored square.", 80, 400);
    ctx.fillText("Watch the minimap on the top right for help.", 80, 500);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFF200";
    ctx.fillText("Press enter or space to continue", 400, 640);
}
function about(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "45px Arial";
    ctx.fillText("Program made by Jure Mržek.", 80, 200);
    ctx.fillText("Wallpaper made by Vera Kratochvil on website", 80, 300);
    ctx.fillText("PublicDomainPictures.net", 80, 350);
    ctx.fillText("The program randomly generates a maze using", 80, 450);
    ctx.fillText("backtracking algorithm, then projects a first-person", 80, 500);
    ctx.fillText("view by casting rays in front of the player.", 80, 550);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFF200";
    ctx.fillText("Press enter or space to continue", 400, 640);
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];

const pawImg = new Image()
const bgImg = new Image()

pawImg.src = './img/pawn.png'
bgImg.src = './img/background.png'
// const camera = {
//     x: 0,
//     y: 0
// }
ctx.font = '25px Silkscreen';
ctx.strokeStyle = 'white'


let player = {
    x: 0,
    y: 0,
    width: 80,
    height: 155,

    moveLeft: false,
    moveRight: false,
    moveDown: false,
    moveUp: false,
    velocity: 2.5
}
player.x -= player.width / 2
player.y -= player.height / 2

const room = {
    width: 640,
    height: 640,
    x: -320,
    y: -320
}


document.addEventListener('keydown', function(e){
    if(e.keyCode === 68){player.moveRight = true}
    if(e.keyCode === 65){player.moveLeft = true}
    if(e.keyCode === 83){player.moveDown = true}
    if(e.keyCode === 87){player.moveUp = true}

    if(e.key === 'ArrowRight'){player.moveRight = true}
    if(e.key === 'ArrowLeft'){player.moveLeft = true}
    if(e.key === 'ArrowDown'){player.moveDown = true}
    if(e.key === 'ArrowUp'){player.moveUp = true}
})
document.addEventListener('keyup', function(e){
    if(e.keyCode === 68){player.moveRight = false}
    if(e.keyCode === 65){player.moveLeft = false}
    if(e.keyCode === 83){player.moveDown = false}
    if(e.keyCode === 87){player.moveUp = false}

    if(e.key === 'ArrowRight'){player.moveRight = false}
    if(e.key === 'ArrowLeft'){player.moveLeft = false}
    if(e.key === 'ArrowDown'){player.moveDown = false}
    if(e.key === 'ArrowUp'){player.moveUp = false}
})

function draw(){
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    ctx.translate(canvas.width / 2, canvas.height / 2)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // for(let i=0;i<Math.floor(room.width/10);i+=2){
    //     ctx.fillRect((10*i) + room.width, 0, Math.floor(room.width/10), Math.floor(room.width/10))
    // }


    // movement for player
    if(player.moveLeft){ player.x-=player.velocity }
    if(player.moveRight){ player.x+=player.velocity }
    if(player.moveDown){ player.y+=player.velocity }
    if(player.moveUp){ player.y-=player.velocity }

    // check collision, exit to room
    if(player.x + player.width > room.x + room.width){
        player.moveRight = false;
        player.x -= player.velocity
    } 
    if(player.x < room.x){
        player.moveLeft = false;
        player.x += player.velocity
    } 
    if(player.y + player.height > room.y + room.height){
        player.moveUp = false;
        player.y -= player.velocity
    } 
    if(player.y + player.height - 27 < room.y){
        player.moveDown = false;
        player.y += player.velocity
    }
    if(player.x > room.x && player.x + player.width < room.x + room.width &&
    player.y > room.y && player.y + player.height < room.y + room.height
    ){velocity = 0} else {
        player.velocity = 2.5
    }

    ctx.fillStyle = '#252525'
    body.style.backgroundColor = '#252525'

    ctx.fillRect((canvas.width / 2) * -1, (canvas.height / 2) * -1, canvas.width, canvas.height)

    ctx.fillStyle = 'white';
    for (let i = 0; i < room.width / player.width / 2; i++) { 
        for (let j = 0; j < room.width / player.width / 2; j++) {
            ctx.drawImage(bgImg, room.x + (player.width * 2) * j, room.y + (player.width * 2) * i, player.width * 2, player.width * 2);
            // ctx.drawImage(bgImg, ((room.x + (player.width * 2) * j)-player.x)-player.width / 2, ((room.y + (player.width * 2) * i)-player.y)-player.height / 2, player.width * 2, player.width * 2);
        }

    }
    // for (let i = 0; i < room.width / player.width; i++) {
    //     ctx.fillText(8 - i, room.x - 40, room.y + (player.width) * i + 45);
    // }
    

    ctx.drawImage(pawImg, player.x, player.y, player.width, player.height)
    // ctx.drawImage(pawImg, 0-player.width / 2, 0-player.height / 2, player.width, player.height)
    requestAnimationFrame(draw)
}
document.onload = draw()

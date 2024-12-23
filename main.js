const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];

const pawImg = new Image()
const bgImg = new Image()
const gunImg = new Image()
const bulletImg = new Image()

pawImg.src = './img/pawn.png';
bgImg.src = './img/background.png';
gunImg.src = './img/gun.png';
bulletImg.src = './img/bullet.png';

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
    velocity: 2.5,
    isShoot: false
}
player.x -= player.width / 2
player.y -= player.height / 2

const room = {
    width: 640,
    height: 640,
    x: -320,
    y: -320
}
let allBullet = []

let cursorX, cursorY

document.addEventListener('keydown', function(e){
    if(e.keyCode === 68){player.moveRight = true}
    if(e.keyCode === 65){player.moveLeft = true}
    if(e.keyCode === 83){player.moveDown = true}
    if(e.keyCode === 87){player.moveUp = true}

    if(e.key === 'ArrowRight'){player.moveRight = true}
    if(e.key === 'ArrowLeft'){player.moveLeft = true}
    if(e.key === 'ArrowDown'){player.moveDown = true}
    if(e.key === 'ArrowUp'){player.moveUp = true}
});
document.addEventListener('keyup', function(e){
    if(e.keyCode === 68){player.moveRight = false}
    if(e.keyCode === 65){player.moveLeft = false}
    if(e.keyCode === 83){player.moveDown = false}
    if(e.keyCode === 87){player.moveUp = false}

    if(e.key === 'ArrowRight'){player.moveRight = false}
    if(e.key === 'ArrowLeft'){player.moveLeft = false}
    if(e.key === 'ArrowDown'){player.moveDown = false}
    if(e.key === 'ArrowUp'){player.moveUp = false}
});
document.onmousemove = function (e) {
    const rect = canvas.getBoundingClientRect();
    cursorX = e.clientX - rect.left - canvas.width / 2;
    cursorY = e.clientY - rect.top - canvas.height / 2;
};
document.addEventListener('click', function(){
    player.isShoot = true
})

function draw() {
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // movement player
    if (player.moveLeft) player.x -= player.velocity;
    if (player.moveRight) player.x += player.velocity;
    if (player.moveDown) player.y += player.velocity;
    if (player.moveUp) player.y -= player.velocity;

    // collision with wall at room
    if (player.x + player.width > room.x + room.width) {
        player.moveRight = false;
        player.x -= player.velocity;
    }
    if (player.x < room.x) {
        player.moveLeft = false;
        player.x += player.velocity;
    }
    if (player.y + player.height > room.y + room.height) {
        player.moveUp = false;
        player.y -= player.velocity;
    }
    if (player.y + player.height - 27 < room.y) {
        player.moveDown = false;
        player.y += player.velocity;
    }

    ctx.fillStyle = '#252525';
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // draw room
    for (let i = 0; i < room.width / player.width / 2; i++) {
        for (let j = 0; j < room.width / player.width / 2; j++) {
            ctx.drawImage(
                bgImg,
                room.x + player.width * 2 * j,
                room.y + player.width * 2 * i,
                player.width * 2,
                player.width * 2
            );
        }
    }
    if (player.isShoot) {
        angle = Math.atan2(cursorY - (player.y + 85), cursorX - (player.x + 60));
    
        allBullet.push({
            x: player.x + 60 + Math.cos(angle) * 50,
            y: player.y + 65 + Math.sin(angle) * 50,
            angle: angle,
        });
    
        player.isShoot = false;
    }
    for (let i = 0; i < allBullet.length; i++) {
        const bullet = allBullet[i];

        bullet.x += Math.cos(bullet.angle) * 10;
        bullet.y += Math.sin(bullet.angle) * 10;
    
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.angle);
        ctx.drawImage(bulletImg, -6, -7.5, 12, 15);
        ctx.restore();
    }
    

    ctx.save();
    ctx.translate(player.x + 60, player.y + 85);
    angle = Math.atan2(cursorY - (player.y + 85), cursorX - (player.x + 60));
    ctx.rotate(angle);
    ctx.drawImage(gunImg, -5, -15, 75, 50);


    ctx.restore();

    ctx.drawImage(pawImg, player.x, player.y, player.width, player.height);
    requestAnimationFrame(draw);
}
document.onload = draw()
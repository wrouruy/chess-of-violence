const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];

const pawImg = new Image()
const bgImg = new Image()
const gunImg = new Image()
const bulletImg = new Image()
const dummyImg = new Image()

pawImg.src = './img/pawn.png';
bgImg.src = './img/background.png';
gunImg.src = './img/gun.png';
bulletImg.src = './img/bullet.png';
dummyImg.src = './img/dummy.png';

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
};
let dummy = {
    x: -40,
    y: -350,
    width: 80,
    height: 155,
    hp: 100,
    timeout: 0 
};

player.x -= player.width / 2
player.y -= player.height / 2

const room = {
    width: 640,
    height: 640,
    x: -320,
    y: -320
}
let allBullet = []
let cursorX, cursorY;

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
document.addEventListener('click', function(){ player.isShoot = true });

function draw() {
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // movement player
    if (player.moveLeft) player.x -= player.velocity;
    if (player.moveRight) player.x += player.velocity;
    if (player.moveDown) player.y += player.velocity;
    if (player.moveUp) player.y -= player.velocity;

    // collision player with wall of room
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

    // draw grey background
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
    }}

    // event for shoot a bullet
    angle = Math.atan2(cursorY - (player.y + 85), cursorX - (player.x + 60));
    if (player.isShoot) {
        allBullet.push({
            x: player.x + 60 + Math.cos(angle) * 50,
            y: player.y + 65 + Math.sin(angle) * 50,
            angle: angle,
        });
        player.isShoot = false;
    }
    // move a bullet
    for (let i = 0; i < allBullet.length; i++) {
        const bullet = allBullet[i];

        bullet.x += Math.cos(bullet.angle) * 20;
        bullet.y += Math.sin(bullet.angle) * 20;
    
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.angle);
        ctx.drawImage(bulletImg, -6, -7.5, 12, 15);
        ctx.restore();

        if(allBullet[i].x > dummy.x && allBullet[i].x < dummy.x + dummy.width && 
            allBullet[i].y > dummy.y && allBullet[i].y < dummy.y + dummy.height 
        ){
            if(dummy.timeout <= 0) dummy.hp -= 10;
            dummy.timeout = 20
        }
        dummy.timeout -= 1

        // // collision bullet with wall of room
        // if (allBullet.length > 0 && allBullet[i].x < room.x + 25) allBullet.splice(i, 1);
        // if(allBullet.length > 0 && allBullet[i].x > room.x + room.width - 25) allBullet.splice(i, 1);
        // if(allBullet.length > 0 && allBullet[i].y < room.y + 25) allBullet.splice(i, 1);
        // if(allBullet.length > 0 && allBullet[i].y > room.y + room.height - 25) allBullet.splice(i, 1);
    }
    if(dummy.hp > 0){
        ctx.fillStyle = 'green'
        ctx.fillRect(dummy.x - 10, dummy.y - 20, dummy.hp, 15) 
        ctx.strokeRect(dummy.x - 10, dummy.y - 20, 100, 15)
        ctx.font = '15px Silkscreen';
        ctx.fillStyle = 'black'
        ctx.fillText(`${dummy.hp} hp`, dummy.x - 5, dummy.y - 7.5)
        ctx.drawImage(dummyImg, dummy.x, dummy.y, dummy.width, dummy.height) // draw dummy
    }
    ctx.drawImage(pawImg, player.x, player.y, player.width, player.height); // draw paw(player)
    
    // draw a gun
    ctx.save();
    ctx.translate(player.x + 60, player.y + 85);
    ctx.rotate(angle);
    ctx.drawImage(gunImg, -5, -30, 75, 50);
    ctx.restore();

    requestAnimationFrame(draw);
}
document.onload = draw()
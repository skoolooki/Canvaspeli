const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let canvasPosition = canvas.getBoundingClientRect();

// player class
class Player {
    constructor(){
        // player Speed
        this.speed = {
            x: 0,
            y: 0
        } 
        const image = new Image()
        image.src = "./images/nelio.png"
        image.onload = ()=>{
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                // player start position
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }       
    }
    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y)

    }
    update(){
        if (this.image){
            this.draw()
            this.position.x += this.speed.x
        }
    }
}
/*
// invader class
class Invader {
    constructor()
}
// grid class
class InvaderGrid {
    constructor()
}
// projectile class
class Projectile {
    constructor()
}
*/

// Mouse movement

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    move: false
}
    canvas.addEventListener("mousemove", function(e){
    mouse.move = true
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    //console.log(mouse.x, mouse.y)
});

// Keys for moving player
const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

const player = new Player()


function playerMovement(){
    // if a is pressed and player is not at the end of left canvas corner player, move left
    if (keys.a.pressed && player.position.x >=0){
        player.speed.x = -5
    // if d is pressed and player is not at the end of right canvas corner player, move right
    } else if (keys.d.pressed && player.position.x +player.width <= canvas.width){
        player.speed.x = 5
    }else{
    // if nothing is pressed stay still
        player.speed.x = 0
    }

}

// animate

function animate(){
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    playerMovement()
}
animate()

// key switches 
addEventListener('keydown', ({key}) =>{
    console.log(key)
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break;
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break;
    }
})
addEventListener('keyup', ({key}) =>{
    console.log(key)
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = false
            break;
        case 'd':
            console.log('right')
            keys.d.pressed = false
            break;
        case ' ':
            console.log('space')
            break;
    }
})
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

// Enemy //
class Enemy {
    constructor({position}){
        this.speed = {
            x: 0,
            y: 0
        }
         //img setup
        const image = new Image()
        image.src = './images/invader.png'
        //image scale and position on load
        image.onload = () => {
            const scale = 0.5
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    // Image setpp on Canvas //
    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    // updates img position
    update({speed}){
        if (this.image){
            this.draw()
            this.position.x += speed.x
            this.position.y += speed.y
        }
    }
}
// create random grid of enemys  // 
class EnemyGrid {
    // position, speed and array
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.speed = {
            x: 3,
            y: 0
        }
        this.enemys = []
        // random amount of rows and columns
        const rows = Math.floor(Math.random() * 3 + 2);
        const columns = Math.floor(Math.random() * 5 + 5);
        this.width = columns * 40
        // create and push new array
        for (let x = 0; x < columns; x++){
            for (let y = 0; y < rows; y++){
                this.enemys.push(new Enemy({
                    position: {
                        x: x * 40,
                        y: y * 40
                    }
                }))
            }
        }
    }

    update(){
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        this.speed.y = 0
        if(this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.speed.x = -this.speed.x
            this.speed.y = 30
        }
    }
}
class Bullet {
    constructor({position, speed}){
        this.position = position
        this.speed = speed

        this.radius = 3
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}


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
    x: {
        pressed: false
    },
    y: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

const player = new Player()
const grids = []
const bullets = []
let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)


function playerMovement(){
    // if x is pressed and player is not at the end of left canvas corner player, move left
    if (keys.x.pressed && player.position.x >=0){
        player.speed.x = -5
    // if y is pressed and player is not at the end of right canvas corner player, move right
    } else if (keys.y.pressed && player.position.x +player.width <= canvas.width){
        player.speed.x = 5
    }else{
    // if nothing is pressed stay still and if in corner speed = 0
        player.speed.x = 0
    }

}
function shoot(){
    bullets.forEach((bullet) => {
        bullet.update()
    })
}
function spawnEnemys(){
    grids.forEach((grid)=>{
        grid.update()
        grid.enemys.forEach((enemy)=>{
            enemy.update({speed: grid.speed})
        })
        
    })
    // spawn new grid at random
    if (frames % randomInterval === 0){
        grids.push(new EnemyGrid())
        randomInterval = Math.floor(Math.random() * 100 + 500)
        frames = 0
        console.log(grids)
    }
    frames ++
}

// animate

function animate(){
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    playerMovement()
    shoot()
    spawnEnemys()
}
animate()

// key down switches 
addEventListener('keydown', ({key}) =>{
    console.log(key)
    switch (key) {
        case 'x':
            console.log('left')
            keys.x.pressed = true
            break;
        case 'y':
            console.log('right')
            keys.y.pressed = true
            break;
        case ' ':
            console.log('space')
            bullets.push(new Bullet({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                speed: {
                    x: 0,
                    y: -10
                }
                }))
            console.log(bullets)
            break;
    }
})
addEventListener("keyup",({key})=>{
    switch(key){
        case "x": keys.x.pressed = false
        break
        case "y": keys.y.pressed = false
        break
        case " ": keys.space.pressed = false
        break
    }
})
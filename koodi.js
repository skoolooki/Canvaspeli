const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


class Player {
    constructor(){
        // player Speed
        this.speed = {
            x: 0
        }

        const image = new Image()
        image.src = "./images/ship.png"
        image.onload = ()=>{
            const scale = 0.9
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        if (this.image){
            this.draw()
            this.position.x += this.speed.x
            // this.position.y += speed.y
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
const player = new Player()
const bullets = []



const keys = {
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
/*
function bulletShoot(){
    
    if (keys.space.pressed){
        bullet.draw()
        console.log("space pressed")
    }
}
*/
function playerMovement(){
    if (keys.x.pressed && player.position.x >= 0){
        player.speed.x = -5
    } else if (keys.y.pressed && player.position.x + player.width <= canvas.width ){
        player.speed.x = 5
    } else {
        player.speed.x = 0
    }
}


function animate(){
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    playerMovement()


    bullets.forEach((bullet) => {
        bullet.update()
        if (bullet.position.y <= -700){
            bullets.shift()
            console.log("deleted")
        }
    })
}
animate()


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
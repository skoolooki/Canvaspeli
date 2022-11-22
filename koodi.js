const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height / 2 - this.height + 240
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
            // this.position.y += speed.y
        }
    }
}

const player = new Player()

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
    ctx.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    playerMovement()
}

animate()


addEventListener("keydown",({key})=>{
    switch(key){
        case "x": keys.x.pressed = true
        break
        case "y": keys.y.pressed = true
        break
        case " ": keys.space.pressed = true
        break
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

// const player = {
//     x: 20,
//     y: 20,
//     width: 65,
//     height: 20,
// }

// function playerBody(){
//     ctx.fillRect(player.x, player.y, player.width, player.height)
// }
// function enemies(){
//     playerBody()

//     requestAnimationFrame(enemies)
//     console.log(123)
// }


// enemies()
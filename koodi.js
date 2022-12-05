const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreOnScreen = document.querySelector('#number');
const startGameBtn = document.querySelector('#start')
let canvasPosition = canvas.getBoundingClientRect();



// player class
class Player {
    constructor(){
        // player Speed
        this.speed = {
            x: 0,
            y: 0
        }
        this.opacity = 1
        const image = new Image()
        image.src = "./images/ship.png"
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
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.drawImage(this.image, this.position.x, this.position.y)
        ctx.restore()
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
        image.src = './images/enemy.png'
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
    enemyShoot(enemyBullets){
        enemyBullets.push(new EnemyBullet({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            speed: {
                x:0,
                y: 5
            }
        }))
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

class EnemyBullet {
    constructor({position, speed}){
        this.position = position
        this.speed = speed
        this.width = 3
        this.height = 10
    }
    draw(){
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
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
const enemyBullets = []
let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true,
}
let score = 0



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
    bullets.forEach((bullet, index)=>{
        if(bullet.position.y + bullet.radius <= 0){
            setTimeout(()=>{
                bullets.splice(index, 1)
            },0)
        }else{
            bullet.update()
        }
    })
}
function win(){
    if(score === 100){
        grids.forEach((grid, gridIndex)=>{
            grids.splice(gridIndex, 1)
            grid.update()
            setTimeout(()=>{
                game.over = true
                //console.log('You Win')
                gameOver()
            },0)
            setTimeout(()=>{
                game.active = false
            },100)
        })
    }
}

function spawnEnemys(){
        // spawn enemys
        grids.forEach((grid, gridIndex)=>{
            grid.update()


            if(frames % 100 === 0 && grid.enemys.length >0){
                grid.enemys[Math.floor(Math.random()* grid.enemys.length)].enemyShoot(enemyBullets)
            }

            grid.enemys.forEach((enemy, i)=>{
                enemy.update({speed: grid.speed})

                // collision detection
                bullets.forEach((bullet, j)=>{
                    if(
                    bullet.position.y - bullet.radius <=
                    enemy.position.y + enemy.height && 
                    bullet.position.x + bullet.radius >=
                    enemy.position.x && 
                    bullet.position.x - bullet.radius <=
                    enemy.position.x + enemy.width &&
                    bullet.position.y + bullet.radius >=
                    enemy.position.y
                ){
                    // Garbage controll and score
                    setTimeout(()=>{
                    const enemyFound = grid.enemys.find((enemy2) => enemy2 === enemy)
                    const bulletFound = bullets.find((bullet2) => bullet2 === bullet)
                    
                    if(enemyFound && bulletFound){
                        score += 1
                        console.log(score)
                        scoreOnScreen.innerHTML = score
                        grid.enemys.splice(i, 1)
                        bullets.splice(j, 1)
                        // set new left and right for enemyGrid
                        if(grid.enemys.length > 0){
                            const firstEnemy = grid.enemys[0]
                            const lastEnemy = grid.enemys[grid.enemys.length - 1]

                            grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                            grid.position.x = firstEnemy.position.x
                        } else {
                            grids.splice(gridIndex, 1)
                        }
                        }
                    }, 0)

                }
                // if enemy is to fardown gameover
                if(enemy.position.y >= player.position.y){
                    //console.log('dead')
                    setTimeout(()=>{
                        player.opacity = 0
                        game.over = true
                    },0)
                    setTimeout(()=>{
                        game.active = false
                    },100)
                }
            })
            
        })
    })
        // create and push new enemygrid at random
    if (frames % randomInterval === 0){
        grids.push(new EnemyGrid())
        randomInterval = Math.floor(Math.random() * 100 + 500)
        frames = 0
        //console.log(grids)
    }
    frames ++
}

function gameOver(){
    document.getElementById("section").style.display = "none"
    document.getElementById("winsection").style.display = "block"
}
function startGameAgain(){
    /*
    player.opacity = 1
    //console.log("works")
    score = 0
    game.over = false
    game.active = true
    animate()
    document.getElementById("winsection").style.display = "none"
    document.getElementById("section").style.display = "block"
    */
    location.reload()
}

function enemyShoots(){
    enemyBullets.forEach((enemyBullet, index)=>{
        if(enemyBullet.position.y + enemyBullet.height >= canvas.height){
            setTimeout(()=>{
                enemyBullets.splice(index, 1)
            }, 0)
        }else
        enemyBullet.update()
        // enemy bullets collision detection
        if(enemyBullet.position.y + enemyBullet.height >= player.position.y &&
            enemyBullet.position.x + enemyBullet.width >= player.position.x &&
            enemyBullet.position.x <= player.position.x + player.width){
                //console.log('GameOver')
                setTimeout(()=>{
                    enemyBullets.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                },0)
                setTimeout(()=>{
                    game.active = false
                },100)
                gameOver()
            }
    })
}

// animate

function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    playerMovement()
    shoot()
    spawnEnemys()
    enemyShoots()
    win()

}
startGameBtn.addEventListener('click', function(){
    animate()
    startGameBtn.style.display = 'none'
    //console.log('Game Started')
})




// key down switches 
addEventListener('keypress', ({key}) =>{
    if(game.over) return
    //console.log(key)
    switch (key) {
        case 'x':
            //console.log('left')
            keys.x.pressed = true
            break;
        case 'y':
            //console.log('right')
            keys.y.pressed = true
            break;
        case ' ':
            
            //console.log('space')
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
            //console.log(bullets)
            break;
    }
})
// key up switches
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
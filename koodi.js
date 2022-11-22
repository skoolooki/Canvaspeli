const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const enemy = {
    x: 20,
    y: 20,
    width: 65,
    height: 20,
}

function enemyBody(){
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
}
function enemies(){
    enemyBody()

    requestAnimationFrame(enemies)
    console.log(123)
}


enemies()
player()
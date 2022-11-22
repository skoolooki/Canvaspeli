const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// player class
class Player {
    constructor()
}

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

// animate

// movement
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const nave = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tamanho: 20
};
/******
 *NAVE*
 ******/
function desenharNave() {
    ctx.beginPath();

    ctx.moveTo(nave.x + nave.tamanho, nave.y);
    ctx.lineTo(nave.x - nave.tamanho, nave.y - nave.tamanho / 2);
    ctx.lineTo(nave.x - nave.tamanho, nave.y + nave.tamanho / 2);

    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fill();
}

desenharNave();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharNave();
    requestAnimationFrame(gameLoop);
}

let teclas = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false
};

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp" || event.key === "w") {
        teclas.cima = true;
    }

    if (event.key === "ArrowDown" || event.key === "s") {
        teclas.baixo = true;
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
        teclas.esquerda = true;
    }

    if (event.key === "ArrowRight" || event.key === "d") {
        teclas.direita = true;
    }

});

document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowUp" || event.key === "w") {
        teclas.cima = false;
    }

    if (event.key === "ArrowDown" || event.key === "s") {
        teclas.baixo = false;
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
        teclas.esquerda = false;
    }

    if (event.key === "ArrowRight" || event.key === "d") {
        teclas.direita = false;
    }

});

function gameLoop() {

    if (teclas.cima) {
        nave.y -= 5;
    }

    if (teclas.baixo) {
        nave.y += 5;
    }

    if (teclas.esquerda) {
        nave.x -= 5;
    }

    if (teclas.direita) {
        nave.x += 5;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNave();

    requestAnimationFrame(gameLoop);
}

gameLoop();

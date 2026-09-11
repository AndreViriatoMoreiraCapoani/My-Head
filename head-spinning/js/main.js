const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const nave = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tamanho: 20,
    velocidade: 5
};

const tiros = [];

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

let teclas = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false
};

document.addEventListener("keydown", function(event) {

    if (event.key === " ") {
    tiros.push({
        x: nave.x + nave.tamanho,
        y: nave.y,
        velocidade: 10
    });
}

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
        nave.y -= nave.velocidade;
    }

    if (teclas.baixo) {
        nave.y += nave.velocidade;
    }

    if (teclas.esquerda) {
        nave.x -= nave.velocidade;
    }

    if (teclas.direita) {
        nave.x += nave.velocidade;
    }

    if (nave.x < nave.tamanho) {
        nave.x = nave.tamanho;
    }

    if (nave.x > canvas.width - nave.tamanho) {
        nave.x = canvas.width - nave.tamanho;
    }

    if (nave.y < nave.tamanho) {
        nave.y = nave.tamanho;
    }

    if (nave.y > canvas.height - nave.tamanho) {
        nave.y = canvas.height - nave.tamanho;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNave();
    desenharTiros();

    requestAnimationFrame(gameLoop);
}

function desenharTiros() {
    for (let i = tiros.length - 1; i >= 0; i--) {
        const tiro = tiros[i];

        tiro.x += tiro.velocidade;

        ctx.fillStyle = "yellow";
        ctx.fillRect(tiro.x, tiro.y - 2, 10, 4);

        if (tiro.x > canvas.width) {
            tiros.splice(i, 1);
        }
    }
}

gameLoop();
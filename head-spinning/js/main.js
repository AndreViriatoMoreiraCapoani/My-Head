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
    desenharNave();

    requestAnimationFrame(gameLoop);
};
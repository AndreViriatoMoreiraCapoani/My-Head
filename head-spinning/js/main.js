const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

/*****
*NAVE*
*****/

const nave = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tamanho: 20,
    velocidade: 5,
    vida: 3
};

let pontuacao = 0;

/****************
*ESTADO DO JOGO*
****************/

let estadoJogo = "start";
let konamiAtivado = false;

/******
*TIROS*
******/

const tiros = [];

/**********
*INIMIGOS*
**********/

const inimigos = [];
const tirosInimigos = [];

function criarInimigo() {
    if (estadoJogo !== "jogando") return;

    inimigos.push({
        x: canvas.width,
        y: Math.random() * canvas.height,
        tamanho: 20,
        velocidade: 3
    });
}

function inimigoAtira() {
    if (estadoJogo !== "jogando") return;
    if (inimigos.length === 0) return;

    const indice = Math.floor(Math.random() * inimigos.length);
    const inimigo = inimigos[indice];

    tirosInimigos.push({
        x: inimigo.x - inimigo.tamanho,
        y: inimigo.y,
        velocidade: 6
    });
}

/*******************
*SKIN DOS INIMIGOS*
*******************/

const imgInimigoSkin = new Image();
imgInimigoSkin.src = "head-gif.gif";

/********
*COLISÃO*
********/

function colide(obj1, tam1, obj2, tam2) {
    return Math.abs(obj1.x - obj2.x) < (tam1 + tam2) &&
           Math.abs(obj1.y - obj2.y) < (tam1 + tam2);
}

/*************
*KONAMI CODE*
*************/

const sequenciaKonami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let bufferKonami = [];

function verificarKonami(tecla) {
    bufferKonami.push(tecla);

    if (bufferKonami.length > sequenciaKonami.length) {
        bufferKonami.shift();
    }

    if (bufferKonami.join(",") === sequenciaKonami.join(",")) {
        konamiAtivado = true;
        bufferKonami = [];
    }
}

/***************
 *DESENHAR NAVE*
 ***************/

function desenharNave() {
    ctx.beginPath();

    ctx.moveTo(
        nave.x + nave.tamanho,
        nave.y
    );

    ctx.lineTo(
        nave.x - nave.tamanho,
        nave.y - nave.tamanho / 2
    );

    ctx.lineTo(
        nave.x - nave.tamanho,
        nave.y + nave.tamanho / 2
    );

    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fill();
}

/**************
*TELA DE START*
**************/

function desenharTelaStart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    desenharNave();

    ctx.textAlign = "center";

    ctx.fillStyle = "red";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText("ARCADE SPACE", canvas.width / 2, canvas.height / 2 - 120);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Pressione ESPAÇO para começar", canvas.width / 2, canvas.height / 2 + 80);

    if (konamiAtivado) {
        ctx.fillStyle = "yellow";
        ctx.font = "18px sans-serif";
        ctx.fillText("CRÉDITOS: Rafael — código Konami ativado! Skin de inimigo desbloqueada.", canvas.width / 2, canvas.height / 2 + 120);
    }

    ctx.textAlign = "start";
}

/**********
*CONTROLES*
***********/

let teclas = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false
};

document.addEventListener("keydown", function(event) {

    // Atirar

    if (event.key === " ") {
        tiros.push({
            x: nave.x + nave.tamanho,
            y: nave.y,
            velocidade: 10
        });
    }

    // Movimento

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



/***************
*DESENHAR TIROS*
***************/

function desenharTiros() {
    for (let i = tiros.length - 1; i >= 0; i--) {
        const tiro = tiros[i];
        tiro.x += tiro.velocidade;

        ctx.fillStyle = "yellow";
        ctx.fillRect(tiro.x, tiro.y - 2, 10, 4);

        let acertou = false;

        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];
            if (colide(tiro, 5, inimigo, inimigo.tamanho)) {
                inimigos.splice(j, 1);
                pontuacao += 10;
                acertou = true;
                break;
            }
        }

        if (acertou || tiro.x > canvas.width) {
            tiros.splice(i, 1);
        }
    }
}

/******************
*DESENHAR INIMIGOS*
******************/

function desenharInimigos() {
    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        inimigo.x -= inimigo.velocidade;

        if (konamiAtivado && imgInimigoSkin.complete) {
            ctx.drawImage(
                imgInimigoSkin,
                inimigo.x - inimigo.tamanho,
                inimigo.y - inimigo.tamanho,
                inimigo.tamanho * 2,
                inimigo.tamanho * 2
            );
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(
                inimigo.x - inimigo.tamanho,
                inimigo.y - inimigo.tamanho,
                inimigo.tamanho * 2,
                inimigo.tamanho * 2
            );
        }

        if (colide(nave, nave.tamanho, inimigo, inimigo.tamanho)) {
            nave.vida--;
            inimigos.splice(i, 1);
            continue;
        }

        if (inimigo.x < 0) {
            inimigos.splice(i, 1);
        }
    }
}

/**************************
*DESENHAR TIROS INIMIGOS*
**************************/

function desenharTirosInimigos() {
    for (let i = tirosInimigos.length - 1; i >= 0; i--) {
        const tiro = tirosInimigos[i];
        tiro.x -= tiro.velocidade;

        ctx.fillStyle = "orange";
        ctx.fillRect(tiro.x, tiro.y - 2, 10, 4);

        if (colide(nave, nave.tamanho, tiro, 5)) {
            nave.vida--;
            tirosInimigos.splice(i, 1);
            continue;
        }

        if (tiro.x < 0) {
            tirosInimigos.splice(i, 1);
        }
    }
}

/**********
*GAME LOOP*
**********/

function gameLoop() {

    if (estadoJogo === "start") {
        desenharTelaStart();
        requestAnimationFrame(gameLoop);
        return;
    }

    if (nave.vida <= 0) {
        estadoJogo = "gameover";
        desenharTelaGameOver();
        return;
    }

    // Movimento da nave

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

    // Limites da tela

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

    // Limpa a tela

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNave();
    desenharTiros();
    desenharInimigos();
    desenharTirosInimigos();

    // HUD

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Vida: " + nave.vida, 20, 30);
    ctx.fillText("Pontos: " + pontuacao, 20, 55);

    requestAnimationFrame(gameLoop);
}

/*********
*GAME OVER*
*********/

const botaoReiniciar = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 + 40,
    largura: 200,
    altura: 50
};

function desenharTelaGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = "24px sans-serif";
    ctx.fillText("Pontuação final: " + pontuacao, canvas.width / 2, canvas.height / 2 - 10);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(botaoReiniciar.x, botaoReiniciar.y, botaoReiniciar.largura, botaoReiniciar.altura);

    ctx.fillStyle = "white";
    ctx.font = "22px sans-serif";
    ctx.fillText("REINICIAR", canvas.width / 2, botaoReiniciar.y + 32);

    ctx.textAlign = "start";
}

function reiniciarJogo() {
    nave.x = canvas.width / 2;
    nave.y = canvas.height / 2;
    nave.vida = 3;

    pontuacao = 0;
    estadoJogo = "jogando";

    tiros.length = 0;
    inimigos.length = 0;
    tirosInimigos.length = 0;

    gameLoop();
}

canvas.addEventListener("click", function(event) {
    if (estadoJogo !== "gameover") return;

    const dentroX = event.clientX >= botaoReiniciar.x && event.clientX <= botaoReiniciar.x + botaoReiniciar.largura;
    const dentroY = event.clientY >= botaoReiniciar.y && event.clientY <= botaoReiniciar.y + botaoReiniciar.altura;

    if (dentroX && dentroY) {
        reiniciarJogo();
    }
});

/*************
*INICIAR JOGO*
*************/

setInterval(criarInimigo, 1000);
setInterval(inimigoAtira, 1500);

gameLoop();
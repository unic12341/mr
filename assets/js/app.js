import Effect from "./effect.js";
import * as PIXI from 'pixi.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const singleColor = "#0aff0a";
let gradientColor = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradientColor.addColorStop(0, "red");
gradientColor.addColorStop(0.2, "yellow");
gradientColor.addColorStop(0.4, "green");
gradientColor.addColorStop(0.6, "cyan");
gradientColor.addColorStop(0.8, "blue");
gradientColor.addColorStop(0, "magenta");
let defaultColor = singleColor;

const effect = new Effect(canvas.width, canvas.height);

let lastTime = 0;
const fps = 50;
const nextframe = 1000 / fps;
let timer = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextframe) {
        ctx.fillStyle = "rgba(0,0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = defaultColor;
        effect.symbols.forEach((symbol) => {
            symbol.draw(ctx);
            symbol.update();
        });
        timer = 0;
    } else {
        timer += deltaTime;
    }
    requestAnimationFrame(animate);
}
animate(0);

// Inizializzazione di PixiJS
const pixiApp = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
});
document.body.appendChild(pixiApp.view);

const circle = new PIXI.Graphics();
circle.beginFill(0xFFFFFF);
circle.drawCircle(0, 0, 5);
circle.endFill();
pixiApp.stage.addChild(circle);

// Effetto scia
const trail = new PIXI.ParticleContainer(100, {
    scale: true,
    position: true,
    rotation: false,
    uvs: false,
    alpha: true,
});
pixiApp.stage.addChild(trail);

const particles = [];

for (let i = 0; i < 100; i++) {
    const particle = new PIXI.Sprite.from(PIXI.Texture.WHITE);
    particle.anchor.set(0.5);
    particle.scale.set(0.5);
    particle.alpha = 0;
    trail.addChild(particle);
    particles.push(particle);
}

let currentIndex = 0;

function isCollidingWithCharacter(x, y) {
    for (let symbol of effect.symbols) {
        const symbolX = symbol.x * effect.fontSize;
        const symbolY = symbol.y * effect.fontSize;
        if (
            x > symbolX && x < symbolX + effect.fontSize &&
            y > symbolY && y < symbolY + effect.fontSize
        ) {
            return true;
        }
    }
    return false;
}

// Funzione per spostare il cerchio in modo casuale
function moveCircleRandomly() {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    circle.x = randomX;
    circle.y = randomY;

    // Aggiorna la scia
    const particle = particles[currentIndex];
    particle.alpha = 1;
    particle.x = randomX;
    particle.y = randomY;
    currentIndex++;
    if (currentIndex >= particles.length) {
        currentIndex = 0;
    }

    // Controlla le collisioni con i caratteri
    if (isCollidingWithCharacter(randomX, randomY)) {
        defaultColor = gradientColor;
        setTimeout(() => {
            defaultColor = singleColor;
        }, 1000);
    }
}

// Chiamare la funzione ogni secondo
setInterval(moveCircleRandomly, 1000);

pixiApp.ticker.add(() => {
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.alpha *= 0.95;
    }
});

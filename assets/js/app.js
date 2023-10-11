import Effect from "./effect.js";
const PIXI = window.PIXI;

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

const circleSize = 10;  // Dimensione del canvas di PixiJS

const pixiApp = new PIXI.Application({
    width: circleSize,
    height: circleSize,
    transparent: true
});

pixiApp.view.id = 'pixi-canvas';
document.body.appendChild(pixiApp.view);

const circle = new PIXI.Graphics();
circle.beginFill(0xFFFFFF);
circle.drawCircle(circleSize / 2, circleSize / 2, 5);  // Centra il cerchio nel canvas di PixiJS
circle.endFill();
pixiApp.stage.addChild(circle);

let targetX = Math.random() * window.innerWidth;
let targetY = Math.random() * window.innerHeight;
const speed = 2;  // Velocità di movimento del cerchio

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

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

function setNewTargetPosition() {
    targetX = Math.random() * window.innerWidth;
    targetY = Math.random() * window.innerHeight;
}

setInterval(setNewTargetPosition, 1000);

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

    const dx = targetX - parseFloat(pixiApp.view.style.left || 0);
    const dy = targetY - parseFloat(pixiApp.view.style.top || 0);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        const moveX = lerp(parseFloat(pixiApp.view.style.left || 0), targetX, speed / distance);
        const moveY = lerp(parseFloat(pixiApp.view.style.top || 0), targetY, speed / distance);
        pixiApp.view.style.left = `${moveX}px`;
        pixiApp.view.style.top = `${moveY}px`;

        // Check collisions with characters
        if (isCollidingWithCharacter(moveX, moveY)) {
            defaultColor = gradientColor;
            setTimeout(() => {
                defaultColor = singleColor;
            }, 1000);
        }
    }

    requestAnimationFrame(animate);
}
animate(0);

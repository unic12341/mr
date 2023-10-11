export default class Symbol {
    constructor(x, y, fontSize, canvasHeight) {
        this.chracters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
        this.text = "";
    }

    draw(context) {
        this.text = this.chracters.charAt(
            Math.floor(Math.random() * this.chracters.length)
        );
        context.textAlign = "center";
        context.font = this.fontSize + "px monospace";
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
    }

    update() {
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }
}

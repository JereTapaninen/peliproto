class Overlay {
    static draw(canvas, context, player) {
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.fillRect(10, canvas.height - 64 - 10, 64, 64);
        context.drawImage(document.getElementById("bomfunk"), 10, canvas.height - 64 - 10, 64, 64);
        context.strokeRect(10, canvas.height - 64 - 10, 64, 64);
        context.fillStyle = "red";
        const percentageHealth = player.health / player.maxHealth;
        const healthBarWidth = 300;
        const healthBarLength = healthBarWidth * percentageHealth;
        context.fillRect(10 + 64 + 10, canvas.height - ((64 - 10)), healthBarLength, 32);
        context.strokeRect(10 + 64 + 10, canvas.height - ((64 - 10)), healthBarWidth, 32);
    }
}

export default Overlay;

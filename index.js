/** @format */

canvas = document.getElementById("canvas-1");
ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 89) * (canvas.width / 80),
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;

        this.height = 10;
        this.width = 10;

        this.size = size;
        this.color = color;
    }

    draw() {
        const x = this.x;
        const y = this.y - this.height / 2;
        const width = this.width;
        const height = this.height;
        const color = "#696969";

        ctx.save();
        ctx.beginPath();
        var topCurveHeight = height * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
            x,
            y,
            x - width / 2,
            y,
            x - width / 2,
            y + topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
            x - width / 2,
            y + (height + topCurveHeight) / 2,
            x,
            y + (height + topCurveHeight) / 2,
            x,
            y + height
        );
        // bottom right curve
        ctx.bezierCurveTo(
            x,
            y + (height + topCurveHeight) / 2,
            x + width / 2,
            y + (height + topCurveHeight) / 2,
            x + width / 2,
            y + topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > canvas.width - this.size * 10) {
                this.x -= 10;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > canvas.height - this.size * 10) {
                this.y -= 10;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particleArray = [];

    //particle density
    let numberOfParticles = (canvas.height * canvas.width) / 10000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 5 + 1;

        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;

        //speed adjustment
        let directionX = Math.random() * 1.5;
        let directionY = Math.random() * 1.5;

        let color = "#FFFFFF";

        particleArray.push(
            new Particle(x, y, directionX, directionY, size, color)
        );
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
    }

    connect();
}

function connect() {
    let opacityValue = 1;

    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance =
                (particleArray[a].x - particleArray[b].x) *
                    (particleArray[a].x - particleArray[b].x) +
                (particleArray[a].y - particleArray[b].y) *
                    (particleArray[a].y - particleArray[b].y);

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 20000;
                ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }

            //rate at which hearts increase in size
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                particleArray[a].height += 0.1;
                particleArray[a].width += 0.1;

                if (particleArray[a].height >= 30) {
                    particleArray[a].height = 30;
                }
                if (particleArray[a].width >= 30) {
                    particleArray[a].width = 30;
                }
            }

            //rate at which hearts decrease in size
            if (distance > (canvas.width / 7) * (canvas.height / 7)) {
                particleArray[a].height -= 0.01;
                particleArray[a].width -= 0.01;

                if (particleArray[a].height < 5) {
                    particleArray[a].height = 5;
                }
                if (particleArray[a].width < 5) {
                    particleArray[a].width = 5;
                }
            }
        }
    }
}

window.addEventListener("resize", function () {
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    mouse.radius = (canvas.height / 89) * (canvas.width / 80);
    init();
});

window.addEventListener("mouseout", function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();

const canvas1 = document.getElementById('firstStep');
const content = canvas1.getContext("2d");
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
const particlesArray = [];
let colorVar = 0;

const mouse = {
    x: undefined,
    y: undefined,
};

window.addEventListener('resize', function () {
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
});

function cornfieldChase() {

}

canvas1.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle());
    }
});

canvas1.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
    }
});

class Particle {
    constructor() {
        this.x = event.x;
        this.y = event.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + colorVar + ', 100%, 50%)'

    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        content.fillStyle = this.color;
        content.beginPath();
        content.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        content.fill();
    }
};

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.3) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    //content.clearRect(0, 0, canvas1.width, canvas1.height);
    content.fillStyle = 'rgb(0, 0, 0, 0.2)'
    content.fillRect(0, 0, canvas1.width, canvas1.height);
    colorVar++;
    handleParticles();
    requestAnimationFrame(animate);
}

animate();
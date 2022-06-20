<<<<<<< HEAD
const canvas = document.querySelector('canvas');

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

window.addEventListener('resize', () => {

    canvas.width = innerWidth;

    canvas.height = innerHeight;

    // spawn();

});

let miliseconds = 0;

function clock() {
    function spawn(){
        c.beginPath()
        c.fillStyle = "#1B2430"
        c.arc(innerWidth - 40, 40, 20, 0, Math.PI *2)
        c.fill()
        c.closePath()
    }
    spawn()
    miliseconds = new Date().getSeconds();
    
    var milisecondsAngle = miliseconds * 2 * Math.PI / 1000;
    c.beginPath()
    c.strokeStyle = "white";
    c.lineWidth = "2";
    c.moveTo(innerWidth - 40, 40);
    c.lineTo(innerWidth - 40 + Math.sin(milisecondsAngle) * 40 * 0.3, 40 - Math.cos(milisecondsAngle) * 40 * 0.3);
    c.stroke();
    c.closePath()

}

//setInterval(clock, 1);

let particles = [];


class Particle {
    constructor(x, y, s = 0.0, color, x_speed = Math.random() * 600 - 300){
        this.x = x
        this.y = y
        this.last_x = x;
        this.last_y = y;
        this.original_y = this.y;
        
        this.color = color; 
        
        this.x_speed = x_speed;
        this.speed = s;
        this.start_time = Date.now();
        this.last_time = Date.now()

        this.direction = true;
    }
    draw(){
        c.beginPath()
        c.strokeStyle = this.color
        // c.arc(this.x, this.y, 10, 0, Math.PI *2)
        c.moveTo(this.last_x, this.last_y)
        c.lineTo(this.x,this.y);
        c.lineWidth = 5;
        c.stroke()
        c.closePath()


        this.last_x = this.x;
        this.last_y = this.y;
    }
/*  gravity()
    {
        const accel = 9.81;
        let delta_time = time.time() - this.time_zero;
        
        let y = Math.pow(delta_time * accel, 2) / (2 * accel);
        if (y > this.original_y) this.y = 0;
        this.y = this.y - y;
    }*/
    gravity()
    {
        const accel = 9.81 * 100;
        const height = innerHeight;

        //console.log(this.speed);

        
        let delta_time = (Date.now() - this.last_time) / 1.0e3;
        let delta_start_time = (Date.now() - this.start_time) / 1.0e3;
        this.last_time = Date.now();

        this.speed += delta_time * accel; 
        this.y += this.speed * delta_time;

        if (this.speed > 1000) this.speed = 1000;
        if (this.y > height) this.y = height;
    }
    bounce()
    {
        const accel = 9.81 * 100;
        const height = innerHeight - 10;
        const bounce_multi = 0.85;

        let delta_time = (Date.now() - this.last_time) / 1.0e3;
        let delta_start_time = (Date.now() - this.start_time) / 1.0e3;
        this.last_time = Date.now();

        this.x += this.x_speed * delta_time;

        this.speed += delta_time * accel;
        this.y += this.speed * delta_time;
    
        if (this.y > height) 
        {
            this.speed = -this.speed * bounce_multi;
            this.y = height;
        }
    }
}
create = function()
{
    for (let i = 0; i < 10; i++){
        let x = innerWidth / 2;
        let y = Math.random() * innerHeight;
        let speed = Math.random() * 1500;

        let color = "rgb(" + String(Math.random() * 255) + "," + String(Math.random() * 255) + "," + String(Math.random() * 255) + ",1)";
        
        particles.push(new Particle(x, y, speed, color));
    }
}
create()

console.log(particles);

function animate()
{

    c.fillStyle = 'rgb(0, 0, 0, 0.1)'
    c.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particles.length; i++)
    {
        particles[i].bounce();
        particles[i].draw();
    } 
    
    requestAnimationFrame(animate)
}
animate()
=======
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
>>>>>>> 6896c3c304a2f468fe79f9976fcc2f2431f8bdc2

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

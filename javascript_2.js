const canvas = document.querySelector('canvas');

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

window.addEventListener('resize',() =>{

    canvas.width = innerWidth;

    canvas.height = innerHeight;

    init();

});

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let particleArray = [];

var colorArray = [ 

    '#00076f',
    '#44008b',
    '#9f45b0',
    '#e54ed0',
    '#ffe4f2'
];

var mouse = {
    x:undefined,
    y:undefined
}

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    
});

let mouseDown = '';
canvas.addEventListener('mousedown', () => {
    mouseDown = true;
    
});

canvas.addEventListener('touchdown', () => {
    mouseDown = true;
    
});

window.addEventListener('touchup', () => {
    mouseDown = false;
    
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
    
});

let velocityXY = Math.random() * 0.01;

function Particle(x, y, radius, color) {
        
    this.x = x;
    
    this.y = y;
    
    this.radius = radius; 
    
    this.color = color

    this.angle = Math.random() * Math.PI * 2;
    
    this.velocity = Math.random() * 0.01;

    this.distanceFromCenter = {x: randomIntFromRange(50, innerWidth), y: randomIntFromRange(50, innerHeight)}

        
    this.update = () => {
        const lastPoint = {x: this.x, y: this.y};

        // const lastMouse = {x: x, y: y}
            
        this.angle += this.velocity;

        // lastMouse.x += (mouse.x - lastMouse.x) * 0.8;

        // lastMouse.y += (mouse.y - lastMouse.y) * 0.8;
        
        this.x = x + Math.cos(this.angle) * this.distanceFromCenter.x;
        
        this.y = y + Math.sin(this.angle) * this.distanceFromCenter.x;
        
        this.draw(lastPoint);
        
    }
    
    this.draw = lastPoint => {

        c.beginPath();
        
        c.fillStyle = this.color;

        // c.shadowBlur = 5;

        // c.shadowColor = this.color

        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        c.fill();

        c.closePath();

        // c.beginPath();

        // c.strokeStyle = this.color;
        
        // c.lineWidth = this.radius;
        
        // c.moveTo(lastPoint.x, lastPoint.y);
        
        // c.lineTo(this.x, this.y)

        // c.stroke();

        // c.closePath();

    }

}



function init() {
    particleArray = [];
    for ( let i = 0; i < 1000; i++) {
        const radius = (Math.random() * 1) + 0.1;
        particleArray.push(new Particle(innerWidth / 2, innerHeight / 2, radius, colorArray[Math.floor(Math.random()* colorArray.length)]))
    
    }
}
init();


let alpha = 0.3;

function animate() {
    
    if (mouseDown == true && alpha > 0.05) {
        alpha -= 0.01;
    } else if ( mouseDown == false && alpha <0.3) {
        alpha += 0.005;
    }

    c.fillStyle = `rgb(0, 0, 0, ${alpha})`;
    c.fillRect(0, 0, innerWidth, innerHeight);
    

    for ( let i = 0; i < particleArray.length; i++) {
        
        particleArray[i].update();
    
    }

    
    
    requestAnimationFrame(animate);
    
} 

animate();



const canvas = document.createElement("canvas");
document.body.appendChild(canvas);


class Vector_xy
{
    constructor(x=0,y=0)
    {
        this.x = x;
        this.y = y;
    }    
    log = function()
    {
        console.log(this.x, this.y);
    }    
}    


let screen_dimension = new Vector_xy();

fill_canvas = function()
{
    canvas.width = screen_dimension.x = window.innerWidth;
    canvas.height = screen_dimension.y = window.innerHeight;
}



class Ball
{
    pos = new Vector_xy(50,50);
    constructor(px_multiplier)
    { // !! all angles are in radians !!
        this.px_multiplier = px_multiplier;
        this.a = 0;
        this.s = 40;

        this.radius = 2.5;
        this.color = "orange";
    }    
    bounce_horizontal = function()
    { // means that the bounce is done on a surface that is either floor or ceiling ....
        this.a = -this.a;
    }    
    bounce_vertical = function()
    { // the other type of bounce on a wall
        this.a = Math.PI - this.a;
    }    
    calc_xy = function(delta_seconds)
    {
        let delta_pos = new Vector_xy(
            Math.cos(this.a) * this.s * delta_seconds,
            Math.sin(this.a) * this.s * delta_seconds
        );    
        this.pos.x += delta_pos.x;
        this.pos.y += delta_pos.y;

        if (this.pos.y < this.radius)
        {
            this.pos.y = this.radius;
            this.bounce_horizontal();
        }    
        if (this.pos.y + this.radius > screen_dimension.y * this.px_multiplier)
        {
            this.pos.y = (screen_dimension.y * this.px_multiplier) - this.radius;
            this.bounce_horizontal();
        }    
    }    

    draw = function()
    {
        let c = canvas.getContext("2d");
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.pos.x / this.px_multiplier, this.pos.y / this.px_multiplier, this.radius / this.px_multiplier, 0, 2*Math.PI);
        c.fill();
    }    
}    

class Padel
{
    constructor(is_right, px_multiplier)
    {
        this.is_right = is_right;
        this.px_multiplier = px_multiplier;

        this.middle_y = 50; // default the padel to the middle of the screen
        
        this.color = "red";
        this.dist_edge = 5;
        this.width = 2;
        this.height = 20;
        this.speed = 15;
    }    
    move = function(move_up, delta_seconds) // move_up is interpreted as a boolean and if it is false it will move down instead
    {
        if (move_up && this.middle_y - this.height / 2 <= 0) 
        {
            this.middle_y = this.height / 2;
            return
        }    
        if (!move_up && this.middle_y + this.height / 2 >= screen_dimension.y * this.px_multiplier) 
        {
            this.middle_y = screen_dimension.y * this.px_multiplier - this.height / 2;
            return
        }    

        if (move_up) this.speed = -Math.abs(this.speed);
        else this.speed = +Math.abs(this.speed);
        this.middle_y += this.speed * delta_seconds;
    }    
    hit = function(ball_pos_original, court_size, ball_radius)
    {
        let ball_pos = new Vector_xy(ball_pos_original.x, ball_pos_original.y);

        // will do some tricks to imitate a mirrored playing feild
        let on_right = (ball_pos.x > court_size / 2);

        if (on_right != this.is_right) return false; 
        
        if (on_right) ball_pos.x -= court_size;
        ball_pos.x = Math.abs(ball_pos.x);

        if (ball_pos.x < this.dist_edge || ball_pos.x > this.dist_edge + this.width + ball_radius) return false;
        if (ball_pos.y < this.middle_y - this.height / 2 - ball_radius || ball_pos.y > this.middle_y + this.height / 2 + ball_radius) return false;
        

        // the ball must be moved to the correct place if a hit is detected aka the edge of the padel
        if (on_right) ball_pos_original.x = (screen_dimension.x * this.px_multiplier) - this.width - this.dist_edge - ball_radius;
        else ball_pos_original.x = this.width + this.dist_edge + ball_radius;
        return true;
    }    

    draw = function()
    {
        let c = canvas.getContext("2d");
        
        c.fillStyle = this.color;

        if (this.is_right)
        {
            c.fillRect(screen_dimension.x - ((this.dist_edge + this.width) / this.px_multiplier), (this.middle_y - this.height / 2) / this.px_multiplier, this.width / this.px_multiplier, this.height / this.px_multiplier);
        }    
        else
        {
            c.fillRect(this.dist_edge / this.px_multiplier, (this.middle_y - this.height / 2) / this.px_multiplier, this.width / this.px_multiplier, this.height / this.px_multiplier);
        }    
    }    
}    

// game class
class PONG
{   // !! all angles are in radians !!
    // all speeds are in mm/s the pong game board size will be determined in the constructor
    constructor()
    {
        // constants 
        this.court_width = 100; // the mm value of the width of the court, this value will be used to set a multiplier that defines what one pixel equates to
        this.px_multiplier = this.court_width / screen_dimension.x;
        this.ball_radius = 2.5;
        
        this.left_paddel = new Padel(false, this.px_multiplier);
        this.right_paddel = new Padel(true, this.px_multiplier);
        this.ball = new Ball(this.px_multiplier);
    }

    run = function(delta_seconds)
    { // will return false if game has ended and return true if a game is under way
        this.ball.calc_xy(delta_seconds);

        if (this.left_paddel.hit(this.ball.pos, this.court_width, this.ball_radius) || this.right_paddel.hit(this.ball.pos, this.court_width, this.ball_radius))
        {
            this.ball.bounce_vertical();
            // add a random angle to the ball so that the bounce is unpredictable
            this.ball.a += (Math.random() * 1.0 - 0.5);
            console.log(this.ball.a)
        }

        if (this.ball.pos.x > screen_dimension.x * this.px_multiplier || this.ball.pos.x < 0)
        {
            // the game is over due to the ball being outside of the playing bounds
            return false;
        }

        return true;
    }
    
    to_canvas = function()
    {
        canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height);
        this.ball.draw(this.px_multiplier);
        this.left_paddel.draw();
        this.right_paddel.draw();
    }
}


class Key 
{
    constructor(key_string = 0)
    {
        this.key_string = key_string;
        this.state = false;
    }
    update_press = function(e)
    {
        if (e.key == this.key_string)
        {
            this.state = true;
        }
    }
    update_release = function(e)
    {
        if (e.key == this.key_string)
        {
            this.state = false;
        }
    }
}
class Input
{
    up = new Key();
    down = new Key();
    
    constructor(up_string, down_string, is_right)
    { // tried using a function pointer but could not get the variable to copy over into the class
        this.up.key_string = up_string;
        this.down.key_string = down_string;
        
        this.is_right = is_right;
    }
    
    update_press = function(e)
    {
        this.up.update_press(e);
        this.down.update_press(e);
    }
    update_release = function(e)
    {
        this.up.update_release(e);
        this.down.update_release(e);
    }
    move = function(delta_seconds)
    {
        if (this.up.state && !this.down.state)
        {
            // move up
            if (this.is_right) testing.right_paddel.move(true, delta_seconds);
            else testing.left_paddel.move(true, delta_seconds);
        }
        if (this.down.state && !this.up.state)
        {
            // move down
            if (this.is_right) testing.right_paddel.move(false, delta_seconds);
            else testing.left_paddel.move(false, delta_seconds);
        }
    }
}


fill_canvas();
let testing = new PONG();
let last_time = Date.now();

let left_input = new Input("w", "s", false);
let right_input = new Input("ArrowUp", "ArrowDown", true);

document.addEventListener("keydown", function(e) {
    left_input.update_press(e);
    right_input.update_press(e);
})
document.addEventListener("keyup", function (e) {
    left_input.update_release(e);
    right_input.update_release(e);
})

main = function()
{
    let delta_seconds = (Date.now() - last_time) / 1.0e3;
    last_time = Date.now();
    
    left_input.move(delta_seconds);
    right_input.move(delta_seconds);

    if (!testing.run(delta_seconds))
    {
        console.log("game over");
        testing.ball.a = Math.random() * Math.PI * 2;
        testing.ball.pos.x = testing.court_width / 2;
        testing.ball.pos.y = screen_dimension.y * testing.px_multiplier / 2;
    }
    else
    {
        testing.ball.s += 2 * delta_seconds;
    }
    testing.to_canvas();
}
setInterval(main);
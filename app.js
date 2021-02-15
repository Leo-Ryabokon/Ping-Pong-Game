const cvs = document.getElementById('pong');
const ctx = cvs.getContext('2d');

// Create the user paddle
const user = {
    x: 0,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: 'WHITE',
    score: 0
};
const comp = {
    x: cvs.width-10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: 'WHITE',
    score: 0
};
const ball = {
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE '
};

// Create the net
const net = {
    x: cvs.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: 'WHITE'
};
// Draw rect function
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw net
function drawNet(){
    for(let i = 0; i <= cvs.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Draw circle
function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}
drawCircle(100, 100, 50, 'WHITE');

// Draw Text 
function drawText(text, x, y, color){
    ctx.fillStyle = color;
    ctx.font = '45px fantasy';
    ctx.fillText(text, x, y);
}


function rander(){
    // Clear canvas
    drawRect(0, 0, cvs.width, cvs.height, 'BLACK');

    // Draw the net
    drawNet();

    // Draw the score
    drawText(user.score,cvs.width/4, cvs.height/5, 'WHITE');
    drawText(comp.score,3*cvs.width/4, cvs.height/5, 'WHITE');

    // Draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control the user paddle
cvs.addEventListener('mousemove', movePaddle);
function movePaddle(event){
    let rect = cvs.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
}

// Collision detection 
function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
// Update: pos, move, score
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Create a simple AI to control the paddle
    let compLeavel = 0.7;
    comp.y += (ball.y - (comp.y + comp.height)) * compLeavel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : comp;

    if(collision(ball, player)){
        // Where the ball hit the player
        let collidePoint = ball.y - (player.y + player.height/2);

        // Normalization
        collidePoint = collidePoint/(player.height/2);

        // Change angle in radian
        let angleRad = collidePoint * Math.PI/4;

        // X direction of the ball when its hit
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // Change velocity X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY =             ball.speed * Math.sin(angleRad);

        // Every time when the ball hit paddle we encrece its speed
        ball.speed += 1;
    }

    // Udate the score
    if(ball.x - ball.radius < 0){
        // the comp win
        comp.score++;
        resetBall();
    } else if(ball.x + ball.radius > cvs.width){
        // the user win
        user.score++;
        resetBall();
    }
}

// Game init
function game(){
    update();
    rander();
}

// Loop 
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);
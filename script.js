const { Engine, Render, Runner, Bodies, Composite } = Matter;

const engine = Engine.create();

const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 788,
            height: 800,
            wireframes: false,
            background: "stake.png"
        }
});

let balance = 1000;
const balanceText = document.getElementById("balanceText");
const betAmount = document.getElementById("betAmount");



for (let i = 3; i <= 18; i++){
    for (let k = 0; k < i; k++){
        const peg = Bodies.circle(((400-45.9*i/2) + k*45.9+17), i*45.5-102, 6, {
            isStatic: true,
            render: {
                fillStyle: "white",
                strokeStyle: "white",
            }
        })
        Composite.add(engine.world, peg)
    }
} 

for(let i = 0; i <= 17; i++){
    const barrier = Bodies.rectangle(i*45.9 + 3.8, 800-30, 3, 40, {
        isStatic: true,
        render: {
            fillStyle: "white",
            strokeStyle: "white",
        }
    })
    Composite.add(engine.world, barrier)
}



const ground = Bodies.rectangle(400, 800, 800, 20, {
    isStatic: true,
    render: {
        fillStyle: "white",
        strokeStyle: "white",
    }
});

Composite.add(engine.world, ground)




function playSound(src) {
    const sound = new Audio(src);
    sound.volume = 0.4;
    sound.play();
}




const balls = []

function dropBall() {
    
    if (betAmount.value <= balance && betAmount.value > 0){
        betAmount.disabled = true;
        playSound('dropsound.mp3')

        balance = balance - betAmount.value;
        balanceText.innerText = Math.round(balance * 100) / 100;
        ;

        const ball = Bodies.circle(350 + Math.random()*89, 15, 10, {
            restitution: 0,
            friction: 50000,
            
            render: {
                fillStyle: "red",
                strokeStyle: "red",
            }
        });
        balls.push(ball)
        Composite.add(engine.world, ball)
    }

Matter.Events.on(engine, "afterUpdate", function() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        if (b.position.y >= 775) {
            playSound('dropsound.mp3')
            console.log(b.position.x, b.position.y);
            
            if(b.position.x >= 0 && b.position.x <= 45.9+3.8 || b.position.x >= 16*45.9+3.8 && b.position.x <= 17*45.9+3.8)
            {
                balance = Math.round((balance + 1000*betAmount.value)*100) / 100;
            }
            else if (b.position.x >= 1*45.9+3.8 && b.position.x <= 2*45.9+3.8 || b.position.x >= 15*45.9+3.8 && b.position.x <= 16*45.9+3.8)
            {
                balance = Math.round((balance + 130*betAmount.value)*100) / 100;
            } 
            else if (b.position.x >= 2*45.9+3.8 && b.position.x <= 3*45.9+3.8 || b.position.x >= 14*45.9+3.8 && b.position.x <= 15*45.9+3.8)
            {
                balance = Math.round((balance + 26*betAmount.value)*100) / 100;
            }
            else if(b.position.x >= 3*45.9+3.8 && b.position.x <= 4*45.9+3.8 || b.position.x >= 13*45.9+3.8 && b.position.x <= 14*45.9+3.8)
            {
                balance = Math.round((balance + 9*betAmount.value)*100) / 100;
            }
            else if (b.position.x >= 4*45.9+3.8 && b.position.x <= 5*45.9+3.8 || b.position.x >= 12*45.9+3.8 && b.position.x <= 13*45.9+3.8)
            {
                balance = Math.round((balance + 4*betAmount.value)*100) / 100;
            }
            else if (b.position.x >= 5*45.9+3.8 && b.position.x <= 6*45.9+3.8 || b.position.x >= 11*45.9+3.8 && b.position.x <= 12*45.9+3.8)
            {
                balance = Math.round((balance + 2*betAmount.value)*100) / 100;
            }
            else
            {
                balance = Math.round((balance + 0.2*betAmount.value)*100) / 100;
            }
            balanceText.innerText = balance

            Composite.remove(engine.world, b);
            balls.splice(i, 1);

            if (balls.length == 0)
            {
                betAmount.disabled = false;

            } 
        }
    }
})}


const button = document.getElementById("dropButton");
const maxBetButton = document.getElementById("maxBetButton");
button.addEventListener("click", dropBall);
maxBetButton.addEventListener("click", () => {
    if(betAmount.disabled == false)
    {
        betAmount.value = balance;
    }
});

Render.run(render)
Runner.run(Runner.create(), engine)

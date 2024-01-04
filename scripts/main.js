//global variables
let dotCnt = 100;
let maxiteration = 500;
let w = 700;
let h = 300;

//Visualization setup
var p5project = sketch => {

    let x = [];
    let y = [];

    let sumX = 0;
    let sumY = 0;

    let centerX = 0;
    let centerY = 0;
    let ratio = 0.1;

    let runs = 0;

    sketch.setup = function() {
        let fontRegular;

        //For local testing
        //fontRegular = sketch.loadFont('http://127.0.0.1:5500/Minimum-Enclosing-Circle/assets/AnonymousPro-Regular.ttf');
        
        //For hosting
        fontRegular = sketch.loadFont('assets/AnonymousPro-Regular.ttf');
        
        sketch.createCanvas(w, h, document.getElementById('p5canvas'));

        for (let i=0; i<dotCnt; i++){
            let x1,y1;
            while(1){
                x1 = Math.floor(Math.floor(Math.random() * (w/2 + 1))); //random x coordinate;
                y1 = Math.floor(Math.floor(Math.random() * (h + 1))); //random y coordinate;
                if(sketch.dist(x1,y1,w/4,h/2)<h/3){
                    break;
                }
            }
            x.push(x1);
            y.push(y1);
            sumX += x1;
            sumY += y1;
        }

        sketch.textFont(fontRegular);
        sketch.textSize(30);
        sketch.frameRate(8);
        sketch.smooth();
    };

    sketch.draw = function() {
        button.addEventListener("click", ( eraseall ) => {
            var pointcnt = document.getElementById("dotcnt").value;
            var maxiter = document.getElementById("iter").value;
            if(Number(pointcnt)>=10 && Number(pointcnt)<=300 && Number(maxiter)>=100 && Number(maxiter)<=1000){
                sketch.removeElements();
                sketch.noLoop();
            }
        })

        sketch.background('#0c0c0c');

        //draw points
        sketch.fill('#FFFF00');
        for (let i=0; i<dotCnt; i++){
            sketch.circle(x[i], y[i], 5);
        }
        sketch.noFill();

        //mark initial center
        if(runs===0){
            centerX = sumX/dotCnt;
            centerY = sumY/dotCnt;
            sketch.fill('#FF0000');
            sketch.circle(centerX, centerY, 5);
            sketch.noFill();
        }
        
        
        //heuristic phase to find min enclosing circle
        let radius = 0;
        let cursor = -1;
        runs += 1;
        cursor = -1;
        for(let i=0; i<dotCnt; i++){
            let newradius = sketch.dist(centerX, centerY, x[i], y[i]);
            if(radius<newradius){
            radius = newradius;
            cursor = i;
            }
        }
        
        /*terminate condition check;
        terminate if max iteration reached*/
        let complete = false;
        if(runs === maxiteration){
            complete = true;
        }

        //draw circle and radius at current step
        sketch.fill('#FF0000');
        sketch.circle(centerX, centerY, 5);
        sketch.noFill();
        sketch.stroke('#FF0000');
        sketch.circle(centerX, centerY, 2*radius);
        sketch.noStroke();
        sketch.stroke('#F5F5F5');
        sketch.line(centerX, centerY, x[cursor], y[cursor]);
        sketch.noStroke();

        //termination step
        if(complete){
            //draw final state of circle
            sketch.stroke('#69F542');
            sketch.circle(centerX, centerY, 2*radius);
            sketch.noStroke();

            //draw final radius
            sketch.stroke('#42F5EF');
            sketch.line(centerX, centerY, x[cursor], y[cursor]);
            sketch.noStroke();
            
            //exit
            sketch.noLoop();
        }

        //show current status
        sketch.fill('#F5F5F5');
        sketch.text("step = "+runs, 400, 75);
        sketch.text("r = "+radius.toFixed(3), 400, 125);
        sketch.text("x = "+centerX.toFixed(3), 400, 175);
        sketch.text("y = "+centerY.toFixed(3), 400, 225);
        sketch.noFill();

        //for next heuristic step
        centerX = centerX + (x[cursor]-centerX)*ratio;
        centerY = centerY + (y[cursor]-centerY)*ratio;
        ratio = ratio*0.99;
    };
};
//Up to here is setup for visualization

function isInt(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}


const button = document.getElementById("run");
button.addEventListener("click", (event) => {
    var pointcnt = document.getElementById("dotcnt").value;
    var maxiter = document.getElementById("iter").value;
    if(isInt(pointcnt) && isInt(maxiter)){
        if(Number(pointcnt)>=10 && Number(pointcnt)<=300 && Number(maxiter)>=100 && Number(maxiter)<=1000){
            maxiteration = maxiter;
            dotCnt = pointcnt;
            new p5(p5project, 'p5canvas');
        }
    }
});







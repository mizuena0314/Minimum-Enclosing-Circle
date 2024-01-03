let w = 700;
let h = 300;

let x = [];
let y = [];
let loop = 0;
let epsilon = 0.0001;

let tmp = 0;
let complete = false;
let cursor = -1;

let sumX = 0;
let sumY = 0;

let centerX = 0;
let centerY = 0;
let radius = 0;

let dotCnt = 100;
let ratio = 0.1;

let fontRegular;

function preload(){
  //fontRegular = loadFont('http://127.0.0.1:5500/Minimum-Enclosing-Circle/assets/AnonymousPro-Regular.ttf');
  fontRegular = loadFont('assets/AnonymousPro-Regular.ttf')
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// credits to Francisc and danday74 on stackoverflow

function setup() {
  createCanvas(w, h, WEBGL, document.getElementById('p5canvas'));

  for (let i=0; i<dotCnt; i++){
    let x1,y1;
    while(1){
      x1 = Math.floor(randomIntFromInterval(0,w/2));
      y1 = Math.floor(randomIntFromInterval(-1*h/2,h/2));
      if(dist(x1,y1,w/4,0)<h/3){
        break;
      }
    }
    x.push(-1*x1);
    y.push(y1);
    sumX -= x1;
    sumY += y1;
  }

  textFont(fontRegular);
  textSize(30);
  frameRate(8);
  smooth();
}

function draw() {
  background('#0c0c0c');
  loop+=1;

  //draw points
  fill('#FFFF00');
  for (let i=0; i<dotCnt; i++){
    circle(x[i], y[i], 5);
  }
  noFill();

  //mark initial center
  if(tmp===0){
    centerX = sumX/dotCnt;
    centerY = sumY/dotCnt;
    fill('#FF0000');
    circle(centerX, centerY, 5);
    noFill();
    tmp+=1;
  }

  //heuristic phase to find min enclosing circle
  radius = 0;
  cursor = -1;
  for(let i=0; i<dotCnt; i++){
    let newradius = dist(centerX, centerY, x[i], y[i]);
    if(radius<newradius){
      radius=newradius;
      cursor = i;
    }
  }
  
  //terminate condition check;
  //terminate if heuristic "precise enough"
  if(ratio < epsilon){
    complete = true;
  }

  //draw circle and radius at current step
  fill('#FF0000');
  circle(centerX, centerY, 5);
  noFill();
  stroke('#FF0000');
  circle(centerX, centerY, 2*radius);
  noStroke();
  stroke('#FFFFFF');
  line(centerX, centerY, x[cursor], y[cursor]);
  noStroke();

  //termination step
  if(complete){
    //draw final state of circle
    stroke('#69F542');
    circle(centerX, centerY, 2*radius);
    noStroke();

    //draw final radius
    stroke('#42F5EF');
    line(centerX, centerY, x[cursor], y[cursor]);
    noStroke();
    
    //exit
    noLoop();
  }

  //show current status
  fill('#F5F5F5');
  text("iteration = "+loop, 90, -75);
  text("r = "+radius.toFixed(3), 90, -25);
  text("x = "+centerX.toFixed(3), 90, 25);
  text("y = "+centerY.toFixed(3), 90, 75);
  noFill();

  //for next heuristic
  centerX = centerX + (x[cursor]-centerX)*ratio;
  centerY = centerY + (y[cursor]-centerY)*ratio;
  ratio = ratio*0.99;
}


var w = window.innerWidth;
var h = window.innerHeight;

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

let dotCnt = 300;
let ratio = 0.1;

let fontRegular;
function preload(){
  fontRegular = 'Georgia';
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// credits to Francisc and danday74 on stackoverflow

function setup() {
  createCanvas(w,h);
  for (let i=0; i<dotCnt; i++){
    let x1,y1;
    while(1){
      x1 = Math.floor(randomIntFromInterval(Math.floor(h/5), Math.floor(h*4/5)));
      y1 = Math.floor(randomIntFromInterval(Math.floor(h/5), Math.floor(h*4/5)));
      if(dist(x1,y1,w/4,h/2)<h/3){
        break;
      }
    }
    x.push(x1);
    y.push(y1);
    sumX += x1;
    sumY += y1;
  }
  textFont(fontRegular);
  textSize(30);
  frameRate(8);
}

function draw() {
  background(0);
  loop+=1;

  //draw points
  fill('#FFFF00');
  for (let i=0; i<dotCnt; i++){
    ellipse(x[i], y[i], 5, 5);
  }
  noFill();

  //mark initial center
  if(tmp===0){
    centerX = sumX/dotCnt;
    centerY = sumY/dotCnt;
    fill('#FF0000');
    ellipse(centerX, centerY, 5, 5);
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
  ellipse(centerX, centerY, 5, 5);
  noFill();
  stroke('#FF0000');
  ellipse(centerX, centerY, 2*radius, 2*radius);
  noStroke();
  stroke('#FFFFFF');
  line(centerX, centerY, x[cursor], y[cursor]);
  noStroke();

  //termination step
  if(complete){
    //draw final state of circle
    stroke('#69F542');
    ellipse(centerX, centerY, 2*radius, 2*radius);
    noStroke();

    //draw final radius
    stroke('#42F5EF');
    line(centerX, centerY, x[cursor], y[cursor]);
    noStroke();
    
    //exit
    noLoop();
  }

  //show current status
  fill('#FFFFFF');
  text("iteration = "+loop, 3*w/4-90, h/2-45);
  text("r = "+radius, 3*w/4-90, h/2-15);
  text("x = "+centerX, 3*w/4-90, h/2+15);
  text("y = "+centerY, 3*w/4-90, h/2+45);
  noFill();

  //for next heuristic
  centerX = centerX + (x[cursor]-centerX)*ratio;
  centerY = centerY + (y[cursor]-centerY)*ratio;
  ratio = ratio*0.99;
}
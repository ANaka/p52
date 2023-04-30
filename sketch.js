
class RingPoints {
  constructor(numPoints, radius, centerX, centerY, ringRotationAngle) {
    this.numPoints = numPoints;
    this.radius = radius;
    this.centerX = centerX;
    this.centerY = centerY;
    this.ringRotationAngle = ringRotationAngle;
    this.points = [];
    this.generatePoints();
  }

  generatePoints() {
    for (let i = 0; i < this.numPoints; i++) {
      let angle = map(i, 0, this.numPoints, 0, TWO_PI) + this.ringRotationAngle;
      let x = this.centerX + this.radius * cos(angle);
      let y = this.centerY + this.radius * sin(angle);
      this.points.push([x, y]);
    }
  }
}


class Square {
  constructor(centerX, centerY, sideLength, rotationAngle) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.sideLength = sideLength;
    this.rotationAngle = rotationAngle;
    this.points = this.generatePoints();
    this.lines = this.generateLines();
  }

  generatePoints() {
    let halfLength = this.sideLength / 2;
    let x1 = -halfLength;
    let y1 = -halfLength;
    let x2 = halfLength;
    let y2 = -halfLength;
    let x3 = halfLength;
    let y3 = halfLength;
    let x4 = -halfLength;
    let y4 = halfLength;

    let points = [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x4, y4]
    ];

    for (let i = 0; i < points.length; i++) {
      let x = points[i][0];
      let y = points[i][1];
      let rotatedX = x * cos(this.rotationAngle) - y * sin(this.rotationAngle);
      let rotatedY = x * sin(this.rotationAngle) + y * cos(this.rotationAngle);
      points[i] = [rotatedX + this.centerX, rotatedY + this.centerY];
    }

    return points;
  }

  // generate lines using the points
  generateLines() {
    let lines = [];
    for (let i = 0; i < this.points.length; i++) {
      let x1 = this.points[i][0];
      let y1 = this.points[i][1];
      let x2 = this.points[(i+1) % this.points.length][0];
      let y2 = this.points[(i+1) % this.points.length][1];
      lines.push([x1, y1, x2, y2]);
    }
    return lines;
  }

  // draw lines
  show() {
    for (let i = 0; i < this.lines.length; i++) {
      let x1 = this.lines[i][0];
      let y1 = this.lines[i][1];
      let x2 = this.lines[i][2];
      let y2 = this.lines[i][3];
      stroke(255);
      line(x1, y1, x2, y2);
    }
  }
}

// draws a square at each point in a RingPoints object
class RingSquares {
  constructor(numPoints, radius, centerX, centerY, squareSize) {
    this.numPoints = numPoints;
    this.radius = radius;
    this.centerX = centerX;
    this.centerY = centerY;
    this.squareSize = squareSize;
    this.points = [];
    this.squares = [];
    this.allLines = [];
    this.generateLineOrder();
  }

  generatePoints(ringRotationAngle) {
    this.points = [];
    for (let i = 0; i < this.numPoints; i++) {
      let angle = map(i, 0, this.numPoints, 0, TWO_PI) + ringRotationAngle;
      let x = this.centerX + this.radius * cos(angle);
      let y = this.centerY + this.radius * sin(angle);
      this.points.push([x, y]);
    }
  }

  generateSquares(rotationOffset) {
    this.allLines = [];
    this.squares = [];
    for (let i = 0; i < this.points.length; i++) {
      let centerX = this.points[i][0];
      let centerY = this.points[i][1];
      let rotationAngle = map(i, 0, this.points.length, 0, TWO_PI) + rotationOffset;
      let square = new Square(centerX, centerY, this.squareSize, rotationAngle);
      this.squares.push(square);
      this.allLines = this.allLines.concat(square.lines);
    }
  }

  generateLineOrder(){
    let totalNumLines = this.numPoints * 4;
    // create a random order of totalNumLines
    this.lineOrder = [];
    for (let i = 0; i < totalNumLines; i++) {
      this.lineOrder.push(i);
    }
  }

  shuffleLineOrder(){
    shuffle(this.lineOrder, true)
  }

  // shuffle but only swap lines that are within 4 of each other
  shuffleLineOrderWithin4(){
    for (let i = 0; i < this.lineOrder.length; i++) {
      let swapIndex = i + floor(random(-4, 4));
      if (swapIndex < 0) {
        swapIndex = this.lineOrder.length + swapIndex;
      } else if (swapIndex >= this.lineOrder.length) {
        swapIndex = swapIndex - this.lineOrder.length;
      }
      let temp = this.lineOrder[i];
      this.lineOrder[i] = this.lineOrder[swapIndex];
      this.lineOrder[swapIndex] = temp;
    }
  }

  interpolateLines(lerp_amount){
    for (let i = 0; i < this.allLines.length; i++) {
      let line1_x1 = this.allLines[this.lineOrder[i]][0];
      let line1_y1 = this.allLines[this.lineOrder[i]][1];
      let line1_x2 = this.allLines[this.lineOrder[i]][2];
      let line1_y2 = this.allLines[this.lineOrder[i]][3];
      let line2_x1 = this.allLines[this.lineOrder[(i+1) % this.allLines.length]][0];
      let line2_y1 = this.allLines[this.lineOrder[(i+1) % this.allLines.length]][1];
      let line2_x2 = this.allLines[this.lineOrder[(i+1) % this.allLines.length]][2];
      let line2_y2 = this.allLines[this.lineOrder[(i+1) % this.allLines.length]][3];
      let x1 = lerp(line1_x1, line2_x1, lerp_amount);
      let y1 = lerp(line1_y1, line2_y1, lerp_amount);
      let x2 = lerp(line1_x2, line2_x2, lerp_amount);
      let y2 = lerp(line1_y2, line2_y2, lerp_amount);
      stroke(255);
      line(x1, y1, x2, y2);
    }
  }
  drawLines(){
    for (let i = 0; i < this.allLines.length; i++) {
      let x1 = this.allLines[i][0];
      let y1 = this.allLines[i][1];
      let x2 = this.allLines[i][2];
      let y2 = this.allLines[i][3];
      stroke(255);
      line(x1, y1, x2, y2);
    }
  }

  
}


let rings = [];
let lerpFunctions = [];
let rotationOffsetFunctions = [];
let capturer;
let capturing = false;
let startMillis;
const captureDurationMillis = 10000; // Capture for 3 seconds
const fps = 30;

const totalFrames = 3000; // 5 seconds * 30 fps


function setup() {
  createCanvas(600, 600);
  frameRate(fps);

  //
  // make radius in increments of 10
  const radiusParams = Array.from({length: 27}, (_,i) => i*18 + 30);

  // iterate through the radius params and create points proportional to the circumference
  const numRingPointsParams = radiusParams.map((r) => floor(2 * PI * r / 15));

  // all size 10
  const squareSizeParams = Array.from({length: radiusParams.length}, (_,i) => 5);

  
  
  for (let i = 0; i < numRingPointsParams.length; i++) {
    let _lerpFunction = (t) => map(sin(t * 0.15 + i * 0.35), -1, 1, 0, 1);
    lerpFunctions.push(_lerpFunction);
  }

  for (let i = 0; i < numRingPointsParams.length; i++) {
    let _rotationOffsetFunction = (t) => (t * (0.005 + i * 0.0002));
    rotationOffsetFunctions.push(_rotationOffsetFunction);
  }

  let numParamSets = numRingPointsParams.length;
  

  // make a ring for each set of parameters
  
  for (let i = 0; i < numParamSets; i++) {
    let numRingPoints = numRingPointsParams[i];
    let radius = radiusParams[i];
    let squareSize = squareSizeParams[i];
    let ring = new RingSquares(numRingPoints, radius, width/2, height/2, squareSize);
    rings.push(ring);
  }
  // shuffle the order
  for (let i = 0; i < rings.length; i++) {
    // rings[i].shuffleLineOrder();
    rings[i].shuffleLineOrderWithin4();
  }

  // Initialize frame counter
  frameCounter = 0;

  //gif
  // capturer = new CCapture({
  //   format: 'gif',
  //   workersPath: 'node_modules/ccapture.js/src/',
  //   framerate: fps,
  // });

  // png
  capturer = new CCapture({ format: 'png', framerate: fps });
}



let rotationOffset = 0;
let frameCount = 0;

function draw() {
  clear();
  background(0); // Set background color

  frameCount += 1;

  t = map(frameCount % totalFrames, 0, totalFrames, 0, TWO_PI*20 / 0.15); 
  // interpolate using sin(t) to get a smooth transition
  
  for (let i = 0; i < rings.length; i++) {
    let lerp_amount = lerpFunctions[i](t);
    let rotationOffset = rotationOffsetFunctions[i](t);
    rings[i].generatePoints(rotationOffset);
    rings[i].generateSquares(rotationOffset);
    rings[i].interpolateLines(lerp_amount);
    // rings[i].drawLines();
  }

  if (!capturing && millis() > 2000) { // Wait 2 seconds before start capturing
    capturer.start();
    startMillis = millis();
    capturing = true;
  }

  if (capturing && millis() - startMillis > captureDurationMillis) {
    capturer.stop();
    capturer.save();
    noLoop();
  }

  if (capturing) {
    capturer.capture(document.getElementById('defaultCanvas0'));
  }
}

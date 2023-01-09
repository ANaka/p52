
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

const numRingPoints = 80;
const radius = 200;
let totalNumLines = numRingPoints * 4;
// create a random order of totalNumLines
let lineOrder = [];
for (let i = 0; i < totalNumLines; i++) {
  lineOrder.push(i);
}

function setup() {
  createCanvas(600, 600);
  // shuffle the order
  shuffle(lineOrder, true)
}



let rotationOffset = 0;
let t = 0;

function draw() {
  clear();
  background(0); // Set background color
  rotationOffset += 0.01;
  t += 0.01;
  let centerX = width/2;
  let centerY = height/2;
  ring = new RingPoints(numRingPoints, radius, centerX, centerY, rotationOffset);
  let allLines = [];
  for (let i = 0; i < ring.points.length; i++) {
    let centerX = ring.points[i][0];
    let centerY = ring.points[i][1];
    stroke(255);
    // point(centerX, centerY);
    let squareSize = 10;
    let rotationAngle = map(i, 0, ring.points.length, 0, TWO_PI) + rotationOffset;
    let square = new Square(centerX, centerY, squareSize, rotationAngle);
    allLines = allLines.concat(square.lines);
  }

  // interpolate using sin(t) to get a smooth transition
  let lerp_amount = map(sin(t), -1, 1, 0, 1);

  for (let i = 0; i < allLines.length; i++) {
    let line1_x1 = allLines[lineOrder[i]][0];
    let line1_y1 = allLines[lineOrder[i]][1];
    let line1_x2 = allLines[lineOrder[i]][2];
    let line1_y2 = allLines[lineOrder[i]][3];
    let line2_x1 = allLines[lineOrder[(i+1) % allLines.length]][0];
    let line2_y1 = allLines[lineOrder[(i+1) % allLines.length]][1];
    let line2_x2 = allLines[lineOrder[(i+1) % allLines.length]][2];
    let line2_y2 = allLines[lineOrder[(i+1) % allLines.length]][3];
    let x1 = lerp(line1_x1, line2_x1, lerp_amount);
    let y1 = lerp(line1_y1, line2_y1, lerp_amount);
    let x2 = lerp(line1_x2, line2_x2, lerp_amount);
    let y2 = lerp(line1_y2, line2_y2, lerp_amount);
    stroke(255);
    line(x1, y1, x2, y2);
  }

}

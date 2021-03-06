//TODO compare to Shroeder's code

//Simulation Variables
let particles = [];
let N;
let diameter = 10;
let dt = 0.005;
let k = 500;
let wallThickness = 20;
let numStepsPerFrame = 20;

//UI variables
let nSlider;
let vSlider;
let startButton;
let startButtonValue = 0;
let restartButton;

//Other needed/useful variables
let endWidth;
let pec;
pec = potentialEnergyAtCutoff();

function setup() {
    createCanvas(1000, 500);
    endWidth = width - 100;
    UISetup();
    UILabels();
    N = nSlider.value();
    for (let i = 0; i < N; i++) {
        addParticle(i * diameter + wallThickness, height - diameter - wallThickness);
    }
}

function draw() {
    background(150);
    if (startButtonValue == 0) {
        let v = vSlider.value();
        endWidth = round(v / (height - 2 * wallThickness));

        N = nSlider.value();
        particles = []
        let numNPerRow = (endWidth - 2 * wallThickness) / diameter;
        let numRowsFilled = 0;
        let count = 0;
        for (let i = 0; i < N; i++) {
            if (count == numNPerRow) {
                numRowsFilled++;
                count = 0;
            }
            addParticle(count * diameter + wallThickness, height - numRowsFilled * diameter - wallThickness);
            count++;
        }
    }
    drawWalls(endWidth - 2 * wallThickness + diameter, height - 2 * wallThickness + diameter);
    drawParticles();
    UILabels();
    if (startButtonValue == 1) {
        let totEnergy = 0;
        let temp = 0;
        let p = 0;
        for (let i = 0; i < numStepsPerFrame; i++) {
            updateParticles();
            totEnergy = totEnergy + totalEnergy();
            temp = temp + temperature(); //think this is wrong, should average total kinetic energy then divide it by nkb
            p = p + pressure();
        }
        totEnergy = totEnergy / numStepsPerFrame;
        temp = temp / numStepsPerFrame;
        temp = temp / (N * diameter);
        p = p / numStepsPerFrame;
        updateParameters(totEnergy, temp, p);
        //for (let i = 0; i < N; i++) {
        //    console.log("Particle: " + i);
        //    console.log(particles[i].toString());
        //}
        //console.log();
    }
}

function UISetup() {
    fill(0);
    nSlider = createSlider(1, 1000, 100, 1);
    nSlider.position(endWidth, 50);
    nSlider.style('width', '80px');

    //vSlider = createSlider((height - 2 * wallThickness) * (10 + 2 * wallThickness), (endWidth - 2 * wallThickness) * (height - 2 * wallThickness), (endWidth - 2 * wallThickness) * (height - 2 * wallThickness));
    vSlider = createSlider((height - 2 * wallThickness) * (10 + 2 * wallThickness), (endWidth - 2 * wallThickness) * (height - 2 * wallThickness), 147200);
    vSlider.position(endWidth, 100);
    vSlider.style('width', '80px');

    startButton = createButton("Start");
    startButton.position(endWidth, 150);
    startButton.mousePressed(start);

    restartButton = createButton("Restart");
    restartButton.position(endWidth, 200);
    restartButton.mousePressed(restart);
}

function UILabels() {
    let nLabel = "N: " + nSlider.value();
    text(nLabel, width - 100, 45);

    let vLabel = "V: " + vSlider.value();
    text(vLabel, width - 100, 95);
}

function restart() {
    console.log(location.reload());
}

function start() {
    startButtonValue = 1;
}

function addParticle(x, y) {
    particles.push(new Particle(x, y, diameter));
}

function drawParticles() {
    fill(0);
    for (let i = 0; i < N; i++) {
        circle(particles[i].getX(), particles[i].getY(), diameter);
    }
}

function drawWalls(w, h) {
    fill(255);
    rect(wallThickness - diameter / 2, wallThickness - diameter / 2, w, h);
}

function updateParameters(totEnergy, temp, p) {
    let energyString = "E: " + round(totEnergy, 3);
    let tempString = "T: " + round(temp, 3);
    let pString = "P: " + round(p, 3);
    text(energyString, wallThickness, height - wallThickness / 6);
    text(tempString, width / 2 - wallThickness / 2, height - wallThickness / 6);
    text(pString, width - 3 * wallThickness, height - wallThickness / 6);
}

function forceX(distX, distY) {
    let rSquared = (distX * distX) + (distY * distY);
    let diameterPower = diameter * diameter * diameter * diameter * diameter * diameter;
    let rSquaredCubed = rSquared * rSquared * rSquared;
    let rSquaredSeventh = rSquared * rSquared * rSquared * rSquared * rSquared * rSquared * rSquared;
    let numerator = -24 * diameter * diameterPower * distX * (rSquaredCubed - 2 * diameterPower);
    return numerator / rSquaredSeventh;
}

function forceY(distX, distY) {
    let rSquared = (distX * distX) + (distY * distY);
    let diameterPower = diameter * diameter * diameter * diameter * diameter * diameter;
    let rSquaredCubed = rSquared * rSquared * rSquared;
    let rSquaredSeventh = rSquared * rSquared * rSquared * rSquared * rSquared * rSquared * rSquared;
    let numerator = -24 * diameter * diameterPower * distY * (rSquaredCubed - 2 * diameterPower);
    return numerator / rSquaredSeventh;
}

function updateParticles() {
    for (let i = 0; i < N; i++) {
        particles[i].updatePosition(dt);
        particles[i].updateVelocity(dt);
        let fx = 0;
        let fy = 0;
        fx = fx + leftWallForce(particles[i].getX()) + rightWallForce(particles[i].getX());
        fy = fy + topWallForce(particles[i].getY()) + bottomWallForce(particles[i].getY());
        for (let j = 0; j < N; j++) {
            if (i != j) {
                let distX = particles[i].getX() - particles[j].getX();
                let distY = particles[i].getY() - particles[j].getY();
                if (((distX * distX) + (distY * distY)) < (9 * diameter * diameter)) {
                    fx = fx + forceX(distX, distY);
                    fy = fy + forceY(distX, distY);
                }
            }
        }
        particles[i].updateAcceleration(fx, fy);
        particles[i].updateVelocity(dt);
    }
}

function leftWallForce(pos) {
    if (pos > wallThickness) {
        return 0;
    }
    else {
        if (abs(wallThickness - pos) > wallThickness / 2) {
            return k * wallThickness / 2;
        }
        else {
            return k * (wallThickness - pos);
        }
    }
}

function rightWallForce(pos) {
    if (pos < (endWidth - wallThickness)) {
        return 0;
    }
    else {
        if (abs(pos - (endWidth - wallThickness)) > wallThickness / 2) {
            return -k * wallThickness / 2;
        }
        else {
            return -k * (pos - (endWidth - wallThickness));
        }
    }
}

function topWallForce(pos) {
    if (pos > wallThickness) {
        return 0;
    }
    else {
        if (abs(pos - wallThickness) > wallThickness / 2) {
            return k * wallThickness / 2;
        }
        else {
            return -k * (pos - wallThickness);
        }
    }
}

function bottomWallForce(pos) {
    if (pos < (height - wallThickness)) {
        return 0;
    }
    else {
        if (abs(pos - (height - wallThickness)) > wallThickness / 2) {
            return -k * wallThickness / 2;
        }
        else {
            return -k * (pos - (height - wallThickness));
        }
    }
}

function totalEnergy() {
    let E = 0;
    for (let i = 0; i < N; i++) {
        for (let j = i; j < N; j++) {
            if (i != j) {
                let distX = particles[i].getX() - particles[j].getX();
                let distY = particles[i].getY() - particles[j].getY();
                E = E + potentialEnergy(distX, distY);
            }
            E = E + wallEnergy(particles[i].getX(), particles[i].getY());
        }
        E = E + kineticEnergy(particles[i].getVx(), particles[i].getVy(), particles[i].getM());
    }
    return E;
}

function temperature() {
    let totalK = 0;
    for (let i = 0; i < N; i++) {
        totalK = totalK + kineticEnergy(particles[i].getVx(), particles[i].getVy(), particles[i].getM());
    }
    return totalK;
    //return totalK / (N * diameter);
}

function pressure() {
    let wallForce = 0;
    for (let i = 0; i < N; i++) {
        wallForce = wallForce + leftWallForce(particles[i].getX()) + rightWallForce(particles[i].getX()) + topWallForce(particles[i].getY()) + bottomWallForce(particles[i].getY());
    }
    let surfaceArea = 2 * (endWidth - 2 * wallThickness) + 2 * (height - 2 * wallThickness)
    return wallForce / surfaceArea;
}

function potentialEnergy(distX, distY) {
    let rSquared = (distX * distX) + (distY * distY);
    if (rSquared > (9 * diameter * diameter)) {
        return 0;
    }
    else {
    let diameterTwelve = diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter;
    let diameterSix = diameter * diameter * diameter * diameter * diameter * diameter;
    let rSquaredCubed = rSquared * rSquared * rSquared;
    let rSquaredSix = rSquared * rSquared * rSquared * rSquared * rSquared * rSquared;
    let particlePE =  4 * diameter * ((diameterTwelve / rSquaredSix) - (diameterSix / rSquaredCubed));
    return particlePE - pec;
    }
}

function kineticEnergy(vx, vy, m) {
    return 0.5 * m * (vx * vx + vy * vy);
}

function potentialEnergyAtCutoff(){
    let rSquared = diameter * diameter * 9;
    let diameterTwelve = diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter;
    let diameterSix = diameter * diameter * diameter * diameter * diameter * diameter;
    let rSquaredCubed = rSquared * rSquared * rSquared;
    let rSquaredSix = rSquared * rSquared * rSquared * rSquared * rSquared * rSquared;
    let particlePE =  4 * diameter * ((diameterTwelve / rSquaredSix) - (diameterSix / rSquaredCubed));
    return particlePE;
}

function wallEnergy(x, y){
    let E = 0;
    if (x < wallThickness) {
        let temp = 0.5* k * (wallThickness - x) * (wallThickness - x);
        E = E + temp
    }
    if (x > (endWidth - wallThickness)) {
        let temp = 0.5 * k * (x - (endWidth - wallThickness)) * (x - (endWidth - wallThickness));
        E = E + temp;
    }
    if (y < wallThickness) {
        let temp = 0.5 * k * (y - wallThickness) * (y - wallThickness);
        E = E = temp;
    }
    if (y > (height - wallThickness)) {
        let temp = 0.5 * k * (y - (height - wallThickness)) * (y - (height - wallThickness));
        E = E + temp;
    }
    return E;
}
let particles = [];
let N = 2;
let diameter = 10;
let dt = 0.02;
let k = 50;
let wallThickness = 20;
let numStepsPerFrame = 20;

function setup() {
    createCanvas(500, 500);
    for (let i = 0; i < N; i++) {
        addParticle(i * diameter + wallThickness, height - diameter - wallThickness);
    }
}

function draw() {
    background(150);
    drawWalls();
    drawParticles();
    let totEnergy = 0;
    let temp = 0;
    let p = 0;
    for (let i = 0; i < numStepsPerFrame; i++) {
        updateParticles();
        totEnergy = totEnergy + totalEnergy();
        temp = temp + temperature();
        p = p + pressure();
    }
    totEnergy = totEnergy / (numStepsPerFrame * dt);
    temp = temp / (numStepsPerFrame * dt);
    p = p / (numStepsPerFrame * dt);
    updateParameters(totEnergy, temp, p);
    //for (let i = 0; i < N; i++) {
    //    console.log("Particle: " + i);
    //    console.log(particles[i].toString());
    //}
    //console.log();
}

function addParticle(x, y) {
    particles.push(new Particle(x, y));
}

function drawParticles() {
    fill(0);
    for (let i = 0; i < N; i++) {
        circle(particles[i].getX(), particles[i].getY(), diameter);
    }
}

function drawWalls() {
    fill(255);
    rect(wallThickness - diameter / 2, wallThickness - diameter / 2, width - 2 * wallThickness + diameter, height - 2 * wallThickness + diameter);
}

function updateParameters(totEnergy, temp, p) {
    let energyString = "E: " + round(totEnergy, 3);
    let tempString = "T: " + round(temp, 3);
    let pString = "P: " + round(p, 3);
    text(energyString, wallThickness, height - wallThickness / 6);
    text(tempString, width / 2 - wallThickness / 2, height - wallThickness / 6);
    text(pString, width - 2 * wallThickness, height - wallThickness / 6);
}

function forceX(distX, distY) {
    if ((distX * distX + distY * distY) > 9 * diameter * diameter) {
        return 0;
    }
    else {
        return -24 * diameter * diameter * diameter * diameter * diameter * diameter * distX * ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) - 2 * diameter * diameter * diameter * diameter * diameter * diameter) / ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY));
    }
}

function forceY(distX, distY) {
    if ((distX * distX + distY * distY) > 9 * diameter * diameter) {
        return 0;
    }
    else {
        return -24 * diameter * diameter * diameter * diameter * diameter * diameter * distY * ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) - 2 * diameter * diameter * diameter * diameter * diameter * diameter) / ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY));
    }
}

function updateParticles() {
    for (let i = 0; i < N; i++) {
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < N; j++) {
            if (i != j) {
                fx = fx + forceX(particles[i].getX() - particles[j].getX(), particles[i].getY() - particles[j].getY());
                fy = fy + forceY(particles[i].getX() - particles[j].getX(), particles[i].getY() - particles[j].getY());
            }
        }
        fx = fx + leftWallForce(particles[i].getX()) + rightWallForce(particles[i].getX());
        fy = fy + topWallForce(particles[i].getY()) + bottomWallForce(particles[i].getY());
        //console.log("" + fx + " " + fy);
        particles[i].updateMotion(fx, fy, dt);
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
    if (pos < (width - wallThickness)) {
        return 0;
    }
    else {
        if (abs(pos - (width - wallThickness)) > wallThickness / 2) {
            return -k * wallThickness / 2;
        }
        else {
            return -k * (pos - (width - wallThickness));
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
        }
        E = E + kineticEnergy(particles[i].getVx(), particles[i].getVy());
    }
    return E;
}

function temperature() { //need a time average
    let totalK = 0;
    for (let i = 0; i < N; i++) {
        totalK = totalK + kineticEnergy(particles[i].getVx(), particles[i].getVy());
    }
    return totalK / N;
}

function pressure() {
    let wallForce = 0;
    for (let i = 0; i < N; i++) {
        wallForce = wallForce + leftWallForce(particles[i].getX()) + rightWallForce(particles[i].getX()) + topWallForce(particles[i].getY()) + bottomWallForce(particles[i].getY());
    }
    let surfaceArea = 2 * (width - 2 * wallThickness + diameter) + 2 * (height - 2 * wallThickness + diameter)
    return wallForce / surfaceArea
}

function potentialEnergy(distX, distY) {
    if ((distX * distX + distY * distY) > 9 * diameter * diameter) {
        return 0;
    }
    else {
        return 4 * (diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter * diameter / ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY)) - diameter * diameter * diameter * diameter * diameter * diameter / ((distX * distX + distY * distY) * (distX * distX + distY * distY) * (distX * distX + distY * distY)));
    }
}

function kineticEnergy(vx, vy) {
    return 0.5 * (vx * vx + vy * vy);
}
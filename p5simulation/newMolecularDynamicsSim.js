//Simulation variables
let pos = [];
let vel = [];
let force = [];
let oldForce = [];
let N = 500; //just for testing
let dt = 0.005;
let m = 10;
let sigma = 10;
let epsilon = 10;
let rc = 3*sigma;
let fc;
let vc;
let kb = 10;
let T = 0.45; //just for testing

//useful variables
let posConstant = 0.5 * dt * dt / m;
let velConstant = 0.5 * dt / m;
let A;

function setup(){
    createCanvas(500, 500);
    A = sqrt(12 * kb * T / m);
    angleMode(RADIANS);
    initializePosition();
    initializeVelocity();
    fc = calculateForce(rc);
    vc = calculateEnergy(rc);
}

function draw(){
    background(255);
    drawParticles();
    update();
    //analysis();
}

function update(){
    for (let n = 0; n < 20; n++){
        for (let i = 0; i < 2 * N; i++){
            pos[i] = pos[i] + vel[i] * dt + force[i] * posConstant;
            //checking boundary conditions - implement walls instead
            if (pos[i] > width){
                pos[i] = pos[i] - width;
            }
            if (pos[i] < 0){
                pos[i] = pos[i] + width;
            }
        }

        for (let i = 0; i < 2 * N; i++){
            oldForce[i] = force[i];
        }

        for (let i = 0; i < 2 * N; i = i + 2){
            let totFx = 0;
            let totFy = 0;
            for (let j = 0; j < 2 * N; j = j + 2){
                if (i != j){
                    let distX = pos[i] - pos[j];
                    let distY = pos[i+1] - pos[j+1];
                    let r = sqrt((distX * distX) + (distY * distY));
                    if (r < rc){
                        let magForce = calculateForce(r) - fc;
                        let angle = atan2(distY / distX);
                        let fx = magForce * cos(angle);
                        let fy = magForce * sin(angle);
                        totFx = totFx + fx;
                        totFy = totFy + fy;
                    }
                }
            }
            force[i] = totFx;
            force[i+1] = totFy;
        }

        for (let i = 0; i < 2 * N; i++){
            vel[i] = vel[i] + (force[i] + oldForce[i]) * velConstant;
        }

    }
}

function calculateForce(r){
    let sigma12 = sigma * sigma * sigma* sigma* sigma* sigma* sigma* sigma* sigma* sigma* sigma* sigma;
    let sigma6 = sigma * sigma* sigma* sigma* sigma* sigma;
    let r13 = r * r * r * r * r * r * r * r * r * r * r * r * r;
    let r7 = r * r * r * r * r * r * r;
    let firstTerm = 12 * sigma12 / r13;
    let secondTerm = 6 * sigma6 / r7;
    return 4 * epsilon * (firstTerm - secondTerm);
}

function calculateEnergy(r){
    let fraction = sigma / r;
    let fraction12 = fraction * fraction * fraction * fraction * fraction * fraction * fraction * fraction * fraction * fraction * fraction * fraction;
    let fraction6 = fraction * fraction * fraction * fraction * fraction * fraction;
    return 4 * epsilon * (fraction12 - fraction6) + fc * r;
}

function analysis(){

}

function initializePosition(){
    let spacing = 1.5 * sigma;
    let nPerRow = floor(width / spacing);
    let colCount = 0;
    let rowCount = 0;
    for (let i = 0; i < 2 * N; i++){
        if (i % 2 == 0){ //x positions
            pos.push(spacing * colCount + spacing);
            colCount++;
            if (colCount > nPerRow){
                colCount = 0;
                rowCount++;
            }
        }
        else{
            pos.push(spacing * rowCount + spacing);
        }
    }
}

function drawParticles(){
    fill(0);
    for (let i = 0; i < 2 * N; i = i + 2) {
        circle(pos[i], pos[i + 1], sigma);
    }
}

function initializeVelocity(){
    for (let i = 0; i < 2 * N; i++){
        vel.push(A * (random() - 0.5));
    } //may need to subtract off totalV/N to ensure that there is not any total momentum of the box
}
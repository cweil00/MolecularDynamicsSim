import java.util.ArrayList;

ArrayList<Particle> particles = new ArrayList<Particle>();
int N = 1;
int diameter = 10;
float dt = 0.02;
float k = 50;
int wallThickness = 20;
int numStepsPerFrame = 20;

void setup() {
  size(500, 500);
  for (int i=0; i<N; i++){
    addParticle(i*diameter + wallThickness, height - diameter - wallThickness);
  }
}

void draw() {
  background(150);
  drawWalls();
  drawParticles();
  for (int i=0; i<numStepsPerFrame; i++){
    updateParticles();
  }
  for (int i=0; i<particles.size(); i++){
    System.out.println("Particle: " + i);
    System.out.println(particles.get(i).toString());
  }
  System.out.println();
}

void addParticle(float x, float y){
  particles.add(new Particle(x, y));
}

void drawParticles(){
  for (int i=0; i<particles.size(); i++){
    fill(0);
    circle(particles.get(i).getX(), particles.get(i).getY(), diameter);
  }
}

void drawWalls(){
  fill(255);
  rect(wallThickness - diameter/2, wallThickness - diameter/2, width - 2*wallThickness + diameter/2, height - 2*wallThickness + diameter/2);
}

float forceX(float distX, float distY){
  if ((distX*distX + distY*distY) > 9*diameter*diameter){
    return 0;
  }
  else{
    return -24*diameter*diameter*diameter*diameter*diameter*diameter*distX*((distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY) - 2*diameter*diameter*diameter*diameter*diameter*diameter)/((distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY));
  }
}

float forceY(float distX, float distY){
  if ((distX*distX + distY*distY) > 9*diameter*diameter){
    return 0;
  }
  else{
    return -24*diameter*diameter*diameter*diameter*diameter*diameter*distY*((distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY) - 2*diameter*diameter*diameter*diameter*diameter*diameter)/((distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY)*(distX*distX + distY*distY));
  }
}

void updateParticles(){
  for (int i=0; i<particles.size(); i++){
    float fx = 0;
    float fy = 0;
    for (int j=0; j<particles.size(); j++){
      if (i != j){
        fx = fx + forceX(particles.get(i).getX() - particles.get(j).getX(), particles.get(i).getY() - particles.get(j).getY());
        fy = fy + forceY(particles.get(i).getX() - particles.get(j).getX(), particles.get(i).getY() - particles.get(j).getY());
      }
    }
    fx = fx + leftWallForce(particles.get(i).getX()) + rightWallForce(particles.get(i).getX());
    fy = fy + topWallForce(particles.get(i).getY()) + bottomWallForce(particles.get(i).getY());
    //System.out.println("" + fx + " " + fy);
    particles.get(i).updateMotion(fx, fy, dt);
  }
}

float leftWallForce(float pos){
  if (pos > wallThickness){
    return 0;
  }
  else{
    if (abs(pos - wallThickness) < wallThickness/2){
      return k*wallThickness/2;
    }
    else{
      return -k*(pos - wallThickness);
    }
  }
}

float rightWallForce(float pos){
  if (pos < (width - wallThickness)){
    return 0;
  }
  else{
    if (abs(pos - (width - wallThickness)) < wallThickness/2){
      return -k*wallThickness/2;
    }
    else{
      return -k*(pos - (width - wallThickness));
    }
  }
}

float topWallForce(float pos){
  if (pos > wallThickness){
    return 0;
  }
  else{
    if (abs(pos - wallThickness) < wallThickness/2){
      return k*wallThickness/2;
    }
    else{
      return -k*(pos - wallThickness);
    }
  }
}

float bottomWallForce(float pos){
  if (pos < (height - wallThickness)){
    return 0;
  }
  else{
    if (abs(pos - (height - wallThickness)) < wallThickness/2){
      return -k*wallThickness/2;
    }
    else{
      return -k*(pos - (height - wallThickness));
    }
  }
}
import java.util.ArrayList;

ArrayList<Particle> particles = new ArrayList<Particle>();
int N = 1;
int diameter = 10;
float dt = 0.01;
float k = 50;

void setup() {
  size(500, 500);
  for (int i=0; i<N; i++){
    addParticle(i*5*diameter/4+3*diameter/4, i*5*diameter/4 + 3*diameter/4);
  }
}

void draw() {
  background(255);
  drawParticles();
  updateParticles();
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

float force(float dist){
  if (dist > 3*diameter){
    return 0;
  }
  else if (dist == 0){
    return 0;
  }
  else{
    return 4*(-12.0*(diameter*diameter*diameter*diameter*diameter*diameter*diameter*diameter*diameter*diameter*diameter*diameter)/(dist*dist*dist*dist*dist*dist*dist*dist*dist*dist*dist*dist*dist) + 6.0*(diameter*diameter*diameter*diameter*diameter*diameter*diameter)/(dist*dist*dist*dist*dist*dist));
  }
}

void updateParticles(){
  for (int i=0; i<particles.size(); i++){
    float fx = 0;
    float fy = 0;
    for (int j=0; j<particles.size(); j++){
      if (i != j){
        fx = fx + force(particles.get(i).getX() - particles.get(j).getX());
        fy = fy + force(particles.get(i).getY() - particles.get(j).getY());
      }
    }
    fx = fx + leftWallForce(particles.get(i).getX()) + rightBottomWallForce(particles.get(i).getX() - width);
    fy = fy + topWallForce(particles.get(i).getY()) + rightBottomWallForce(particles.get(i).getY() - height);
    particles.get(i).updateMotion(fx, fy, dt);
  }
}

float leftWallForce(float dist){
  return -k*(dist - width);
}

float topWallForce(float dist){
  return -k*(dist - height);
}

float rightBottomWallForce(float dist){
  return -k*(-dist);
}
    

class Particle{
  
  private float x;
  private float y;
  private float vx;
  private float vy;
  private float ax;
  private float ay;
  
  public Particle(float x, float y){
    this.x = x;
    this.y = y;
    vx = 0;
    vy = 0;
    ax = 0;
    ay = 0;
  }
  
  private void updatePosition(float dt){
    x = x + vx*dt + ax*dt*dt/2;
    y = y + vy*dt + ay*dt*dt/2;
  }
  
  private void updateVelocity(float dt){
    vx = vx + ax*dt/2;
    vy = vy + ay*dt/2;
  }
  
  public void updateMotion(float Fx, float Fy, float dt){
    this.updatePosition(dt);
    this.updateVelocity(dt);
    ax = Fx;
    ay = Fy;
    this.updateVelocity(dt);
  }
  
  public void setV(float vx, float vy){
    this.vx = vx;
    this.vy = vy;
  }
  
  public float getX(){
    return x;
  }
  
  public float getY(){
    return y;
  }
  
  public float getVx(){
    return vx;
  }
  
  public float getVy(){
    return vy;
  }
  
  public String toString(){
    return "Position: (" + x + ", " + y + "), " +
           "Velocity: (" + vx + ", " + vy + "), " +
           "Acceleration: (" + ax + ", " + ay + ")";
  
  }
  
}

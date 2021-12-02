class Particle {

    #x;
    #y
    #vx;
    #vy;
    #ax;
    #ay;
    #m;

    constructor(x, y, m) {
        this.#x = x;
        this.#y = y;
        this.#vx = random() - 0.5;
        this.#vy = random() - 0.5;
        this.#ax = 0;
        this.#ay = 0;
        this.#m = m;
    }

    updatePosition(dt) {
        this.#x = this.#x + this.#vx * dt + this.#ax * dt * dt / 2;
        this.#y = this.#y + this.#vy * dt + this.#ay * dt * dt / 2;
    }

    updateVelocity(dt) {
        this.#vx = this.#vx + this.#ax * dt / 2;
        this.#vy = this.#vy + this.#ay * dt / 2;
    }

    updateAcceleration(Fx, Fy) {
        this.#ax = Fx / this.#m;
        this.#ay = Fy / this.#m;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getVx() {
        return this.#vx;
    }

    getVy() {
        return this.#vy;
    }

    getM() {
        return this.#m;
    }

    toString() {
        return "Position: (" + this.#x + ", " + this.#y + "), " +
            "Velocity: (" + this.#vx + ", " + this.#vy + "), " +
            "Acceleration: (" + this.#ax + ", " + this.#ay + ")";
    }

}
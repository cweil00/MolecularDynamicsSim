import numpy as np
import matplotlib.pyplot as plt

def leonardJones(r, u):
    for i in range(len(r)):
        if r[i] < d:
            r[i] = d
        if r[i] > 3*d:
            u.append(0)
        else:
            u.append(4*d*((d/r[i])**12 - (d/r[i])**6))
    return u

def main():
    r = np.linspace(1, 4*d, 1000)
    u = []
    u = np.array(leonardJones(r, u))
    plt.figure()
    plt.scatter(r, u, marker='.')
    plt.xlabel('r')
    plt.ylabel('u')
    plt.xlim(0,4*d)
    #plt.ylim(-1, 1)
    plt.title('leonard jones natural units')
    plt.show()

global d
d = 10
main()

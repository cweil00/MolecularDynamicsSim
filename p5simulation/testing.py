import numpy as np
import matplotlib.pyplot as plt

def lj(r, e, s, uc):
    u = []
    for d in r:
        if d < 3*s:
            p  = 4 * e * ((s/d)**12 - (s/d)**6) - uc
            u.append(p)
        else:
            u.append(0)
    return u

def main():
    s = 10
    e = s
    uc = 4 * e * ((s/(3*s))**12 - (s/(3*s))**6)
    r = np.linspace(0, 4*s, 1000*s)
    u = lj(r, e, s, uc)
    plt.figure(figsize=(5,5))
    plt.plot(r, u)
    plt.hlines(0, 0, 4*s, 'black')
    plt.xlim(0, 4*s)
    plt.ylim(-e- 1, 1)
    plt.xlabel("r", fontsize=20)
    plt.ylabel("u(r)", fontsize=20)
    plt.title(r"Leonard Jones Potetial, $\sigma = \epsilon = 10$", fontsize=24)
    plt.show()

main()
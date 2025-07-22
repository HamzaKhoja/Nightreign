xs = [510, 200, 660, 750, 350, 190, 775, 530, 190, 440, 550]
ys = [225, 350, 360, 350, 390, 550, 570, 620, 690, 680, 775]

for i in range(len(xs)):
    print(f"{xs[i]/960*100:.2f}, {ys[i]/960*100:.2f}")  # Adjusted to match the original format
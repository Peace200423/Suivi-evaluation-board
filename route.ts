@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #16231C;
  color: #ECE7D9;
}

.gauge-ticks {
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent calc(10% - 1px),
    rgba(22, 35, 28, 0.55) 10%
  );
}

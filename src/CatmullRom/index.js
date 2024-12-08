import { Vector2 } from "../lib/vector";

/**
 * Denotes
 *
 * c = curve segment
 * p = data points
 * t = knots
 *
 */
function getHitPoint(e) {
  return new Vector2(e.offsetX, e.offsetY);
}
function isInternal(hitpoint, radius, point) {
  return (
    (hitpoint.x - point.x) ** 2 + (hitpoint.y - point.y) ** 2 < radius ** 2
  );
}

const PARAMETERIZATION = {
  centropedial: 0.5,
  chordal: 1,
  uniform: 0,
};

const parameterization = "centropedial";
const controlPoints = [];
const density = 500;
const STAGE_DIMENSION = new Vector2(
  document.body.clientWidth,
  document.body.clientHeight
);
const CONTROL_POINT_RADIUS = 20;
const thickness = 6;
let dragState = -1;

export function Component() {
  const canvas = document.createElement("canvas");
  canvas.width = STAGE_DIMENSION.x;
  canvas.height = STAGE_DIMENSION.y;
  canvas.id = "stage";

  const ctx = canvas.getContext("2d");

  for (let i = 0; i < 9; i++) {
    controlPoints.push(
      new Vector2(i * (STAGE_DIMENSION.x / 9), STAGE_DIMENSION.y / 2)
    );
  }

  canvas.addEventListener("mousedown", (e) => {
    for (let i = 0; i < controlPoints.length; i++) {
      const cp = controlPoints[i];
      if (isInternal(cp, CONTROL_POINT_RADIUS, getHitPoint(e))) {
        dragState = i;
        return;
      }
    }
    dragState = -1;
  });
  canvas.addEventListener("mousemove", (e) => {
    if (dragState >= 0) {
      controlPoints[dragState] = getHitPoint(e);
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    dragState = -1;
  });

  function createSpline(p0, p1, p2, p3) {
    return {
      p0: p0,
      p1: p1,
      p2: p2,
      p3: p3,
    };
  }

  function splinePoint(spline, tVal, edge) {
    function knotInterval(p0, p1, alpha) {
      return (
        Math.sqrt((p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2) **
          PARAMETERIZATION[parameterization] +
        alpha
      );
    }
    const P0 = spline.p0;
    const P1 = spline.p1;
    const P2 = spline.p2;
    const P3 = spline.p3;
    const k0 = 0; // assume start point
    const k1 = knotInterval(spline.p0, spline.p1, k0);
    const k2 = knotInterval(spline.p1, spline.p2, k1);
    const k3 = knotInterval(spline.p2, spline.p3, k2);
    const k = (k2 - k1) * tVal + k1;
    const A1 = {
      x: ((k1 - k) / (k1 - k0)) * P0.x + ((k - k0) / (k1 - k0)) * P1.x,
      y: ((k1 - k) / (k1 - k0)) * P0.y + ((k - k0) / (k1 - k0)) * P1.y,
    };
    const A2 = {
      x: ((k2 - k) / (k2 - k1)) * P1.x + ((k - k1) / (k2 - k1)) * P2.x,
      y: ((k2 - k) / (k2 - k1)) * P1.y + ((k - k1) / (k2 - k1)) * P2.y,
    };
    const A3 = {
      x: ((k3 - k) / (k3 - k2)) * P2.x + ((k - k2) / (k3 - k2)) * P3.x,
      y: ((k3 - k) / (k3 - k2)) * P2.y + ((k - k2) / (k3 - k2)) * P3.y,
    };
    const B1 = {
      x: ((k2 - k) / (k2 - k0)) * A1.x + ((k - k0) / (k2 - k0)) * A2.x,
      y: ((k2 - k) / (k2 - k0)) * A1.y + ((k - k0) / (k2 - k0)) * A2.y,
    };
    const B2 = {
      x: ((k3 - k) / (k3 - k1)) * A2.x + ((k - k1) / (k3 - k1)) * A3.x,
      y: ((k3 - k) / (k3 - k1)) * A2.y + ((k - k1) / (k3 - k1)) * A3.y,
    };
    const C = {
      x: ((k2 - k) / (k2 - k1)) * B1.x + ((k - k1) / (k2 - k1)) * B2.x,
      y: ((k2 - k) / (k2 - k1)) * B1.y + ((k - k1) / (k2 - k1)) * B2.y,
    };
    return C;
  }

  function drawSpline(spl, color, thickness, density, edge) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    let t = 1 / density;
    ctx.beginPath();
    const firstPt = splinePoint(spl, 0, edge);
    ctx.moveTo(firstPt.x, firstPt.y);

    for (let i = 0; i < density; i++) {
      const nextP = splinePoint(spl, t, edge);
      ctx.lineTo(nextP.x, nextP.y);
      t += 1 / density;
    }
    ctx.stroke();
    ctx.closePath();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors = ["red", "blue", "green", "purple", "pink", "gold"];
    for (let i = 0; i < controlPoints.length - 3; i++) {
      const spline = createSpline(...controlPoints.slice(i, i + 4));
      const edge = i === 0 ? 1 : i === controlPoints.length - 4 ? 2 : 0;
      drawSpline(spline, colors[i], thickness, density, edge);
    }

    ctx.fillStyle = "tomato";
    for (let i = 0; i < controlPoints.length; i++) {
      const cp = controlPoints[i];
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();

  return canvas;
}

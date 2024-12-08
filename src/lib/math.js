export function isInternal(p1, p2, threshold = 1) {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 < threshold ** 2;
}

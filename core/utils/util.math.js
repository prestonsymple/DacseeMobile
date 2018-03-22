

const distance = (n1, e1, n2, e2) => {
  let jd = 102834.74258026089
  let wd = 111712.69150641055
  let b = Math.abs((e1 - e2) * jd)
  let a = Math.abs((n1 - n2) * wd)
  return Math.sqrt((a * a + b * b))
}

const direction = (n1, e1, n2, e2) => {
  let e3 = 0
  let n3 = 0
  e3 = e1 + 0.005
  n3 = n1
  let a = 0
  let b = 0
  let c = 0
  a = distance(e1, n1, e3, n3)
  b = distance(e3, n3, e2, n2)
  c = distance(e1, n1, e2, n2)
  let cosB = 0
  if ((a * c) != 0)
  {
    cosB = (a * a + c * c - b * b) / (2 * a * c)
  }
  let B = Math.acos(cosB) * 180 / Math.PI

  if(n2 < n1) {
    B = 180 + (180 - B)
  }

  return B
}

const carDirection = (n1, e1, n2, e2) => {
  const DEFINE_ANGLE = 24

  const _direction = direction(n1, e1, n2, e2)
  console.log(_direction)
  return parseInt(_direction / DEFINE_ANGLE) + ((_direction % DEFINE_ANGLE) >= (DEFINE_ANGLE / 2) ? 1 : 0)
}


export default {
  distance,
  direction,
  carDirection
}
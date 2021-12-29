attribute vec3 pointA;
attribute vec3 pointB;
attribute vec3 pointC;

uniform float opacity;
uniform float width;
uniform float zlevel;

void main() {
   vec2 pA = pointA.xy;
   vec2 pB = pointB.xy;
   vec2 pC = pointC.xy;
   vec2 tangent = normalize(normalize(pC - pB) + normalize(pB - pA));
   vec2 normal = vec2(-tangent.y, tangent.x);
   vec2 ab = pB - pA;
   vec2 cb = pB - pC;
   float sigma = sign(dot(ab + cb, normal));
   vec2 abn = normalize(vec2(-ab.y, ab.x));
   vec2 cbn = -normalize(vec2(-cb.y, cb.x));
   vec2 p0 = 0.5 * sigma * width * (sigma < 0.0 ? abn : cbn);
   vec2 p1 = 0.5 * sigma * width * (sigma < 0.0 ? cbn : abn);
   float mx = 0.5;
   float dt = max(mx, dot(normal, abn));
   vec2 p2 = -0.5 * normal * sigma * width / dt;
   vec2 point = pB + position.x * p0 + position.y * p1 + position.z * p2;

   vec3 transformed = vec3(point, zlevel);
}

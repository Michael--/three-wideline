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

       vec3 transformed;

       if(position.x == 0.0) {
              vec2 xBasis = pB - pA;
              vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
              vec2 point = pA + xBasis * position.x + yBasis * width * position.y;
              transformed = vec3(point, zlevel);
       } else {

              // Find the normal vector.
              vec2 tangent = normalize(normalize(pC - pB) + normalize(pB - pA));
              vec2 normal = vec2(-tangent.y, tangent.x);

              // Find the perpendicular vectors.
              vec2 ab = pB - pA;
              vec2 cb = pB - pC;
              vec2 abNorm = normalize(vec2(-ab.y, ab.x));

              // Determine the bend direction.
              float sigma = sign(dot(ab + cb, normal));

              if(sign(position.y) == -sigma) {
                     float mx = 0.5;
                     float dt = max(mx, dot(normal, abNorm));
                     vec2 position = 0.5 * normal * -sigma * width / dt;
                     transformed = vec3(pB + position, zlevel);
              } else {
                     vec2 xBasis = pB - pA;
                     vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
                     vec2 point = pA + xBasis * position.x + yBasis * width * position.y;
                     transformed = vec3(point, zlevel);
              }
       }
}

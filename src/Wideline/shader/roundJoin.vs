#ifndef HAS_POSITION
attribute vec3 position; // editor-only to silence linter
#endif

attribute vec3 pointA;
attribute vec3 pointB;
attribute vec3 pointC;

uniform float width;
uniform float resolution;
uniform float zlevel;

void main() {
   vec2 pA = pointA.xy;
   vec2 pB = pointB.xy;
   vec2 pC = pointC.xy;

   // Calculate the x- and y- basis vectors.
   vec2 xBasis = normalize(normalize(pC - pB) + normalize(pB - pA));
   vec2 yBasis = vec2(-xBasis.y, xBasis.x);

   // Calculate the normal vectors for each neighboring segment.
   vec2 ab = pB - pA;
   vec2 cb = pB - pC;
   vec2 abn = normalize(vec2(-ab.y, ab.x));
   vec2 cbn = -normalize(vec2(-cb.y, cb.x));

   // Determine the direction of the bend.
   float sigma = sign(dot(ab + cb, yBasis));
   vec3 transformed;
   // If this is the zeroth id, it's the center of our circle. Stretch it to meet the segments' intersection.
   if(position.x == 0.0) {
      float mx = 0.5;
      transformed = vec3(pB + -0.5 * yBasis * sigma * width / max(mx, dot(yBasis, abn)), zlevel);
   } else {

      // Otherwise find the angle for this vertex.
      float theta = acos(dot(abn, cbn));
      theta = (sigma * 0.5 * 3.1515926) + -0.5 * theta + theta * (position.x - 1.0) / resolution;

      // Find the vertex position from the angle and multiply it by our basis vectors.
      vec2 pos = 0.5 * width * vec2(cos(theta), sin(theta));
      pos = pB + xBasis * pos.x + yBasis * pos.y;

      transformed = vec3(pos, zlevel);
   }
   vec3 objectNormal = normalize(vec3(transformed.xy, 1)); // varying: used in fragment shader
}

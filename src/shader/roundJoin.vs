attribute vec3 pointA;
attribute vec3 pointB;
attribute vec3 pointC;

uniform vec3 color;
uniform float opacity;
uniform float width;
uniform float resolution;
uniform float zlevel;

varying vec4 vColor;

void main() {
   vec2 pA = pointA.xy;
   vec2 pB = pointB.xy;
   vec2 pC = pointC.xy;
   vColor = vec4(color, opacity);
   mat4 m = projectionMatrix * modelViewMatrix;

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

   // If this is the zeroth id, it's the center of our circle. Stretch it to meet the segments' intersection.
   if(position.x == 0.0) {
      float mx = opacity >= 1.0 ? 0.5 : 0.125;
      gl_Position = m * vec4(pB + -0.5 * yBasis * sigma * width / max(mx, dot(yBasis, abn)), 0, 1);
      return;
   }

   // Otherwise find the angle for this vertex.
   float theta = acos(dot(abn, cbn));
   theta = (sigma * 0.5 * 3.1515926) + -0.5 * theta + theta * (position.x - 1.0) / resolution;

   // Find the vertex position from the angle and multiply it by our basis vectors.
   vec2 pos = 0.5 * width * vec2(cos(theta), sin(theta));
   pos = pB + xBasis * pos.x + yBasis * pos.y;

   gl_Position = m * vec4(pos, zlevel, 1);
}

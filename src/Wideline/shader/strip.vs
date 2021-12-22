attribute vec3 pointA;
attribute vec3 pointB;
attribute vec3 pointC;
attribute vec3 pointD;

uniform vec3 color;
uniform float opacity;
uniform float width;
uniform float zlevel;

varying vec4 vColor;

void main() {
   vec2 pA = pointA.xy;
   vec2 pB = pointB.xy;
   vec2 pC = pointC.xy;
   vec2 pD = pointD.xy;

   vColor = vec4(color, opacity);
   mat4 m = projectionMatrix * modelViewMatrix;

   // Select the three points we'll use and adjust the vertex according to 
   // the side of the segment the vertex is on and the order of the points.
   vec2 p0 = pA;
   vec2 p1 = pB;
   vec2 p2 = pC;
   vec2 pos = position.xy;
   if(position.x == 1.0) {
      p0 = pD;
      p1 = pC;
      p2 = pB;
      pos = vec2(1.0 - position.x, -position.y);
   }

   // Find the normal vector.
   vec2 tangent = normalize(normalize(p2 - p1) + normalize(p1 - p0));
   vec2 normal = vec2(-tangent.y, tangent.x);

   // Find the perpendicular vectors.
   vec2 p01 = p1 - p0;
   vec2 p21 = p1 - p2;
   vec2 p01Norm = normalize(vec2(-p01.y, p01.x));

   // Determine the bend direction.
   float sigma = sign(dot(p01 + p21, normal));

   // If this is the intersecting vertex, 

   if(sign(pos.y) == -sigma) {
      float mx = opacity >= 1.0 ? 0.5 : 0.125;
      float dt = max(mx, dot(normal, p01Norm));
      vec2 point = 0.5 * normal * -sigma * width / dt;
      gl_Position = m * vec4(p1 + point, zlevel, 1);
   } else {
      vec2 xBasis = p2 - p1;
      vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
      vec2 point = p1 + xBasis * pos.x + yBasis * width * pos.y;
      gl_Position = m * vec4(point, zlevel, 1);
   }
}

attribute vec3 pointA;
attribute vec3 pointB;

uniform vec3 color;
uniform float opacity;
uniform float width;
uniform float dir; // <=0 start cap, >0 end cap
uniform float zlevel;

varying vec4 vColor;

void main() {
     vec2 pA = pointA.xy;
     vec2 pB = pointB.xy;
     vColor = vec4(color, opacity);
     mat4 m = projectionMatrix * modelViewMatrix;

     vec2 xBasis = normalize(dir <= 0.0 ? (pA - pB) : (pB - pA));
     vec2 yBasis = vec2(-xBasis.y, xBasis.x);
     vec2 point = (dir <= 0.0 ? pA : pB) + xBasis * width * position.x + yBasis * width * position.y;

     gl_Position = m * vec4(point, zlevel, 1);
}

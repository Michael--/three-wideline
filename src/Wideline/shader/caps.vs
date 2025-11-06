#ifndef HAS_POSITION
attribute vec3 position; // editor-only to silence linter
#endif

attribute vec3 pointA;
attribute vec3 pointB;

uniform float width;
uniform float dir; // <=0 start cap, >0 end cap
uniform float zlevel;

void main() {
     vec2 pA = pointA.xy;
     vec2 pB = pointB.xy;

     vec2 xBasis = normalize(dir <= 0.0 ? (pA - pB) : (pB - pA));
     vec2 yBasis = vec2(-xBasis.y, xBasis.x);
     vec2 point = (dir <= 0.0 ? pA : pB) + xBasis * width * position.x + yBasis * width * position.y;

     vec3 transformed = vec3(point, zlevel);
     vec3 objectNormal = normalize(vec3(transformed.xy, 1));
}

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
     // Find the miter vector.
     vec2 tangent = normalize(normalize(pC - pB) + normalize(pB - pA));
     vec2 miter = vec2(-tangent.y, tangent.x);

     // Find the perpendicular vectors.
     vec2 ab = pB - pA;
     vec2 cb = pB - pC;
     vec2 abNorm = normalize(vec2(-ab.y, ab.x));
     vec2 cbNorm = -normalize(vec2(-cb.y, cb.x));

     // Determine the bend direction.
     float sigma = sign(dot(ab + cb, miter));

     // Calculate the basis vectors for the miter geometry.
     vec2 p0 = 0.5 * width * sigma * (sigma < 0.0 ? abNorm : cbNorm);
     vec2 p1 = 0.5 * miter * sigma * width / max(0.25, dot(miter, abNorm));
     vec2 p2 = 0.5 * width * sigma * (sigma < 0.0 ? cbNorm : abNorm);
     float mx = 0.5;
     vec2 p3 = -0.5 * miter * sigma * width / max(mx, dot(miter, abNorm));
     float w = (position == vec3(0, 0, 0)) ? 1.0 : 0.0; // to avoid position definition as vec4 type

     // Calculate the final point position.
     vec2 point = pB + position.x * p0 + position.y * p1 + position.z * p2 + w * p3;

     vec3 transformed = vec3(point, zlevel);
     vec3 objectNormal = normalize(vec3(transformed.xy, 1));
}

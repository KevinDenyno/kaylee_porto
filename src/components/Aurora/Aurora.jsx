import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import "./Aurora.css";

/* ================= VERTEX ================= */
const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/* ================= FRAGMENT ================= */
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uStorm;

out vec4 fragColor;

/* ========= NOISE ========= */
vec3 permute(vec3 x){
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );

  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
  vec3 p = permute(
      permute(i.y + vec3(0.0,i1.y,1.0))
    + i.x + vec3(0.0,i1.x,1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0,x0),
      dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)
    ),
    0.0
  );

  m *= m;
  m *= m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.7928429 - 0.8537347 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

/* ========= RANDOM ========= */
float rand(float n){
  return fract(sin(n) * 43758.5453123);
}

/* ========= CINEMATIC GOLD LIGHTNING ========= */
float lightning(vec2 uv, float t){
  float freq = mix(1.2, 3.0, uStorm);
  float id = floor(t * freq);
  float seed = rand(id);

  // jarang muncul tapi smooth
  float appear = smoothstep(0.92, 1.0, seed);

  float x = rand(id * 13.1);
  float jitter = snoise(vec2(uv.y * 8.0, t)) * 0.035;

  float core = smoothstep(
    0.02,
    0.0,
    abs(uv.x - x + jitter)
  );

  float fadeY = smoothstep(1.0, 0.25, uv.y);

  // pulse lembut
  float pulse = sin((t - id) * 6.283) * 0.5 + 0.5;

  return appear * core * fadeY * pulse;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;

  /* ===== AURORA MOTION ===== */
  float n1 = snoise(vec2(uv.x * 1.5 + uTime * 0.05, uTime * 0.12));
  float n2 = snoise(vec2(uv.x * 3.0 - uTime * 0.08, uTime * 0.18));

  float y = uv.y + n1 * 0.14 + n2 * 0.06;

  float mask =
    smoothstep(0.85, 0.35, y) *
    smoothstep(0.0, 0.22, uv.y);

  /* ===== BLOOD RED COLOR RAMP ===== */
  vec3 color = mix(uColorStops[0], uColorStops[1], uv.y);
  color = mix(color, uColorStops[2], uv.y * uv.y);

  vec3 aurora = color * mask * (0.9 + uStorm * 0.5);

  /* ===== GOLD LIGHTNING ===== */
  float bolt = lightning(uv, uTime);
  vec3 lightningColor = vec3(1.0, 0.85, 0.25) * bolt * 2.0;

  vec3 finalColor = aurora + lightningColor;
  float alpha = clamp(mask + bolt, 0.0, 1.0);

  fragColor = vec4(finalColor, alpha);
}
`;

export default function Aurora({
  colorStops = ["#ff2a2a", "#ff6b3d", "#ff1a1a"],
  speed = 1.0,
  stormIntensity = 0.75
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    });

    const gl = renderer.gl;
    gl.clearColor(0.08, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    delete geometry.attributes.uv;

    const colors = colorStops.map(c => {
      const col = new Color(c);
      return [col.r, col.g, col.b];
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uStorm: { value: stormIntensity },
        uColorStops: { value: colors },
        uResolution: { value: [1, 1] }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };

    resize();
    window.addEventListener("resize", resize);

    let raf;
    const animate = (t) => {
      raf = requestAnimationFrame(animate);
      program.uniforms.uTime.value = t * 0.001 * speed;
      program.uniforms.uStorm.value = stormIntensity;
      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, stormIntensity]);

  return <div ref={containerRef} className="aurora-container" />;
}

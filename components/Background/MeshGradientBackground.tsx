"use client";

import { useEffect, useRef } from "react";

export default function MeshGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) {
      // Fallback: CSS animated blobs if WebGL unavailable
      canvas.style.display = "none";
      return;
    }

    // ── Vertex shader ───────────────────────────────────────────────────────
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // ── Fragment shader — fluid mesh gradient ────────────────────────────────
    const fsSource = `
      precision highp float;

      uniform float u_time;
      uniform vec2  u_resolution;

      // ── Smooth noise helpers ─────────────────────────────────────────────
      vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // ── Palette — deep violet / purple / indigo ──────────────────────────
      // c0 darkest base, c3 brightest bloom
      vec3 palette(float t) {
        // anchor colors
        vec3 c0 = vec3(0.027, 0.020, 0.067);  // #070115 — almost black indigo
        vec3 c1 = vec3(0.157, 0.063, 0.314);  // #280A50 — deep violet
        vec3 c2 = vec3(0.341, 0.098, 0.549);  // #57198C — rich purple
        vec3 c3 = vec3(0.573, 0.200, 0.820);  // #9233D1 — bright violet
        vec3 c4 = vec3(0.749, 0.333, 0.933);  // #BF55EE — lavender bloom

        // piecewise mix across 4 segments
        t = clamp(t, 0.0, 1.0);
        if (t < 0.25) return mix(c0, c1, t / 0.25);
        if (t < 0.50) return mix(c1, c2, (t - 0.25) / 0.25);
        if (t < 0.75) return mix(c2, c3, (t - 0.50) / 0.25);
        return mix(c3, c4, (t - 0.75) / 0.25);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        // aspect-correct coords centered at origin
        vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);

        float t = u_time * 0.18; // overall speed — slow and dreamy

        // ── Layer 1: large slow warp ─────────────────────────────────────
        float n1 = snoise(p * 1.1 + vec2(t * 0.4, t * 0.25));

        // ── Layer 2: medium drift ────────────────────────────────────────
        float n2 = snoise(p * 2.2 + vec2(-t * 0.3, t * 0.5) + n1 * 0.35);

        // ── Layer 3: fine ripple ─────────────────────────────────────────
        float n3 = snoise(p * 4.0 + vec2(t * 0.6, -t * 0.4) + n2 * 0.25);

        // Combine layers — weighted sum remapped to [0,1]
        float combined = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
        combined = combined * 0.5 + 0.5; // remap [-1,1] → [0,1]

        // ── Radial vignette keeps screen edges darker ────────────────────
        float vignette = 1.0 - smoothstep(0.35, 1.1, length(p));
        combined *= mix(0.35, 1.0, vignette);

        // ── Bias toward dark — keep base very dark, blooms punchy ────────
        combined = pow(combined, 1.45);

        vec3 col = palette(combined);

        // ── Subtle scanline grain for texture depth ──────────────────────
        float grain = snoise(gl_FragCoord.xy * 0.85 + u_time * 12.0) * 0.025;
        col += grain;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // ── Compile helpers ──────────────────────────────────────────────────────
    function compileShader(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes  = gl.getUniformLocation(program, "u_resolution");

    // ── Resize handler ───────────────────────────────────────────────────────
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width  = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf: number;
    const start = performance.now();

    function render() {
      const elapsed = (performance.now() - start) / 1000;
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl!.deleteProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
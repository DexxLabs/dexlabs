"use client";

import { useEffect, useRef } from "react";

export default function LavaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Key insight: keep uv in [0,1]x[0,1], blobs orbit in that space.
    // Strength / distance² — strengths ~0.004, threshold ~0.1
    // At distance 0.2 from a blob: 0.004/0.04 = 0.1 → right at threshold (solid edge)
    // At distance 0.3: 0.004/0.09 = 0.044 → glow territory
    // Two blobs 0.25 apart will merge when close, separate when far → lava lamp ✓

    const fsSource = `
      precision highp float;

      uniform float u_time;
      uniform vec2  u_resolution;

      vec2 blob(float t, float cx, float cy, float rx, float ry, float fx, float fy, float px, float py) {
        return vec2(
          cx + rx * sin(t * fx + px),
          cy + ry * cos(t * fy + py)
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float aspect = u_resolution.x / u_resolution.y;

        // Work in aspect-corrected space so blobs are round not oval
        vec2 p = vec2(uv.x * aspect, uv.y);

        float t = u_time * 0.20; // slow, dreamy

        // ── 7 blobs: center(cx,cy), orbit(rx,ry), freq(fx,fy), phase(px,py) ──
        float A = aspect;
        vec2 b0 = blob(t, 0.50*A, 0.50, 0.30*A, 0.28, 0.41, 0.37, 0.00, 0.00);
        vec2 b1 = blob(t, 0.50*A, 0.50, 0.35*A, 0.32, 0.53, 0.61, 2.09, 1.57);
        vec2 b2 = blob(t, 0.50*A, 0.50, 0.28*A, 0.35, 0.67, 0.43, 4.19, 3.14);
        vec2 b3 = blob(t, 0.50*A, 0.50, 0.38*A, 0.25, 0.34, 0.55, 1.05, 5.24);
        vec2 b4 = blob(t, 0.50*A, 0.50, 0.22*A, 0.38, 0.73, 0.31, 3.14, 2.62);
        vec2 b5 = blob(t, 0.50*A, 0.50, 0.40*A, 0.30, 0.29, 0.68, 5.50, 0.52);
        vec2 b6 = blob(t, 0.50*A, 0.50, 0.26*A, 0.33, 0.58, 0.47, 0.79, 4.19);

        // ── Metaball field ─────────────────────────────────────────────────
        float field =
          0.0040 / max(dot(p-b0,p-b0), 0.0001) +
          0.0032 / max(dot(p-b1,p-b1), 0.0001) +
          0.0028 / max(dot(p-b2,p-b2), 0.0001) +
          0.0036 / max(dot(p-b3,p-b3), 0.0001) +
          0.0024 / max(dot(p-b4,p-b4), 0.0001) +
          0.0034 / max(dot(p-b5,p-b5), 0.0001) +
          0.0026 / max(dot(p-b6,p-b6), 0.0001);

        // Threshold: sqrt(strength/T) gives blob radius in uv units
        // 0.004/0.10 → radius ≈ 0.20 (20% of screen height) — nicely sized
        float T       = 0.10;

        float blobMask  = smoothstep(T - T*0.12, T + T*0.12, field);
        float glowMask  = smoothstep(T * 0.10,   T * 0.85,   field);
        float innerGlow = smoothstep(T * 0.55,   T * 0.95,   field);

        // ── Purple palette ────────────────────────────────────────────────
        vec3 bgColor   = vec3(0.027, 0.016, 0.063);
        vec3 glowColor = vec3(0.18,  0.04,  0.42);
        vec3 blobColor = vec3(0.36,  0.09,  0.68);
        vec3 coreColor = vec3(0.60,  0.24,  0.92);

        float hueShift = sin(dot(p, vec2(2.1, 3.7)) + t * 0.7) * 0.5 + 0.5;
        blobColor = mix(blobColor, vec3(0.24, 0.05, 0.55), hueShift * 0.35);
        coreColor = mix(coreColor, vec3(0.72, 0.32, 0.96), hueShift * 0.25);

        // ── Composite ─────────────────────────────────────────────────────
        vec3 col = bgColor;
        col = mix(col, glowColor, glowMask  * 0.60);
        col = mix(col, blobColor, blobMask  * 0.92);
        col = mix(col, coreColor, innerGlow * blobMask * 0.65);

        // ── Vignette ──────────────────────────────────────────────────────
        vec2 vig = uv - 0.5;
        float vignette = clamp(1.0 - dot(vig, vig) * 2.0, 0.0, 1.0);
        col *= mix(0.25, 1.0, vignette);

        // ── Grain ─────────────────────────────────────────────────────────
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(127.1,311.7)) + u_time*43.0) * 43758.5) * 0.028 - 0.014;
        col += grain;

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `;

    function compileShader(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader error:", gl!.getShaderInfoLog(s));
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
      console.error("Link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

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

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas!.width  = window.innerWidth  * dpr;
      canvas!.height = window.innerHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

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
    };
  }, []);

  return (
    <>
      {/* WebGL lava blobs */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, width: "100vw", height: "100vh" }}
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </>
  );
}
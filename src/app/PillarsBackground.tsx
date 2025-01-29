"use client";
import { useEffect, useRef } from "react";

export default function PillarsBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //   useEffect(() => {
  //     console.log("PillarsBackground: useEffect");
  //     const wrapperEl = wrapperRef.current;
  //     const canvasEl = canvasRef.current;
  //     if (!wrapperEl || canvasEl == null) {
  //       console.log("PillarsBackground: wrapperEl or canvasEl is null");
  //       return;
  //     }

  //     // ──────────────────────────────────────────────────────────────────────
  //     // 1) Replicate `updatePathPillars()` + event listeners
  //     // ──────────────────────────────────────────────────────────────────────

  //     function updatePathPillars() {
  //       console.log("PillarsBackground: updatePathPillars");
  //         // Set canvas background color from data attribute
  //         const bgColor = wrapperEl?.getAttribute("data-bg-color") ?? "#000";
  //         if (canvasEl) {
  //           canvasEl.style.backgroundColor = bgColor;
  //         }

  //         const path = wrapperEl?.querySelector(
  //           "#pillars-dynamic-path"
  //         ) as SVGPathElement;
  //         if (!path) {
  //           console.log("PillarsBackground: path is null");
  //           return;
  //         }

  //         const rect = canvasEl?.getBoundingClientRect();
  //         const width = rect?.width ?? 0;
  //         const height = rect?.height ?? 0;

  //         console.log("PillarsBackground: width", width);
  //         console.log("PillarsBackground: height", height);

  //         // Calculate path dynamically
  //         const pathData = `
  //           M${-0.05 * width},${0.954 * height}
  //           L${0.36 * width},${0.046 * height}
  //           H${0.64 * width}
  //           L${1.05 * width},${0.954 * height}
  //           H${-0.05 * width}
  //           Z
  //         `;
  //         path.setAttribute("d", pathData);

  //         // Re-apply mask
  //         if (canvasEl) {
  //           canvasEl.style.webkitMaskImage = "url(#pillars-mask)";
  //           canvasEl.style.maskImage = "url(#pillars-mask)";
  //           canvasEl.style.webkitMaskSize = "100% 100%";
  //           canvasEl.style.maskSize = "100% 100%";
  //           canvasEl.style.webkitMaskRepeat = "no-repeat";
  //           canvasEl.style.maskRepeat = "no-repeat";
  //         } else {

  //         }

  //     }

  //     window.addEventListener("resize", updatePathPillars);
  //     updatePathPillars(); // run once on mount

  //     // ──────────────────────────────────────────────────────────────────────
  //     // 2) WebGL + shader code from your script
  //     // ──────────────────────────────────────────────────────────────────────

  //     // Vertex shader
  //     const vertexShaderSourcePillars = `
  //       attribute vec3 aPosition;
  //       void main() {
  //           vec4 positionVec4 = vec4(aPosition, 1.0);
  //           positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  //           gl_Position = positionVec4;
  //       }
  //     `;

  //     // Fragment shader
  //     const fragmentShaderSourcePillars = `
  //       #ifdef GL_ES
  //       precision highp float;
  //       #endif

  //       uniform vec2 u_resolution;
  //       uniform float u_time;
  //       uniform float u_dpr;
  //       uniform vec3 u_col1;
  //       uniform vec3 u_col2;
  //       uniform vec3 u_col3;

  //       // A bunch of helper functions and the main color logic:
  //       float rand(vec2 co){
  //           return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) / u_dpr;
  //       }
  //       float map(float value, float min1, float max1, float min2, float max2) {
  //           return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  //       }
  //       vec4 circle(vec2 st, vec2 center, float radius, float blur, vec3 col){
  //           float dist = distance(st,center)*2.0;
  //           vec4 f_col = vec4(1.0-smoothstep(radius, radius + blur, dist));
  //           f_col.r *= col.r;
  //           f_col.g *= col.g;
  //           f_col.b *= col.b;
  //           return f_col;
  //       }
  //       void main(){
  //           vec2 fst = gl_FragCoord.xy/u_resolution.xy;
  //           float aspect = u_resolution.x/u_resolution.y;
  //           vec2 pst = fst * vec2(aspect, 1.);
  //           vec2 mst = fst;

  //           vec3 col1 = u_col1 / 255.;
  //           vec3 col2 = u_col2 / 255.;
  //           vec3 col3 = u_col3 / 255.;
  //           vec4 color = vec4(0.);

  //           // Purple blob
  //           vec2 purpleC = vec2(.5+cos(u_time*.4)*.5*cos(u_time*.2)*.5, .5+cos(u_time*.3)*.5*cos(u_time*.5)*.5);
  //           float purpleR = .25;
  //           float purpleB = .75;

  //           // Mint blob
  //           vec2 mintC = vec2(.5+sin(u_time*.4)*.5*cos(u_time*.2)*.5, .5+sin(u_time*.3)*.5*cos(u_time*.5)*.5);
  //           float mintR = 1.;
  //           float mintB = 1.;

  //           // Green blob
  //           vec2 greenC = vec2((.5+cos(u_time*.5)*.5*sin(u_time*.2)*.5)*aspect, .5+cos(u_time*.4)*.5*sin(u_time*.3)*.5);
  //           float greenR = 1.;
  //           float greenB = 1.;

  //           pst.x += sin(u_time*.15+pst.x*19.)*.37 * cos(u_time*.46+pst.y*25.)*.28;
  //           pst.y += cos(u_time*.27+pst.x*4.)*.45 * sin(u_time*.24+pst.y*8.)*.22;

  //           mst.x += cos(u_time*.37+mst.x*15.)*.21 * sin(u_time*.14+mst.y*7.)*.29 * 4.;
  //           mst.y += sin(u_time*.15+mst.x*13.)*.37 * cos(u_time*.36+mst.y*5.)*.12 * 4.;

  //           vec4 color1 = vec4(0.);
  //           vec4 color2 = vec4(0.);
  //           vec4 color3 = vec4(0.);
  //           vec4 color4 = vec4(0.);
  //           vec4 color5 = vec4(0.);
  //           vec4 color6 = vec4(0.);

  //           color1 += (circle(mst, mintC, mintR, mintB, vec3(1.))
  //                      - circle(mst, mintC, mintR, mintB, vec3(1.))
  //                        * circle(mst, greenC, greenR, greenB, vec3(1.)));

  //           color2 += (circle(mst, mintC, mintR, mintB, vec3(1.))
  //                      - circle(mst, mintC, mintR, mintB, vec3(1.))
  //                        * circle(mst, purpleC, purpleR, purpleB, vec3(1.)));

  //           color1 -= color1 * color2;
  //           color2 -= color1 * color2;

  //           color3 = color1;
  //           color4 = color2;

  //           color3.rgb *= col1; // purple color
  //           color4.rgb *= col3; // green color

  //           color += color3;
  //           color += color4;

  //           color5 += (circle(mst, greenC, greenR, greenB, vec3(1.))
  //                      - circle(mst, greenC, greenR, greenB, vec3(1.))
  //                        * circle(mst, mintC, mintR, mintB, vec3(1.)));

  //           color5 -= color1 * color2;
  //           color5.rgb *= col2; // mint color

  //           color += color5;
  //           color += circle(mst, mintC, mintR, mintB, col2)
  //             * (color1 - circle(mst, mintC, mintR, mintB, vec3(1.)))
  //             * (color2 - circle(mst, mintC, mintR, mintB, vec3(1.)));

  //           float noise = rand(fst*10.) * .2;
  //           color.rgb *= 1. - vec3(noise);

  //           gl_FragColor = color;
  //       }
  //     `;

  //     // Get WebGL context
  //     let glPillars = canvasEl.getContext("webgl");
  //     if (glPillars == null) {
  //       console.warn("WebGL not supported, trying experimental-webgl");
  //       glPillars = canvasEl.getContext(
  //         "experimental-webgl"
  //       ) as WebGLRenderingContext | null;
  //     }
  //     if (glPillars == null) {
  //       console.error("Your browser does not support WebGL.");
  //       return;
  //     }

  //     // Helper to compile a shader
  //     function createShaderPillars(
  //       gl: WebGLRenderingContext,
  //       type: number,
  //       source: string
  //     ) {
  //       const shader = gl.createShader(type);
  //       if (!shader) return null;
  //       gl.shaderSource(shader, source);
  //       gl.compileShader(shader);
  //       const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  //       if (success) {
  //         return shader;
  //       }
  //       console.log(gl.getShaderInfoLog(shader));
  //       gl.deleteShader(shader);
  //       return null;
  //     }

  //     const vertexShaderPillars = createShaderPillars(
  //       glPillars,
  //       glPillars.VERTEX_SHADER,
  //       vertexShaderSourcePillars
  //     );
  //     const fragmentShaderPillars = createShaderPillars(
  //       glPillars,
  //       glPillars.FRAGMENT_SHADER,
  //       fragmentShaderSourcePillars
  //     );

  //     // Helper to create a program
  //     function createProgramPillars(
  //       gl: WebGLRenderingContext,
  //       vs: WebGLShader,
  //       fs: WebGLShader
  //     ) {
  //       const program = gl.createProgram();
  //       if (!program) return null;
  //       gl.attachShader(program, vs);
  //       gl.attachShader(program, fs);
  //       gl.linkProgram(program);
  //       const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  //       if (success) return program;
  //       console.log(gl.getProgramInfoLog(program));
  //       gl.deleteProgram(program);
  //       return null;
  //     }

  //     if (!vertexShaderPillars || !fragmentShaderPillars) {
  //       console.log("PillarsBackground: vertexShaderPillars or fragmentShaderPillars is null");
  //       return;
  //     }

  //     const programPillars = createProgramPillars(
  //       glPillars,
  //       vertexShaderPillars,
  //       fragmentShaderPillars
  //     );
  //     if (!programPillars) return;

  //     const positionAttributeLocationPillars = glPillars.getAttribLocation(
  //       programPillars,
  //       "aPosition"
  //     );
  //     const positionBufferPillars = glPillars.createBuffer();
  //     glPillars.bindBuffer(glPillars.ARRAY_BUFFER, positionBufferPillars);

  //     // Full-screen quad
  //     const positionsPillars = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  //     glPillars.bufferData(
  //       glPillars.ARRAY_BUFFER,
  //       new Float32Array(positionsPillars),
  //       glPillars.STATIC_DRAW
  //     );

  //     function resizeCanvasToDisplaySizePillars(canvas: HTMLCanvasElement) {
  //       const displayWidth = canvas.clientWidth;
  //       const displayHeight = canvas.clientHeight;
  //       if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
  //         canvas.width = displayWidth;
  //         canvas.height = displayHeight;
  //       }
  //     }

  //     // Uniform locations
  //     const u_resolutionPillars = glPillars.getUniformLocation(
  //       programPillars,
  //       "u_resolution"
  //     );
  //     const u_timePillars = glPillars.getUniformLocation(
  //       programPillars,
  //       "u_time"
  //     );
  //     const u_dprPillars = glPillars.getUniformLocation(programPillars, "u_dpr");
  //     const u_col1Pillars = glPillars.getUniformLocation(
  //       programPillars,
  //       "u_col1"
  //     );
  //     const u_col2Pillars = glPillars.getUniformLocation(
  //       programPillars,
  //       "u_col2"
  //     );
  //     const u_col3Pillars = glPillars.getUniformLocation(
  //       programPillars,
  //       "u_col3"
  //     );

  //     let startTimePillars = Date.now();

  //     // Pull color data from data attributes
  //     const col1Str = wrapperEl.getAttribute("data-color-1") ?? "153,255,249";
  //     const col2Str = wrapperEl.getAttribute("data-color-2") ?? "198,236,233";
  //     const col3Str = wrapperEl.getAttribute("data-color-3") ?? "208,178,255";
  //     const col1Arr = col1Str.split(",").map(Number);
  //     const col2Arr = col2Str.split(",").map(Number);
  //     const col3Arr = col3Str.split(",").map(Number);

  //     // Animation loop
  //     function renderPillars() {
  //       if (canvasEl == null || glPillars == null) return;
  //       resizeCanvasToDisplaySizePillars(canvasEl);

  //       glPillars.viewport(0, 0, canvasEl.width, canvasEl.height);
  //       glPillars.clearColor(0, 0, 0, 0);
  //       glPillars.clear(glPillars.COLOR_BUFFER_BIT);

  //       glPillars.useProgram(programPillars);
  //       glPillars.enableVertexAttribArray(positionAttributeLocationPillars);
  //       glPillars.bindBuffer(glPillars.ARRAY_BUFFER, positionBufferPillars);

  //       const size = 2;
  //       const type = glPillars.FLOAT;
  //       const normalize = false;
  //       const stride = 0;
  //       const offset = 0;
  //       glPillars.vertexAttribPointer(
  //         positionAttributeLocationPillars,
  //         size,
  //         type,
  //         normalize,
  //         stride,
  //         offset
  //       );

  //       glPillars.uniform2fv(u_resolutionPillars, [
  //         canvasEl.width,
  //         canvasEl.height,
  //       ]);
  //       glPillars.uniform1f(
  //         u_timePillars,
  //         (Date.now() - startTimePillars) * 0.005
  //       );
  //       glPillars.uniform1f(u_dprPillars, window.devicePixelRatio);

  //       // Pass uniform colors
  //       glPillars.uniform3fv(u_col1Pillars, col1Arr);
  //       glPillars.uniform3fv(u_col2Pillars, col2Arr);
  //       glPillars.uniform3fv(u_col3Pillars, col3Arr);

  //       glPillars.drawArrays(glPillars.TRIANGLES, 0, 6);
  //       requestAnimationFrame(renderPillars);
  //     }

  //     requestAnimationFrame(renderPillars);

  //     // ──────────────────────────────────────────────────────────────────────
  //     // Cleanup when component unmounts:
  //     // ──────────────────────────────────────────────────────────────────────
  //     return () => {
  //       console.log("PillarsBackground: cleanup");
  //       window.removeEventListener("resize", updatePathPillars);
  //     };
  //   }, []);
  // ------------- [ END <script> CONTENT ] ------------- //
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Grab the WebGL context
    let gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported, trying experimental-webgl");
      gl = canvas.getContext(
        "experimental-webgl"
      ) as WebGLRenderingContext | null;
    }
    if (!gl) {
      console.error("Your browser does not support WebGL.");
      return;
    }

    //
    // 1. Vertex shader (very simple)
    //
    const vertexShaderSourcePillars = `
  attribute vec2 aPosition;
  void main() {
    // Scale from [ -1..1, -1..1 ]
    // If you prefer the old approach of "positionVec4.xy = positionVec4.xy * 2.0 - 1.0;"
    // you can do that, but typically for a full-screen quad we already supply
    // data in [-1..1], so we just pass it through:
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

    //
    // 2. Fragment shader (solid red)
    //
    const fsSource = `
    #ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;
uniform vec3 u_col1;
uniform vec3 u_col2;
uniform vec3 u_col3;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) / u_dpr;
}

 float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

vec4 circle(vec2 st, vec2 center, float radius, float blur, vec3 col){
            float dist = distance(st,center)*2.0;
            vec4 f_col = vec4(1.0-smoothstep(radius, radius + blur, dist));
            f_col.r *= col.r;
            f_col.g *= col.g;
            f_col.b *= col.b;
            return f_col;
        }

void main() {
 vec2 fst = gl_FragCoord.xy/u_resolution.xy;
            float aspect = u_resolution.x/u_resolution.y;
            vec2 pst = fst * vec2(aspect, 1.);
            vec2 mst = fst;

            vec3 col1 = u_col1 / 255.;
            vec3 col2 = u_col2 / 255.;
            vec3 col3 = u_col3 / 255.;
            vec4 color = vec4(0.);

            // Purple blob
            vec2 purpleC = vec2(.5+cos(u_time*.4)*.5*cos(u_time*.2)*.5, .5+cos(u_time*.3)*.5*cos(u_time*.5)*.5);
            float purpleR = .25;
            float purpleB = .75;

            // Mint blob
            vec2 mintC = vec2(.5+sin(u_time*.4)*.5*cos(u_time*.2)*.5, .5+sin(u_time*.3)*.5*cos(u_time*.5)*.5);
            float mintR = 1.;
            float mintB = 1.;

            // Green blob
            vec2 greenC = vec2((.5+cos(u_time*.5)*.5*sin(u_time*.2)*.5)*aspect, .5+cos(u_time*.4)*.5*sin(u_time*.3)*.5);
            float greenR = 1.;
            float greenB = 1.;

            pst.x += sin(u_time*.15+pst.x*19.)*.37 * cos(u_time*.46+pst.y*25.)*.28;
            pst.y += cos(u_time*.27+pst.x*4.)*.45 * sin(u_time*.24+pst.y*8.)*.22;

            mst.x += cos(u_time*.37+mst.x*15.)*.21 * sin(u_time*.14+mst.y*7.)*.29 * 4.;
            mst.y += sin(u_time*.15+mst.x*13.)*.37 * cos(u_time*.36+mst.y*5.)*.12 * 4.;

            vec4 color1 = vec4(0.);
            vec4 color2 = vec4(0.);
            vec4 color3 = vec4(0.);
            vec4 color4 = vec4(0.);
            vec4 color5 = vec4(0.);
            vec4 color6 = vec4(0.);

            color1 += (circle(mst, mintC, mintR, mintB, vec3(1.))
                       - circle(mst, mintC, mintR, mintB, vec3(1.))
                         * circle(mst, greenC, greenR, greenB, vec3(1.)));

            color2 += (circle(mst, mintC, mintR, mintB, vec3(1.))
                       - circle(mst, mintC, mintR, mintB, vec3(1.))
                         * circle(mst, purpleC, purpleR, purpleB, vec3(1.)));

            color1 -= color1 * color2;
            color2 -= color1 * color2;

            color3 = color1;
            color4 = color2;

            color3.rgb *= col1; // purple color
            color4.rgb *= col3; // green color

            color += color3;
            color += color4;

            color5 += (circle(mst, greenC, greenR, greenB, vec3(1.))
                       - circle(mst, greenC, greenR, greenB, vec3(1.))
                         * circle(mst, mintC, mintR, mintB, vec3(1.)));

            color5 -= color1 * color2;
            color5.rgb *= col2; // mint color

            color += color5;
            color += circle(mst, mintC, mintR, mintB, col2)
              * (color1 - circle(mst, mintC, mintR, mintB, vec3(1.)))
              * (color2 - circle(mst, mintC, mintR, mintB, vec3(1.)));

            float noise = rand(fst*10.) * .2;
            color.rgb *= 1. - vec3(noise);

            gl_FragColor = color;
}
    `;

    // Helper to compile a shader
    function compileShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        console.error("[Shader error]", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSourcePillars
    );
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    // Create program and link
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[Program link error]", gl.getProgramInfoLog(program));
      return;
    }

    // A simple full-screen quad in clip space:
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    // Create and bind a buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Tell WebGL how to pull out the data from the buffer (2 floats per vertex)
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    function resizeCanvas() {
      // Ensure both canvas and gl exist before sizing
      if (!canvas || !gl) return;

      // Match the canvas's internal size to its client size
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // Initial resize
    resizeCanvas();

    // Clear to black
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw
    const uResolution = gl.getUniformLocation(program, "u_resolution")
    const uTime       = gl.getUniformLocation(program, "u_time")
    const uDpr        = gl.getUniformLocation(program, "u_dpr")
    const uCol1       = gl.getUniformLocation(program, "u_col1")
    const uCol2       = gl.getUniformLocation(program, "u_col2")
    const uCol3       = gl.getUniformLocation(program, "u_col3")
    
    gl.useProgram(program)
    
    // 2) Set them to something non-zero
    gl.uniform2f(uResolution, canvas.width, canvas.height)
    gl.uniform1f(uTime, 2.0)  // Just pick some nonzero value
    gl.uniform1f(uDpr, window.devicePixelRatio || 1.0)
    
    // The shader expects them in 0..255 range, so pass float values:
    gl.uniform3f(uCol1, 153.0, 255.0, 249.0) // matches your data-color-1
    gl.uniform3f(uCol2, 198.0, 236.0, 233.0) // data-color-2
    gl.uniform3f(uCol3, 208.0, 178.0, 255.0) // data-color-3
    
    // Now draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)


    // If you want an animation loop, you can add requestAnimationFrame here,
    // but for now let's just draw once.

    // Log gl errors
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
      console.error("WebGL error code:", error);
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
  //   return (
  //     <div
  //       ref={wrapperRef}
  //       data-bg-color="#99FFF9"
  //       data-color-1="153,255,249"
  //       data-color-2="198,236,233"
  //       data-color-3="208,178,255"
  //     //   className="am-pillars-bg-gradient-code w-embed w-script fixed inset-0 -z-10"
  //       className="fixed inset-0 -z-10"
  //       // Because you have CSS for .pillars-canvas, you can include it in your global CSS or Tailwind
  //     >
  //       <canvas
  //         ref={canvasRef}
  //         className="pillars-canvas w-full h-full"
  //         style={{
  //           backgroundColor: "rgb(153, 255, 249)",
  //           // Add any inline styles from your snippet:
  //           maskImage: "url(#pillars-mask)",
  //           WebkitMaskImage: "url(#pillars-mask)",
  //           WebkitMaskSize: "100% 100%",
  //           maskSize: "100% 100%",
  //           WebkitMaskRepeat: "no-repeat",
  //           maskRepeat: "no-repeat",
  //         }}
  //       />

  //       <svg
  //         className="pillars-mask"
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="0"
  //         height="0"
  //       >
  //         <defs>
  //           <filter
  //             id="pillars-blur-canvas"
  //             x="-10%"
  //             y="-10%"
  //             width="120%"
  //             height="120%"
  //           >
  //             <feGaussianBlur stdDeviation="20"></feGaussianBlur>
  //           </filter>
  //           <linearGradient
  //             id="pillars-fade-gradient"
  //             x1="50%"
  //             y1="0%"
  //             x2="50%"
  //             y2="100%"
  //             gradientUnits="userSpaceOnUse"
  //           >
  //             <stop offset="5%" stopColor="#737373" stopOpacity="0"></stop>
  //             <stop offset="20%" stopColor="#D9D9D9" stopOpacity="1"></stop>
  //             <stop offset="40%" stopColor="#D9D9D9" stopOpacity="1"></stop>
  //             <stop offset="70%" stopColor="#737373" stopOpacity="0"></stop>
  //           </linearGradient>
  //           <mask
  //             id="pillars-mask"
  //             maskUnits="userSpaceOnUse"
  //             maskContentUnits="userSpaceOnUse"
  //           >
  //             <path
  //               id="pillars-dynamic-path"
  //               fill="url(#pillars-fade-gradient)"
  //               filter="url(#pillars-blur-canvas)"
  //               d="
  //                 M-56.400000000000006,644.3152031249999
  //                 L406.08,31.067609375
  //                 H721.92
  //                 L1184.4,644.3152031249999
  //                 H-56.400000000000006
  //                 Z"
  //             ></path>
  //           </mask>
  //         </defs>
  //       </svg>
  //     </div>
  //   );
}

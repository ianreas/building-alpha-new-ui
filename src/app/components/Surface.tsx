// import { useEffect, useRef } from "react";
// //import { DataSet } from "vis";
// import { Graph3d, DataSet } from "vis-graph3d";
// import "vis/dist/vis.css";

// const SurfacePlot = () => {
//   const graphRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const container = graphRef.current;

//     if (!container) return;

//     // Generate sample data
//     const data = new DataSet();
//     const steps = 50;
//     const axisMax = 314;
//     const axisStep = axisMax / steps;
//     for (let x = 0; x < axisMax; x += axisStep) {
//       for (let y = 0; y < axisMax; y += axisStep) {
//         const value = Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50;
//         data.add({ x, y, z: value });
//       }
//     }

//     // Define options for the 3D graph
//     const options = {
//       width: "100%",
//       height: "600px",
//       style: "surface",
//       showPerspective: true,
//       showGrid: true,
//       keepAspectRatio: true,
//       verticalRatio: 0.5,
//       legendLabel: "value",
//       cameraPosition: { horizontal: 1.0, vertical: 0.5, distance: 2.2 },
//       tooltip: (point:any) => `x: ${point.x}, y: ${point.y}, z: ${point.z}`,
//       animationInterval: 1000,
//       animationPreload: true,
//       animationAutoStart: false,
//       interaction: {
//         zoomView: true,
//         dragView: true,
//       },
//     };

//     // Create the graph
//     const graph = new Graph3d(container, data, options);

//     // Add event listeners for click and drag to rotate
//     let isDragging = false;
//     let startX:any, startY:any;

//     container.addEventListener("mousedown", (event) => {
//       isDragging = true;
//       startX = event.clientX;
//       startY = event.clientY;
//     });

//     container.addEventListener("mouseup", () => {
//       isDragging = false;
//     });

//     container.addEventListener("mousemove", (event) => {
//       if (isDragging) {
//         const diffX = event.clientX - startX;
//         const diffY = event.clientY - startY;

//         graph.setCameraPosition({
//           horizontal: graph.getCameraPosition().horizontal - diffX * 0.01,
//           vertical: graph.getCameraPosition().vertical + diffY * 0.01,
//         });

//         startX = event.clientX;
//         startY = event.clientY;
//       }
//     });

//     return () => {
//       graph.destroy();
//     };
//   }, []);

//   return <div ref={graphRef}></div>;
// };

// export default SurfacePlot;

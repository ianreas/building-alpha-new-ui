// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { OrbitControls, Text } from "@react-three/drei";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";
// import { PlusCircle } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Skeleton } from "@/components/ui/skeleton";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// interface BillboardTextProps {
//   children: ReactNode;
//   position: [number, number, number];
//   fontSize: number;
//   color: string;
//   anchorX?: "left" | "center" | "right";
//   anchorY?: "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom";
// }

// const BillboardText: React.FC<BillboardTextProps> = ({
//   children,
//   ...props
// }) => {
//   const textRef = useRef<THREE.Object3D>(null);
//   const { camera } = useThree();

//   useFrame(() => {
//     if (textRef.current) {
//       textRef.current.quaternion.copy(camera.quaternion);
//     }
//   });

//   return (
//     <Text ref={textRef} {...props}>
//       {children}
//     </Text>
//   );
// };

// const SurfaceGraph = ({
//   data,
//   strikeRange,
//   weeksRange,
// }: {
//   data: number[][];
//   strikeRange: [number, number];
//   weeksRange: [number, number];
// }) => {
//   const mesh = React.useRef<THREE.Mesh>(null);
//   const [hoverPoint, setHoverPoint] = useState<{
//     x: number;
//     y: number;
//     z: number;
//   } | null>(null);

//   const { geometry, minVal, maxVal } = useMemo(() => {
//     const geo = new THREE.BufferGeometry();
//     const vertices = [];
//     const colors = [];
//     const indices = [];

//     const width = data[0]?.length || 0;
//     const height = data.length;

//     const minVal = Math.min(...data.flat());
//     const maxVal = Math.max(...data.flat());
//     const range = maxVal - minVal;

//     for (let i = 0; i < height; i++) {
//       for (let j = 0; j < width; j++) {
//         const x = j / (width - 1);
//         const z = i / (height - 1);
//         const y = (data[i][j] - minVal) / range;

//         vertices.push(x, y, z);

//         const color = new THREE.Color();
//         color.setHSL(0.7 - y * 0.7, 1, 0.5);
//         colors.push(color.r, color.g, color.b);
//       }
//     }

//     for (let i = 0; i < height - 1; i++) {
//       for (let j = 0; j < width - 1; j++) {
//         const a = i * width + j;
//         const b = i * width + j + 1;
//         const c = (i + 1) * width + j;
//         const d = (i + 1) * width + j + 1;
//         indices.push(a, b, d, a, d, c);
//       }
//     }

//     geo.setIndex(indices);
//     geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
//     geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
//     geo.computeVertexNormals();

//     return { geometry: geo, minVal, maxVal };
//   }, [data]);

//   const handlePointerMove = (event: THREE.Intersection) => {
//     if (event.face) {
//       const { x, y, z } = event.point;
//       const strikeStep = strikeRange[1] - strikeRange[0];
//       const weeksStep = weeksRange[1] - weeksRange[0];

//       const strike = strikeRange[0] + x * strikeStep;
//       const weeks = weeksRange[0] + z * weeksStep;
//       const iv = y * (maxVal - minVal) + minVal;

//       setHoverPoint({ x: strike, y: iv, z: weeks });
//     } else {
//       setHoverPoint(null);
//     }
//   };

//   return (
//     <group>
//       <mesh
//         ref={mesh}
//         geometry={geometry}
//         onPointerMove={(e) => handlePointerMove(e)}
//         onPointerOut={() => setHoverPoint(null)}
//       >
//         <meshPhongMaterial
//           vertexColors
//           side={THREE.DoubleSide}
//           shininess={50}
//         />
//       </mesh>
//       {hoverPoint && (
//         <BillboardText
//           position={[0.5, 1.1, 0.5]}
//           fontSize={0.05}
//           color="white"
//           anchorX="center"
//           anchorY="middle"
//         >
//           {`Strike: ${hoverPoint.x.toFixed(2)}, IV: ${hoverPoint.y.toFixed(
//             4
//           )}, Weeks: ${hoverPoint.z.toFixed(1)}`}
//         </BillboardText>
//       )}
//       <axesHelper args={[1]} />
//       {/* { <Text position={[0.5, -0.05, -0.05]} fontSize={0.05} color="red">Strike Price</Text>
//         <Text position={[-0.05, 0.5, -0.05]} fontSize={0.05} color="green" rotation={[0, 0, Math.PI / 2]}>IV</Text>
//         <Text position={[-0.05, -0.05, 0.5]} fontSize={0.05} color="blue">Weeks to Maturity</Text>} */}
//       <BillboardText position={[1.05, 0, 0]} fontSize={0.05} color="red">
//         Strike Price
//       </BillboardText>
//       <BillboardText position={[0, 1.05, 0]} fontSize={0.05} color="green">
//         IV
//       </BillboardText>
//       <BillboardText position={[0, 0, 1.05]} fontSize={0.05} color="blue">
//         Weeks to Maturity
//       </BillboardText>
//     </group>
//   );
// };

// export const SurfaceGraphContainer = ({
//   strikeRange,
//   weeksRange,
// }: {
//   strikeRange: [number, number];
//   weeksRange: [number, number];
// }) => {
//   const [ivSurfaceData, setIvSurfaceData] = useState<number[][]>([]);
//   const [ticker, setTicker] = useState<string>("AAPL");
//   const [inputTicker, setInputTicker] = useState<string>("AAPL");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isCall, setIsCall] = useState<boolean>(true);

//   const handleOptionTypeChange = (value: string) => {
//     setIsCall(value === "call");
//   };

//   const fetchData = async (tickerSymbol: string) => {
//     setIsLoading(true);
//     try {
//       const response: Response = await fetch(
//         `https://buildingalpha-backend-74a6217c48ee.herokuapp.com/getNewThreeDGraph${isCall ? "" : "ForPuts"}?ticker=${tickerSymbol}`
//       );
//       const data = await response.json();
//       setIvSurfaceData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(ticker);
//   }, [ticker, isCall]);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (inputTicker !== ticker) {
//       setTicker(inputTicker);
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col">
//       <form onSubmit={handleSubmit} className="mb-2 space-y-2">
//         <div className="flex flex-col space-y-1">
//           <Label htmlFor="ticker-input">Ticker Symbol</Label>
//           <div className="flex space-x-2">
//             <Input
//               id="ticker-input"
//               type="text"
//               value={inputTicker}
//               onChange={(e) => setInputTicker(e.target.value)}
//               placeholder="Enter ticker symbol"
//               className="flex-grow"
//             />
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Loading..." : "Search"}
//             </Button>
//           </div>
//         </div>
//         <div className="flex flex-col space-y-1">
//           <Label>Option Type</Label>
//           <RadioGroup
//             defaultValue={isCall ? "call" : "put"}
//             onValueChange={handleOptionTypeChange}
//             className="flex space-x-4"
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="call" id="call" />
//               <Label htmlFor="call">Call</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="put" id="put" />
//               <Label htmlFor="put">Put</Label>
//             </div>
//           </RadioGroup>
//         </div>
//       </form>
//       <div className="flex-grow relative">
//         {isLoading ? (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Skeleton className="w-full h-full" />
//           </div>
//         ) : (
//           <Canvas camera={{ position: [1.5, 1.5, 1.5], fov: 75 }}>
//             <OrbitControls />
//             <ambientLight intensity={0.5} />
//             <pointLight position={[10, 10, 10]} intensity={1} />
//             <SurfaceGraph
//               data={ivSurfaceData}
//               strikeRange={strikeRange}
//               weeksRange={weeksRange}
//             />
//           </Canvas>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SurfaceGraphContainer;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

interface BillboardTextProps {
  children: ReactNode;
  position: [number, number, number];
  fontSize: number;
  color: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom";
}

const BillboardText: React.FC<BillboardTextProps> = ({
  children,
  ...props
}) => {
  const textRef = useRef<THREE.Object3D>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <Text ref={textRef} {...props}>
      {children}
    </Text>
  );
};

const SurfaceGraph = ({
  data,
  strikeRange,
  weeksRange,
}: {
  data: number[][];
  strikeRange: [number, number];
  weeksRange: [number, number];
}) => {
  const mesh = React.useRef<THREE.Mesh>(null);
  const [hoverPoint, setHoverPoint] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);

  const { geometry, minVal, maxVal } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const indices = [];

    const width = data[0]?.length || 0;
    const height = data.length;

    const minVal = Math.min(...data.flat());
    const maxVal = Math.max(...data.flat());
    const range = maxVal - minVal;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const x = j / (width - 1);
        const z = i / (height - 1);
        const y = (data[i][j] - minVal) / range;

        vertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(0.7 - y * 0.7, 1, 0.5);
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let i = 0; i < height - 1; i++) {
      for (let j = 0; j < width - 1; j++) {
        const a = i * width + j;
        const b = i * width + j + 1;
        const c = (i + 1) * width + j;
        const d = (i + 1) * width + j + 1;
        indices.push(a, b, d, a, d, c);
      }
    }

    geo.setIndex(indices);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    return { geometry: geo, minVal, maxVal };
  }, [data]);

  const handlePointerMove = (event: THREE.Intersection) => {
    if (event.face) {
      const { x, y, z } = event.point;
      const strikeStep = strikeRange[1] - strikeRange[0];
      const weeksStep = weeksRange[1] - weeksRange[0];

      const strike = strikeRange[0] + x * strikeStep;
      const weeks = weeksRange[0] + z * weeksStep;
      const iv = y * (maxVal - minVal) + minVal;

      setHoverPoint({ x: strike, y: iv, z: weeks });
    } else {
      setHoverPoint(null);
    }
  };

  return (
    <group>
      <mesh
        ref={mesh}
        geometry={geometry}
        onPointerMove={(e) => handlePointerMove(e)}
        onPointerOut={() => setHoverPoint(null)}
      >
        <meshPhongMaterial
          vertexColors
          side={THREE.DoubleSide}
          shininess={50}
        />
      </mesh>
      {hoverPoint && (
        <BillboardText
          position={[0.5, 1.1, 0.5]}
          fontSize={0.05}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`Strike: ${hoverPoint.x.toFixed(2)}, IV: ${hoverPoint.y.toFixed(
            4
          )}, Weeks: ${hoverPoint.z.toFixed(1)}`}
        </BillboardText>
      )}
      <axesHelper args={[1]} />
      {/* { <Text position={[0.5, -0.05, -0.05]} fontSize={0.05} color="red">Strike Price</Text>
        <Text position={[-0.05, 0.5, -0.05]} fontSize={0.05} color="green" rotation={[0, 0, Math.PI / 2]}>IV</Text>
        <Text position={[-0.05, -0.05, 0.5]} fontSize={0.05} color="blue">Weeks to Maturity</Text>} */}
      <BillboardText position={[1.05, 0, 0]} fontSize={0.05} color="red">
        Strike Price
      </BillboardText>
      <BillboardText position={[0, 1.05, 0]} fontSize={0.05} color="green">
        IV
      </BillboardText>
      <BillboardText position={[0, 0, 1.05]} fontSize={0.05} color="blue">
        Weeks to Maturity
      </BillboardText>
    </group>
  );
};

const SurfaceGraphContainer = ({
  strikeRange,
  weeksRange,
}: {
  strikeRange: [number, number];
  weeksRange: [number, number];
}) => {
  const [ivSurfaceData, setIvSurfaceData] = useState<number[][]>([]);
  const [ticker, setTicker] = useState<string>("AAPL");
  const [inputTicker, setInputTicker] = useState<string>("AAPL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCall, setIsCall] = useState<boolean>(true);

  const handleOptionTypeChange = (value: string) => {
    setIsCall(value === "call");
  };

  const fetchData = async (tickerSymbol: string) => {
    setIsLoading(true);
    try {
      const response: Response = await fetch(
        `https://buildingalpha-backend-74a6217c48ee.herokuapp.com/getNewThreeDGraph${
          isCall ? "" : "ForPuts"
        }?ticker=${tickerSymbol}`
      );
      const data = await response.json();
      setIvSurfaceData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(ticker);
  }, [ticker, isCall]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputTicker !== ticker) {
      setTicker(inputTicker);
    }
  };

  return (
    <Card className="col-span-2 row-span-4">
      <CardHeader>
        <CardTitle>IV Surface Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="ticker-input">Ticker Symbol</Label>
            <div className="flex space-x-2">
              <Input
                id="ticker-input"
                type="text"
                value={inputTicker}
                onChange={(e) => setInputTicker(e.target.value)}
                placeholder="Enter ticker symbol"
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Option Type</Label>
            <RadioGroup
              defaultValue={isCall ? "call" : "put"}
              onValueChange={handleOptionTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="call" />
                <Label htmlFor="call">Call</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="put" id="put" />
                <Label htmlFor="put">Put</Label>
              </div>
            </RadioGroup>
          </div>
        </form>
        <div className="w-full h-[500px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <Canvas camera={{ position: [1.5, 1.5, 1.5], fov: 75 }}>
              <OrbitControls />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <SurfaceGraph
                data={ivSurfaceData}
                strikeRange={strikeRange}
                weeksRange={weeksRange}
              />
            </Canvas>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurfaceGraphContainer;

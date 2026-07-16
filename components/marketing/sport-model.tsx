"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const SPORT_GEOMETRY: Record<string, { color: string; build: () => THREE.BufferGeometry }> = {
  Surfing: {
    color: "#7d92ff",
    build: () => new THREE.CapsuleGeometry(0.55, 2.1, 8, 24),
  },
  "Track & Field": {
    color: "#39e08e",
    build: () => new THREE.TorusGeometry(1, 0.32, 24, 64),
  },
  Basketball: {
    color: "#f0a544",
    build: () => new THREE.IcosahedronGeometry(1.15, 3),
  },
  Climbing: {
    color: "#e0637a",
    build: () => new THREE.OctahedronGeometry(1.25, 1),
  },
  Football: {
    color: "#39e08e",
    build: () => new THREE.IcosahedronGeometry(1.1, 1),
  },
  Cycling: {
    color: "#7d92ff",
    build: () => new THREE.TorusKnotGeometry(0.75, 0.24, 128, 16),
  },
};

function SpinningShape({ sport }: { sport: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const config = SPORT_GEOMETRY[sport] ?? SPORT_GEOMETRY.Basketball;

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <mesh ref={ref} geometry={config.build()} castShadow receiveShadow>
      <meshStandardMaterial
        color={config.color}
        roughness={0.25}
        metalness={0.35}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}

export function SportModel({ sport }: { sport: string }) {
  return (
    <div className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 4.2], fov: 40 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.4} castShadow />
        <Suspense fallback={null}>
          <SpinningShape sport={sport} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={8} blur={2.5} far={2} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

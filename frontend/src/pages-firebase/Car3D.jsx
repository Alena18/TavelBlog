import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Car3D({ drive }) {
  const carRef = useRef();
  const { scene } = useGLTF("/models/car.gltf"); // adjust path!

  // Animate forward movement
  useFrame(() => {
    if (drive && carRef.current && carRef.current.position.x < 10) {
      carRef.current.position.x += 0.1;
    }
  });

  return (
    <primitive
      object={scene}
      ref={carRef}
      position={[0, 0, 0]}
      scale={[0.5, 0.5, 0.5]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

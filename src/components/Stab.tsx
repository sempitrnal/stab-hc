// @ts-nocheck
import {
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  shaderMaterial,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  FXAA,
  Glitch,
  GodRays,
  LensFlare,
  SMAA,
  SelectiveBloom,
  TiltShift,
  TiltShift2,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef } from "react";
import { Color, HemisphereLight } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const StabLogo = () => {
  // useFrame((state, delta) => {
  //   gltf.scene.rotation.y += 0.005;
  // });
  const bloomColor = new Color("#9679ff");
  bloomColor.multiplyScalar(2);
  const gltf = useLoader(GLTFLoader, "/stab-logo.glb");

  gltf.scene.position.set(0.24, 0, -0.5);
  const changeColor = (color) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // Check if the mesh has a material
        if (child.material) {
          // Set the color of the material
          child.material.color.set(bloomColor);
          child.material.metalness = 1;
          //   child.material.roughness = 0.4;
          //   child.material.envMapIntensity = 0.5;
          //   child.material.resolution = 1025;
          //   child.material.mixStrength = 0.5;
          child.material.mirror = 1;
        }
      }
    });
  };

  // Call changeColor with the desired color
  changeColor("#9679ff"); // Change "red" to the desired color

  return (
    <mesh position={[0.05, -0.15, 0]}>
      <primitive object={gltf.scene} />
    </mesh>
  );
};
const Box = () => {
  return (
    <mesh position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} castShadow receiveShadow>
      <boxGeometry />
      <MeshReflectorMaterial
        color="#9679ff"
        metalness={1}
        roughness={0.7}
        dithering
        mixStrength={80}
        resolution={1024}
        mirror={0}
        mixContrast={1}
      />
    </mesh>
  );
};
const Stab = () => {
  return (
    <Canvas
      style={{
        width: "100%",
        height: "150px",
      }}
    >
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        maxDistance={1}
        minDistance={0.7}
      />{" "}
      <directionalLight position={[-1, 1.5, 6]} intensity={0.05} />
      <directionalLight position={[-3.5, 0.5, 5]} intensity={0.15} />
      <directionalLight position={[2, 0, 5]} intensity={0.1} />
      <directionalLight position={[-1, -0.5, 5]} intensity={0.1} />
      <directionalLight position={[3, 1, 5]} intensity={0.1} />
      <directionalLight position={[50, -100, -2000]} intensity={0.1} />
      <directionalLight position={[40, -100, -1000]} intensity={0.1} />
      <directionalLight position={[40, -100, -10]} intensity={0.1} />
      <StabLogo />
      {/* <Box /> */}
      <EffectComposer>
        <FXAA samples={16} />
        <SMAA />
        <SelectiveBloom mipmapBlur intensity={1} />
        {/* <Bloom intensity={0.2} /> */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.005, 0.002]}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Stab;

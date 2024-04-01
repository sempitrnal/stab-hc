// @ts-nocheck
import {
  OrbitControls,
  PivotControls,
  shaderMaterial,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const StabLogo = () => {
  // useFrame((state, delta) => {
  //   gltf.scene.rotation.y += 0.005;
  // });
  const gltf = useLoader(GLTFLoader, "/stab-logo.glb");

  gltf.scene.position.set(0.24, 0, -0.5);
  const changeColor = (color) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // Check if the mesh has a material
        if (child.material) {
          // Set the color of the material
          child.material.color.set(color);
          child.material.metalness = 1;
          child.material.roughness = 0;
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
    <mesh position={[1, 0, 2]}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
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
      <directionalLight position={[0.5, -0, 1]} intensity={3000} />

      <StabLogo />
      <OrbitControls
        // autoRotate
        autoRotateSpeed={2}
        maxDistance={1.3}
        minDistance={1.1}
      />
    </Canvas>
  );
};

export default Stab;

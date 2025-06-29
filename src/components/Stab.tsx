// @ts-nocheck
import useGlobalLoadingStore from "@/stores/loading";
import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  ChromaticAberration,
  EffectComposer,
  FXAA,
  SMAA,
} from "@react-three/postprocessing";
import { useRouter } from "next/router";
import { BlendFunction } from "postprocessing";
import { useEffect, useState } from "react";
import { Color } from "three";
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
          child.material.roughness = 0.25;
          child.material.toneMapped = false;
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
        resolution={2048}
        mirror={0}
        mixContrast={1}
      />
    </mesh>
  );
};

const Stab = () => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const router = useRouter();
  const { setLoading } = useGlobalLoadingStore();
  useEffect(() => {}, []);
  return (
    <div
      // onClick={() => {
      //   if (router.pathname === "/") {
      //     window.scrollTo({ top: 0, behavior: "smooth" });
      //   } else {
      //     router.push("/", undefined, { scroll: false });
      //     setLoading(true);
      //   }
      // }}
      onMouseDown={() => setIsGrabbing(true)}
      onMouseUp={() => setIsGrabbing(false)}
      onMouseLeave={() => setIsGrabbing(false)}
      className={`h-[80px] w-[200px] translate-x-[-3rem]   ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Canvas style={{}}>
        <OrbitControls
          // autoRotate
          autoRotateSpeed={0.5}
          maxDistance={0.9}
          minDistance={0.7}
          enableZoom={false}
          enablePan={false}
        />
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
          <FXAA samples={16} /> <SMAA />
          {/* <SelectiveBloom mipmapBlur intensity={0.5} />
        <Bloom intensity={0.2} /> */}
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0015, 0.002]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Stab;

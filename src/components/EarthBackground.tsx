"use client";


import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";


function EarthModel() {
  const earthGroupRef = useRef<THREE.Group>(null);
  const interactiveBoostRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const [earth, setEarth] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let fbxLoader: any;
    let loadedModel: THREE.Group | null = null;
    let loadedTexture: THREE.Texture | null = null;

    async function loadModel() {
      try {
        const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
        fbxLoader = new FBXLoader();
        fbxLoader.setPath("/models/earth/source/");
        fbxLoader.load(
          "Earth.fbx",
          (object: THREE.Group) => {
            loadedModel = object;
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
              "/models/earth/textures/1_earth_8k.jpg",
              (texture) => {
                loadedTexture = texture;
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.anisotropy = 8;

                loadedModel!.traverse((child) => {
                  if (!(child instanceof THREE.Mesh)) return;
                  const material = Array.isArray(child.material)
                    ? child.material[0]
                    : child.material;
                  if (material && "map" in material) {
                    material.map = texture;
                    material.needsUpdate = true;
                  }
                  child.castShadow = false;
                  child.receiveShadow = false;
                });
                if (isMounted) setEarth(loadedModel!.clone(true));
              },
              undefined,
              (err: any) => {
                if (isMounted) setError("Failed to load Earth texture");
                // eslint-disable-next-line no-console
                console.error("Earth texture load error", err);
              }
            );
          },
          undefined,
          (err: any) => {
            if (isMounted) setError("Failed to load Earth model");
            // eslint-disable-next-line no-console
            console.error("Earth FBX load error", err);
          }
        );
      } catch (e) {
        setError("FBXLoader import failed");
        // eslint-disable-next-line no-console
        console.error("FBXLoader dynamic import failed", e);
      }
    }
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  useFrame((_, delta) => {
    if (!earthGroupRef.current) return;
    interactiveBoostRef.current = Math.max(interactiveBoostRef.current - delta * 0.9, 0);
    const group = earthGroupRef.current;
    const baseSpin = 0.18;
    group.rotation.y += delta * (baseSpin + interactiveBoostRef.current * 0.9);
    group.rotation.x +=
      (pointerTargetRef.current.y * 0.22 - group.rotation.x) * Math.min(delta * 2.8, 1);
    group.rotation.z +=
      (pointerTargetRef.current.x * -0.08 - group.rotation.z) * Math.min(delta * 2.6, 1);
  });

  if (error) {
    return <group><mesh><boxGeometry /><meshStandardMaterial color="red" /></mesh></group>;
  }
  if (!earth) return null;
  return (
    <group
      ref={earthGroupRef}
      scale={[0.015, 0.015, 0.015]}
      onPointerMove={(event) => {
        event.stopPropagation();
        pointerTargetRef.current.x = event.pointer.x;
        pointerTargetRef.current.y = event.pointer.y;
      }}
      onPointerOut={() => {
        pointerTargetRef.current.x = 0;
        pointerTargetRef.current.y = 0;
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        interactiveBoostRef.current = 0.55;
      }}
    >
      <primitive object={earth} />
    </group>
  );
}

export default function EarthBackground() {
  return (
    <div className="earth-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.7]}
      >
        <ambientLight intensity={1.05} color="#ffffff" />
        <directionalLight position={[3.5, 2.6, 4]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-4, -2, 2.2]} intensity={0.45} color="#f1f5f9" />
        <EarthModel />
      </Canvas>
    </div>
  );
}

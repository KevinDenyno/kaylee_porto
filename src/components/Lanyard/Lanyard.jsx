/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Text } from '@react-three/drei';
import { useMemo } from "react";

// replace with your own imports, see the usage snippet for details
const cardGLB = "/assets/card.glb";
const lanyard = "/portofolio/assets/lanyard.png";

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useMemo(() => createLanyardTexture(), []);
  const frontPhoto = useTexture('/portofolio/assets/front.png');

  const frontTexture = useMemo(() => {
    if (!frontPhoto.image) return frontPhoto;
    return createFrontCardTexture(frontPhoto.image);
  }, [frontPhoto]);
  const backTexture  = useTexture('/portofolio/assets/back.png');
  const nameGroup = useRef();
  const [textVisible, setTextVisible] = useState(false);
  
  frontTexture.center.set(0.5, 0.5);
  frontTexture.repeat.set(1, 0.7);
  frontTexture.offset.set(0.25, 0.1);

  backTexture.center.set(0.5, 0.5);
  backTexture.repeat.set(1, 1);
  backTexture.offset.set(0.25, 0);
  backTexture.wrapS = backTexture.wrapT = THREE.ClampToEdgeWrapping;


  frontTexture.wrapS = frontTexture.wrapT = THREE.ClampToEdgeWrapping;

  frontTexture.minFilter = THREE.LinearFilter;
  frontTexture.magFilter = THREE.LinearFilter;
  frontTexture.anisotropy = 16;

  frontTexture.wrapS = frontTexture.wrapT = THREE.ClampToEdgeWrapping;
  const cardTexture = useTexture('/portofolio/assets/kevin.png'); 
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

function createLanyardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4096;  
  canvas.height = 512;  

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const text = "KAYLEE  BUMN";
  const fontSize = 220;
  const spacing = 2000  ; 

  ctx.font = `900 ${fontSize}px Arial Black`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerY = canvas.height / 2;

  for (let x = canvas.width - spacing / 2; x > 0; x -= spacing) {
    ctx.fillText(text, x, centerY);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.repeat.x = -0.8;
  texture.offset.x = 1;    

  texture.wrapS = THREE.RepeatWrapping; 
  texture.wrapT = THREE.ClampToEdgeWrapping;

  texture.repeat.set(0.1, 1); 
  texture.offset.set(0, 0);

  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
}

function createFrontCardTexture(image) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;

  const ctx = canvas.getContext("2d");

  // =========================
  // FOTO
  // =========================
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // =========================
  // OVERLAY TIPIS (BIAR TEKS KEBACA)
  // =========================
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // =========================
  // NAMA (VERTIKAL)
  // =========================
  ctx.save();
  ctx.translate(80, canvas.height * 0.26);
  ctx.rotate(-Math.PI / 2);
  ctx.font = "750 58px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.98)";
  ctx.textAlign = "center";

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.generateMipmaps = false;

  return texture;
}

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.50, 0]]);

  frontTexture.flipY = false;
  backTexture.flipY = false;

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
    if (nameGroup.current) {
      nameGroup.current.position.y = THREE.MathUtils.lerp(
        nameGroup.current.position.y,
        textVisible ? -0.95 : -1.05,
        0.08
      );

      nameGroup.current.children.forEach((child) => {
        child.material.opacity = THREE.MathUtils.lerp(
          child.material.opacity,
          textVisible ? 1 : 0,
          0.08
        );
      });
    }
  });

      useEffect(() => {
      setTextVisible(true);
    }, []);

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            {/* FRONT CARD */}
            <mesh geometry={nodes.card.geometry} position={[0, 0, 0.002]}>
              <meshPhysicalMaterial
                map={frontTexture}
                clearcoat={1}
                clearcoatRoughness={0.1}
                roughness={0.9}
                metalness={0.8}
                emissive="#1e40af"
                emissiveIntensity={0.15}
              />
            </mesh>

            {/* BACK CARD */}
            <mesh
              geometry={nodes.card.geometry}
              position={[0, 0, -0.002]}
              rotation={[0, Math.PI, 0]}
            >
              <meshPhysicalMaterial
                map={backTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>

            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          map={texture}
          useMap
          lineWidth={1.4}
          transparent
          opacity={1}
          depthTest={false}
        />
      </mesh>
    </>
  );
}

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, RoundedBox } from '@react-three/drei';

// A clean, abstract 3D SUV built with primitives (no external downloads required!)
const AbstractSUV = () => {
  return (
    <group position={[0, -0.5, 0]} scale={0.8}>
      {/* Main Body */}
      <RoundedBox args={[4, 1.2, 2]} position={[0, 0.8, 0]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
      </RoundedBox>
      
      {/* Cabin / Roof */}
      <RoundedBox args={[2.4, 1, 1.8]} position={[-0.2, 1.8, 0]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
      </RoundedBox>

      {/* Headlights */}
      <mesh position={[2, 0.8, 0.7]}>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2, 0.8, -0.7]}>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-2, 0.8, 0.7]}>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-2, 0.8, -0.7]}>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>

      {/* Wheels */}
      {[
        [1.3, 0.3, 1],   // Front Right
        [1.3, 0.3, -1],  // Front Left
        [-1.3, 0.3, 1],  // Rear Right
        [-1.3, 0.3, -1], // Rear Left
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Simple Error Boundary just in case Canvas fails to mount
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-[1.25rem] text-slate-500">
           <img src="/heroSectionIllustration.png" alt="Fallback" className="w-[120%] opacity-50 mix-blend-multiply" />
        </div>
      );
    }
    return this.props.children;
  }
}

const CarModelViewer = () => {
  return (
    <div className="w-full h-full min-h-[250px] cursor-grab active:cursor-grabbing">
      <ErrorBoundary>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 3, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} adjustCamera={false}>
              <AbstractSUV />
            </Stage>
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} makeDefault />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default CarModelViewer;

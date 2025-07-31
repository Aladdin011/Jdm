import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/stores/appStore';

interface ParticleSystemProps {
  count?: number;
  size?: number;
  speed?: number;
  color?: string;
  opacity?: number;
}

function ParticleField({ count = 1000, size = 0.005, speed = 0.01, color = '#F97316', opacity = 0.6 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const { reducedMotion, personalization } = useAppStore();

  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles in 3D space
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, [count, viewport]);

  // Animate particles
  useFrame((state) => {
    if (!ref.current || reducedMotion) return;

    const time = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Floating motion
      positions[i3 + 1] += Math.sin(time + positions[i3]) * speed * 0.1;
      
      // Drift motion
      positions[i3] += Math.cos(time * 0.5 + positions[i3 + 2]) * speed * 0.05;
      positions[i3 + 2] += Math.sin(time * 0.3 + positions[i3]) * speed * 0.02;
      
      // Reset particles that drift too far
      if (positions[i3] > viewport.width) positions[i3] = -viewport.width;
      if (positions[i3] < -viewport.width) positions[i3] = viewport.width;
      if (positions[i3 + 1] > viewport.height) positions[i3 + 1] = -viewport.height;
      if (positions[i3 + 1] < -viewport.height) positions[i3 + 1] = viewport.height;
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleSize = personalization.deviceType === 'mobile' ? size * 0.5 : size;
  const particleOpacity = personalization.deviceType === 'mobile' ? opacity * 0.7 : opacity;

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={particleSize}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={particleOpacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function InteractiveParticles() {
  const { pointer } = useThree();
  const ref = useRef<THREE.Points>(null);
  const { mousePosition } = useAppStore();

  useFrame(() => {
    if (ref.current) {
      // Mouse interaction effect
      const mouseInfluence = 0.1;
      ref.current.rotation.x = pointer.y * mouseInfluence;
      ref.current.rotation.y = pointer.x * mouseInfluence;
    }
  });

  return (
    <group ref={ref}>
      <ParticleField count={500} size={0.008} speed={0.005} color="#FFD700" opacity={0.4} />
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { scrollProgress } = useAppStore();

  useFrame(() => {
    // Subtle camera movement based on scroll
    camera.position.z = 5 + scrollProgress * 2;
    camera.rotation.x = scrollProgress * 0.1;
  });

  return null;
}

export function ParticleCanvas() {
  const { reducedMotion, personalization } = useAppStore();

  // Don't render on low-performance devices or with reduced motion
  if (reducedMotion || personalization.deviceType === 'mobile') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-pink-500/10" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <CameraController />
        
        {/* Main particle field */}
        <ParticleField 
          count={800} 
          size={0.006} 
          speed={0.008} 
          color="#F97316" 
          opacity={0.6} 
        />
        
        {/* Secondary interactive particles */}
        <InteractiveParticles />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#FFD700" />
      </Canvas>
    </div>
  );
}

export default ParticleCanvas;

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url, onLoad }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef()

  useEffect(() => {
    if (onLoad && scene) {
      onLoad()
    }
  }, [scene, onLoad])

  // Calculate bounding box and center the model
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      // Center the model
      scene.position.x = -center.x
      scene.position.y = -center.y
      scene.position.z = -center.z
      
      // Scale to fit if needed
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 3) {
        scene.scale.setScalar(3 / maxDim)
      }
    }
  }, [scene])

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={1}
    />
  )
}

function LoadingSpinner() {
  return (
    <Html center>
      <div style={{
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: 'system-ui',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px'
      }}>
        Loading 3D model...
      </div>
    </Html>
  )
}

function Plant3DViewer({ modelUrl }) {
  const [isLoading, setIsLoading] = useState(true)

  if (!modelUrl) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#ffffff',
        fontSize: '0.9rem',
        fontFamily: 'system-ui'
      }}>
        3D model not available for this plant
      </div>
    )
  }

  const handleModelLoad = () => {
    setIsLoading(false)
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%', background: '#000000' }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Model url={modelUrl} onLoad={handleModelLoad} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={15}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
        <Environment preset="sunset" />
      </Suspense>
      {isLoading && <LoadingSpinner />}
    </Canvas>
  )
}

export default Plant3DViewer


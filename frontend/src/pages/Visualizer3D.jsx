import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import './Visualizer3D.css'

// 3D Model Component that creates a 3D representation from 2D image
function Plant3DModel({ imageUrl, height, depth, lighting }) {
  const meshRef = useRef()
  const [texture, setTexture] = useState(null)
  const geometryRef = useRef()

  // Load image as texture
  useEffect(() => {
    if (imageUrl) {
      const loader = new THREE.TextureLoader()
      loader.load(
        imageUrl,
        (loadedTexture) => {
          loadedTexture.flipY = false
          setTexture(loadedTexture)
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error)
        }
      )
    }
  }, [imageUrl])

  // Initialize geometry
  useEffect(() => {
    if (!geometryRef.current) {
      geometryRef.current = new THREE.PlaneGeometry(2, 2, 32, 32)
    }
  }, [])

  // Update geometry with depth effect
  useEffect(() => {
    if (!geometryRef.current) return
    
    const geometry = geometryRef.current
    const positions = geometry.attributes.position
    
    // Modify vertices to create depth effect based on depth parameter
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      // Create a wave-like distortion for depth
      const z = Math.sin(x * Math.PI) * Math.cos(y * Math.PI) * (depth / 100) * 0.2
      positions.setZ(i, z)
    }
    
    positions.needsUpdate = true
    geometry.computeVertexNormals()
  }, [depth])

  // Cleanup texture
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])

  if (!imageUrl) return null

  return (
    <group ref={meshRef} position={[0, (height - 50) * 0.02, 0]}>
      {geometryRef.current && (
        <mesh geometry={geometryRef.current} rotation={[0, 0, 0]}>
          {texture ? (
            <meshStandardMaterial 
              map={texture} 
              side={THREE.DoubleSide}
              emissive={new THREE.Color(0x000000)}
              emissiveIntensity={0}
            />
          ) : (
            <meshStandardMaterial color="#4B8B3B" />
          )}
        </mesh>
      )}
    </group>
  )
}

// Loading Component
function Loader() {
  return (
    <Html center>
      <div className="loader-3d">
        <div className="loader-spinner"></div>
        <p>Generating 3D Model...</p>
      </div>
    </Html>
  )
}

// Main 3D Canvas Component
function ModelCanvas({ imageUrl, height, depth, lighting, onReset }) {
  const controlsRef = useRef()

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    onReset()
  }, [onReset])

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4 * lighting} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8 * lighting} 
            castShadow
          />
          <directionalLight 
            position={[-5, -5, -5]} 
            intensity={0.3 * lighting} 
          />
          <pointLight 
            position={[0, 10, 0]} 
            intensity={0.5 * lighting} 
          />
          {imageUrl && (
            <Plant3DModel 
              imageUrl={imageUrl} 
              height={height} 
              depth={depth}
              lighting={lighting}
            />
          )}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            autoRotate={false}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      <div className="canvas-controls">
        <button 
          className="control-btn reset-btn"
          onClick={handleReset}
          title="Reset View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Reset View
        </button>
      </div>
    </div>
  )
}

const Visualizer3D = () => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [viewMode, setViewMode] = useState('2d') // '2d', '3d', 'compare'
  const [height, setHeight] = useState(50)
  const [depth, setDepth] = useState(50)
  const [lighting, setLighting] = useState(100)
  const fileInputRef = useRef(null)
  const dropAreaRef = useRef(null)

  const handleFileSelect = useCallback((file) => {
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG or PNG image')
      return
    }

    const reader = new FileReader()
    reader.onloadstart = () => {
      setIsProcessing(true)
      setProgress(0)
    }
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    reader.onloadend = () => {
      setIsProcessing(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
    }
    reader.onload = (e) => {
      const imageUrl = e.target.result
      setImagePreview(imageUrl)
      setUploadedImage(imageUrl)
      setViewMode('2d')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInput = useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null)
    setImagePreview(null)
    setViewMode('2d')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleGenerate3D = useCallback(() => {
    setViewMode('3d')
  }, [])

  const handleDownload = useCallback(() => {
    // Create a canvas to capture the 3D view
    // This is a simplified version - in a real implementation, you'd capture the Three.js canvas
    if (uploadedImage) {
      const link = document.createElement('a')
      link.href = uploadedImage
      link.download = '3d-plant-visualization.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [uploadedImage])

  const handleReset = useCallback(() => {
    setHeight(50)
    setDepth(50)
    setLighting(100)
  }, [])

  return (
    <div className="visualizer-3d">
      <motion.div
        className="visualizer-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="visualizer-header">
          <div className="header-content">
            <h1>3D Plant Visualizer</h1>
            <p>Transform your 2D plant images into interactive 3D models</p>
          </div>
        </div>

        <div className="visualizer-content">
          {/* Upload Section */}
          {!uploadedImage && (
            <motion.div
              className="upload-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                ref={dropAreaRef}
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="drop-zone-content">
                  <div className="upload-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3>Drag & Drop Your Plant Image</h3>
                  <p>or click to browse</p>
                  <span className="file-types">Supports JPG, PNG</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInput}
                className="file-input"
              />
            </motion.div>
          )}

          {/* Processing Progress */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="progress-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="progress-text">Processing image... {progress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main View Area */}
          {uploadedImage && (
            <div className="main-view-section">
              {/* Left Column: View Modes and Content */}
              <div className="view-section">
                {/* View Mode Toggle */}
                <div className="view-mode-toggle">
                  <button
                    className={`mode-btn ${viewMode === '2d' ? 'active' : ''}`}
                    onClick={() => setViewMode('2d')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                    </svg>
                    2D View
                  </button>
                  <button
                    className={`mode-btn ${viewMode === '3d' ? 'active' : ''}`}
                    onClick={() => setViewMode('3d')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <boxGeometry />
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    3D View
                  </button>
                  <button
                    className={`mode-btn ${viewMode === 'compare' ? 'active' : ''}`}
                    onClick={() => setViewMode('compare')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Compare
                  </button>
                  <button
                    className="remove-btn"
                    onClick={handleRemoveImage}
                    title="Remove Image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* View Content */}
                <div className="view-content">
                  <AnimatePresence mode="wait">
                    {viewMode === '2d' && (
                      <motion.div
                        key="2d"
                        className="view-2d"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Plant preview" className="preview-image" />
                          <div className="generate-3d-overlay">
                            <button className="generate-3d-btn" onClick={handleGenerate3D}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              </svg>
                              Generate 3D View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {viewMode === '3d' && (
                      <motion.div
                        key="3d"
                        className="view-3d"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ModelCanvas
                          imageUrl={uploadedImage}
                          height={height}
                          depth={depth}
                          lighting={lighting}
                          onReset={handleReset}
                        />
                      </motion.div>
                    )}

                    {viewMode === 'compare' && (
                      <motion.div
                        key="compare"
                        className="view-compare"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="compare-container">
                          <div className="compare-item">
                            <h4>2D Original</h4>
                            <div className="image-preview-container">
                              <img src={imagePreview} alt="Original 2D" className="preview-image" />
                            </div>
                          </div>
                          <div className="compare-divider">
                            <div className="divider-line"></div>
                            <span>VS</span>
                            <div className="divider-line"></div>
                          </div>
                          <div className="compare-item">
                            <h4>3D Model</h4>
                            <div className="canvas-container-compare">
                              <ModelCanvas
                                imageUrl={uploadedImage}
                                height={height}
                                depth={depth}
                                lighting={lighting}
                                onReset={handleReset}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Control Panel */}
              <div className="control-panel">
                <h3>3D Controls</h3>
                <div className="controls-grid">
                  <div className="control-item">
                    <label>
                      <span>Height</span>
                      <span className="control-value">{height}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>
                  <div className="control-item">
                    <label>
                      <span>Depth</span>
                      <span className="control-value">{depth}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={depth}
                      onChange={(e) => setDepth(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>
                  <div className="control-item">
                    <label>
                      <span>Lighting</span>
                      <span className="control-value">{lighting}%</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      value={lighting}
                      onChange={(e) => setLighting(Number(e.target.value))}
                      className="control-slider"
                    />
                  </div>
                </div>
                <button className="reset-controls-btn" onClick={handleReset}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  Reset Controls
                </button>
                <button className="download-btn" onClick={handleDownload}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Visualizer3D


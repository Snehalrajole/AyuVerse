import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './PlantDetail.css'
import tulsi from '../assets/tulsi.png'
import aloe from '../assets/aloe2.png'
import garlic from '../assets/garlic.png'
import haldi from '../assets/haldi.png'
import neem1 from '../assets/neem2.png'
import Plant3DViewer from '../components/Plant3DViewer'
import aloeModel from '../assets/3dModels/ALOE.glb?url'
import holyBasilModel from '../assets/3dModels/HOLY BOSIL.glb?url'
import neemModel from '../assets/3dModels/NEEM.glb?url'
import turmericModel from '../assets/3dModels/TURMERIC.glb?url'

const PlantDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(null)
  const [showAyushModal, setShowAyushModal] = useState(false)
  const [showHealthModal, setShowHealthModal] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])
  const speechSynthesisRef = useRef(null)
  const speechUtteranceRef = useRef(null)

  // Plant data - this would come from an API or database
  const plantsData = {
    'holy-basil': {
      name: 'Holy Basil',
      image: tulsi,
      size: 'Typically grows up to 60 cm (2 feet) in height.',
      nativeRegion: 'Indian subcontinent.',
      climate: 'Warm, tropical and subtropical climates.',
      sunlight: 'Full sun to partial shade.',
      soil: 'Well-drained, fertile soil rich in organic matter.',
      partUsed: ['Leaves'],
      activeCompounds: ['Eugenol', 'Rosmarinic acid', 'Luteolin', 'Ursolic acid'],
      therapeuticProperties: ['Adaptogenic', 'Antioxidant', 'Anti-inflammatory', 'Immunomodulatory'],
      dosageForms: ['Tea', 'Capsules', 'Tinctures', 'Essential oils'],
      ayushApplication: {
        ayurveda: 'Used for respiratory conditions, stress relief, and immune system support.',
        unani: 'Used for treating cough, cold, and as a digestive aid.',
        siddha: 'Used for skin conditions, respiratory ailments, and enhancing mental clarity.'
      },
      healthBenefits: [
        'Reduces stress and anxiety levels.',
        'Supports respiratory health and eases breathing.',
        'Boosts immune system function.',
        'Promotes healthy skin and reduces inflammation.'
      ]
    },
    'aloe': {
      name: 'Aloe',
      image: aloe,
      size: 'Typically grows up to 60-100 cm (2-3 feet) in height.',
      nativeRegion: 'Arabian Peninsula, but widely cultivated worldwide.',
      climate: 'Warm, arid to semi-arid climates.',
      sunlight: 'Full sun to partial shade.',
      soil: 'Well-drained, sandy soil.',
      partUsed: ['Leaves (Gel)'],
      activeCompounds: ['Aloin', 'Aloe-emodin', 'Polysaccharides', 'Vitamins A, C, E'],
      therapeuticProperties: ['Soothing', 'Healing', 'Moisturizing', 'Anti-inflammatory'],
      dosageForms: ['Gel', 'Juice', 'Capsules', 'Creams'],
      ayushApplication: {
        ayurveda: 'Used for skin conditions, burns, and digestive issues.',
        unani: 'Used for wound healing, skin health, and as a laxative.',
        siddha: 'Used for treating constipation, skin ailments, and enhancing digestion.'
      },
      healthBenefits: [
        'Promotes skin healing and reduces inflammation.',
        'Moisturizes and soothes dry skin.',
        'Supports digestive health and relieves constipation.'
      ]
    },
    'neem': {
      name: 'Neem',
      image: neem1,
      size: 'Typically grows up to 20 meters (65 feet) in height.',
      nativeRegion: 'Indian subcontinent.',
      climate: 'Tropical and subtropical climates.',
      sunlight: 'Full sun.',
      soil: 'Well-drained, loamy soil.',
      partUsed: ['Leaves', 'Bark', 'Seeds'],
      activeCompounds: ['Azadirachtin', 'Nimbin', 'Nimbidin', 'Salannin'],
      therapeuticProperties: ['Antibacterial', 'Antifungal', 'Antiviral', 'Anti-inflammatory'],
      dosageForms: ['Capsules', 'Powder', 'Oil', 'Tea'],
      ayushApplication: {
        ayurveda: 'Used for skin diseases, dental care, and blood purification.',
        unani: 'Used for treating infections, fever, and as a purgative.',
        siddha: 'Used for skin disorders, diabetes management, and immune support.'
      },
      healthBenefits: [
        'Fights bacterial and fungal infections.',
        'Improves skin health and reduces acne.',
        'Supports oral hygiene and dental health.',
        'Helps manage blood sugar levels.'
      ]
    },
    'garlic': {
      name: 'Garlic',
      image: garlic,
      size: 'Typically grows up to 90 cm (3 feet) in height.',
      nativeRegion: 'Central Asia.',
      climate: 'Temperate climates.',
      sunlight: 'Full sun.',
      soil: 'Well-drained, fertile soil.',
      partUsed: ['Bulb', 'Cloves'],
      activeCompounds: ['Allicin', 'Ajoene', 'Diallyl disulfide', 'S-allyl cysteine'],
      therapeuticProperties: ['Antimicrobial', 'Cardiovascular support', 'Antioxidant', 'Immune booster'],
      dosageForms: ['Raw', 'Capsules', 'Oil', 'Extract'],
      ayushApplication: {
        ayurveda: 'Used for cardiovascular health, respiratory conditions, and digestive disorders.',
        unani: 'Used for treating infections, hypertension, and as a carminative.',
        siddha: 'Used for heart health, cholesterol management, and immune enhancement.'
      },
      healthBenefits: [
        'Supports cardiovascular health and reduces blood pressure.',
        'Boosts immune system and fights infections.',
        'Helps lower cholesterol levels.',
        'Provides antioxidant protection.'
      ]
    },
    'turmeric': {
      name: 'Turmeric',
      image: haldi,
      size: 'Typically grows up to 100 cm (3.3 feet) in height.',
      nativeRegion: 'Southeast Asia.',
      climate: 'Tropical and subtropical climates.',
      sunlight: 'Full sun to partial shade.',
      soil: 'Well-drained, fertile soil.',
      partUsed: ['Rhizome'],
      activeCompounds: ['Curcumin', 'Demethoxycurcumin', 'Bisdemethoxycurcumin', 'Volatile oils'],
      therapeuticProperties: ['Anti-inflammatory', 'Antioxidant', 'Antimicrobial', 'Hepatoprotective'],
      dosageForms: ['Powder', 'Capsules', 'Tea', 'Extract'],
      ayushApplication: {
        ayurveda: 'Used for inflammation, digestive disorders, and skin conditions.',
        unani: 'Used for wound healing, liver health, and as an anti-inflammatory agent.',
        siddha: 'Used for arthritis, digestive issues, and enhancing skin complexion.'
      },
      healthBenefits: [
        'Reduces inflammation and joint pain.',
        'Supports liver health and detoxification.',
        'Improves digestion and gut health.',
        'Provides powerful antioxidant benefits.'
      ]
    }
  }

  const plant = plantsData[slug]

  // Map plant slugs to 3D model files
  const modelMap = {
    'holy-basil': holyBasilModel,
    'aloe': aloeModel,
    'neem': neemModel,
    'turmeric': turmericModel,
    'garlic': null // No model available for garlic
  }

  const plantModel = modelMap[slug] || null

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
    }
    speechUtteranceRef.current = null
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeechSupported(false)
      return
    }

    const synth = window.speechSynthesis
    speechSynthesisRef.current = synth
    setIsSpeechSupported(true)

    const loadVoices = () => {
      const voices = synth.getVoices()
      if (voices && voices.length) {
        setAvailableVoices(voices)
      }
    }

    loadVoices()

    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', loadVoices)
      return () => {
        synth.removeEventListener('voiceschanged', loadVoices)
      }
    }

    if ('onvoiceschanged' in synth) {
      const handler = () => loadVoices()
      synth.onvoiceschanged = handler
      return () => {
        if (synth.onvoiceschanged === handler) {
          synth.onvoiceschanged = null
        }
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [stopSpeaking])

  useEffect(() => {
    if (activeTab !== '3d-view') {
      stopSpeaking()
    }
  }, [activeTab, stopSpeaking])

  const plantNarration = useMemo(() => {
    if (!plant) {
      return ''
    }

    const baseIntro = `${plant.name} is an Ayurvedic plant native to ${plant.nativeRegion}.`
    const growthInfo = `It thrives in ${plant.climate.toLowerCase()} and prefers ${plant.sunlight.toLowerCase()} with ${plant.soil.toLowerCase()}.`
    const partsUsed = plant.partUsed && plant.partUsed.length
      ? `Traditional healers often use the ${plant.partUsed.join(', ')}.`
      : ''
    const properties = plant.therapeuticProperties && plant.therapeuticProperties.length
      ? `It is known for ${plant.therapeuticProperties.slice(0, 3).join(', ').toLowerCase()} properties.`
      : ''
    const benefits = plant.healthBenefits && plant.healthBenefits.length
      ? `Some key benefits include ${plant.healthBenefits.slice(0, 2).join(', ')}.`
      : ''
    const dosage = plant.dosageForms && plant.dosageForms.length
      ? `Common preparations are ${plant.dosageForms.slice(0, 2).join(' and ')}.`
      : ''

    return [baseIntro, growthInfo, partsUsed, properties, benefits, dosage]
      .filter(Boolean)
      .join(' ')
  }, [plant])

  const handleSpeakToggle = () => {
    if (!isSpeechSupported || !speechSynthesisRef.current || !plantNarration) {
      return
    }

    if (isSpeaking) {
      stopSpeaking()
      return
    }

    if (typeof window === 'undefined' || typeof window.SpeechSynthesisUtterance !== 'function') {
      return
    }

    const utterance = new window.SpeechSynthesisUtterance(plantNarration.slice(0, 900))
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    utterance.pitch = 1

    if (availableVoices.length) {
      const preferredVoice =
        availableVoices.find((voice) => voice.lang && voice.lang.startsWith('en') && voice.name.toLowerCase().includes('natural')) ||
        availableVoices.find((voice) => voice.lang && voice.lang.startsWith('en') && voice.name.toLowerCase().includes('voice')) ||
        availableVoices.find((voice) => voice.lang && voice.lang.startsWith('en')) ||
        availableVoices[0]
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
    }

    utterance.onend = () => {
      stopSpeaking()
    }

    utterance.onerror = () => {
      stopSpeaking()
    }

    speechUtteranceRef.current = utterance
    speechSynthesisRef.current.cancel()
    speechSynthesisRef.current.speak(utterance)
    setIsSpeaking(true)
  }

  const handleBackFrom3D = () => {
    stopSpeaking()
    setActiveTab(null)
  }

  if (!plant) {
    return (
      <div className="plant-detail">
        <div className="plant-not-found">
          <h2>Plant not found</h2>
          <button onClick={() => navigate('/explore-plants')}>Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="plant-detail">
      <div className="plant-detail-header">
        <Link to="/" className="header-home-link">Home</Link>
        <button className="header-back-button" onClick={() => navigate('/explore-plants')}>
          <span>Go back</span>
        </button>
      </div>

      <div className="plant-detail-content">
        {/* Left Column - Plant Information */}
        <div className="plant-info-column">
          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Plant Size:</strong> {plant.size}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Native Region:</strong> {plant.nativeRegion}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Preferred Climate:</strong> {plant.climate}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Required Sunlight:</strong> {plant.sunlight}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Required Soil:</strong> {plant.soil}
            </div>
          </motion.div>
        </div>

        {/* Center Column - 3D Plant View */}
        <div className="plant-view-column">
          <div className="plant-tabs">
            <button
              className={`plant-tab ${activeTab === '3d-view' ? 'active' : ''}`}
              onClick={() => setActiveTab('3d-view')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                <path d="M7 2v20M17 2v20M2 7h20M2 17h20" />
              </svg>
              <span>3D View</span>
            </button>
            <button
              className={`plant-tab ${showAyushModal ? 'active' : ''}`}
              onClick={() => setShowAyushModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>AYUSH Application</span>
            </button>
            <button
              className={`plant-tab ${showHealthModal ? 'active' : ''}`}
              onClick={() => setShowHealthModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Health Benefits</span>
            </button>
          </div>

          <div className="plant-image-container">
            {activeTab === '3d-view' && plantModel ? (
              <>
                <div className="viewer-controls">
                  <button
                    type="button"
                    className={`viewer-speak-button ${isSpeaking ? 'speaking' : ''}`}
                    onClick={handleSpeakToggle}
                    disabled={!isSpeechSupported || !plantNarration}
                    aria-label={isSpeaking ? `Stop narration for ${plant.name}` : `Play narration for ${plant.name}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 8v8M10 5v14M14 9v6M18 4v16" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="viewer-back-button"
                    onClick={handleBackFrom3D}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Back to Details</span>
                  </button>
                </div>
                <Plant3DViewer modelUrl={plantModel} />
              </>
            ) : (
              <img src={plant.image} alt={plant.name} className="plant-detail-image" />
            )}
          </div>

          <div className="plant-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>{plant.name}</span>
          </div>
        </div>

        {/* Right Column - Medicinal Information */}
        <div className="medicinal-info-column">
          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Part used in medicinal:</strong> {plant.partUsed.join(', ')}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Active compounds in plants:</strong> {plant.activeCompounds.join(', ')}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Therapeutic properties in plants:</strong> {plant.therapeuticProperties.join(', ')}
            </div>
          </motion.div>

          <motion.div
            className="info-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className="info-card-text">
              <strong>Dosage Form:</strong> {plant.dosageForms.join(', ')}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AYUSH Application Modal */}
      <AnimatePresence>
        {showAyushModal && plant.ayushApplication && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAyushModal(false)}
          >
            <motion.div
              className="modal-content ayush-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <h2>AYUSH Application</h2>
                </div>
              </div>
              <div className="modal-body">
                <div className="ayush-section">
                  <div className="ayush-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="ayush-content">
                    <h3>Ayurveda</h3>
                    <p>{plant.ayushApplication.ayurveda}</p>
                  </div>
                </div>
                <div className="ayush-section">
                  <div className="ayush-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="ayush-content">
                    <h3>Unani</h3>
                    <p>{plant.ayushApplication.unani}</p>
                  </div>
                </div>
                <div className="ayush-section">
                  <div className="ayush-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div className="ayush-content">
                    <h3>Siddha</h3>
                    <p>{plant.ayushApplication.siddha}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-close-button" onClick={() => setShowAyushModal(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Benefits Modal */}
      <AnimatePresence>
        {showHealthModal && plant.healthBenefits && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHealthModal(false)}
          >
            <motion.div
              className="modal-content health-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                    <path d="M3.41 9.05a5.5 5.5 0 0 1 6.89 0" />
                    <path d="M18 12a6.5 6.5 0 0 1-3 6" />
                  </svg>
                  <h2>Health Benefits</h2>
                </div>
              </div>
              <div className="modal-body">
                {plant.healthBenefits.map((benefit, index) => (
                  <div key={index} className="health-benefit-item">
                    <div className="benefit-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="modal-close-button" onClick={() => setShowHealthModal(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlantDetail


import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import './Homepage.css'

//Import images from assets folder
import tulsi from "../assets/tulsi.png";
import ayuimage from "../assets/ayuimage.png";
import haldi from "../assets/haldi.png";

// Import feature images from Home_Page folder
import explorePlantsImg from "../assets/Home_Page/Explore_plant.webp";
import chatbotImg from "../assets/Home_Page/chatbot.png";
import virtualTourImg from "../assets/Home_Page/virtual_tour.jpg";
import learnAyurvedaImg from "../assets/Home_Page/ayurveda_orig.jpg";
import visualizerImg from "../assets/Home_Page/a-couple-man-and-a-woman-wearing-vr-glasses-doing-a-game-simulation-of-traveling-around-the-world-through-virtual-reality-virtual-travel-for-entertainment-and-education-flat-illustration-vecto.jpg";

const Homepage = () => {
  const navigate = useNavigate()

  const features = [
    {
      id: 1,
      title: 'Explore Plants',
      description: 'Discover the vast world of Ayurvedic plants and their healing properties',
      image: explorePlantsImg,
      color: 'var(--primary-green)'
    },
    {
      id: 2,
      title: 'Herbal Chatbot',
      description: 'Get personalized Ayurvedic recommendations from our AI assistant',
      image: chatbotImg,
      color: 'var(--soothing-turquoise)'
    },
    {
      id: 3,
      title: 'Virtual Tour',
      description: 'Experience an immersive journey through Ayurvedic gardens',
      image: virtualTourImg,
      color: 'var(--soft-clay)'
    },
    {
      id: 4,
      title: 'Learn Ayurveda',
      description: 'Deep dive into ancient wisdom and modern applications',
      image: learnAyurvedaImg,
      color: 'var(--gentle-lavender)'
    },
    {
      id: 5,
      title: '3D Herbal Visualizer',
      description: 'Generate realistic 3D view of plants instantly from 2D images using AI technology',
      image: visualizerImg,
      color: 'var(--soft-cyan)'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="homepage">
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Welcome to <span className="highlight">आयुVerse</span>
          </h1>
          <p className="hero-subtitle">The Universe of Ayurveda</p>
          <p className="hero-description">
            Discover the ancient wisdom of Ayurveda and explore the healing power of nature's plants.
            Join us on a journey through centuries of traditional knowledge.
          </p>
          <motion.button
            className="hero-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/explore-plants')}
          >
            Explore Now
          </motion.button>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-decoration">
            <div className="decoration-circle circle-1">
              <img src={tulsi} alt="Tulsi" className="circle-img" />
            </div>
            <div className="decoration-circle circle-2">
              <img src={ayuimage} alt="Image" className="circle-img" />
            </div>
            <div className="decoration-circle circle-3">
              <img src={haldi} alt="Haldi" className="circle-img" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Explore Our Features</h2>
          <p className="section-subtitle">
            Discover everything आयुVerse has to offer
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </section>

      <section className="about-section">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="about-title">About Ayurveda</h2>
          <p className="about-text">
            Ayurveda, the science of life, is an ancient healing system that originated in India over 5,000 years ago.
            It emphasizes the balance between mind, body, and spirit through natural remedies, diet, and lifestyle practices.
          </p>
          <p className="about-text">
            At आयुVerse, we bring this timeless wisdom to the modern world, helping you discover the healing power
            of plants and natural remedies that have been trusted for millennia.
          </p>
        </motion.div>
      </section>
    </div>
  )
}

export default Homepage

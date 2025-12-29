import { motion } from 'framer-motion'
import './FeatureCard.css'

const FeatureCard = ({ feature }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      className="feature-card"
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="feature-image-container">
        <img 
          src={feature.image} 
          alt={feature.title}
          className="feature-image"
        />
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
      <motion.div
        className="feature-hover-effect"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default FeatureCard

import { motion } from 'framer-motion'
import './VirtualTour.css'

const VirtualTour = () => {
  const tourSections = [
    {
      id: 1,
      title: 'Medicinal Garden',
      description: 'Explore our collection of healing herbs and plants',
      icon: '🌿'
    },
    {
      id: 2,
      title: 'Spice Corner',
      description: 'Discover the aromatic world of Ayurvedic spices',
      icon: '🫚'
    },
    {
      id: 3,
      title: 'Herbal Nursery',
      description: 'Learn about growing and cultivating medicinal plants',
      icon: '🌱'
    },
    {
      id: 4,
      title: 'Processing Unit',
      description: 'See how traditional remedies are prepared',
      icon: '⚗️'
    }
  ]

  return (
    <div className="virtual-tour">
      <motion.div
        className="tour-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Virtual Tour</h1>
        <p>Experience Ayurveda in a whole new way</p>
      </motion.div>

      <div className="tour-content">
        <div className="tour-grid">
          {tourSections.map((section, index) => (
            <motion.div
              key={section.id}
              className="tour-section-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="tour-icon">{section.icon}</div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <motion.button
                className="tour-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Tour
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="tour-info"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Immersive Experience</h2>
          <p>
            Step into our virtual Ayurvedic garden and explore the wonders of nature's pharmacy.
            Navigate through different sections, learn about each plant, and discover their
            traditional uses and modern applications.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default VirtualTour

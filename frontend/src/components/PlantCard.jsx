import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './PlantCard.css'

const PlantCard = ({ plant, index }) => {
  const navigate = useNavigate()

  const handleViewMore = () => {
    navigate(`/plant/${plant.slug}`)
  }

  const handleCardClick = (e) => {
    // Only navigate if not clicking on bookmark button
    if (e.target.closest('.bookmark-button')) {
      return
    }
    handleViewMore()
  }

  return (
    <motion.div
      className="plant-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="plant-card-image-wrapper">
        <img src={plant.image} alt={plant.name} className="plant-card-image" />
        <button className="bookmark-button" aria-label="Bookmark" onClick={(e) => e.stopPropagation()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      
      <div className="plant-card-content">
        <h3 className="plant-card-name">{plant.name}</h3>
        
        <div className="plant-card-info">
          <div className="info-badge">
            <span className="info-value">Family: {plant.family}</span>
          </div>
          <div className="info-badge">
            <span className="info-value">Genus: {plant.genus}</span>
          </div>
          <div className="info-badge">
            <span className="info-value">Size: {plant.size}</span>
          </div>
        </div>

        <button className="view-more-button" onClick={(e) => { e.stopPropagation(); handleViewMore(); }}>
          <span>View More</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default PlantCard

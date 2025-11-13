import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PlantCard from '../components/PlantCard'
import './ExplorePlants.css'
import tulsi from '../assets/tulsi.png'
import aloe from '../assets/aloe2.png'
import garlic from '../assets/garlic.png'
import haldi from '../assets/haldi.png'
import neem1 from '../assets/neem2.png'

const FILTER_OPTIONS = [
  'All',
  'Digestion',
  'Immunity',
  'Skin & Hair',
  'Diabetes',
  'Heart & Blood pressure'
]

const ExplorePlants = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const plants = useMemo(() => [
    {
      id: 1,
      name: 'Holy Basil',
      family: 'Lamiaceae',
      genus: 'Ocimum',
      size: '60 cm',
      image: tulsi,
      slug: 'holy-basil',
      categories: ['Immunity', 'Heart & Blood pressure']
    },
    {
      id: 2,
      name: 'Aloe',
      family: 'Asphodelaceae',
      genus: 'Aloe',
      size: '100 cm',
      image: aloe,
      slug: 'aloe',
      categories: ['Skin & Hair', 'Digestion']
    },
    {
      id: 3,
      name: 'Neem',
      family: 'Meliaceae',
      genus: 'Azadirachta',
      size: '20 meters',
      image: neem1,
      slug: 'neem',
      categories: ['Skin & Hair', 'Immunity', 'Diabetes']
    },
    {
      id: 4,
      name: 'Garlic',
      family: 'Amaryllidaceae',
      genus: 'Allium',
      size: '90 cm',
      image: garlic,
      slug: 'garlic',
      categories: ['Heart & Blood pressure', 'Immunity']
    },
    {
      id: 5,
      name: 'Turmeric',
      family: 'Zingiberaceae',
      genus: 'Curcuma',
      size: '100 cm',
      image: haldi,
      slug: 'turmeric',
      categories: ['Digestion', 'Skin & Hair', 'Immunity']
    }
  ], [])

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        selectedFilter === 'All' || plant.categories.includes(selectedFilter)
      return matchesSearch && matchesFilter
    })
  }, [plants, searchTerm, selectedFilter])

  const handleSearch = () => {
    // Search is handled by filteredPlants computed state
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  return (
    <div className="explore-plants">
      <div className="explore-plants-header">
        <h1 className="explore-plants-title">
          Explore the Healing Power of Plants and Herbs
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Your Herbal Plant By Name!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
        <div className="filters-container" role="tablist" aria-label="Filter plants by wellness benefit">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={selectedFilter === filter}
              className={`filter-pill ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="plants-grid-container">
        <motion.div
          className="plants-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPlants.map((plant, index) => (
            <PlantCard key={plant.id} plant={plant} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default ExplorePlants

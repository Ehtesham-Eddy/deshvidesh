import React from 'react';

export default function CountryCard({ country, isFavorite, onToggleFavorite, onClick }) {
  const { name, code, continent, capital, language, currency } = country;

  // flagcdn.com URL using lowercase 2-letter ISO country code
  const flagUrl = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;

  const handleFavClick = (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the favorite button
    onToggleFavorite(name);
  };

  return (
    <div className="country-card" onClick={onClick}>
      <div className="card-flag-wrapper">
        <img 
          src={flagUrl} 
          alt={`Flag of ${name}`} 
          className="card-flag" 
          loading="lazy" 
          onError={(e) => {
            // Fallback flag if flagcdn fails or code is xx
            e.target.src = 'https://flagcdn.com/w320/un.png';
          }}
        />
        <button 
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavClick}
          aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div className="card-content">
        <span className="card-continent">{continent}</span>
        <h3 className="card-title">{name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
          <div className="card-details">
            Capital: <span>{capital}</span>
          </div>
          <div className="card-details">
            Language: <span>{language}</span>
          </div>
          <div className="card-details">
            Currency: <span>{currency || 'Local Currency'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

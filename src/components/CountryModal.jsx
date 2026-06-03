import React from 'react';
import WorldMap from './WorldMap';
import { 
  X, 
  Heart, 
  MapPin, 
  Globe, 
  Sparkles, 
  Compass, 
  Bookmark, 
  PlusCircle, 
  CheckCircle,
  Languages,
  Coins
} from 'lucide-react';

export default function CountryModal({ 
  country, 
  allCountries, 
  isFavorite, 
  onToggleFavorite, 
  onClose, 
  onSelectCountry, 
  user, 
  collections, 
  onToggleCountryInCollection,
  onOpenBudgetCalculator
}) {
  if (!country) return null;

  const { name, code, continent, capital, language, currency, origin, attractions, fact, neighbors, lat, lng } = country;

  // Banner & Flag CDN URLs
  const flagUrl = `https://flagcdn.com/w640/${code.toLowerCase()}.png`;

  // Find neighbor details for interactive badges
  const neighborObjects = neighbors.map(neighborName => {
    return allCountries.find(c => c.name.toLowerCase() === neighborName.toLowerCase());
  }).filter(n => n !== undefined);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header Banner with Flag Background */}
        <div className="modal-header-banner">
          <img src={flagUrl} alt="" className="modal-banner-bg" />
          <div className="modal-header-overlay">
            <div className="modal-header-content">
              <img 
                src={flagUrl} 
                alt={`Flag of ${name}`} 
                className="modal-flag-img" 
                onError={(e) => {
                  e.target.src = 'https://flagcdn.com/w640/un.png';
                }}
              />
              <div className="modal-header-text">
                <h2>{name}</h2>
                <span className="modal-continent-badge">{continent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Left Column: Origin, Attractions, Facts */}
          <div className="modal-left-column">
            
            {/* Origin & Etymology */}
            <div>
              <div className="modal-section-title">
                <Bookmark size={18} className="text-primary" />
                Name Origin & History
              </div>
              <div className="origin-block">
                <p>{origin}</p>
              </div>
            </div>

            {/* Tourist Attractions */}
            <div>
              <div className="modal-section-title">
                <Compass size={18} className="text-primary" />
                Must-Visit Tourist Attractions
              </div>
              <div className="attractions-list">
                {attractions && attractions.map((attraction, idx) => (
                  <div key={idx} className="attraction-item">
                    <MapPin size={14} style={{ color: 'var(--accent-secondary)' }} />
                    <span>{attraction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interesting Fact */}
            <div>
              <div className="modal-section-title">
                <Sparkles size={18} className="text-primary" />
                Interesting Fact
              </div>
              <div className="fact-block">
                <p>{fact}</p>
              </div>
            </div>
            
            {/* Collections Management (Logged In Users Only) */}
            {user && collections && collections.length > 0 && (
              <div className="modal-collections-section">
                <div className="modal-collections-header">Add to Personal Collections</div>
                <div className="modal-collections-grid">
                  {collections.map(col => {
                    const isInCollection = col.countries.includes(name);
                    return (
                      <button
                        key={col.id}
                        className={`modal-collection-toggle ${isInCollection ? 'active' : ''}`}
                        onClick={() => onToggleCountryInCollection(col.id, name)}
                      >
                        {isInCollection ? <CheckCircle size={14} /> : <PlusCircle size={14} />}
                        {col.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Stats, Neighbors, Map */}
          <div className="modal-right-column">
            
            {/* Quick Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
              <div className="stat-item">
                <div className="stat-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="stat-label">Capital City</div>
                  <div className="stat-value">{capital}</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <div className="stat-label">Continent</div>
                  <div className="stat-value">{continent}</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Languages size={20} />
                </div>
                <div>
                  <div className="stat-label">Official Language(s)</div>
                  <div className="stat-value">{language}</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Coins size={20} />
                </div>
                <div>
                  <div className="stat-label">Official Currency</div>
                  <div className="stat-value">{currency || 'Local Currency'}</div>
                </div>
              </div>
            </div>

            {/* Favorites Toggle Button */}
            <button 
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onToggleFavorite(name)}
              style={{ width: '100%', justifyContent: 'center', gap: '10px', height: '48px' }}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
            </button>

            {/* Budget Calculator Button */}
            <button 
              className="btn btn-accent"
              onClick={() => onOpenBudgetCalculator(country)}
              style={{ width: '100%', justifyContent: 'center', gap: '10px', height: '48px', marginTop: '8px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M19 7h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6Z"/></svg>
              Calculate Travel Budget
            </button>

            {/* Map Point Locator */}
            <WorldMap lat={lat} lng={lng} countryName={name} />

            {/* Neighboring Countries */}
            <div>
              <div className="modal-section-title">
                <Globe size={18} className="text-primary" />
                Neighbouring Countries
              </div>
              {neighborObjects.length > 0 ? (
                <div className="neighbors-badges-container">
                  {neighborObjects.map(neighbor => (
                    <button
                      key={neighbor.name}
                      className="neighbor-badge-btn"
                      onClick={() => onSelectCountry(neighbor)}
                    >
                      {neighbor.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  This country has no land bordering neighbors (island nation or territory).
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

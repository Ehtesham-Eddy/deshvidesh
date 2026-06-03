import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  FolderPlus, 
  LogOut, 
  Lock, 
  Folder, 
  Plus, 
  Sparkles, 
  Globe,
  MapPin
} from 'lucide-react';

export default function Dashboard({ 
  isOpen, 
  onClose, 
  user, 
  favorites, 
  collections, 
  allCountries,
  onToggleFavorite, 
  onAddCollection, 
  onDeleteCollection, 
  onRemoveFromCollection,
  onOpenAuth,
  onLogout,
  onSelectCountry
}) {
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    onAddCollection(newCollectionName.trim());
    setNewCollectionName('');
  };

  // Find full country details for favorites to display flags and names
  const favoriteObjects = favorites.map(favName => {
    return allCountries.find(c => c.name.toLowerCase() === favName.toLowerCase());
  }).filter(c => c !== undefined);

  return (
    <div className={`dashboard-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3 className="drawer-title">
          <Globe size={22} style={{ color: 'var(--accent-primary)' }} />
          Personal Dashboard
        </h3>
        <button className="drawer-close" onClick={onClose} aria-label="Close dashboard">
          <X size={22} />
        </button>
      </div>

      <div className="drawer-body">
        {user ? (
          // Logged In Dashboard View
          <>
            {/* User Session Profile Header */}
            <div className="dash-user-section">
              <div className="dash-user-info">
                <h4>Welcome, {user.username}!</h4>
                <p>Curator & Travel Planner</p>
              </div>
              <button 
                className="btn-icon-only" 
                onClick={onLogout} 
                title="Sign Out"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Custom Travel Collections */}
            <div>
              <div className="modal-section-title">
                <Folder size={18} className="text-primary" />
                My Collections ({collections.length})
              </div>
              
              {/* Form to Create Collection */}
              <form onSubmit={handleCreateCollection} className="add-collection-form">
                <input
                  type="text"
                  placeholder="e.g. Dream Trip 2026..."
                  className="add-collection-input"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>
                  <Plus size={16} />
                  New
                </button>
              </form>

              {/* Collections Cards */}
              <div style={{ marginTop: '16px' }}>
                {collections.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>
                    Create custom lists above to organize countries you plan to explore.
                  </p>
                ) : (
                  collections.map(col => (
                    <div key={col.id} className="collection-card">
                      <div className="collection-header">
                        <span className="collection-name">
                          <Folder size={14} style={{ color: 'var(--accent-primary)' }} />
                          {col.name}
                        </span>
                        <button 
                          className="collection-delete-btn"
                          onClick={() => onDeleteCollection(col.id)}
                          title="Delete collection"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Items in Collection */}
                      {col.countries.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Empty. Add countries from country details.
                        </p>
                      ) : (
                        <div className="collection-items">
                          {col.countries.map(cName => (
                            <span key={cName} className="collection-item-tag">
                              <span 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  const cObj = allCountries.find(x => x.name.toLowerCase() === cName.toLowerCase());
                                  if (cObj) onSelectCountry(cObj);
                                }}
                              >
                                {cName}
                              </span>
                              <button 
                                className="collection-item-remove"
                                onClick={() => onRemoveFromCollection(col.id, cName)}
                                title="Remove country"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Favorite Countries List */}
            <div>
              <div className="modal-section-title">
                <Heart size={18} className="text-primary" />
                Favorite Countries ({favorites.length})
              </div>

              <div className="fav-dashboard-list">
                {favoriteObjects.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
                    Heart countries on their cards to add them to your favorites.
                  </p>
                ) : (
                  favoriteObjects.map(country => (
                    <div 
                      key={country.name} 
                      className="fav-dashboard-item"
                      onClick={() => onSelectCountry(country)}
                    >
                      <div className="fav-item-left">
                        <img 
                          src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
                          alt="" 
                          className="fav-item-flag" 
                        />
                        <span className="fav-item-name">{country.name}</span>
                      </div>
                      <button
                        className="fav-item-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(country.name);
                        }}
                        title="Remove from favorites"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          // Guest / Locked View
          <div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              marginBottom: '20px'
            }}>
              <Lock size={28} />
            </div>
            
            <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Unlock Personal Collections</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px', maxWidth: '300px', lineHeight: '1.5' }}>
              Create an account to unlock custom trip planning, save custom collections, and persist favorites list across sessions!
            </p>
            
            <button 
              className="btn btn-primary" 
              onClick={onOpenAuth} 
              style={{ width: '100%', maxWidth: '240px', justifyContent: 'center', height: '46px' }}
            >
              Sign In / Register
            </button>
            
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                <Heart size={16} className="text-primary" style={{ flexShrink: 0 }} />
                <span><strong>Save Favorites:</strong> Curate countries in a dedicated, quick-access list.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                <FolderPlus size={16} className="text-primary" style={{ flexShrink: 0 }} />
                <span><strong>Custom Collections:</strong> Create trip agendas, regional lists, or themed compilations.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                <Sparkles size={16} className="text-primary" style={{ flexShrink: 0 }} />
                <span><strong>Data Synchronization:</strong> Everything is saved in your browser's local profile!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

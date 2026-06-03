import { useState, useEffect } from 'react';
import { countriesData } from './data/countriesData';
import CountryCard from './components/CountryCard';
import CountryModal from './components/CountryModal';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { 
  Search, 
  Heart, 
  User, 
  MapPin, 
  Compass, 
  Globe, 
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import './App.css';

function App() {
  // Global States
  const [countries, setCountries] = useState(countriesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  
  // Auth & Storage States
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  
  // Modals & Panels UI States
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Load user session and corresponding data on startup
  useEffect(() => {
    const sessionUser = localStorage.getItem('deshvidesh_current_user');
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setUser(parsedUser);
      loadUserData(parsedUser.username);
    } else {
      // Load Guest data
      const guestFavs = JSON.parse(localStorage.getItem('deshvidesh_guest_favorites') || '[]');
      const guestCols = JSON.parse(localStorage.getItem('deshvidesh_guest_collections') || '[]');
      setFavorites(guestFavs);
      setCollections(guestCols);
    }
  }, []);

  // Show dynamic toast notifications
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Helper to load specific user favorites and collections
  const loadUserData = (username) => {
    const users = JSON.parse(localStorage.getItem('deshvidesh_users') || '{}');
    const userData = users[username.toLowerCase()];
    if (userData) {
      setFavorites(userData.favorites || []);
      setCollections(userData.collections || []);
    }
  };

  // Synchronize favorites and collections state with local storage
  const syncDataWithStorage = (newFavs, newCols) => {
    if (user) {
      // Sync with user's specific account in database
      const users = JSON.parse(localStorage.getItem('deshvidesh_users') || '{}');
      const userKey = user.username.toLowerCase();
      if (users[userKey]) {
        users[userKey].favorites = newFavs;
        users[userKey].collections = newCols;
        localStorage.setItem('deshvidesh_users', JSON.stringify(users));
      }
    } else {
      // Sync with guest local storage
      localStorage.setItem('deshvidesh_guest_favorites', JSON.stringify(newFavs));
      localStorage.setItem('deshvidesh_guest_collections', JSON.stringify(newCols));
    }
  };

  // Auth Handling
  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('deshvidesh_current_user', JSON.stringify(loggedInUser));
    
    // Load registered user data
    const users = JSON.parse(localStorage.getItem('deshvidesh_users') || '{}');
    const userData = users[loggedInUser.username.toLowerCase()];
    
    if (userData) {
      // Merge guest favorites into user favorites, ensuring no duplicates
      const guestFavs = JSON.parse(localStorage.getItem('deshvidesh_guest_favorites') || '[]');
      const mergedFavs = Array.from(new Set([...(userData.favorites || []), ...guestFavs]));
      
      const userCols = userData.collections || [];
      
      setFavorites(mergedFavs);
      setCollections(userCols);
      
      // Save merged details
      userData.favorites = mergedFavs;
      users[loggedInUser.username.toLowerCase()] = userData;
      localStorage.setItem('deshvidesh_users', JSON.stringify(users));
      
      // Clean guest local storage
      localStorage.removeItem('deshvidesh_guest_favorites');
      localStorage.removeItem('deshvidesh_guest_collections');
      
      showToast(`Welcome back, ${loggedInUser.username}! Favorites loaded.`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('deshvidesh_current_user');
    
    // Reset back to guest data
    setFavorites([]);
    setCollections([]);
    
    showToast('Logged out successfully.');
  };

  // Favorites Toggling
  const handleToggleFavorite = (countryName) => {
    let newFavs;
    let isAdded = false;
    
    if (favorites.includes(countryName)) {
      newFavs = favorites.filter(name => name !== countryName);
      isAdded = false;
    } else {
      newFavs = [...favorites, countryName];
      isAdded = true;
    }
    
    setFavorites(newFavs);
    syncDataWithStorage(newFavs, collections);
    showToast(isAdded ? `Added ${countryName} to Favorites` : `Removed ${countryName} from Favorites`);
  };

  // Collections Actions
  const handleAddCollection = (name) => {
    if (!user) {
      showToast('Please sign in to create collections.', 'error');
      setIsAuthOpen(true);
      return;
    }

    const newCol = {
      id: 'col_' + Date.now(),
      name: name,
      countries: []
    };
    
    const newCols = [...collections, newCol];
    setCollections(newCols);
    syncDataWithStorage(favorites, newCols);
    showToast(`Created collection "${name}"`);
  };

  const handleDeleteCollection = (id) => {
    const colToDelete = collections.find(c => c.id === id);
    const newCols = collections.filter(c => c.id !== id);
    setCollections(newCols);
    syncDataWithStorage(favorites, newCols);
    showToast(`Deleted collection "${colToDelete?.name}"`);
  };

  const handleToggleCountryInCollection = (collectionId, countryName) => {
    const newCols = collections.map(col => {
      if (col.id === collectionId) {
        const isIncluded = col.countries.includes(countryName);
        let updatedCountries;
        if (isIncluded) {
          updatedCountries = col.countries.filter(c => c !== countryName);
          showToast(`Removed ${countryName} from ${col.name}`);
        } else {
          updatedCountries = [...col.countries, countryName];
          showToast(`Added ${countryName} to ${col.name}`);
        }
        return { ...col, countries: updatedCountries };
      }
      return col;
    });

    setCollections(newCols);
    syncDataWithStorage(favorites, newCols);
  };

  const handleRemoveFromCollection = (collectionId, countryName) => {
    handleToggleCountryInCollection(collectionId, countryName);
  };

  // Search & Filtering Logic
  const filteredCountries = countries.filter(country => {
    // 1. Continent filter
    const matchesContinent = selectedContinent === 'All' || country.continent === selectedContinent;
    
    // 2. Search query filter (matches name, capital, or tourist attractions)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      country.name.toLowerCase().includes(normalizedQuery) ||
      country.capital.toLowerCase().includes(normalizedQuery) ||
      country.attractions.some(attr => attr.toLowerCase().includes(normalizedQuery));
      
    return matchesContinent && matchesSearch;
  });

  // Sorting Logic
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'neighbors-count') {
      return b.neighbors.length - a.neighbors.length;
    }
    return 0;
  });

  // Unique list of continents
  const continents = ['All', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];

  return (
    <div className="container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header / Navigation */}
      <header className="header">
        <div className="header-container" style={{ width: '100%' }}>
          <div className="logo">
            <div className="logo-icon">
              <Globe size={20} />
            </div>
            DeshVidesh
          </div>

          <div className="nav-actions">
            {/* My Dashboard button */}
            <button 
              className="btn btn-secondary badge-container"
              onClick={() => setIsDashboardOpen(true)}
            >
              <Layers size={16} />
              Dashboard
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </button>

            {/* Auth Session controls */}
            {user ? (
              <button className="btn btn-accent" onClick={() => setIsDashboardOpen(true)}>
                <User size={16} />
                {user.username}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsAuthOpen(true)}>
                <User size={16} />
                Register / Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="hero">
        <h1 className="hero-title">Discover the World with <span>DeshVidesh</span></h1>
        <p className="hero-subtitle">
          Explore geographical coordinates, historical name origins, famous tourist spots, and interesting facts for all 194 countries of the world.
        </p>

        {/* Search, Filter & Sorting Bar */}
        <div className="controls-container">
          
          {/* Continent Filter Row */}
          <div className="continents-tabs">
            {continents.map(cont => (
              <button
                key={cont}
                className={`continent-tab ${selectedContinent === cont ? 'active' : ''}`}
                onClick={() => setSelectedContinent(cont)}
              >
                {cont}
              </button>
            ))}
          </div>

          {/* Search Input and Sort Selection */}
          <div className="search-sort-row">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by country, capital, or tourist attractions (e.g. Taj Mahal, Paris)..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sort-wrapper">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Alphabetical (A - Z)</option>
                <option value="name-desc">Alphabetical (Z - A)</option>
                <option value="neighbors-count">Borders Count (High - Low)</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* Main Countries Grid */}
      <main style={{ flexGrow: 1 }}>
        <div className="countries-grid">
          {sortedCountries.length > 0 ? (
            sortedCountries.map(country => (
              <CountryCard
                key={country.name}
                country={country}
                isFavorite={favorites.includes(country.name)}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => setSelectedCountry(country)}
              />
            ))
          ) : (
            <div className="no-results">
              <Globe size={48} className="no-results-icon" style={{ strokeWidth: 1 }} />
              <h3>No countries found matching your query</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                Try adjusting your search criteria or selecting a different continent.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} DeshVidesh. Built as a premium geographical educational portal.</p>
        <p className="footer-text">
          Features high-fidelity vector world map projections, historical etymologies, dynamic neighborhood graphs, and local session auth syncing.
        </p>
      </footer>

      {/* Country Detail Modal */}
      {selectedCountry && (
        <CountryModal
          country={selectedCountry}
          allCountries={countries}
          isFavorite={favorites.includes(selectedCountry.name)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedCountry(null)}
          onSelectCountry={(c) => setSelectedCountry(c)}
          user={user}
          collections={collections}
          onToggleCountryInCollection={handleToggleCountryInCollection}
        />
      )}

      {/* Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Personal Dashboard Drawer */}
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
        favorites={favorites}
        collections={collections}
        allCountries={countries}
        onToggleFavorite={handleToggleFavorite}
        onAddCollection={handleAddCollection}
        onDeleteCollection={handleDeleteCollection}
        onRemoveFromCollection={handleRemoveFromCollection}
        onOpenAuth={() => {
          setIsDashboardOpen(false);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setIsDashboardOpen(false);
        }}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Info size={16} />
            {toast.message}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;

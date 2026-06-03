import React, { useState, useEffect } from 'react';
import { estimateDailyCost } from '../data/countriesData';
import { 
  X, 
  Users, 
  Calendar, 
  DollarSign, 
  Save, 
  Info, 
  Globe, 
  Plane, 
  Wallet,
  Sparkles,
  Layers
} from 'lucide-react';

export default function BudgetCalculator({ 
  isOpen, 
  onClose, 
  country, 
  allCountries, 
  user, 
  collections, 
  onSaveBudgetToCollection 
}) {
  if (!isOpen) return null;

  // Selected country state (defaults to passed country or India)
  const [selectedCountryName, setSelectedCountryName] = useState(
    country ? country.name : (allCountries?.[0]?.name || 'India')
  );
  
  // Basic Inputs
  const [travelers, setTravelers] = useState(1);
  const [duration, setDuration] = useState(7);
  const [travelStyle, setTravelStyle] = useState('midrange'); // 'budget' | 'midrange' | 'luxury'
  
  // Custom Overrides
  const [flightCost, setFlightCost] = useState(0);
  const [extraCost, setExtraCost] = useState(0);
  
  // Save State
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  // Auto-select first collection if available when user changes
  useEffect(() => {
    if (collections && collections.length > 0) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [collections]);

  // Find selected country details
  const activeCountry = allCountries.find(
    c => c.name.toLowerCase() === selectedCountryName.toLowerCase()
  ) || country || allCountries?.[0];

  // Calculate costs
  const costBreakdown = estimateDailyCost(
    activeCountry.name, 
    activeCountry.continent, 
    travelStyle
  );

  const dailyEstimate = costBreakdown.dailyTotal;
  const numTravelers = parseInt(travelers) || 1;
  const numDays = parseInt(duration) || 1;

  // Conversion factor
  const USD_TO_INR = 83;
  const formatINR = (usdAmount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(usdAmount * USD_TO_INR);
  };

  // Calculate totals
  const dailyAccommodationTotal = costBreakdown.accommodation * numTravelers * numDays;
  const dailyFoodTotal = costBreakdown.food * numTravelers * numDays;
  const dailyTransportTotal = costBreakdown.transport * numTravelers * numDays;
  const dailyActivitiesTotal = costBreakdown.activities * numTravelers * numDays;
  const dailyMiscTotal = costBreakdown.misc * numTravelers * numDays;
  
  const flights = parseFloat(flightCost) || 0;
  const extras = parseFloat(extraCost) || 0;

  const totalDailyExpenses = dailyEstimate * numTravelers * numDays;
  const grandTotal = totalDailyExpenses + flights + extras;
  const costPerPerson = Math.round(grandTotal / numTravelers);

  // Compute percentages for the visual chart
  const hasCosts = grandTotal > 0;
  const pctAccommodation = hasCosts ? ((dailyAccommodationTotal / grandTotal) * 100).toFixed(1) : 0;
  const pctFood = hasCosts ? ((dailyFoodTotal / grandTotal) * 100).toFixed(1) : 0;
  const pctTransport = hasCosts ? ((dailyTransportTotal / grandTotal) * 100).toFixed(1) : 0;
  const pctActivities = hasCosts ? ((dailyActivitiesTotal / grandTotal) * 100).toFixed(1) : 0;
  const pctMisc = hasCosts ? ((dailyMiscTotal / grandTotal) * 100).toFixed(1) : 0;
  const pctFlights = hasCosts ? ((flights / grandTotal) * 100).toFixed(1) : 0;
  const pctExtras = hasCosts ? ((extras / grandTotal) * 100).toFixed(1) : 0;

  const handleSave = () => {
    if (!selectedCollectionId) return;
    
    const budgetData = {
      countryName: activeCountry.name,
      travelers: numTravelers,
      duration: numDays,
      travelStyle,
      flightCost: flights,
      extraCost: extras,
      totalCost: grandTotal,
      costPerPerson,
      totalCostINR: formatINR(grandTotal),
      costPerPersonINR: formatINR(costPerPerson)
    };

    onSaveBudgetToCollection(selectedCollectionId, budgetData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close calculator">
          <X size={20} />
        </button>

        {/* Top Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
          padding: '24px 32px', 
          color: 'white',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 800 }}>
            <Wallet size={24} />
            Interactive Travel Budget Planner
          </h2>
          <p style={{ opacity: 0.9, fontSize: '13px', marginTop: '4px' }}>
            Estimate stay, food, activities, and flight budgets for your next trip.
          </p>
        </div>

        {/* Modal Layout */}
        <div className="modal-body" style={{ padding: '24px 32px' }}>
          
          {/* Left Column - Input Panels */}
          <div className="modal-left-column" style={{ gap: '20px' }}>
            
            {/* Input Group: Destination Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} className="text-primary" />
                Select Destination
              </label>
              <select
                className="sort-select"
                value={selectedCountryName}
                onChange={(e) => setSelectedCountryName(e.target.value)}
                style={{ width: '100%', backgroundPosition: 'right 14px center' }}
              >
                {allCountries.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.continent})
                  </option>
                ))}
              </select>
            </div>

            {/* Input Group: Travelers Count */}
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} className="text-primary" />
                  Travelers
                </span>
                <span className="text-primary">{numTravelers} {numTravelers === 1 ? 'Person' : 'People'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="search-input"
                style={{ height: '6px', padding: 0, cursor: 'pointer', appearance: 'auto' }}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              />
            </div>

            {/* Input Group: Trip Duration */}
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} className="text-primary" />
                  Trip Duration
                </span>
                <span className="text-primary">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                className="search-input"
                style={{ height: '6px', padding: 0, cursor: 'pointer', appearance: 'auto' }}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {/* Input Group: Travel Style */}
            <div>
              <label className="form-label">Select Travel Style</label>
              <div className="continents-tabs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingBottom: 0 }}>
                <button
                  type="button"
                  className={`continent-tab ${travelStyle === 'budget' ? 'active' : ''}`}
                  onClick={() => setTravelStyle('budget')}
                  style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}
                >
                  Budget
                </button>
                <button
                  type="button"
                  className={`continent-tab ${travelStyle === 'midrange' ? 'active' : ''}`}
                  onClick={() => setTravelStyle('midrange')}
                  style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}
                >
                  Comfort
                </button>
                <button
                  type="button"
                  className={`continent-tab ${travelStyle === 'luxury' ? 'active' : ''}`}
                  onClick={() => setTravelStyle('luxury')}
                  style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}
                >
                  Premium
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <Info size={12} />
                Estimated standard base rate: <strong>${dailyEstimate} / day per person</strong>
              </div>
            </div>

            {/* Custom Extras overrides */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="flight-cost">
                  <Plane size={13} style={{ marginRight: '4px' }} />
                  Flights (Total)
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="flight-cost"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="form-input"
                    value={flightCost === 0 ? '' : flightCost}
                    onChange={(e) => setFlightCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    style={{ paddingLeft: '28px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="misc-extra">
                  Other Costs
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="misc-extra"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="form-input"
                    value={extraCost === 0 ? '' : extraCost}
                    onChange={(e) => setExtraCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    style={{ paddingLeft: '28px' }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Results, Visual charts, and Save panel */}
          <div className="modal-right-column" style={{ justifyContent: 'space-between' }}>
            
            {/* Total Budget Outputs */}
            <div style={{ textAlign: 'center', backgroundColor: '#e0e7ff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #c7d2fe' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--accent-primary)' }}>
                Total Estimated Budget
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1 }}>
                ${grandTotal.toLocaleString()}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px', lineHeight: 1.2 }}>
                {formatINR(grandTotal)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Per traveler: <strong>${costPerPerson.toLocaleString()} / {formatINR(costPerPerson)}</strong> ({numTravelers} traveler/s)
              </div>
            </div>

            {/* Stacked allocation chart visualizer */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Expense Allocation Breakdown
              </div>
              
              {/* Stacked bar container */}
              <div style={{ 
                height: '24px', 
                width: '100%', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-full)', 
                overflow: 'hidden', 
                display: 'flex',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {dailyAccommodationTotal > 0 && <div style={{ width: `${pctAccommodation}%`, backgroundColor: '#4f46e5' }} title={`Stay: ${pctAccommodation}%`}></div>}
                {dailyFoodTotal > 0 && <div style={{ width: `${pctFood}%`, backgroundColor: '#06b6d4' }} title={`Food: ${pctFood}%`}></div>}
                {dailyTransportTotal > 0 && <div style={{ width: `${pctTransport}%`, backgroundColor: '#10b981' }} title={`Transit: ${pctTransport}%`}></div>}
                {dailyActivitiesTotal > 0 && <div style={{ width: `${pctActivities}%`, backgroundColor: '#f59e0b' }} title={`Activities: ${pctActivities}%`}></div>}
                {dailyMiscTotal > 0 && <div style={{ width: `${pctMisc}%`, backgroundColor: '#a855f7' }} title={`Misc: ${pctMisc}%`}></div>}
                {flights > 0 && <div style={{ width: `${pctFlights}%`, backgroundColor: '#ef4444' }} title={`Flights: ${pctFlights}%`}></div>}
                {extras > 0 && <div style={{ width: `${pctExtras}%`, backgroundColor: '#64748b' }} title={`Extras: ${pctExtras}%`}></div>}
              </div>

              {/* Color legend grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', marginTop: '10px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'inline-block' }}></span>
                  Stay: ${dailyAccommodationTotal.toLocaleString()} / {formatINR(dailyAccommodationTotal)} ({pctAccommodation}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'inline-block' }}></span>
                  Food: ${dailyFoodTotal.toLocaleString()} / {formatINR(dailyFoodTotal)} ({pctFood}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                  Transit: ${dailyTransportTotal.toLocaleString()} / {formatINR(dailyTransportTotal)} ({pctTransport}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
                  Excursions: ${dailyActivitiesTotal.toLocaleString()} / {formatINR(dailyActivitiesTotal)} ({pctActivities}%)
                </div>
                {flights > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                    Flights: ${flights.toLocaleString()} / {formatINR(flights)} ({pctFlights}%)
                  </div>
                )}
                {extras > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' }}></span>
                    Extras: ${extras.toLocaleString()} / {formatINR(extras)} ({pctExtras}%)
                  </div>
                )}
              </div>
            </div>

            {/* Save budget panel */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                // Logged In Save Setup
                collections && collections.length > 0 ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        className="sort-select"
                        value={selectedCollectionId}
                        onChange={(e) => setSelectedCollectionId(e.target.value)}
                        style={{ flex: 1, padding: '10px 12px', fontSize: '13px', backgroundPosition: 'right 12px center' }}
                      >
                        {collections.map(col => (
                          <option key={col.id} value={col.id}>
                            Save to "{col.name}"
                          </option>
                        ))}
                      </select>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleSave}
                        style={{ height: '38px', gap: '6px', fontSize: '13px', padding: '0 16px' }}
                      >
                        <Save size={14} />
                        Save Itinerary
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
                    Create a collection in your dashboard first to save this budget planner profile.
                  </div>
                )
              ) : (
                // Guest Warning
                <div style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px dashed var(--accent-primary)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '10px', 
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={16} className="text-primary" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Registered users</strong> can save budget itinerary sheets directly to their folders.
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

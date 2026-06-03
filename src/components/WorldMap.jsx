import React from 'react';
import { getMapCoords } from '../data/countriesData';

export default function WorldMap({ lat, lng, countryName }) {
  // Get percentage coordinates (0 to 100) for mapping
  const { x, y } = getMapCoords(lat, lng);

  return (
    <div className="map-section">
      <div className="modal-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        Global Location
      </div>
      <div className="map-wrapper">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="svg-grid" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
          <defs>
            <pattern id="grid" width="5" height="10" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 10" fill="none" stroke="var(--accent-primary)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
        
        <svg viewBox="0 0 1000 500" className="map-svg">
          {/* Stylized low-poly SVG World Map paths */}
          <g className="map-continents">
            {/* North America */}
            <path
              className="map-land"
              d="M 120 70 L 160 60 L 220 50 L 250 80 L 270 120 L 220 160 L 260 190 L 230 220 L 190 220 L 160 260 L 150 280 L 140 270 L 150 240 L 130 210 L 90 200 L 70 150 L 80 110 L 100 90 Z"
            />
            {/* Greenland */}
            <path
              className="map-land"
              d="M 280 40 L 330 30 L 360 50 L 330 90 L 290 80 Z"
            />
            {/* South America */}
            <path
              className="map-land"
              d="M 230 220 L 260 210 L 290 240 L 330 270 L 340 310 L 320 370 L 290 420 L 280 440 L 270 440 L 270 410 L 250 350 L 230 280 L 220 250 Z"
            />
            {/* Africa */}
            <path
              className="map-land"
              d="M 430 210 L 480 180 L 510 180 L 550 200 L 580 230 L 590 260 L 560 310 L 530 360 L 500 400 L 490 410 L 480 380 L 480 340 L 450 320 L 430 290 L 410 260 L 410 230 Z"
            />
            {/* Madagascar */}
            <path
              className="map-land"
              d="M 580 330 L 590 320 L 600 340 L 590 370 L 580 360 Z"
            />
            {/* Europe */}
            <path
              className="map-land"
              d="M 420 170 L 450 140 L 440 100 L 460 70 L 480 60 L 500 80 L 510 110 L 480 140 L 500 170 L 450 180 Z"
            />
            {/* Asia */}
            <path
              className="map-land"
              d="M 500 170 L 480 140 L 510 110 L 500 80 L 560 60 L 650 50 L 730 60 L 800 70 L 850 100 L 880 140 L 860 170 L 820 200 L 840 230 L 790 270 L 760 270 L 710 240 L 680 250 L 630 270 L 600 240 L 580 230 L 550 200 Z"
            />
            {/* India & Indochina detailed polygons */}
            <path
              className="map-land"
              d="M 640 210 L 670 210 L 680 250 L 660 270 L 650 240 Z"
            />
            <path
              className="map-land"
              d="M 710 210 L 740 210 L 750 260 L 730 270 L 720 240 Z"
            />
            {/* Great Britain & Ireland */}
            <path
              className="map-land"
              d="M 400 100 L 410 90 L 420 110 L 410 130 Z"
            />
            {/* Japan */}
            <path
              className="map-land"
              d="M 870 120 L 880 110 L 890 140 L 880 160 Z"
            />
            {/* Indonesia & Malaysia */}
            <path
              className="map-land"
              d="M 720 280 L 770 280 L 830 300 L 830 320 L 780 320 L 730 300 Z"
            />
            {/* Australia */}
            <path
              className="map-land"
              d="M 780 350 L 830 340 L 870 350 L 890 390 L 860 420 L 800 420 L 760 380 Z"
            />
            {/* New Zealand */}
            <path
              className="map-land"
              d="M 910 420 L 920 410 L 930 440 L 920 450 Z"
            />
            {/* Iceland */}
            <path
              className="map-land"
              d="M 370 70 L 390 60 L 400 70 L 380 80 Z"
            />
          </g>
        </svg>

        {/* Pulsing Locator Pin */}
        <div 
          className="map-marker" 
          style={{ 
            left: `${x}%`, 
            top: `${y}%`,
            transition: 'left 0.5s ease-out, top 0.5s ease-out'
          }}
          title={countryName}
        >
          <div className="marker-pulse"></div>
          <div className="marker-dot"></div>
        </div>
      </div>
    </div>
  );
}

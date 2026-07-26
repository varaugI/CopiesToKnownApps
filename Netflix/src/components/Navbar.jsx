import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROFILES } from '../data/mockData';

export default function Navbar({ onChangeProfileClick }) {
  const {
    currentProfile,
    setCurrentProfile,
    searchQuery,
    setSearchQuery,
    selectedCategoryTab,
    setSelectedCategoryTab
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab) => {
    setSelectedCategoryTab(tab);
    setSearchQuery('');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div className="logo-text" onClick={() => handleNavClick('Home')}>
          STREAMFLIX
        </div>
        <ul className="nav-links">
          {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((tab) => (
            <li
              key={tab}
              className={`nav-link ${selectedCategoryTab === tab && !searchQuery ? 'active' : ''}`}
              onClick={() => handleNavClick(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        {/* Instant Search Bar */}
        <div className={`search-box ${isSearchOpen || searchQuery ? 'open' : ''}`}>
          <Search
            size={18}
            color="#FFF"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsSearchOpen(prev => !prev)}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Titles, people, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <Bell
            size={20}
            color="#FFF"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsNotificationsOpen(prev => !prev)}
          />
          {isNotificationsOpen && (
            <div className="profile-dropdown" style={{ right: 0, width: 260 }}>
              <div style={{ fontSize: 13, fontWeight: 700, borderBottom: '1px solid #333', paddingBottom: 8 }}>
                Notifications
              </div>
              <div style={{ fontSize: 12, color: '#AAA' }}>
                🎬 <strong>Cyber Chronicles 2099</strong> Season 3 is now available!
              </div>
              <div style={{ fontSize: 12, color: '#AAA', marginTop: 8 }}>
                🔥 <strong>The Eclipse Protocol</strong> is trending in Top 10 Today.
              </div>
            </div>
          )}
        </div>

        {/* Profile Switcher Menu */}
        <div style={{ position: 'relative' }}>
          <div
            className="profile-avatar-btn"
            onClick={() => setIsProfileDropdownOpen(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {isProfileDropdownOpen && (
            <div className="profile-dropdown" onMouseLeave={() => setIsProfileDropdownOpen(false)}>
              <div style={{ fontSize: 11, color: '#888', paddingLeft: 8 }}>Switch Profiles</div>
              {PROFILES.filter(p => p.id !== currentProfile.id).map(profile => (
                <div
                  key={profile.id}
                  className="profile-option"
                  onClick={() => {
                    setCurrentProfile(profile);
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  <img src={profile.avatar} alt={profile.name} className="profile-option-img" />
                  <span className="profile-option-name">{profile.name}</span>
                </div>
              ))}
              <div
                className="profile-option"
                style={{ borderTop: '1px solid #333', marginTop: 6, paddingTop: 10 }}
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  if (onChangeProfileClick) onChangeProfileClick();
                }}
              >
                <User size={16} color="#FFF" />
                <span className="profile-option-name">Manage Profiles</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { PROFILES } from '../data/mockData';

export default function ProfileSelector({ onSelect }) {
  const { setCurrentProfile } = useApp();

  const handleSelect = (profile) => {
    setCurrentProfile(profile);
    if (onSelect) onSelect();
  };

  return (
    <div className="profiles-screen">
      <h1 className="profiles-title">Who's watching?</h1>
      <div className="profiles-grid">
        {PROFILES.map(profile => (
          <div
            key={profile.id}
            className="profile-card"
            onClick={() => handleSelect(profile)}
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="profile-card-avatar"
            />
            <span className="profile-card-name">{profile.name}</span>
          </div>
        ))}
      </div>
      <button className="manage-profiles-btn">Manage Profiles</button>
    </div>
  );
}

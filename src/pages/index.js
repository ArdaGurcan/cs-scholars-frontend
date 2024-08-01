import React, { useState } from 'react';
import Tabs from '@/components/Tabs';
import Scholars from '@/components/Scholars';
import Locations from '@/components/Locations';
import Miscellaneous from '@/components/Miscellaneous';
import Profile from '@/components/Profile';
import LocationProfile from '@/components/LocationProfile';

const App = () => {
  const [activeTab, setActiveTab] = useState('Scholars');
  const [selectedScholar, setSelectedScholar] = useState('null');
  const [selectedLocation, setSelectedLocation] = useState('null');

  const handleSelectScholar = (scholarId) => {
    setSelectedScholar(scholarId);
    setSelectedLocation('null');
  };

  const handleSelectLocation = (locationId) => {
    setSelectedLocation(locationId);
    setSelectedScholar('null');
  };

  const renderTabContent = () => {
    if (selectedScholar != 'null') {
      return (
        <Profile 
          id={selectedScholar} 
          onBack={() => setSelectedScholar('null')} 
          onSelectLocation={handleSelectLocation}
        />
      );
    }
    if (selectedLocation != 'null') {
      return (
        <LocationProfile 
          id={selectedLocation} 
          onBack={() => setSelectedLocation('null')} 
          onSelectScholar={handleSelectScholar}
        />
      );
    }

    switch (activeTab) {
      case 'Scholars':
        return <Scholars onSelectScholar={handleSelectScholar} />;
      case 'Locations':
        return <Locations onSelectLocation={handleSelectLocation} />;

      case 'Miscellaneous':
        return <Miscellaneous />;
      default:
        return <Scholars onSelectScholar={handleSelectScholar} />;
    }
  };

  return (
    <div className="container mt-4">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default App;
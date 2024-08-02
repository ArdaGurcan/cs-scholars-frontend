import React from 'react';
import { Nav } from 'react-bootstrap';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Scholars', 'Locations'];

  return (
    <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
      {tabs.map((tab) => (
        <Nav.Item key={tab}>
          <Nav.Link eventKey={tab}>{tab}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Tabs;

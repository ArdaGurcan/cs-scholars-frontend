// components/LocationProfile.js
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Table, Button } from 'react-bootstrap';

const LocationProfile = ({ id, onBack, onSelectScholar }) => {  const [profile, setProfile] = useState('null');

  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/${id}/profile`)
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching location profile:', error));
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Button onClick={onBack} style={{ float: 'right' }}>Go Back</Button>
        <h1>{profile.loc_name}</h1>
      </div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Location Information</Card.Title>
          <ListGroup variant="flush">
            {profile.city && <ListGroup.Item>City: {profile.city}</ListGroup.Item>}
            {profile.state && <ListGroup.Item>State: {profile.state}</ListGroup.Item>}
            <ListGroup.Item>Country: {profile.country}</ListGroup.Item>
            <ListGroup.Item>Total Scholars: {profile.scholar_count}</ListGroup.Item>
            <ListGroup.Item>Total Publications: {profile.publication_count}</ListGroup.Item>
            <ListGroup.Item>Total Grants: {profile.grant_count}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {profile.scholars && profile.scholars.length > 0 &&
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Scholars</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Major</th>
                  <th>H-index</th>
                </tr>
              </thead>
              <tbody>
                {profile.scholars.map((scholar) => (
                  <tr key={scholar.pid}>
                    <td>
                      <a href="#" onClick={() => onSelectScholar(scholar.pid)}>
                        {scholar.name}
                      </a>
                    </td>
                    <td>{scholar.major}</td>
                    <td>{scholar.hindex}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      }
    </div>
  );
};

export default LocationProfile;
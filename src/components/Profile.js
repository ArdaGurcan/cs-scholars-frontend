import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Table, Button, Row } from 'react-bootstrap';

const Profile = ({ id, onBack, onSelectLocation }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/scholar/${id}/profile`)
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error));
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Button onClick={onBack} style={{ float: 'right' }}>Go Back</Button>
        <h1>{profile.name}</h1>
      </div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Basic Information</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Major: {profile.major}</ListGroup.Item>
            <ListGroup.Item>H-index: {profile.hindex}</ListGroup.Item>
            <ListGroup.Item>
              Location: 
              <a href="#" onClick={() => onSelectLocation(profile.location_id)}>
                {profile.location}
              </a>
            </ListGroup.Item>
            <ListGroup.Item>Publications: {profile.publication_count}</ListGroup.Item>
            <ListGroup.Item>Grants: {profile.grant_count}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {profile.publications && profile.publications.length > 0 &&
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Publications</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>PMID</th>
                  <th>DOI</th>
                </tr>
              </thead>
              <tbody>
                {profile.publications.map((pub) => (
                  <tr key={pub.pubid}>
                    <td>{pub.pmid != 0.0 ? pub.pmid : '-'}</td>
                    <td>{pub.doi}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      }

      {profile.grants && profile.grants.length > 0 &&
        <Card>
          <Card.Body>
            <Card.Title>Grants</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Grant ID</th>
                  <th>Budget Start</th>
                </tr>
              </thead>
              <tbody>
                {profile.grants.map((grant) => (
                  <tr key={grant.grantid}>
                    <td>{grant.grantid}</td>
                    <td>{new Date(grant.budget_start).toLocaleDateString()}</td>
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

export default Profile;
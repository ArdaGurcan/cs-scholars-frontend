import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Table, Button, Row, Form, Col, Container } from 'react-bootstrap';
import axios from 'axios';

const Profile = ({ id, onBack, onSelectLocation }) => {
  const [profile, setProfile] = useState(null);
  const [newHIndex, setNewHIndex] = useState('');
  const [publication, setPublication] = useState({ pmid: '', doi: '' });
  const [grant, setGrant] = useState({ budgetStart: '' });
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/scholar/${id}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateHIndex = async () => {
    try {
      await axios.put(`http://localhost:8080/api/scholar/update-hindex`, null, {
        params: { name: profile.name, newHindex: newHIndex }
      });
      setProfile({ ...profile, hindex: newHIndex });
    } catch (error) {
      console.error('Error updating h-index:', error);
    }
  };

  const addPublication = async () => {
    try {
      await axios.post(`http://localhost:8080/api/scholar/add-publication`, null, {
        params: { ...publication, authorName: profile.name }
      });
      fetchProfile();
    } catch (error) {
      console.error('Error adding publication:', error);
    }
  };

  const assignGrant = async () => {
    try {
      await axios.post(`http://localhost:8080/api/scholar/assign-grant`, null, {
        params: { budgetStart: grant.budgetStart, personName: profile.name }
      });
      fetchProfile();
    } catch (error) {
      console.error('Error assigning grant:', error);
    }
  };

  const changeLocation = async () => {
    try {
      await axios.put(`http://localhost:8080/api/scholar/change-location`, null, {
        params: { personName: profile.name, locName: newLocation }
      });
      setProfile({ ...profile, location: newLocation });
    } catch (error) {
      console.error('Error changing location:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{profile.name}</h1>
        <Button onClick={onBack}>Go Back</Button>
      </div>

      <BasicInfo profile={profile} onSelectLocation={onSelectLocation} />
      <PublicationsTable publications={profile.publications} />
      <GrantsTable grants={profile.grants} />
      
      <UpdateHIndexForm newHIndex={newHIndex} setNewHIndex={setNewHIndex} onUpdate={updateHIndex} />
      <AddPublicationForm publication={publication} setPublication={setPublication} onAdd={addPublication} />
      <AssignGrantForm grant={grant} setGrant={setGrant} onAssign={assignGrant} />
      <ChangeLocationForm newLocation={newLocation} setNewLocation={setNewLocation} onChange={changeLocation} />
    </Container>
  );
};

const BasicInfo = ({ profile, onSelectLocation }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Basic Information</Card.Title>
      <ListGroup variant="flush">
        <ListGroup.Item>Major: {profile.major}</ListGroup.Item>
        <ListGroup.Item>H-index: {profile.hindex}</ListGroup.Item>
        <ListGroup.Item>
          Location: <a href="#" onClick={() => onSelectLocation(profile.location_id)}>{profile.location}</a>
        </ListGroup.Item>
        <ListGroup.Item>Publications: {profile.publication_count}</ListGroup.Item>
        <ListGroup.Item>Grants: {profile.grant_count}</ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
);

const PublicationsTable = ({ publications }) => (
  publications && publications.length > 0 && (
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
            {publications.map((pub) => (
              <tr key={pub.pubid}>
                <td>{pub.pmid != 0.0 ? pub.pmid : '-'}</td>
                <td>{pub.doi}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
);

const GrantsTable = ({ grants }) => (
  grants && grants.length > 0 && (
    <Card className="mb-4">
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
            {grants.map((grant) => (
              <tr key={grant.grantid}>
                <td>{grant.grantid}</td>
                <td>{new Date(grant.budget_start).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
);

const UpdateHIndexForm = ({ newHIndex, setNewHIndex, onUpdate }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Update H-Index</Card.Title>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">New H-Index:</Form.Label>
          <Col sm="8">
            <Form.Control type="number" value={newHIndex} onChange={(e) => setNewHIndex(e.target.value)} />
          </Col>
          <Col sm="2">
            <Button onClick={onUpdate}>Update</Button>
          </Col>
        </Form.Group>
      </Form>
    </Card.Body>
  </Card>
);

const AddPublicationForm = ({ publication, setPublication, onAdd }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Add Publication</Card.Title>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">PMID:</Form.Label>
          <Col sm="4">
            <Form.Control type="text" value={publication.pmid} onChange={(e) => setPublication({...publication, pmid: e.target.value})} />
          </Col>
          <Form.Label column sm="2">DOI:</Form.Label>
          <Col sm="4">
            <Form.Control type="text" value={publication.doi} onChange={(e) => setPublication({...publication, doi: e.target.value})} />
          </Col>
        </Form.Group>
        <Button onClick={onAdd}>Add Publication</Button>
      </Form>
    </Card.Body>
  </Card>
);

const AssignGrantForm = ({ grant, setGrant, onAssign }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Assign Grant</Card.Title>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">Budget Start:</Form.Label>
          <Col sm="8">
            <Form.Control type="date" value={grant.budgetStart} onChange={(e) => setGrant({...grant, budgetStart: e.target.value})} />
          </Col>
          <Col sm="2">
            <Button onClick={onAssign}>Assign Grant</Button>
          </Col>
        </Form.Group>
      </Form>
    </Card.Body>
  </Card>
);

const ChangeLocationForm = ({ newLocation, setNewLocation, onChange }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Change Location</Card.Title>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">New Location:</Form.Label>
          <Col sm="8">
            <Form.Control type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
          </Col>
          <Col sm="2">
            <Button onClick={onChange}>Change Location</Button>
          </Col>
        </Form.Group>
      </Form>
    </Card.Body>
  </Card>
);

export default Profile;
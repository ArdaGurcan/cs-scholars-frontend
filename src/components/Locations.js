import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';

const Locations = ({ onSelectLocation }) => {
  const [locations, setLocations] = useState([]);
  const [major, setMajor] = useState('');
  const [sortBy, setSortBy] = useState('by-people-count');
  
  useEffect(() => {
    setLocations([]);
  }, [sortBy]);

  const fetchLocations = async () => {
    const baseURL = 'http://localhost:8080/api/locations';
    const endpoint = sortBy;
    console.log("fetching locations");
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: {
        major,
      },
    });
    console.log(response.data);
    setLocations(response.data);
  };

  return (
    <Container>
      <h1>Locations</h1>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="major">
              <Form.Label>Major</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sortBy">
              <Form.Label>Sort By</Form.Label>
              <Form.Control
                as="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="by-people-count">Number of People with Major</option>
                <option value="by-grant-count">Number of Grants</option>
                <option value="by-max-hindex">Max H-Index</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={fetchLocations}>
          Search
        </Button>
      </Form>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Location</th>
            <th>{sortBy === 'by-people-count' ? 'Number of People' : sortBy === 'by-grant-count' ? 'Number of Grants' : 'Max H-Index'}</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location[0]}>
              <td><a href="#" onClick={() =>  onSelectLocation(location[0])}>{location[1]}</a></td>
              <td>{location[2]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Locations;

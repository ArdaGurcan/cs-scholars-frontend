import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup, Container, Row, Col, Table } from 'react-bootstrap';

const Scholars = ({ onSelectScholar }) => {
  const [scholars, setScholars] = useState([]);
  const [location, setLocation] = useState('');
  const [major, setMajor] = useState('');
  const [sortBy, setSortBy] = useState('publication-count');
  const [noGrants, setNoGrants] = useState(false);

  useEffect(() => {
    setScholars([]);
  }, [sortBy]);

  useEffect(() => {
    if (noGrants)
      setSortBy('hindex');
  }, [noGrants]);

  const fetchScholars = async () => {
    const baseURL = 'http://localhost:8080/api/scholar';
    const endpoint = noGrants ? 'publications-no-grants' : sortBy;
    console.log("fetching scholars");
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: {
        location,
        major,
      },
    });
    console.log(response.data);
    setScholars(response.data);
  };

  return (
    <Container>
      <h1>Scholars</h1>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          </Col>
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
                <option value="publication-count">Publication Count</option>
                <option value="hindex">H-Index</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="noGrants">
          <Form.Check
            type="checkbox"
            label="Only Publications No Grants"
            checked={noGrants}
            onChange={(e) => setNoGrants(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" onClick={fetchScholars}>
          Search
        </Button>
      </Form>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Major Area</th>
            <th>{sortBy === 'publication-count' ? 'Publication Count' : 'H-Index'}</th>
          </tr>
        </thead>
        <tbody>
          {scholars.map((scholar) => (
            <tr key={scholar[0]}>
              <td><a onClick={() => onSelectScholar(scholar[0])}>{scholar[1]}</a></td>
              <td>{scholar[2]}</td>
              <td>{scholar[3]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Scholars;

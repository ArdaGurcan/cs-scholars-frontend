import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';

const Locations = ({ onSelectLocation }) => {
  const [locations, setLocations] = useState([]);
  const [searchParams, setSearchParams] = useState({
    major: '',
    sortBy: 'by-people-count'
  });

  useEffect(() => {
    setLocations([]);
  }, [searchParams.sortBy]);

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const fetchLocations = async () => {
    const baseURL = 'http://localhost:8080/api/locations';
    try {
      const response = await axios.get(`${baseURL}/${searchParams.sortBy}`, {
        params: { major: searchParams.major },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Locations</h1>
      <SearchForm 
        searchParams={searchParams} 
        onParamChange={handleSearchParamChange} 
        onSearch={fetchLocations} 
      />
      <LocationTable 
        locations={locations} 
        sortBy={searchParams.sortBy} 
        onSelectLocation={onSelectLocation} 
      />
    </Container>
  );
};

const SearchForm = ({ searchParams, onParamChange, onSearch }) => (
  <Form className="mb-4">
    <Row>
      <Col md={6}>
        <Form.Group controlId="major">
          <Form.Label>Major</Form.Label>
          <Form.Control
            type="text"
            name="major"
            placeholder="Enter major"
            value={searchParams.major}
            onChange={onParamChange}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="sortBy">
          <Form.Label>Sort By</Form.Label>
          <Form.Control
            as="select"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={onParamChange}
          >
            <option value="by-people-count">Number of People with Major</option>
            <option value="by-grant-count">Number of Grants</option>
            <option value="by-max-hindex">Max H-Index</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
    <Button variant="primary" onClick={onSearch} className="mt-2">
      Search
    </Button>
  </Form>
);

const LocationTable = ({ locations, sortBy, onSelectLocation }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Location</th>
        <th>{getSortByLabel(sortBy)}</th>
      </tr>
    </thead>
    <tbody>
      {locations.map((location) => (
        <tr key={location[0]}>
          <td>
            <a href="#" onClick={() => onSelectLocation(location[0])}>
              {location[1]}
            </a>
          </td>
          <td>{location[2]}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const getSortByLabel = (sortBy) => {
  switch (sortBy) {
    case 'by-people-count':
      return 'Number of People';
    case 'by-grant-count':
      return 'Number of Grants';
    case 'by-max-hindex':
      return 'Max H-Index';
    default:
      return '';
  }
};

export default Locations;
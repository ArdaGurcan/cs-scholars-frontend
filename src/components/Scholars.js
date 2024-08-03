import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';

const Scholars = ({ onSelectScholar }) => {
  const [scholars, setScholars] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    major: '',
    sortBy: 'publication-count',
    noGrants: false
  });
  const [newScholar, setNewScholar] = useState({
    name: '',
    major: '',
    hindex: '',
    location: ''
  });

  useEffect(() => {
    setScholars([]);
  }, [searchParams.sortBy]);

  useEffect(() => {
    if (searchParams.noGrants) {
      setSearchParams(prev => ({ ...prev, sortBy: 'hindex' }));
    }
  }, [searchParams.noGrants]);

  const handleSearchParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewScholarChange = (e) => {
    const { name, value } = e.target;
    setNewScholar(prev => ({ ...prev, [name]: value }));
  };

  const fetchScholars = async () => {
    const baseURL = 'http://localhost:8080/api/scholar';
    const endpoint = searchParams.noGrants ? 'publications-no-grants' : searchParams.sortBy;
    try {
      const response = await axios.get(`${baseURL}/${endpoint}`, {
        params: {
          location: searchParams.location,
          major: searchParams.major,
        },
      });
      setScholars(response.data);
    } catch (error) {
      console.error('Error fetching scholars:', error);
    }
  };

  const addNewScholar = async () => {
    try {
      await axios.post('http://localhost:8080/api/scholar/add', null, {
        params: newScholar
      });
      setNewScholar({ name: '', major: '', hindex: '', location: '' });
      fetchScholars();
    } catch (error) {
      console.error('Error adding new scholar:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Scholars</h1>
      <SearchForm 
        searchParams={searchParams} 
        onParamChange={handleSearchParamChange} 
        onSearch={fetchScholars} 
      />
      <AddScholarForm 
        newScholar={newScholar} 
        onScholarChange={handleNewScholarChange} 
        onAddScholar={addNewScholar} 
      />
      <ScholarTable 
        scholars={scholars} 
        sortBy={searchParams.sortBy} 
        onSelectScholar={onSelectScholar} 
      />
    </Container>
  );
};

const SearchForm = ({ searchParams, onParamChange, onSearch }) => (
  <Form className="mb-4">
    <Row>
      <Col md={4}>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter location"
            value={searchParams.location}
            onChange={onParamChange}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
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
      <Col md={4}>
        <Form.Group controlId="sortBy">
          <Form.Label>Sort By</Form.Label>
          <Form.Control
            as="select"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={onParamChange}
          >
            <option value="publication-count">Publication Count</option>
            <option value="hindex">H-Index</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
    <Form.Group controlId="noGrants" className="mt-2">
      <Form.Check
        type="checkbox"
        label="Only Publications No Grants"
        name="noGrants"
        checked={searchParams.noGrants}
        onChange={onParamChange}
      />
    </Form.Group>
    <Button variant="primary" onClick={onSearch} className="mt-2">
      Search
    </Button>
  </Form>
);

const AddScholarForm = ({ newScholar, onScholarChange, onAddScholar }) => (
  <Form className="mb-4">
    <h3>Add New Scholar</h3>
    <Row>
      <Col md={3}>
        <Form.Group controlId="newName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={newScholar.name}
            onChange={onScholarChange}
            data-testid="new-scholar-name"
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group controlId="newMajor">
          <Form.Label>Major</Form.Label>
          <Form.Control
            type="text"
            name="major"
            placeholder="Enter major"
            value={newScholar.major}
            onChange={onScholarChange}
            data-testid="new-scholar-major"
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group controlId="newHIndex">
          <Form.Label>H-Index</Form.Label>
          <Form.Control
            type="number"
            name="hindex"
            placeholder="Enter h-index"
            value={newScholar.hindex}
            onChange={onScholarChange}
            data-testid="new-scholar-hindex"
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group controlId="newLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter location"
            value={newScholar.location}
            onChange={onScholarChange}
            data-testid="new-scholar-location"
          />
        </Form.Group>
      </Col>
    </Row>
    <Button variant="primary" onClick={onAddScholar} className="mt-2" data-testid="add-new-scholar-button">
      Add New Scholar
    </Button>
  </Form>
);

const ScholarTable = ({ scholars, sortBy, onSelectScholar }) => (
  <Table striped bordered hover>
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
          <td>
            <a href="#" onClick={() => onSelectScholar(scholar[0])}>
              {scholar[1]}
            </a>
          </td>
          <td>{scholar[2]}</td>
          <td>{scholar[3]}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default Scholars;
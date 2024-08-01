import React, { useState } from 'react';
import axios from 'axios';

const PeopleByPublicationCount = () => {
  const [major, setMajor] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8080/api/scholar/hindex', {
        params: { major, location }
      });
      setResults(response.data);
    } catch (err) {
      setError('An error occurred while fetching the data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>People by Publication Count</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="major">Major:</label>
          <input
            type="text"
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location Name:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>Publication Count</th>
            </tr>
          </thead>
          <tbody>
            {results.map((person, index) => (
              <tr key={index}>
                <td>{person[0]}</td>
                <td>{person[1]}</td>
                <td>{person[2]}</td>
                <td>{person[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PeopleByPublicationCount;
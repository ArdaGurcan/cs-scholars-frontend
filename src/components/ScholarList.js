import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScholarList() {
    const [scholars, setScholars] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/scholar/')
            .then(response => { setScholars(response.data); console.log(response.data);})
            .catch(error => console.error('Error fetching scholars:', error));
    }, []);

    return (
        <div className="container">
            <h2>Scholar List</h2>
            <ul className="list-group">
                {/* TODO: Backend seems to be sending 9559 empty entries so this produces an error */}
                {scholars.map(scholar => (
                    <li key={scholar.pid} className="list-group-item">
                        {scholar.name} ({scholar.majorarea})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ScholarList;

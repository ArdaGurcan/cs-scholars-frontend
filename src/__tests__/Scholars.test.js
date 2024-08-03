import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Scholars from '@/components/Scholars'
import axios from 'axios'

jest.mock('axios')

describe('Scholars Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] })
    axios.post.mockResolvedValue({ data: {} })
  })

  test('1. Creates a new scholar and verifies backend storage', async () => {
    const mockOnSelectScholar = jest.fn()
    render(<Scholars onSelectScholar={mockOnSelectScholar} />)
  
    const newScholar = {
      name: 'John Doe',
      major: 'Computer Science',
      hindex: '10',
      location: 'University of Example'
    }
  
    fireEvent.change(screen.getByTestId('new-scholar-name'), { target: { value: newScholar.name } })
    fireEvent.change(screen.getByTestId('new-scholar-major'), { target: { value: newScholar.major } })
    fireEvent.change(screen.getByTestId('new-scholar-hindex'), { target: { value: newScholar.hindex } })
    fireEvent.change(screen.getByTestId('new-scholar-location'), { target: { value: newScholar.location } })
  
    axios.post.mockResolvedValueOnce({ data: newScholar })
  
    fireEvent.click(screen.getByTestId('add-new-scholar-button'))
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/scholar/add', null, { params: newScholar })
    })
  })

  test('2. Updates scholar data and confirms backend reflection', async () => {
    const mockOnSelectScholar = jest.fn()
    axios.get.mockResolvedValueOnce({
      data: [
        [1, 'John Doe', 'Computer Science', 10]
      ]
    })
    render(<Scholars onSelectScholar={mockOnSelectScholar} />)
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('John Doe'))
    expect(mockOnSelectScholar).toHaveBeenCalledWith(1)
  })

  test('3. Fetches scholars with no grants and ensures backend removal', async () => {
    const mockOnSelectScholar = jest.fn()
    render(<Scholars onSelectScholar={mockOnSelectScholar} />)
    fireEvent.click(screen.getByLabelText(/Only Publications No Grants/i))
    fireEvent.click(screen.getByText(/Search/i))
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/scholar/publications-no-grants', expect.any(Object))
    })
  })

  test('4. Tests sorting scholars by different criteria', async () => {
    const mockOnSelectScholar = jest.fn()
    render(<Scholars onSelectScholar={mockOnSelectScholar} />)
    fireEvent.change(screen.getByLabelText(/Sort By/i), { target: { value: 'hindex' } })
    fireEvent.click(screen.getByText(/Search/i))
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/scholar/hindex', expect.any(Object))
    })
  })


  test('5. Simulates network error and tests error handling', async () => {
    const mockOnSelectScholar = jest.fn()
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    axios.get.mockRejectedValueOnce(new Error('Network Error'))
    render(<Scholars onSelectScholar={mockOnSelectScholar} />)
    fireEvent.click(screen.getByText(/Search/i))
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching scholars:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
})
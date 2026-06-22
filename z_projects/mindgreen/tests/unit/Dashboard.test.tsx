import Dashboard from '@/app/dashboard/page'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

test('renders dashboard title', () => {
  render(<Dashboard />)
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
})

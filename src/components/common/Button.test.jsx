import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'
import { LogIn } from 'lucide-react'

describe('Button component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button disabled onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with icon', () => {
    render(<Button icon={LogIn}>Login</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Laden...')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should apply correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-700')
  })

  it('should be keyboard accessible', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    button.focus()

    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should have proper ARIA attributes', () => {
    render(<Button ariaLabel="Submit form">Submit</Button>)
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument()
  })

  it('should apply fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('should meet minimum touch target size (44px)', () => {
    render(<Button size="md">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-h-[44px]')
  })
})

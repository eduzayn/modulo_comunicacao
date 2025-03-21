import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('h-9');
  });

  it('applies fullWidth class when specified', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button', { name: /full width button/i });
    expect(button).toHaveClass('w-full');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });
});

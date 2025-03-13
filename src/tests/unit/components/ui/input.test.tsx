import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md border');
  });

  it('accepts and displays user input', async () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    await userEvent.type(input, 'Hello, world!');
    
    expect(input).toHaveValue('Hello, world!');
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('renders with custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    
    const input = screen.getByPlaceholderText('Custom input');
    expect(input).toHaveClass('custom-class');
  });

  it('passes through additional props', async () => {
    const handleChange = jest.fn();
    render(
      <Input 
        placeholder="Test input" 
        onChange={handleChange}
        maxLength={10}
        required
      />
    );
    
    const input = screen.getByPlaceholderText('Test input');
    await userEvent.type(input, 'Test');
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('required');
  });

  it('works with different input types', () => {
    render(<Input type="password" placeholder="Password" />);
    
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });
});

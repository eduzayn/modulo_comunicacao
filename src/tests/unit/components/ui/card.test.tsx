import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card components', () => {
  it('renders Card correctly', () => {
    render(
      <Card data-testid="test-card">
        <div>Card Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('test-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm');
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders CardHeader correctly', () => {
    render(
      <Card>
        <CardHeader data-testid="test-header">
          <div>Header Content</div>
        </CardHeader>
      </Card>
    );
    
    const header = screen.getByTestId('test-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex flex-col space-y-1.5 p-6');
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders CardTitle correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle data-testid="test-title">Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    
    const title = screen.getByTestId('test-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl font-semibold leading-none tracking-tight');
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders CardDescription correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription data-testid="test-description">Card Description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    const description = screen.getByTestId('test-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm text-muted-foreground');
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders CardContent correctly', () => {
    render(
      <Card>
        <CardContent data-testid="test-content">
          <div>Content</div>
        </CardContent>
      </Card>
    );
    
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6 pt-0');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders CardFooter correctly', () => {
    render(
      <Card>
        <CardFooter data-testid="test-footer">
          <div>Footer Content</div>
        </CardFooter>
      </Card>
    );
    
    const footer = screen.getByTestId('test-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex items-center p-6 pt-0');
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders a complete card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

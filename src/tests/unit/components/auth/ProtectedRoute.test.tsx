import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
      isLoading: false
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false
    });

    // Mock router push
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush
      })
    }));

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Should not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('shows loading state when authentication is in progress', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Should show loading indicator and not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Assuming there's a loading indicator with text "Loading..."
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isLoading, login, logout } = useAuth();
  
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <button onClick={() => login('admin@edunexia.com')}>Login</button>
        </>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('provides authentication state and functions', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After loading, should show not logged in
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    // Click login button
    const loginButton = screen.getByText('Login');
    await act(async () => {
      userEvent.click(loginButton);
    });

    // Should now be logged in
    await waitFor(() => {
      expect(screen.getByText('Logged in as Administrador')).toBeInTheDocument();
    });

    // Click logout button
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      userEvent.click(logoutButton);
    });

    // Should be logged out again
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('restores user session from localStorage', async () => {
    // Set up mock localStorage with a stored user
    mockLocalStorage.setItem('auth_user', JSON.stringify({
      id: '1',
      name: 'Administrador',
      email: 'admin@edunexia.com',
      role: 'admin'
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should load the user from localStorage
    await waitFor(() => {
      expect(screen.getByText('Logged in as Administrador')).toBeInTheDocument();
    });
  });

  it('handles login failures correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    // Use the hook directly to test login with invalid credentials
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Attempt login with invalid email
    let loginSuccess;
    await act(async () => {
      loginSuccess = await result.current.login('invalid@example.com');
    });

    // Login should fail
    expect(loginSuccess).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

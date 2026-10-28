import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import { apiClient, getAccessToken } from '../services/apiClient';
import { UserRole } from '../types';

vi.mock('../services/apiClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/apiClient')>();
  return {
    ...actual,
    apiClient: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process login with backend response structure ({ accessToken, refreshToken, user })', async () => {
    const mockUser = {
      id: 'd382b660-5217-424b-a309-2952bb9f03e5',
      email: 'superadmin@hms.health',
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      tenantId: null,
      isActive: true,
    };

    const mockResponse = {
      data: {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
        user: mockUser,
      },
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.login({
      email: 'superadmin@hms.health',
      password: 'Password123!',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'superadmin@hms.health',
      password: 'Password123!',
    });
    expect(result).toEqual(mockResponse.data);
    expect(getAccessToken()).toBe('access-token-123');
  });

  it('should process login with nested tokens response structure ({ tokens: { accessToken, refreshToken }, user })', async () => {
    const mockUser = {
      id: 'd382b660-5217-424b-a309-2952bb9f03e5',
      email: 'superadmin@hms.health',
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      tenantId: null,
      isActive: true,
    };

    const mockResponse = {
      data: {
        tokens: {
          accessToken: 'nested-token-789',
          refreshToken: 'nested-refresh-012',
        },
        user: mockUser,
      },
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.login({
      email: 'superadmin@hms.health',
      password: 'Password123!',
    });

    expect(result).toEqual(mockResponse.data);
    expect(getAccessToken()).toBe('nested-token-789');
  });

  it('should clear tokens on logout', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: {} });

    await authService.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    expect(getAccessToken()).toBeNull();
  });
});

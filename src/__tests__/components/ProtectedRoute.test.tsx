import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const mockedUseSession = vi.mocked(useSession);
const mockedUseRouter = vi.mocked(useRouter);

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while session is pending", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      isPending: true,
      error: null,
      isSuccess: false,
      isError: false,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
    } as any);

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects to login when session has no user", () => {
    const push = vi.fn();
    mockedUseRouter.mockReturnValue({ push } as any);
    mockedUseSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      isSuccess: false,
      isError: false,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
    } as any);

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(push).toHaveBeenCalledWith("/login");
  });

  it("renders children when session has a user", () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          role: "student",
        },
        session: { id: "sess1", expiresAt: new Date() },
      },
      isPending: false,
      error: null,
      isSuccess: true,
      isError: false,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
    } as any);

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("returns null when not pending and no session user", () => {
    const push = vi.fn();
    mockedUseRouter.mockReturnValue({ push } as any);
    mockedUseSession.mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
      isSuccess: false,
      isError: false,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(container.innerHTML).toBe("");
  });
});

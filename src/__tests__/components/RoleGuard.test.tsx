import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RoleGuard } from "@/components/common/role-guard";
import { Role, UserStatus } from "@/types/auth";
import type { User } from "@/types/auth";

vi.mock("@/hooks/useAuth", () => ({
  useUser: vi.fn(),
}));

import { useUser } from "@/hooks/useAuth";

const mockedUseUser = vi.mocked(useUser);

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "1",
    name: "Test User",
    email: "user@test.com",
    role: Role.Student,
    status: UserStatus.Active,
    banned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "org1",
    emailVerified: true,
    ...overrides,
  };
}

describe("RoleGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing while user is loading", () => {
    mockedUseUser.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <RoleGuard allowedRoles={[Role.Student]}>
        <div>Student content</div>
      </RoleGuard>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders children when user role is allowed", () => {
    mockedUseUser.mockReturnValue({
      data: makeUser({ role: Role.Student }),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <RoleGuard allowedRoles={[Role.Student]}>
        <div>Student content</div>
      </RoleGuard>,
    );

    expect(screen.getByText("Student content")).toBeInTheDocument();
  });

  it("renders fallback when user role is not allowed", () => {
    mockedUseUser.mockReturnValue({
      data: makeUser({ role: Role.Student }),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <RoleGuard allowedRoles={[Role.Instructor]} fallback={<div>Denied</div>}>
        <div>Instructor content</div>
      </RoleGuard>,
    );

    expect(screen.getByText("Denied")).toBeInTheDocument();
    expect(screen.queryByText("Instructor content")).not.toBeInTheDocument();
  });

  it("renders null when role not allowed and no fallback", () => {
    mockedUseUser.mockReturnValue({
      data: makeUser({ role: Role.Student }),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <RoleGuard allowedRoles={[Role.Admin]}>
        <div>Admin content</div>
      </RoleGuard>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders null when user has no role", () => {
    mockedUseUser.mockReturnValue({
      data: makeUser({ role: undefined }),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <RoleGuard allowedRoles={[Role.Student]}>
        <div>Student content</div>
      </RoleGuard>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders null when user is null", () => {
    mockedUseUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <RoleGuard allowedRoles={[Role.Student]}>
        <div>Student content</div>
      </RoleGuard>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("supports multiple allowed roles", () => {
    mockedUseUser.mockReturnValue({
      data: makeUser({ role: Role.Instructor }),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <RoleGuard allowedRoles={[Role.Admin, Role.Instructor]}>
        <div>Admin or Instructor content</div>
      </RoleGuard>,
    );

    expect(screen.getByText("Admin or Instructor content")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "@/pages/Register";
import { AuthProvider } from "@/contexts/AuthContext";

vi.mock("@/hooks/useAnalytics", () => ({
  default: () => ({
    trackBusinessEvent: {
      userAuth: vi.fn(),
    },
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it("renders multi-step registration form", () => {
    renderRegister();
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
  });

  it("validates required fields on step 1", async () => {
    renderRegister();
    const nextButton = screen.getByRole("button", { name: /next/i });
    
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });
  });

  it("advances to step 2 with valid data", async () => {
    renderRegister();
    
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), {
      target: { value: "+1234567890" },
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
  });

  it("validates password strength", async () => {
    renderRegister();
    
    // Fill step 1
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "john@example.com" },
    });
    
    // Go to step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    
    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: "weak" } });
    });

    expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
  });

  it("validates password confirmation match", async () => {
    renderRegister();
    
    // Navigate to step 2 and fill password fields
    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/confirm password/i);
      
      fireEvent.change(passwordInput, { target: { value: "StrongPass123!" } });
      fireEvent.change(confirmInput, { target: { value: "DifferentPass123!" } });
    });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});


import { googleLogin } from "./authService";
import { toast } from "react-toastify";

const GOOGLE_CLIENT_ID =
  "735956371916-7123jdc3ukfuekd4t59taeqoknfomtsj.apps.googleusercontent.com";

/**
 * Directly triggers the Google account picker popup.
 * No modal needed — click button → account picker opens immediately.
 *
 * @param {string} role - "ADMIN" | "TEAM_LEADER" | "EMPLOYEE"
 * @param {function} onSuccess - called with backend response on success
 * @param {function} onError - called with error message string
 */
export function triggerGoogleLogin(role, onSuccess, onError) {
  const google = window.google;
  if (!google || !google.accounts) {
    onError?.("Google Sign-In script not loaded. Please refresh the page.");
    return;
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: "openid email profile",
    callback: async (tokenResponse) => {
      if (tokenResponse.error) {
        onError?.("Google sign-in was cancelled. Please try again.");
        return;
      }

      try {
        // Fetch user info from Google
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const { email, name, sub: googleId } = await userInfoRes.json();

        // Send to backend
        const response = await googleLogin(email, name, googleId, role);

        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("name", response.name || name);
          localStorage.setItem("email", response.email || email);
          localStorage.setItem("userId", response.userId || "");
          localStorage.setItem("companyId", response.companyId || "");
          localStorage.setItem("role", response.role || role);

          if (role === "ADMIN") {
            localStorage.setItem("adminToken", response.token);
            localStorage.setItem("adminName", response.name);
          } else if (role === "TEAM_LEADER" || role === "LEADER") {
            localStorage.setItem("leaderToken", response.token);
            localStorage.setItem("leaderName", response.name);
            localStorage.setItem("leaderId", response.userId);
          } else if (role === "EMPLOYEE") {
            localStorage.setItem("employeeToken", response.token);
            localStorage.setItem("employeeName", response.name);
            localStorage.setItem("employeeId", response.userId);
          }

          toast.success(`Welcome, ${response.name || name}! 🎉`);
          onSuccess?.(response);
        } else {
          onError?.(
            response?.message ||
              "Account not found. Make sure you are registered in the system."
          );
        }
      } catch (err) {
        console.error("[Google OAuth Error]", err);
        onError?.(
          err.response?.data?.message ||
            err.message ||
            "Google authentication failed."
        );
      }
    },
  });

  // Opens the account picker directly
  tokenClient.requestAccessToken({ prompt: "select_account" });
}

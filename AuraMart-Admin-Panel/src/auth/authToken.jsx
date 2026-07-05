// ✅ Save token + user info in sessionStorage
export const setToken = (data) => {
  if (!data || !data.token) return;
  try {
    sessionStorage.setItem("data", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving token:", err);
  }
};

// ✅ Get token safely (prevent undefined/null errors)
export const getToken = () => {
  try {
    const stored = sessionStorage.getItem("data");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed?.token || null;
  } catch (err) {
    console.error("Error reading token:", err);
    return null;
  }
};

// ✅ Remove token + auth data
export const removeToken = () => {
  try {
    sessionStorage.removeItem("data");
  } catch (err) {
    console.error("Error removing token:", err);
  }
};

// ✅ Logout helper (clean + redirect)
export const logout = () => {
  removeToken();
  // window.location.href = "/login";
  window.location.replace("/login");
};

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const userPanel = document.getElementById("user-panel");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginError = document.getElementById("login-error");
  const registerError = document.getElementById("register-error");
  const usernameDisplay = document.getElementById("username-display");
  const historyList = document.getElementById("history-list");
  const loadMoreHistory = document.getElementById("load-more-history");

  // API Endpoints
  const API_BASE = "https://shortsummaryai.onrender.com/api/v1";
  const AUTH_ENDPOINT = `${API_BASE}/auth`;
  const TEXT_ENDPOINT = `${API_BASE}/text`;

  // History pagination
  let historyPage = 0;
  const historyLimit = 5;

  // Check if user is logged in
  checkAuthState();

  // Form switching
  showRegisterLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  showLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // Login form submission
  loginBtn.addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      loginError.textContent = "Please fill in all fields";
      return;
    }

    try {
      loginError.textContent = "";
      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      const response = await fetch(`${AUTH_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store token and get user info
      chrome.storage.local.set(
        {
          token: data.access_token,
          tokenType: data.token_type,
        },
        function () {
          checkAuthState();
        }
      );
    } catch (error) {
      loginError.textContent = error.message;
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });

  // Register form submission
  registerBtn.addEventListener("click", async function () {
    const email = document.getElementById("reg-email").value;
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (!email || !username || !password) {
      registerError.textContent = "Please fill in all fields";
      return;
    }

    try {
      registerError.textContent = "";
      registerBtn.disabled = true;
      registerBtn.textContent = "Registering...";

      const response = await fetch(`${AUTH_ENDPOINT}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Show login form after successful registration
      registerForm.style.display = "none";
      loginForm.style.display = "block";
      document.getElementById("email").value = email;
      loginError.textContent = "Registration successful! Please login.";
      loginError.style.color = "#28a745";
    } catch (error) {
      registerError.textContent = error.message;
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Register";
    }
  });

  // Logout button
  logoutBtn.addEventListener("click", function () {
    chrome.storage.local.remove(["token", "tokenType", "user"], function () {
      checkAuthState();

      // Notify background script about logout
      chrome.runtime.sendMessage({ action: "logout" });
    });
  });

  // Load more history
  loadMoreHistory.addEventListener("click", function () {
    historyPage++;
    loadHistory(historyPage * historyLimit, historyLimit, true);
  });

  // Check authentication state
  function checkAuthState() {
    chrome.storage.local.get(["token", "user"], function (data) {
      if (data.token) {
        // User is authenticated
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        userPanel.style.display = "block";

        // Get user info if not already stored
        if (!data.user) {
          getUserInfo(data.token);
        } else {
          usernameDisplay.textContent = data.user.username;
        }

        // Load processing history
        historyPage = 0;
        loadHistory(0, historyLimit);

        // Notify background script about login
        chrome.runtime.sendMessage({
          action: "login",
          token: data.token,
        });
      } else {
        // User is not authenticated
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        userPanel.style.display = "none";
      }
    });
  }

  // Get user info using JWT token
  async function getUserInfo(token) {
    try {
      // Decode JWT token to get user info (client-side only)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // Store user info in local storage
      chrome.storage.local.set({
        user: {
          id: payload.user_id,
          email: payload.sub,
          username: payload.sub.split("@")[0], // Use email prefix as username if not available
        },
      });

      usernameDisplay.textContent = payload.sub.split("@")[0];
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Load processing history
  async function loadHistory(skip, limit, append = false) {
    try {
      chrome.storage.local.get(["token"], async function (data) {
        if (!data.token) return;

        const response = await fetch(
          `${TEXT_ENDPOINT}/history?skip=${skip}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load history");
        }

        const historyData = await response.json();

        if (!append) {
          historyList.innerHTML = "";
        }

        if (historyData.items.length > 0) {
          historyData.items.forEach((item) => {
            const historyItem = document.createElement("div");
            historyItem.className = "history-item";

            const processType = document.createElement("p");
            processType.className = "process-type";
            processType.textContent =
              item.process_type === "summary" ? "Summary" : "Bullet Points";

            const inputText = document.createElement("p");
            inputText.textContent =
              item.input_text.substring(0, 50) +
              (item.input_text.length > 50 ? "..." : "");

            const date = document.createElement("p");
            date.className = "date";
            date.textContent = new Date(item.created_at).toLocaleString();

            historyItem.appendChild(processType);
            historyItem.appendChild(inputText);
            historyItem.appendChild(date);

            historyItem.addEventListener("click", function () {
              // Show result in a new tab
              chrome.tabs.create({
                url: chrome.runtime.getURL("result.html") + `?id=${item.id}`,
              });
            });

            historyList.appendChild(historyItem);
          });

          // Show load more button if there are more items
          if (
            historyData.items.length === limit &&
            historyData.total > skip + limit
          ) {
            loadMoreHistory.style.display = "block";
          } else {
            loadMoreHistory.style.display = "none";
          }
        } else if (!append) {
          historyList.innerHTML = "<p>No processing history yet.</p>";
          loadMoreHistory.style.display = "none";
        }
      });
    } catch (error) {
      console.error("Error loading history:", error);
      historyList.innerHTML = "<p>Failed to load history.</p>";
    }
  }
});

// Global state
let isAuthenticated = false;
let authToken = null;

// Check for authentication on startup
chrome.storage.local.get(["token"], function (data) {
  if (data.token) {
    isAuthenticated = true;
    authToken = data.token;
    setupContextMenu();
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "login") {
    isAuthenticated = true;
    authToken = message.token;
    setupContextMenu();
    sendResponse({ success: true });
  } else if (message.action === "logout") {
    isAuthenticated = false;
    authToken = null;
    removeContextMenu();
    sendResponse({ success: true });
  } else if (message.action === "processText") {
    processText(message.text, message.processType, sender.tab);
    sendResponse({ success: true });
  }
  return true;
});

// Setup context menu items
function setupContextMenu() {
  removeContextMenu(); // Clear existing items

  chrome.contextMenus.create({
    id: "textProcessor",
    title: "Text Processor",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "summarize",
    parentId: "textProcessor",
    title: "Summarize Text",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "bulletPoints",
    parentId: "textProcessor",
    title: "Generate Bullet Points",
    contexts: ["selection"],
  });
}

// Remove context menu items
function removeContextMenu() {
  chrome.contextMenus.removeAll();
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (!isAuthenticated) {
    // Show login notification
    chrome.tabs.sendMessage(tab.id, {
      action: "showNotification",
      message: "Please log in to use Text Processor",
    });
    return;
  }

  const selectedText = info.selectionText;

  if (selectedText && selectedText.length > 0) {
    if (info.menuItemId === "summarize") {
      processText(selectedText, "summary", tab);
    } else if (info.menuItemId === "bulletPoints") {
      processText(selectedText, "bullet_points", tab);
    }
  }
});

// Process the selected text
async function processText(text, processType, tab) {
  if (!isAuthenticated || !authToken) {
    chrome.tabs.sendMessage(tab.id, {
      action: "showNotification",
      message: "Please log in to use Text Processor",
      type: "error",
    });
    return;
  }

  // Show loading notification
  chrome.tabs.sendMessage(tab.id, {
    action: "showLoading",
    message:
      processType === "summary"
        ? "Generating summary..."
        : "Generating bullet points...",
  });

  // API Endpoints
  const API_BASE = "http://localhost:8000/api/v1";
  const TEXT_ENDPOINT = `${API_BASE}/text`;

  try {
    // Make API request
    const endpoint =
      processType === "summary" ? "generate_summary" : "generate_bullet_points";

    const response = await fetch(`${TEXT_ENDPOINT}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "API request failed");
    }

    const result = await response.json();

    // Send result to content script
    chrome.tabs.sendMessage(tab.id, {
      action: "showResult",
      processType: processType,
      inputText: text,
      outputText: result.output_text,
    });
  } catch (error) {
    console.error("Error processing text:", error);

    // Show error notification
    chrome.tabs.sendMessage(tab.id, {
      action: "showNotification",
      message: `Error: ${error.message}`,
      type: "error",
    });
  }
}

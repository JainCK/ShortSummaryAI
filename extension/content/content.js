// Create custom elements when the script loads
const resultContainer = document.createElement("div");
resultContainer.id = "text-processor-result";
resultContainer.className = "text-processor-container";
resultContainer.style.display = "none";
document.body.appendChild(resultContainer);

const notificationContainer = document.createElement("div");
notificationContainer.id = "text-processor-notification";
notificationContainer.className = "text-processor-notification";
notificationContainer.style.display = "none";
document.body.appendChild(notificationContainer);

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "showNotification") {
    showNotification(message.message, message.type || "info");
    sendResponse({ success: true });
  } else if (message.action === "showLoading") {
    showLoading(message.message);
    sendResponse({ success: true });
  } else if (message.action === "showResult") {
    showResult(message.processType, message.inputText, message.outputText);
    sendResponse({ success: true });
  }
  return true;
});

// Show notification
function showNotification(message, type = "info") {
  const notification = document.getElementById("text-processor-notification");
  notification.className = `text-processor-notification ${type}`;
  notification.textContent = message;
  notification.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Show loading indicator
function showLoading(message) {
  const result = document.getElementById("text-processor-result");

  // Clear previous content
  result.innerHTML = "";

  // Create loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-indicator";

  const spinner = document.createElement("div");
  spinner.className = "spinner";

  const loadingText = document.createElement("p");
  loadingText.textContent = message || "Processing...";

  loadingDiv.appendChild(spinner);
  loadingDiv.appendChild(loadingText);

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", function () {
    result.style.display = "none";
  });

  // Add elements to result container
  result.appendChild(closeButton);
  result.appendChild(loadingDiv);

  // Show the container
  result.style.display = "block";

  // Position near the selection
  positionResultContainer();
}

// Show processing result
function showResult(processType, inputText, outputText) {
  const result = document.getElementById("text-processor-result");

  // Clear previous content
  result.innerHTML = "";

  // Create title
  const title = document.createElement("h3");
  title.textContent = processType === "summary" ? "Summary" : "Bullet Points";

  // Create output content
  const outputContent = document.createElement("div");
  outputContent.className = "result-output";

  if (processType === "bullet_points") {
    // Parse bullet points (split by newline)
    const bulletPoints = outputText
      .split("\n")
      .filter((point) => point.trim().length > 0);

    const bulletList = document.createElement("ul");
    bulletPoints.forEach((point) => {
      const listItem = document.createElement("li");
      listItem.textContent = point.replace(/^[-•*]\s*/, "").trim();
      bulletList.appendChild(listItem);
    });

    outputContent.appendChild(bulletList);
  } else {
    // Regular summary text
    const paragraphs = outputText.split("\n\n");
    paragraphs.forEach((para) => {
      if (para.trim().length > 0) {
        const p = document.createElement("p");
        p.textContent = para;
        outputContent.appendChild(p);
      }
    });
  }

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", function () {
    result.style.display = "none";
  });

  // Create action buttons
  const actionContainer = document.createElement("div");
  actionContainer.className = "action-buttons";

  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy";
  copyButton.addEventListener("click", function () {
    navigator.clipboard.writeText(outputText).then(() => {
      showNotification("Copied to clipboard!", "success");
    });
  });

  actionContainer.appendChild(copyButton);

  // Add elements to result container
  result.appendChild(closeButton);
  result.appendChild(title);
  result.appendChild(outputContent);
  result.appendChild(actionContainer);

  // Show the container
  result.style.display = "block";

  // Position near the selection
  positionResultContainer();
}

// Position the result container near the text selection
function positionResultContainer() {
  const result = document.getElementById("text-processor-result");
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate position
    let left = rect.left + scrollLeft;
    let top = rect.bottom + scrollTop + 10; // 10px below the selection

    // Ensure it doesn't go off-screen
    const containerWidth = 300; // Same as in CSS

    if (left + containerWidth > window.innerWidth + scrollLeft) {
      left = window.innerWidth + scrollLeft - containerWidth - 20;
    }

    // Set position
    result.style.left = `${left}px`;
    result.style.top = `${top}px`;
  }
}

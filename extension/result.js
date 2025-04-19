document.addEventListener("DOMContentLoaded", function () {
  // Get result ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const resultId = urlParams.get("id");

  // Elements
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const resultElement = document.getElementById("result");
  const processTypeElement = document.getElementById("process-type");
  const createdAtElement = document.getElementById("created-at");
  const inputTextElement = document.getElementById("input-text");
  const outputTitleElement = document.getElementById("output-title");
  const outputTextElement = document.getElementById("output-text");
  const copyOutputButton = document.getElementById("copy-output");
  const backButton = document.getElementById("back-btn");

  // API Endpoints
  const API_BASE = "https://shortsummaryai.onrender.com/api/v1";

  // Show error
  function showError(message) {
    loadingElement.style.display = "none";
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Load result
  async function loadResult() {
    if (!resultId) {
      showError("No result ID provided.");
      return;
    }

    try {
      // Get token from storage
      chrome.storage.local.get(["token"], async function (data) {
        if (!data.token) {
          showError("You are not logged in. Please log in to view results.");
          return;
        }

        // Fetch result from API
        const response = await fetch(`${API_BASE}/text/history?limit=100`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to load result");
        }

        const historyData = await response.json();

        // Find the specific result by ID
        const result = historyData.items.find(
          (item) => item.id === parseInt(resultId)
        );

        if (!result) {
          throw new Error("Result not found");
        }

        // Display result
        displayResult(result);
      });
    } catch (error) {
      showError(`Error: ${error.message}`);
    }
  }

  // Display result
  function displayResult(result) {
    // Set process type
    processTypeElement.textContent =
      result.process_type === "summary" ? "Summary" : "Bullet Points";

    // Set created at date
    createdAtElement.textContent = `Created on ${new Date(
      result.created_at
    ).toLocaleString()}`;

    // Set input text
    inputTextElement.textContent = result.input_text;

    // Set output title
    outputTitleElement.textContent =
      result.process_type === "summary" ? "Summary" : "Bullet Points";

    // Set output text
    if (result.process_type === "bullet_points") {
      const bulletPoints = result.output_text
        .split("\n")
        .filter((point) => point.trim().length > 0);

      const bulletList = document.createElement("ul");
      bulletList.className = "bullet-list";

      bulletPoints.forEach((point) => {
        const listItem = document.createElement("li");
        listItem.textContent = point.replace(/^[-•*]\s*/, "").trim(); // Remove bullet characters if present
        bulletList.appendChild(listItem);
      });

      outputTextElement.innerHTML = "";
      outputTextElement.appendChild(bulletList);
    } else {
      // Regular summary text
      const paragraphs = result.output_text.split("\n\n");

      outputTextElement.innerHTML = "";
      paragraphs.forEach((para) => {
        if (para.trim().length > 0) {
          const p = document.createElement("p");
          p.textContent = para;
          outputTextElement.appendChild(p);
        }
      });
    }

    // Hide loading, show result
    loadingElement.style.display = "none";
    resultElement.style.display = "block";
  }

  // Copy output text
  copyOutputButton.addEventListener("click", function () {
    const textToCopy = outputTextElement.textContent;

    navigator.clipboard.writeText(textToCopy).then(function () {
      copyOutputButton.textContent = "Copied!";

      setTimeout(function () {
        copyOutputButton.textContent = "Copy Output";
      }, 2000);
    });
  });

  // Back button
  backButton.addEventListener("click", function () {
    window.close();
  });

  // Load result on page load
  loadResult();
});

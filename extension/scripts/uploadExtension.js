const fs = require("fs");
const fetch = require("node-fetch");

const EXTENSION_ZIP_PATH = "./extension.zip";
const CLIENT_ID = "your-client-id";
const CLIENT_SECRET = "your-client-secret";
const REFRESH_TOKEN = "your-refresh-token";
const EXTENSION_ID = "your-extension-id";

async function uploadExtension() {
  try {
    // Get access token
    const tokenResponse = await fetch(
      "https://accounts.google.com/o/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN,
          grant_type: "refresh_token",
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Upload the extension
    const zipBuffer = fs.readFileSync(EXTENSION_ZIP_PATH);
    const uploadResponse = await fetch(
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${EXTENSION_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-goog-api-version": "2",
        },
        body: zipBuffer,
      }
    );

    const uploadData = await uploadResponse.json();
    console.log("Upload Response:", uploadData);

    // Publish the extension
    const publishResponse = await fetch(
      `https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}/publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-goog-api-version": "2",
        },
      }
    );

    const publishData = await publishResponse.json();
    console.log("Publish Response:", publishData);
  } catch (error) {
    console.error("Error uploading extension:", error);
  }
}

uploadExtension();

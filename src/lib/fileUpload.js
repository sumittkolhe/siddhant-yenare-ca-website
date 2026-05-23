/**
 * Upload a file to the cloud via the Vercel serverless API proxy.
 * Returns a real HTTPS download URL that can be shared in WhatsApp messages.
 *
 * @param {File} file - The File object to upload
 * @returns {Promise<string|null>} - The public cloud URL, or null on failure
 */
export async function uploadFileToCloud(file) {
  if (!file) return null;

  try {
    // Convert file to base64 data URL
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    // Send to our Vercel serverless upload endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileBase64: base64,
      }),
    });

    if (!response.ok) {
      console.error('Upload API returned error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error('Cloud upload failed:', error);
    return null;
  }
}

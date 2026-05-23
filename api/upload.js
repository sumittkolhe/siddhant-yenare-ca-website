export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileBase64 } = req.body;

    if (!fileName || !fileBase64) {
      return res.status(400).json({ error: 'Missing fileName or fileBase64' });
    }

    // Strip the data URL prefix (e.g. "data:application/pdf;base64,") to get raw base64
    const base64Data = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Detect MIME type from the data URL prefix
    const mimeMatch = fileBase64.match(/^data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    // Upload to catbox.moe (free permanent file hosting, no auth required)
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', new Blob([buffer], { type: mimeType }), fileName);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Fallback: try 0x0.st as a backup host
      const fallbackForm = new FormData();
      fallbackForm.append('file', new Blob([buffer], { type: mimeType }), fileName);

      const fallbackResponse = await fetch('https://0x0.st', {
        method: 'POST',
        body: fallbackForm,
      });

      if (!fallbackResponse.ok) {
        throw new Error('Both upload services failed');
      }

      const fallbackUrl = (await fallbackResponse.text()).trim();
      return res.status(200).json({ url: fallbackUrl });
    }

    const url = (await response.text()).trim();

    // Validate we got a URL back
    if (!url.startsWith('https://')) {
      throw new Error(`Unexpected response: ${url}`);
    }

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
}

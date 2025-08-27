import { IncomingForm } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
// Use built-in fetch (Next.js API routes provide fetch globally)

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Form parse error', details: err.message });
      return;
    }

    // Debug: log file fields from formidable
    console.log('DEBUG files.person:', files.person);
    console.log('DEBUG files.cloth:', files.cloth);
    if (Array.isArray(files.person)) {
      console.log('DEBUG files.person[0]:', files.person[0]);
    }
    if (Array.isArray(files.cloth)) {
      console.log('DEBUG files.cloth[0]:', files.cloth[0]);
    }
    // Validate required files
    let personFile = Array.isArray(files.person) ? files.person[0] : files.person;
    let clothFile = Array.isArray(files.cloth) ? files.cloth[0] : files.cloth;
    if (!clothFile || !clothFile.filepath || !personFile || !personFile.filepath) {
      console.error('Missing uploaded files (after flattening):', { clothFile, personFile });
      res.status(400).json({ error: 'Missing required files', details: { clothFile, personFile } });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('cloth', fs.createReadStream(clothFile.filepath), clothFile.originalFilename);
      formData.append('person', fs.createReadStream(personFile.filepath), personFile.originalFilename);
      formData.append('cloth_typE', Array.isArray(fields.cloth_typE) ? fields.cloth_typE[0] : fields.cloth_typE);
      formData.append('token', Array.isArray(fields.token) ? fields.token[0] : fields.token);

      const response = await axios.post('http://catvton-api.fly.dev/tryon', formData, {
        headers: formData.getHeaders(),
        responseType: 'arraybuffer',
      });
      // Set the correct content-type header for the image
      const contentType = response.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.status(response.status).send(Buffer.from(response.data));
    } catch (apiErr) {
      res.status(500).json({ error: 'API call failed', details: apiErr.message });
    }
  });
}

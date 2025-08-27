import formidable, { File } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

// Disable Next.js default body parser
export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  // formidable does not work directly with web streams, so we need to use Node.js request
  // This workaround is required in the app directory
  const nodeReq = (req as any).req;

  return new Promise((resolve) => {
    const form = new formidable.IncomingForm();
    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        resolve(
          new Response(JSON.stringify({ error: 'Failed to parse form data' }), { status: 500 })
        );
        return;
      }
      try {
        const data = new FormData();
        // Use the exact field names expected by the backend
        if (files.clothing_image && Array.isArray(files.clothing_image)) {
          data.append('clothing_image', fs.createReadStream(files.clothing_image[0].filepath));
        } else if (files.clothing_image) {
          data.append('clothing_image', fs.createReadStream((files.clothing_image as File).filepath));
        }
        if (files.avatar_image && Array.isArray(files.avatar_image)) {
          data.append('avatar_image', fs.createReadStream(files.avatar_image[0].filepath));
        } else if (files.avatar_image) {
          data.append('avatar_image', fs.createReadStream((files.avatar_image as File).filepath));
        }

        const response = await axios.post('https://virtufit360.fly.dev/try-on', data, {
          headers: { ...data.getHeaders() },
          maxBodyLength: Infinity,
          responseType: 'arraybuffer',
        });

        // Return the binary response directly
        resolve(
          new Response(response.data, {
            status: response.status,
            headers: {
              'Content-Type': response.headers['content-type'] || 'image/jpeg',
              'Content-Length': response.headers['content-length'],
            },
          })
        );
      } catch (error: any) {
        resolve(
          new Response(
            JSON.stringify({
              error: error.response?.data || error.message || 'Unknown error',
            }),
            { status: error.response?.status || 500 }
          )
        );
      }
    });
  });
}

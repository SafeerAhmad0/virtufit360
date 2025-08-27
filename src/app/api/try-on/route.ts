
import { NextRequest } from 'next/server';
import formidable from 'formidable';
import type { IncomingMessage } from 'http';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest): Promise<Response> {
  return new Promise<Response>((resolve) => {
    const form = formidable({ multiples: false });
    form.parse(req as unknown as IncomingMessage, async (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: 'Failed to parse form data' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }
      if (!files.clothing_image || !files.avatar_image) {
        resolve(new Response(JSON.stringify({ error: 'Both clothing_image and avatar_image are required.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }
      try {
        const data = new FormData();
        const clothingFile = Array.isArray(files.clothing_image) ? files.clothing_image[0] : files.clothing_image;
        const avatarFile = Array.isArray(files.avatar_image) ? files.avatar_image[0] : files.avatar_image;
        data.append('clothing_image', fs.createReadStream(clothingFile.filepath), clothingFile.originalFilename ?? undefined);
        data.append('avatar_image', fs.createReadStream(avatarFile.filepath), avatarFile.originalFilename ?? undefined);
        const response = await axios.post('https://virtufit360.fly.dev/try-on', data, {
          headers: { ...data.getHeaders() },
          maxBodyLength: Infinity,
          responseType: 'arraybuffer',
        });
        resolve(new Response(response.data, {
          status: response.status,
          headers: {
            'Content-Type': response.headers['content-type'] || 'image/jpeg',
            'Content-Length': response.headers['content-length'],
          },
        }));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status || 500;
          const errorData = error.response?.data || error.message || 'Unknown error';
          resolve(new Response(JSON.stringify({ error: errorData }), {
            status,
            headers: { 'Content-Type': 'application/json' }
          }));
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          const errorMessage = (error as { message?: string }).message || 'Unknown error';
          resolve(new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }));
        } else {
          resolve(new Response(JSON.stringify({ error: 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }
    });
  });
}

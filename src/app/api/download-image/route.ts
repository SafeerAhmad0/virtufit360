import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  console.log('Download request for URL:', imageUrl);

  if (!imageUrl) {
    return new NextResponse(JSON.stringify({ error: 'Image URL is required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Extract the path from the Supabase URL
    console.log('Parsing URL...');
    const url = new URL(imageUrl);
    console.log('URL parsed successfully');
    
    // Extract the file path from the Supabase URL
    // The format is: /storage/v1/object/public/bucket-name/file-path
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^?]+)/);
    if (!pathMatch || pathMatch.length < 2) {
      throw new Error(`Invalid Supabase URL format. Expected format: /storage/v1/object/public/bucket-name/file-path`);
    }
    
    const fullPath = pathMatch[1];
    const bucketName = 'product-images'; // Your bucket name
    let filePath = fullPath;
    
    // If the path includes the bucket name, extract just the file path
    if (fullPath.startsWith(`${bucketName}/`)) {
      filePath = fullPath.substring(bucketName.length + 1);
    }

    console.log('Extracted file path:', filePath);
    console.log('Using bucket:', bucketName);
    
    // List files in the bucket for debugging
    console.log('Listing files in bucket...');
    const { data: listData, error: listError } = await supabase.storage
      .from(bucketName)
      .list();
      
    if (listError) {
      console.error('Error listing files:', listError);
    } else {
      console.log('Files in bucket:', listData?.map(f => f.name));
    }
    
    // Download the file from Supabase Storage
    console.log(`Attempting to download: ${filePath} from bucket: ${bucketName}`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      console.error('Supabase download error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data received from Supabase');
    }

    console.log('File downloaded successfully, size:', data.size, 'bytes');
    
    // Convert the Blob to a Buffer
    const buffer = await data.arrayBuffer();
    
    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': data.type || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error in download-image API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Error downloading image',
        details: error instanceof Error ? error.message : 'Unknown error',
        url: imageUrl
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

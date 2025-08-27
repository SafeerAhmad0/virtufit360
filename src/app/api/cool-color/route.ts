import { NextResponse } from "next/server";

// Common store colors with their names
const STORE_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#008000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Navy', hex: '#000080' }
];

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Simple color recommendation based on random selection
    // You can enhance this with actual image analysis logic later
    const randomColor = STORE_COLORS[Math.floor(Math.random() * STORE_COLORS.length)];
    
    return NextResponse.json({ 
      color: randomColor.hex, 
      name: randomColor.name 
    });
  } catch (error) {
    console.error("Error processing color recommendation:", error);
    // Fallback: Return a default color
    const fallbackColor = STORE_COLORS[0]; // Red as default
    return NextResponse.json({ 
      color: fallbackColor.hex, 
      name: fallbackColor.name,
      isFallback: true 
    });
  }
}

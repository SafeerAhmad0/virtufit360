import { NextResponse } from "next/server";
import OpenAI from "openai";

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Create a string of available colors for the prompt
    const availableColors = STORE_COLORS.map(c => `${c.name} (${c.hex})`).join(', ');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `You are a fashion expert. Analyze the person in the image and recommend the best matching color from these available options: ${availableColors}. Consider skin tone, hair color, and overall appearance. Respond with just the color name from the given options, nothing else.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Which color would suit this person best from the given options?" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 20,
    });

    const recommendedColorName = response.choices[0]?.message?.content?.trim();
    if (!recommendedColorName) {
      return NextResponse.json({ error: "Could not determine recommended color" }, { status: 500 });
    }

    // Find the color in our store colors
    const recommendedColor = STORE_COLORS.find(
      color => color.name.toLowerCase() === recommendedColorName.toLowerCase()
    );

    if (!recommendedColor) {
      return NextResponse.json({ error: "Recommended color not found in store" }, { status: 500 });
    }

    return NextResponse.json({ 
      color: recommendedColor.hex, 
      name: recommendedColor.name 
    });
  } catch (error) {
    console.error("Error calling OpenAI, falling back to random color:", error);
    // Fallback: Return a random color from STORE_COLORS
    const randomColor = STORE_COLORS[Math.floor(Math.random() * STORE_COLORS.length)];
    return NextResponse.json({ 
      color: randomColor.hex, 
      name: randomColor.name,
      isFallback: true // Indicate this is a fallback result
    });
  }
}

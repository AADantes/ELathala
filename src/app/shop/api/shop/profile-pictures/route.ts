import { NextResponse } from "next/server"
import supabase from "../../../../../../config/supabaseClient"

// BACKEND INTEGRATION POINT:
// This is where you would connect to your database to fetch profile pictures
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ProfilePictures')
      .select('id, title, picPrice, picFilename, picUrl');

    if (error) {
      throw error;
    }

    const profilePictures = data.map((pic) => ({
      id: pic.id,
      name: pic.title,
      price: pic.picPrice,
      previewUrl: pic.picUrl
  ? pic.picUrl
  : pic.picFilename
  ? `https://your-project-id.supabase.co/storage/v1/object/public/profile-pics/${pic.picFilename}`
  : "/placeholder.svg",
    }));

    return new Response(JSON.stringify(profilePictures), { status: 200 });
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    return new Response('Failed to fetch profile pictures', { status: 500 });
  }
}
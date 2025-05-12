// app/api/homepage/userdata/route.ts
import { NextResponse } from 'next/server';
import supabase from '../../../../../config/supabaseClient';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userID = user.id;

    const { data: profile, error: profileError } = await supabase
      .from('User')
      .select('username, userLevel, usercurrentExp, targetExp, userCredits')
      .eq('id', userID)
      .single();

    const { data: writtenWorks, error: worksError } = await supabase
      .from('written_works')
      .select('workID, workTitle, numberofWords, noOfWordsSet, timelimitSet')
      .eq('UserID', userID);

    if (profileError || worksError) {
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }

    return NextResponse.json({
      userData: {
        username: profile.username ?? 'Unknown User',
        experience: profile.usercurrentExp,
        level: profile.userLevel,
        totalExperience: profile.targetExp,
        credits: profile.userCredits ?? 0,
      },
      works: writtenWorks || [],
      userID,
    });
  } catch (error) {
    console.error('Error in homepage user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

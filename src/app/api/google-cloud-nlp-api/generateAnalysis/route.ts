import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../../config/supabaseClient'; // adjust path if needed

// Google Cloud API key for NLP
const GOOGLE_CLOUD_API_KEY = 'AIzaSyAsIMazMjpfOjdMTisD7lUNN7G6h12T1B8';

export async function POST(req: NextRequest) {
  try {
    const { text, userID } = await req.json(); // Assuming userID is in the body
    


    // Check if the user exists in Supabase
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('id', userID)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 📊 Check existing usage
    const { data: usageRow, error: fetchError } = await supabase
      .from('api_usage')
      .select('*')
      .eq('userid', userID) // Update column name to `userid` here
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
    }

    if (!usageRow) {
      await supabase.from('api_usage').insert([{
        userid: userID, // Update to `userid` here
        api_calls_this_month: 1,
        last_reset_date: firstOfMonth,
      }]);
    } else {
      const lastReset = new Date(usageRow.last_reset_date);
      const shouldReset = now > new Date(lastReset.getFullYear(), lastReset.getMonth() + 1, 1);

      await supabase
        .from('api_usage')
        .update({
          api_calls_this_month: shouldReset ? 1 : usageRow.api_calls_this_month + 1,
          last_reset_date: shouldReset ? firstOfMonth : usageRow.last_reset_date,
        })
        .eq('userid', userID); // Update to `userid` here
    }

    // 🌐 Analyze text with Google NLP API
    const gcpRes = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: { type: 'PLAIN_TEXT', content: text },
          encodingType: 'UTF8',
        }),
      }
    );

    if (!gcpRes.ok) {
      const error = await gcpRes.json();
      return NextResponse.json({ error }, { status: gcpRes.status });
    }

    const result = await gcpRes.json();
    const sentiment = result.documentSentiment;

    let sentimentLabel = 'neutral';
    if (sentiment.score > 0.25) sentimentLabel = 'positive';
    else if (sentiment.score < -0.25) sentimentLabel = 'negative';

    return NextResponse.json({
      output: {
        sentiment: sentimentLabel,
        confidence: sentiment.magnitude,
      },
    });
  } catch (err) {
    console.error('[Sentiment API ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

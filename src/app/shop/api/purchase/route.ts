import { NextRequest, NextResponse } from 'next/server'
import  supabase  from '../../../../../config/supabaseClient' // Adjust according to your supabase instance setup

// Handle purchase API request
export async function POST(req: NextRequest) {
  // Parse the request body
  const { user_id, font_id, price, transaction_id, purchase_date } = await req.json()

  try {
    // Fetch current user credits from the "User" table
    const { data: user, error: fetchError } = await supabase
      .from('User')
      .select('credits')
      .eq('uuid', user_id)
      .single()

    // Check if user exists
    if (fetchError || !user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Check if user has enough credits
    if (user.credits < price) {
      return NextResponse.json({ success: false, message: 'Insufficient credits' }, { status: 400 })
    }

    // Proceed with purchase: deduct credits and log the purchase
    const updatedCredits = user.credits - price

    // Update the user's credits in the "User" table
    const { error: updateError } = await supabase
      .from('User')
      .update({ credits: updatedCredits })
      .eq('uuid', user_id)

    // If error updating credits
    if (updateError) {
      return NextResponse.json({ success: false, message: 'Failed to update credits' }, { status: 500 })
    }

    // Log the purchase in the "Purchases" table
    const { error: logError } = await supabase
      .from('FontPurchases')
      .insert({
        user_id,
        font_id,
        price,
        transaction_id,
        purchase_date,
      })

    // If error logging purchase
    if (logError) {
      return NextResponse.json({ success: false, message: 'Failed to log purchase' }, { status: 500 })
    }

    // Return success response with updated credits
    return NextResponse.json({ success: true, updatedCredits })

  } catch (error) {
    console.error("Error processing purchase:", error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
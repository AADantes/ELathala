import React from 'react'
import LandingPage from '@/app/landingpage/page'
import supabase from '../../config/supabaseClient'

export default function Main() {

  console.log (supabase)
  
  return (
    <div>
      <LandingPage/>
    </div>
  )
}

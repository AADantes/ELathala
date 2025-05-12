'use client';
import React from 'react'
import LandingPage from '@/app/landingpage/page'
import supabase from '../../config/supabaseClient'
import { UserTokenProvider } from '@/app/Contexts/UserTokenContext'

export default function Main() {

  console.log (supabase)
  
  return (
    <div>
       <UserTokenProvider>
          <LandingPage/>
       </UserTokenProvider>

    </div>
  )
}

import LoginPage from '@/components/LoginComponent'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import React from 'react'

async function page() {
    const session = await auth.api.getSession({
        headers:await headers()
    })

    if(session){
        redirect("/")
    }
  return (
    <div>
      <LoginPage/>
    </div>
  )
}

export default page

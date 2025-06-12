import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
      <h2 className='text-white'>Interview Genaration</h2>

      <Agent userName="You" userId="user1" type="generate"/>
    </>
  )
}

export default page

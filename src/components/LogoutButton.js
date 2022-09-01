import React from 'react'

export default function LogoutButton( { removePlayer, userId, failedAttempts } ) {
  console.log(failedAttempts)
  return (
    <button className="remove-player" onClick={()=>removePlayer(userId, failedAttempts)}>✖</button>
  )
}

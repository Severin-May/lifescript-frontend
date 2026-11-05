const buttonStyle = 'bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-3 py-1.5'

function AccountButton({ user, onLoginClick, onRegisterClick, onLogout }) {
  if (!user) {
    return (
      <div className='flex items-center gap-2 text-sm'>
        <button onClick={onLoginClick} className={buttonStyle}>
          Log in
        </button>
        <button onClick={onRegisterClick} className={buttonStyle}>
          Register
        </button>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3 text-sm'>
      <span className='text-gray-300'>{user.email}</span>
      <button onClick={onLogout} className={buttonStyle}>
        Log out
      </button>
    </div>
  )
}

export default AccountButton

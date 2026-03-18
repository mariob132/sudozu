import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Credenciales hardcodeadas
    if (username === 'admin' && password === '12345678') {
      onLogin()
      navigate('/templates')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">zudosu</h1>
          <p className="login-subtitle">Inicia sesión para acceder al editor</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
          </form>

          <div className="login-hint">
            <p>Credenciales de prueba:</p>
            <p><strong>Usuario:</strong> admin</p>
            <p><strong>Contraseña:</strong> 12345678</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

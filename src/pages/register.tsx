import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, user } = useAppSelector(state => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token && user) {
      navigate(`/user/${user.id}/projects`, { replace: true })
    }
  }, [token, user, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)

      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)

      return
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap()
      navigate('/login', { replace: true })
    } catch (err: any) {
      setError(err?.message ?? 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analysat</h1>
          <p className="text-default-500">Crea tu cuenta</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            isRequired
            className="w-full"
            label="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            isRequired
            className="w-full"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            isRequired
            className="w-full"
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            isRequired
            className="w-full"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-danger text-sm text-center">{error}</p>}
          <Button
            fullWidth
            className="mt-6"
            color="primary"
            isLoading={loading}
            type="submit"
          >
            Registrarse
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-default-500">
            ¿Ya tienes cuenta?{' '}
            <Link className="text-primary hover:underline" to="/login">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

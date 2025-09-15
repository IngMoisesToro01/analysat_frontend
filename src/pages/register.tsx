import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'

import DefaultLayout from '@/layouts/default'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token } = useAppSelector(state => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate('/login', { replace: true })
    }
  }, [token, navigate])

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
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-default-500">
            Regístrate para gestionar tus proyectos
          </p>
        </div>

        <form className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
          <Input
            isRequired
            label="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            isRequired
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            isRequired
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            isRequired
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button fullWidth color="primary" isLoading={loading} type="submit">
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
      </section>
    </DefaultLayout>
  )
}

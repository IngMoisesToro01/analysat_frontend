import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'

import DefaultLayout from '@/layouts/default'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser } from '@/store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token } = useAppSelector(state => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate('/user/1/projects', { replace: true })
    }
  }, [token, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap()

      navigate(`/user/${result.user.id}/projects`, { replace: true })
    } catch (err: any) {
      setError(err?.message ?? 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-10">
        <form className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
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
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button fullWidth color="primary" isLoading={loading} type="submit">
            Iniciar sesión
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-default-500">
            ¿No tienes cuenta?{' '}
            <Link className="text-primary hover:underline" to="/register">
              Regístrate
            </Link>
          </p>
        </div>
      </section>
    </DefaultLayout>
  )
}

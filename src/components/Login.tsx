import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Conta criada! Verifique seu e-mail se a confirmação estiver habilitada.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setMessage('Login realizado com sucesso!')
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">SixFit</h1>
        <p className="text-gray-600 text-sm mb-6">{isSignUp ? 'Crie sua conta' : 'Entre com seu e-mail e senha'}</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-3 rounded font-semibold text-sm text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
          >
            {loading ? 'Processando...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp((v) => !v)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar conta'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
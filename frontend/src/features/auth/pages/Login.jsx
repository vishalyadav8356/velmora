import { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa6'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      const loggedInUser = await handleLogin({ email, password })
      if (loggedInUser?.role === 'buyer') {
        navigate('/')
      } else if (loggedInUser?.role === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
      setErrors({ submit: 'Invalid email or password' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1440px] items-stretch overflow-hidden rounded-[24px] border border-[#eadfcd] bg-[#fbf7f0] shadow-[0_28px_80px_rgba(77,57,38,0.12)]">
        <div className="relative hidden w-[42%] overflow-hidden lg:block">
          <img
            alt="Ambient Interior"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">
            <div className="flex flex-col items-center text-center">
              <svg
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3 text-[#6f6657]"
              >
                <path d="M21 6C18 10 16 12 16 16C16 20 19 22 21 25C23 22 26 20 26 16C26 12 24 10 21 6Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M14 24C18 20 24 20 28 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M21 25V35" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <h1 className="font-display text-[34px] tracking-[0.34em] text-[#6e6257]">VELMORA</h1>
              <p className="mt-1 text-[10px] tracking-[0.34em] text-[#b2a593]">CRAFTING SPACES. ELEVATING LIVES.</p>
            </div>

            <div className="mt-10">
              <h2 className="text-[29px] leading-tight font-medium text-[#26211a]">Welcome back</h2>
              <p className="mt-2 text-[15px] text-[#7f7465]">Login to continue to Velmora</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-[#322b23]">Email address</label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b6ab9c]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-[10px] border border-[#e3d7c7] bg-[#fbf8f3] py-3 pl-10 pr-4 text-sm text-[#322b23] outline-none transition placeholder:text-[#b8aea2] focus:border-[#8b7d69] focus:ring-2 focus:ring-[#8b7d69]/10"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-medium text-[#322b23]">Password</label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b6ab9c]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-[10px] border border-[#e3d7c7] bg-[#fbf8f3] py-3 pl-10 pr-11 text-sm text-[#322b23] outline-none transition placeholder:text-[#b8aea2] focus:border-[#8b7d69] focus:ring-2 focus:ring-[#8b7d69]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8f8476] transition hover:text-[#584f44]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
              </div>

              <div className="-mt-1 flex justify-end">
                <Link to="/forgot-password" className="text-[13px] text-[#8f8476] transition hover:text-[#584f44]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#5a6247] px-4 py-3 text-[15px] font-medium text-white transition hover:bg-[#4d563e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Logging in…' : 'Login'}
              </button>
              {errors.submit && <p className="pt-1 text-center text-xs text-red-500">{errors.submit}</p>}
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#e4dacd]" />
              <span className="text-[13px] text-[#908578]">or continue with</span>
              <span className="h-px flex-1 bg-[#e4dacd]" />
            </div>

            <div className="flex justify-center">
              <a
                href="http://localhost:3000/api/auth/google"
                className="flex w-full max-w-md items-center justify-center gap-2 rounded-[10px] border border-[#e4dacd] bg-[#fbf8f3] px-4 py-3 text-sm font-medium text-[#332c24] transition hover:bg-white sm:w-auto sm:px-6"
              >
                <FcGoogle className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="text-base sm:text-lg md:text-xl">
                  Continue with Google
                </span>
              </a>
            </div>
            <p className="mt-8 text-center text-[14px] text-[#6f6254]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-[#5a6247] transition hover:text-[#4d563e]">
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError('')
    try {
      const { email } = data
      const result = await signIn('credentials', {
        redirect: false,
        email,
      })
      
      if (result?.error) {
        toast.error('Invalid email')
        setError('Invalid email')
        
        return
      }
      toast.success('Logged in successfully')
      router.push('/') // Redirect to dashboard after successful login
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
      toast.error('Failed to log in. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Dont have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
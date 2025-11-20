"use client"
import FooterLinks from '@/components/forms/FooterLinks';
import InputFilelds from '@/components/forms/InputFilelds';
import { Button } from '@/components/ui/button';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const SignIn = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  },);
  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) router.push('/')
    } catch (error) {
      toast.error('Sign in failed', { description: error instanceof Error ? error.message : 'Failed to sign in' })
      console.log(error)
    }
  }
  return (
    <>
      <h1 className='text-3xl font-bold text-center mb-2 text-yellow-400'>Signalist</h1>
      <h1 className='form-title'>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

        <InputFilelds
          name='email'
          label='Email'
          placeholder='Enter your email'
          register={register}
          error={errors.email}
          validation={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
        />
        <InputFilelds
          name='password'
          label='Password'
          placeholder='Enter your password'
          type='password'
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required', minLength: 8 }}
        />
        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5 '>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
        <FooterLinks text="Don't have an account?" linkText='Sign Up' href='/sign-up' />
      </form>
    </>
  )
}

export default SignIn
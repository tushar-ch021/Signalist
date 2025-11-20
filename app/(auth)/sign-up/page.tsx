'use client';
import CountrySelectFeilds from '@/components/forms/CountrySelectFeilds';
import FooterLinks from '@/components/forms/FooterLinks';
import InputFilelds from '@/components/forms/InputFilelds';
import SelectFields from '@/components/forms/SelectFields';
import { Button } from '@/components/ui/button';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const SignUp = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'IN',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data)
      if (result?.success) router.push('/')
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : 'Failed to create an account. Please try again';
      if (msg.includes('User already exists')) {
        toast.error('Use another email.', {
          description: 'This email is already associated with an account.'
        });
      } else {
        toast.error('Something went wrong', {
          description: msg
        })
      }
    }
  }

  return (
    <>
      <h1 className='text-3xl font-bold text-center mb-2 text-yellow-400'>Signalist</h1>
      <h1 className='form-title'>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

        <InputFilelds
          name='fullName'
          label='Full Name'
          placeholder='Enter your full name'
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is required', minLength: 2 }}
        />
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
        <CountrySelectFeilds
          name='country'
          label='Country'
          control={control}
          error={errors.country}
          required
        />
        <SelectFields
          name='investmentGoals'
          label='Investment Goals'
          placeholder='Select your investment goals'
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />
        <SelectFields
          name='riskTolerance'
          label='Risk Tolerance'
          placeholder='Select your risk tolerance'
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />
        <SelectFields
          name='preferredIndustry'
          label='Preferred Industry'
          placeholder='Select your preferred industry'
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />

        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5 '>
          {isSubmitting ? 'Creating Account...' : 'Start Your Investing Journey'}
        </Button>
        <FooterLinks text='Already have an account?' linkText='Sign In' href='/sign-in' />
      </form>

    </>
  )
}

export default SignUp
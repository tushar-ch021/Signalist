import React from 'react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

const InputFilelds = ({name,label,placeholder,register,error,validation,type="text",disabled,value}:FormInputProps) => {
  return (
    <div className='space-y-2'>
        <label htmlFor={name} className='form-label'>{label}</label>
        <Input
          type={type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
            value={value}
            className={ cn('form-input',{'opacity-50 cursor-not-allowed':disabled})}
          {...register(name, validation)}
        />
        {error && <p className='form-error'>{error.message}</p>}
    </div>
  )
}

export default InputFilelds
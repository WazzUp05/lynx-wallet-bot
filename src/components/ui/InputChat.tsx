import Arrow from '@/components/icons/arrow.svg'
import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    className?: string;
}

const InputChat = ({
    placeholder = 'Сообщение...',
    onChange,
    ...props
    }: InputProps) => {

    const [value, setValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        onChange?.(e)
        console.log(e.target.value)
    }

    const handleSend = () => {
    if (!value.trim()) return
    console.log('Отправлено сообщение:', value)
    setValue('') 
    }
    return (
        <div className='relative glass grow rounded-[2rem] center'>
            <input className='pl-[1rem] py-[0.8rem] fs-very-small pr-[3rem] 
                              focus:outline-none focus:ring-0 w-full bg-transparent' 
                              placeholder={placeholder} 
                              onChange={handleChange}
                              value={value}
                              {...props}
            />
            {value.trim().length > 0 && 
            <button className='w-[2.5rem] h-[2.5rem] rounded-[1.5rem] center bg-[var(--yellow)] absolute right-[0.3rem]'
                    onClick={handleSend}            
            ><Arrow/></button>
            }
            
        </div>
    )
}

export default InputChat
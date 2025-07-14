'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
}

export const Button = ({ variant = 'primary', className, ...props }: Props) => {
  const base = 'px-4 py-2 rounded font-medium transition';
  const styles = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      {...props}
      className={clsx(base, styles[variant], className)}
    />
  );
};

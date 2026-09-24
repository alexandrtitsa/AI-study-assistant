import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';
import { Loader } from '../Loader/Loader';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader size="sm" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
};
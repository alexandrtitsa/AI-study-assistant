import type { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Loader.module.scss';

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Loader: FC<LoaderProps> = ({
  size = 'md',
  label,
  className,
  ...props
}) => {
  return (
    <div
      role="status"
      className={clsx(styles.loaderContainer, className)}
      {...props}
    >
      <div className={clsx(styles.spinner, styles[size])} />
      {label && <span className={styles.label}>{label}</span>}
      <span className="srOnly">{label || 'Завантаження...'}</span>
    </div>
  );
};
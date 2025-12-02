import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            icon,
            className = '',
            id,
            required,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);

        const containerClassNames = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
        ]
            .filter(Boolean)
            .join(' ');

        const inputClassNames = [
            styles.input,
            hasError ? styles.error : '',
            icon ? styles.withIcon : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClassNames}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                <div className={styles.inputWrapper}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClassNames}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />
                </div>

                {error && (
                    <p id={`${inputId}-error`} className={styles.errorText}>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

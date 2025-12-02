import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
    children: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    padding = 'md',
    hover = false,
    className = '',
    onClick,
}) => {
    const classNames = [
        styles.card,
        styles[`padding-${padding}`],
        hover ? styles.hover : '',
        onClick ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
};

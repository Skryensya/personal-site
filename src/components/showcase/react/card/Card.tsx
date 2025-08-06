import React from 'react';
import './card.css';

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  variant?: 'default' | 'highlighted' | 'minimal';
  onClick?: () => void;
  children?: React.ReactNode;
}

export function Card({ 
  title, 
  description, 
  imageUrl, 
  tags = [], 
  variant = 'default',
  onClick,
  children 
}: CardProps) {
  return (
    <div 
      className={`showcase-card showcase-card--${variant} ${onClick ? 'showcase-card--clickable' : ''}`}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="showcase-card__image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      
      <div className="showcase-card__content">
        <h3 className="showcase-card__title">{title}</h3>
        
        {description && (
          <p className="showcase-card__description">{description}</p>
        )}
        
        {children && (
          <div className="showcase-card__body">
            {children}
          </div>
        )}
        
        {tags.length > 0 && (
          <div className="showcase-card__tags">
            {tags.map((tag, index) => (
              <span key={index} className="showcase-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
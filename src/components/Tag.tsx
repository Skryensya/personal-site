import * as React from 'react';

interface Props {
    text: string;
    href?: string;
    withHash?: boolean; 
    className?: string;
}

export default function Tag({ text, href, withHash = false, className = '' }: Props) {
    const displayText = withHash ? `#${text}` : text;

    const baseClasses = 'inline-block px-4 py-1 text-base font-mono font-medium border-2 border-main bg-secondary text-main overflow-hidden';

    const finalClasses = `${baseClasses} ${className}`;

    const content = (
        <>
            {displayText}
            {<div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-main"></div>}
        </>
    );

    if (href) {
        return (
            <a href={href} className={`${finalClasses} hover:bg-red-5600 hover:text-main focus:bg-secondary focus:text-main focus:outline-none`}>
                {content}
            </a>
        );
    }

    const spanClasses = `relative ${finalClasses}`;

    return <span className={spanClasses}>{content}</span>;
}

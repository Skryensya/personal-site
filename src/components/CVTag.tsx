interface CVTagProps {
    text: string;
    className?: string;
}

export default function CVTag({ text, className = '' }: CVTagProps) {
    return (
        <span
            className={`inline-block bg-main text-secondary px-2 py-0.5 text-[12px] font-medium font-mono tracking-tight print:!bg-transparent print:!text-black print:border print:border-black print-color-adjust-exact print:!px-1 print:!py-0.5 print:!text-[10px] print:!font-medium print:!leading-tight ${className}
            `}
            style={{ WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}
        >
            {text}
        </span>
    );
}

import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    icon: LucideIcon;
    className?: string;
}

export function SectionHeader({ title, icon: Icon, className = '' }: SectionHeaderProps) {
    return (
        <h2 className={`text-xl font-bold uppercase border-b-2 border-main pb-2 mb-4 flex items-center gap-2 ${className}`}>
            <Icon className="w-5 h-5 text-main" />
            {title}
        </h2>
    );
}
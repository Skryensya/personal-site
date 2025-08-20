import { Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';

interface ContactInfoProps {
    lang?: string;
}

export function ContactInfo({ lang = 'es' }: ContactInfoProps) {
    return (
        <div className="grid grid-cols-2 gap-4 text-left text-sm">
            <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-main flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">Email</p>
                    <a 
                        href="mailto:Allison.jpb+cv@gmail.com" 
                        className="text-main hover:underline break-words"
                    >
                        Allison.jpb+cv@gmail.com
                    </a>
                </div>
            </div>
            
            <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-main flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">Teléfono</p>
                    <a 
                        href="tel:+56998120052" 
                        className="text-main hover:underline"
                    >
                        +56 9 9812 0052
                    </a>
                </div>
            </div>
            
            <div className="flex items-start gap-2">
                <Linkedin className="w-4 h-4 text-main flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">LinkedIn</p>
                    <a 
                        href="https://linkedin.com/in/skryensya" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-main hover:underline break-words"
                    >
                        <span className="print:hidden">skryensya</span>
                        <span className="hidden print:inline">linkedin.com/in/skryensya</span>
                    </a>
                </div>
            </div>
            
            <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-main flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-main">Santiago de Chile</p>
                </div>
            </div>
            
            {/* Portafolio solo en impresión */}
            <div className="hidden print:flex items-start gap-2 col-span-2">
                <Globe className="w-4 h-4 text-main flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">Portafolio</p>
                    <p className="text-main">Skryensya.dev</p>
                </div>
            </div>
        </div>
    );
}
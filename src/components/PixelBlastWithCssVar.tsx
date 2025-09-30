import React from 'react';
import PixelBlast from './PixelBlast';
import { useCssVar } from '@/lib/utils';

type Props = React.ComponentProps<typeof PixelBlast> & {
    cssVar?: string; // por defecto '--color-main'
    fallbackColor?: string; // color de respaldo mientras resuelve la var
};

const PixelBlastWithCssVar: React.FC<Props> = ({ cssVar = '--color-main', fallbackColor, ...rest }) => {
    const main = useCssVar(cssVar); // lee y observa cambios de la variable
    const color = main || fallbackColor; // evita SSR mismatch
    return <PixelBlast {...rest} color={color} />;
};

export default PixelBlastWithCssVar;

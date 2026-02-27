import React from 'react';
import SimplePixelBlast from './SimplePixelBlast';
import { useCssVar } from '@/lib/utils';

type Props = React.ComponentProps<typeof SimplePixelBlast> & {
  cssVar?: string;
  fallbackColor?: string;
};

const SimplePixelBlastWithCssVar: React.FC<Props> = ({ cssVar = '--color-main', fallbackColor, ...rest }) => {
  const main = useCssVar(cssVar);
  const color = main || fallbackColor;
  return <SimplePixelBlast {...rest} color={color} />;
};

export default SimplePixelBlastWithCssVar;

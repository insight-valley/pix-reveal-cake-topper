import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Gift, 
  ArrowLeft, 
  Loader2,
  Check,
  CreditCard,
  Download,
  Palette,
  Search,
  X,
  QrCode,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Smartphone
} from 'lucide-react';

interface LordIconProps {
  src: string;
  size?: number;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'sequence';
  delay?: number;
  colors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    quaternary?: string;
  };
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Temporary icon mapping - we'll use Lucide icons as fallback until Lordicon is fixed
const getIconComponent = (src: string) => {
  if (src.includes('lomfljuq')) return Sparkles;
  if (src.includes('ohfmmfhn')) return Heart;
  if (src.includes('yxyampao')) return Star;
  if (src.includes('jxwksgwc')) return Gift;
  if (src.includes('zmkotitn')) return ArrowLeft;
  if (src.includes('msoeawqm')) return Loader2;
  if (src.includes('oqdmuxru')) return Check;
  if (src.includes('qhgmphtg')) return CreditCard;
  if (src.includes('wjmesuoc')) return CreditCard; // PIX icon fallback
  if (src.includes('jyunynsz')) return Download;
  if (src.includes('imamsnbq')) return Palette;
  if (src.includes('xfftupfv')) return Search;
  if (src.includes('nqtddedc')) return X;
  // Network icons
  if (src.includes('wifi-on')) return Wifi;
  if (src.includes('wifi-off')) return WifiOff;
  // Device icons
  if (src.includes('smartphone')) return Smartphone;
  return Sparkles; // Default fallback
};

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  size = 24,
  trigger = 'hover',
  delay = 0,
  colors,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const IconComponent = getIconComponent(src);
  
  const iconStyle = {
    color: colors?.primary || 'currentColor',
    ...(trigger === 'loop' && {
      animation: 'spin 2s linear infinite'
    })
  };

  const handleMouseEnter = () => {
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    onMouseLeave?.();
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className} ${trigger === 'hover' ? 'hover:scale-110 transition-transform' : ''}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <IconComponent 
        size={size} 
        style={iconStyle}
        className={trigger === 'loop' ? 'animate-spin' : ''}
      />
    </div>
  );
};

// Predefined icon components for common use cases
export const SparklesIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/lomfljuq.json" {...props} />
);

export const HeartIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/ohfmmfhn.json" {...props} />
);

export const StarIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/yxyampao.json" {...props} />
);

export const GiftIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/jxwksgwc.json" {...props} />
);

export const LoadingIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon 
    src="https://cdn.lordicon.com/msoeawqm.json" 
    trigger="loop"
    {...props} 
  />
);

export const CheckIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/oqdmuxru.json" {...props} />
);

export const ArrowLeftIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/zmkotitn.json" {...props} />
);

export const CreditCardIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/qhgmphtg.json" {...props} />
);

export const PixIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/wjmesuoc.json" {...props} />
);

export const DownloadIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/jyunynsz.json" {...props} />
);

export const PaletteIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/imamsnbq.json" {...props} />
);

export const SearchIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/xfftupfv.json" {...props} />
);

export const CloseIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/nqtddedc.json" {...props} />
);

export const QrCodeIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/qhgmphtg.json" {...props} />
);

export const CheckCircleIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/oqdmuxru.json" {...props} />
);

export const XCircleIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/nqtddedc.json" {...props} />
);

// Network icons
export const WifiIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/wifi-on.json" {...props} />
);

export const WifiOffIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/wifi-off.json" {...props} />
);

// Device icons
export const SmartphoneIcon: React.FC<Omit<LordIconProps, 'src'>> = (props) => (
  <LordIcon src="https://cdn.lordicon.com/smartphone.json" {...props} />
);
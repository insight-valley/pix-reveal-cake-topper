import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationData: Record<string, unknown>;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  style = {},
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Limpar animação anterior se existir
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Criar nova animação
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData,
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
};

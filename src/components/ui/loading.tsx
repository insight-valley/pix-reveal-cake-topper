import { LottieAnimation } from "../LottieAnimation";
import loadingAnimation from "../../../public/cake-loading-lottie.json";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-32 h-32",
  lg: "w-40 h-40",
};

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={sizeMap[size]}>
        <LottieAnimation
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          className="w-full h-full"
        />
      </div>
      {text && (
        <p className="text-primary font-semibold text-sm mt-4 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

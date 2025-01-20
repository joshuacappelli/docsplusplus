import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: keyof SizeProps; // Use keyof to ensure type safety
  color?: keyof StrokeProps; // Ensure color keys match StrokeProps
}

interface SizeProps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface StrokeProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

const sizesClasses: SizeProps = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

const strokeClasses: StrokeProps = {
  slate: "stroke-foreground",
  blue: "stroke-blue-500",
  red: "stroke-red-500",
  green: "stroke-emerald-500",
  white: "stroke-background",
};

export const Spinner = ({ size = "md", color = "slate" }: SpinnerProps) => {
  return (
    <div aria-label="Loading..." role="status">
      <Loader
        className={cn(
          "animate-spin",
          sizesClasses[size],
          strokeClasses[color]
        )}
      />
    </div>
  );
};

export const RoundSpinner = ({ size = "md", color = "slate" }: SpinnerProps) => {
  return (
    <div aria-label="Loading..." role="status">
      <svg
        className={cn("animate-spin", sizesClasses[size], strokeClasses[color])}
        viewBox="3 3 18 18"
      >
        <path
          className="opacity-20"
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        ></path>
        <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
      </svg>
    </div>
  );
};

interface DotsProps extends SpinnerProps {
  variant?: "v1" | "v2" | "v3" | "v4" | "v5";
}

export const Dots = ({ variant = "v1"}: DotsProps) => {
  switch (variant) {
    case "v1":
      return <Dots_v1/>;
    case "v2":
      return <Dots_v2/>;
    case "v3":
      return <Dots_v3/>;
    case "v4":
      return <Dots_v4/>;
    case "v5":
      return <Dots_v5/>;
    default:
      return <Dots_v1 />;
  }
};

export const Dots_v1 = () => (
  <div className="w-fit">
    <div className="relative flex size-full items-center justify-start">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute size-3.5 rounded-full bg-current"
          initial={{ scale: i === 0 ? 0 : 1 }}
          animate={{ scale: i === 0 ? 1 : 0 }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
          }}
          style={{ left: `${i * 6}rem` }}
        />
      ))}
    </div>
  </div>
);

export const Dots_v2 = () => (
  <div className="flex items-center justify-center space-x-2">
    {[0, 0.3, 0.6].map((delay, index) => (
      <motion.div
        key={index}
        className="size-3.5 rounded-full bg-current"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.1,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        }}
      />
    ))}
  </div>
);

export const Dots_v3 = () => (
  <div className="flex items-center justify-center space-x-2">
    {[0.3, 0.13, 0].map((delay, index) => (
      <div
        key={index}
        className={`size-3.5 animate-bounce rounded-full bg-current`}
        style={{ animationDelay: `${delay}s` }}
      ></div>
    ))}
  </div>
);

export const Dots_v4 = () => (
  <div className="flex items-center justify-center space-x-2">
    {[...Array(3)].map((_, index) => (
      <motion.span
        key={index}
        className="size-3.5 rounded-full bg-current"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: index * 0.2,
          duration: 1.2,
          repeat: Infinity,
        }}
      ></motion.span>
    ))}
  </div>
);

export const Dots_v5 = () => {
  const dots = 8;
  const radius = 24;

  return (
    <div className="relative size-20 border">
      {[...Array(dots)].map((_, i) => {
        const angle = (i / dots) * (2 * Math.PI);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <motion.div
            key={i}
            className="absolute size-2.5 rounded-full bg-current"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              delay: (i / dots) * 1.7,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

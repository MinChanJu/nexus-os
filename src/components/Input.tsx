import { LucideIcon } from "lucide-react";
import { LegacyAnimationControls, TargetAndTransition, Transition, VariantLabels, motion } from "motion/react";

interface InputProps {
  name: string;
  type: string;
  Icon?: LucideIcon;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  layout?: boolean;
  initial?: TargetAndTransition | VariantLabels | boolean;
  animate?: TargetAndTransition | VariantLabels | boolean | LegacyAnimationControls;
  exit?: TargetAndTransition | VariantLabels;
  transition?: Transition;
}

const Input = ({
  name,
  type,
  Icon,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
  layout,
  initial,
  animate,
  exit,
  transition,
}: InputProps) => {
  return (
    <motion.div layout={layout} initial={initial} animate={animate} exit={exit} transition={transition}>
      <div className="relative">
        {Icon && <Icon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-purple-400/60" />}
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pr-4 pl-12 text-white transition-all duration-300 placeholder:text-purple-300/40 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </motion.div>
  );
};

export default Input;

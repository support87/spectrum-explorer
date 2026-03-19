import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const OptionButton = ({ label, selected, onClick }: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-3.5 px-5 rounded-2xl text-left font-medium transition-all duration-300 border",
        selected
          ? "bg-primary/15 border-primary/30 text-foreground"
          : "bg-card border-transparent text-foreground hover:border-border"
      )}
    >
      {label}
    </button>
  );
};

export default OptionButton;

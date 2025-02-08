import { useRef, useEffect, ReactNode } from "react";

interface ClickOutsideProps {
  children: ReactNode;
  onClickOutside: () => void; // ✅ Ensure it's a function
  className?: string;
}

const ClickOutside = ({ children, onClickOutside, className }: ClickOutsideProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside(); // ✅ Ensure function exists
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;

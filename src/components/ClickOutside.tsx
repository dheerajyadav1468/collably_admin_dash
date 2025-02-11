import { useRef, useEffect, ReactNode, useCallback } from "react";

interface ClickOutsideProps {
  children: ReactNode;
  onClickOutside?: () => void; // ✅ Optional function, prevents undefined errors
  className?: string;
}

const ClickOutside = ({ children, onClickOutside, className }: ClickOutsideProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    try {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside?.(); // ✅ Safe function call (won't throw if undefined)
      }
    } catch (error) {
      console.error("Error in ClickOutside handler:", error);
    }
  }, [onClickOutside]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // ✅ Mobile-friendly
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;

import { useRef, useEffect } from "react"

const ClickOutside = ({ children, onClickOutside, className }: any) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClickOutside])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default ClickOutside


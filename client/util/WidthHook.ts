import { useState, useEffect, useCallback, Ref, RefObject } from "react";

function useWidth(elementRef: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0);

  const updateWidth = useCallback(() => {
    if (elementRef && elementRef.current) {
      const { width } = elementRef.current.getBoundingClientRect();
      setWidth(width);
    }
  }, [elementRef]);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  return width;
}

export default useWidth;

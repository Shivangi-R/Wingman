import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

interface IPortalProps {
  children: React.ReactNode;
  setOpened: (state: boolean) => void;
  closeOnEsc?: boolean;
}
const Portal = ({ children, setOpened, closeOnEsc }: IPortalProps) => {
  const [container] = useState(() => {
    return document.createElement("div");
  });

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpened(false);
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  });

  useEffect(() => {
    if (closeOnEsc) document.addEventListener("keydown", handleKeydown);
    return () => {
      if (closeOnEsc) document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};

export default Portal;

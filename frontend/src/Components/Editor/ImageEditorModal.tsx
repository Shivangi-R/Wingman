import React, { useEffect, useState } from "react";
import Portal from "src/Components/Utils/Portal";

export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);


interface IScreenEditorProps {
  visible: boolean;
  children: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
}
export const ImageEditorModal = ({
  visible,
  onOk,
  onCancel,
  children,
}: IScreenEditorProps) => {
  const [opened, setOpened] = useState(visible);

  useEffect(() => {
    setOpened(visible);
  }, [visible]);
  return (
    <>
      {!opened ? null : (
        <Portal setOpened={setOpened}>
          <div className="image-editor-modal-backdrop"></div>
          <div className="image-editor-modal">{children}</div>
        </Portal>
      )}
    </>
  );
};

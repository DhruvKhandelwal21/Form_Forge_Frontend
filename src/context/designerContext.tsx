import { ReactNode, createContext, useState } from "react";
import { FormElementInstance } from "@/components/fields/FormElement";

type DesignerContextType = {
  elements: FormElementInstance[];
  setElements: React.Dispatch<React.SetStateAction<FormElementInstance[]>>;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (elementId: string) => void;
  selectedElement: FormElementInstance;
  setSelectedElement: React.Dispatch<React.SetStateAction<FormElementInstance>>;
  updateElement: (elementId: string, element: FormElementInstance) => void;
};
export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance>(null);
  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };
  const removeElement = (elementId: string) => {
    const updatedElements = elements?.filter((ele) => ele.id !== elementId);
    setElements(updatedElements);
  };
  const updateElement = (elementId, element) => {
    const newElements = [...elements];
    const idx = elements.findIndex((ele) => ele.id === elementId);
    newElements[idx] = element;
    setElements(newElements);
  };

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        setElements,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}

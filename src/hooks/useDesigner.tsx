import { DesignerContext } from "@/context/designerContext";
import { useContext } from "react";

const useDesigner = () => {
  const context = useContext(DesignerContext);
  return context;
};
export default useDesigner;

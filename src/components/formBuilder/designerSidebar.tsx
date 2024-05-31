import useDesigner from "@/hooks/useDesigner";
import FieldPropertiesFormElement from "./FieldPropertiesFormElement";
import FormElementSidebar from "./formElementSidebar";

const DesignerSidebar = () => {
  const { selectedElement } = useDesigner();
  return (
    <div className="w-[400px] max-w-[400px] h-full flex flex-col flex-grow gap-2 border-l-2 border-muted bg-background overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 p-2">
      {!selectedElement && <FormElementSidebar />}
      {selectedElement && <FieldPropertiesFormElement />}
    </div>
  );
};

export default DesignerSidebar;

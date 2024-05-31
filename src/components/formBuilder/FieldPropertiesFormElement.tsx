import useDesigner from "@/hooks/useDesigner";
import { FormElements } from "../fields/FormElement";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const FieldPropertiesFormElement = () => {
  const { selectedElement, setSelectedElement } = useDesigner();
  const { type } = selectedElement;
  const PropertiesComponent = FormElements[type].propertiesComponent;
  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-foreground/70 text-sm">Element Properties</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSelectedElement(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <PropertiesComponent elementInstance={selectedElement} />
    </div>
  );
};

export default FieldPropertiesFormElement;

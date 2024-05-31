import {
  Active,
  DragEndEvent,
  DragOverlay,
  useDndMonitor,
  useDraggable,
} from "@dnd-kit/core";
import { ElementsType, FormElement, FormElements } from "../fields/FormElement";
import { Button } from "../ui/button";
import { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./sidebarBtnElement";
import useDesigner from "@/hooks/useDesigner";
function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { elements } = useDesigner();
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;
  let node = <div>Node</div>;
  const isSideBarElement = draggedItem?.data?.current?.isDesignerBtnElement;
  if (isSideBarElement) {
    const type = draggedItem?.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }
  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) node = <div>Element not found!</div>;
    else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
}
export default DragOverlayWrapper;
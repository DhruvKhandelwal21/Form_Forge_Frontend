import { FormElements } from "@/components/fields/FormElement";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useDesigner from "@/hooks/useDesigner";
import React from "react";

const PreviewDialogBtn = () => {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Preview</Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 ">
          <p className="text-lg font-bold text-foreground">Form Preview</p>
          <p className="text-sm text-forground">
            This is how your form will look to the users
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] overflow-y-auto h-full w-full">
          <div className="max-w-[700px] flex flex-col flex-grow gap-5 bg-background h-full w-full rounded-2xl p-5 overflow-y-auto">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return <FormComponent elementInstance={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialogBtn;

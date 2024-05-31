import Designer from "@/components/formBuilder/designer";
import PreviewDialogBtn from "@/components/formBuilder/designerButtons/PreviewDialogBtn";
import SaveFormBtn from "@/components/formBuilder/designerButtons/SaveFormBtn";
import PublishFormBtn from "@/components/formBuilder/designerButtons/publishFormBtn";
import DragOverlayWrapper from "@/components/formBuilder/dragOverlayWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import useDesigner from "@/hooks/useDesigner";
import useAxiosInstance from "@/hooks/useAxiosInstance";

const FormBuilder = () => {
  let { id } = useParams();
  const { axiosInstance } = useAxiosInstance();
  const { elements, setElements } = useDesigner();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setElements([]);
    try {
      const { data: data } = await axiosInstance.get(`form/${id}`);
      setFormData(data?.data);

      if (data?.data?.content) {
        const elements = JSON.parse(data?.data?.content);
        setElements(elements);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        variant: "destructive", 
        title: "Error",
        description: e?.message,
      });
    }
  };
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(touchSensor, mouseSensor);

  const isFormSaved = ()=>{
    const alreadySavedData = formData?.content;
    const latestData = JSON.stringify(elements);
    return latestData === alreadySavedData
  }

  const getToolTip = ()=>{
    if(!formData?.content){
      return 'Add some elements to the form'
    }else{
      const check = isFormSaved();
      if(!check) return 'Please save changes';
      return 'Publish'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <LoaderCircle className="animate-spin h-12 w-12" />
      </div>
    );
  }
  const shareUrl = `${window.location.origin}/submit/${formData?.shareUrl}`;
  if (formData?.published) {
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className="flex flex-col items-center justify-center h-full w-full mt-4">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 Form Published 🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copied!",
                    description: "Link copied to clipboard",
                  });
                }}
              >
                Copy link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link to={"/"} className="gap-2">
                  <ArrowLeft />
                  Go back home
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link to={`/form/${id}`} className="gap-2">
                  Form details
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {formData?.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!formData?.published && (
              <>
                <SaveFormBtn id={id} fetchData={fetchData} disabled={!elements?.length || isFormSaved()}/>
                <PublishFormBtn id={id} disabled={!formData?.content || !isFormSaved()} toolTip = {getToolTip()} />
              </>
            )}
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-hidden h-[565px] bg-accent bg-[url(/paper.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;

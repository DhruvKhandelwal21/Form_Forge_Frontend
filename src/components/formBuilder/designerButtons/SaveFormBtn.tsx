import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useDesigner from "@/hooks/useDesigner";
import { Import, LoaderCircle } from "lucide-react";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SaveFormBtn = ({ id, fetchData, disabled }) => {
  const { elements } = useDesigner();
  const {axiosInstance} = useAxiosInstance();
  const [loading, setLoading] = useState(false);

  const updateFormContent = async () => {
    setLoading(true);
    const content = JSON.stringify(elements);
    await axiosInstance
      .put(`form`, { content: content, id: id })
      .then(() => {
        setLoading(false);
        fetchData();
        toast({
          title: "Success",
          description: "Your form has been saved",
        });
      })
      .catch(() => {
        setLoading(false);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      });
  };

  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
      <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading || disabled}
      onClick={() => {
        updateFormContent();
      }}
    >
      <Import className="h-4 w-4" />
      Save
      {loading && <LoaderCircle strokeWidth={1} className="animate-spin" />}
    </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Please Save Changes</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
   
  );
};

export default SaveFormBtn;

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BookPlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const publishFormBtn = ({ id, disabled, toolTip }) => {
  const [loading, setLoading] = useState(false);
  const {axiosInstance} = useAxiosInstance();
  async function publishForm() {
    const values = {
      id: id,
      published: true
    }
    setLoading(true);
    await axiosInstance
      .put(`form`, values)
      .then(() => {
        setLoading(false);
        toast({
          title: "Success",
          description: "Your form has been published",
        });
        window.location.reload();
      })
      .catch(() => {
        setLoading(false);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400" disabled={disabled}>
          <BookPlus size={16} className="h-4 w-4" />
          Publish
        </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{toolTip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able
            to edit this form. <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              publishForm();
            }}
          >
            Proceed {loading && <LoaderCircle className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default publishFormBtn;

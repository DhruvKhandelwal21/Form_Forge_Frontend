import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  ExternalLink,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
import { useParams } from "react-router-dom";
import SubmissionsTable from "./SubmissionTable";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Separator } from "@/components/ui/separator";
import StatsCards from "@/components/statsCards";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Form = () => {
  const { id } = useParams();
  const { axiosInstance } = useAxiosInstance();
  const [formData, setFormData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    axiosInstance.get(`form/${id}`)
      .then(({ data }) => {
        let currentFormData = data?.data;
        let { submissions = 0, visits = 0 } = currentFormData;
        let submissionRate = 0;
        let bounceRate = 0;
        if(!submissions) submissions = 0;
        if (visits > 0) {
          submissionRate = (submissions / visits) * 100;
          bounceRate = 100 - submissionRate;
          currentFormData = { ...currentFormData, submissions, submissionRate, bounceRate };
        }
        setStatsData({visits, submissions, submissionRate, bounceRate})
        setFormData(currentFormData);
        setLoading(false);
      })
      .catch((e) => {
        toast({
          variant: "destructive", 
          title: "Error",
          description: e?.message,
        });
        setLoading(false);
      });
  };
  const shareLink = `${window.location.origin}/submit/${formData?.shareUrl}`;

  if (!formData) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoaderCircle className="animate-spin h-4 w-4" />
      </div>
    );
  }
  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-3xl font-semibold truncate">{formData.name}</h1>
          <Button
            className="w-[200px]"
            onClick={() => {
              window.open(shareLink, "_blank");
            }}
          >
            Visit
          </Button>
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={formData?.shareUrl} />
        </div>
      </div>
      <div className="w-full py-5 container">
        <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <RefreshCcw
                className="h-5 w-5 cursor-pointer"
                onClick={()=>{
                  fetchData();
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
        <StatsCards loading = {loading} statsData = {statsData} />
      </div>
      <Separator className="my-2" />
      <div className="container pt-1 overflow-y-auto">
        <SubmissionsTable formData={formData} />
      </div>
    </>
  );
};

export default Form;

const FormLinkShare = ({ shareUrl }: { shareUrl: string }) => {
  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <div className="flex flex-grow gap-4 items-center">
      <Input value={shareLink} readOnly />
      <Button
        className="w-[230px]"
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
        }}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Share link
      </Button>
    </div>
  );
};

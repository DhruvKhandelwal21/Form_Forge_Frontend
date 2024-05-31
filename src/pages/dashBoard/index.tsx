import CreateFormBtn from "@/components/formBuilder/designerButtons/CreateFormBtn";
import FormCards from "@/components/formCards";
import StatsCards from "@/components/statsCards";
import { toast } from "@/components/ui/use-toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";

const DashBoard = () => {
  const { axiosInstance } = useAxiosInstance();
  const [statsData, setStatsData] = useState(null);
  const [formsData, setFormsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => {
      controller.abort();
    };
  }, []);

  const fetchData = async (controller?:any) => {
    setLoading(true);
    try {
      const statData = await axiosInstance.get(`form/get-form-stats`,{ signal: controller?.signal });
      const formData = await axiosInstance.get(`form`,{ signal: controller?.signal });
      setLoading(false);
      setStatsData(statData?.data?.data);
      setFormsData(formData?.data?.data);
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive", 
        title: "Error",
        description: e?.message,
      });
      setLoading(false);
    }
  };
console.log(statsData)
  const handleDelete = async (id)=>{
    await axiosInstance.put(`form/remove`,{_id: id}).then(()=>{
      fetchData();
      toast({
        title: "Success",
        description: `Successfully Deleted`,
        variant: "default",
      });
    }).catch(()=>{
      toast({
        title: "Error",
        description: `Please try again`,
        variant: "destructive",
      });
    })
  }

  return (
    <div className="container pt-4">
      <StatsCards statsData = {statsData} loading = {loading} />
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-2">
        <CreateFormBtn />
        <FormCards allFormsData={formsData} loading={loading} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default DashBoard;

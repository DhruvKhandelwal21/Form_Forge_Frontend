import { ReactNode, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SubmissionsTable = ({ formData }) => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allColumns, setAllColumns] = useState([]);
  const { axiosInstance } = useAxiosInstance();
  useEffect(() => {
    fetchSubmissions();
  }, [formData]);

  useEffect(()=>{
    fetchColumns();
  },[])

  const fetchColumns = () => {
    let columns = JSON.parse(formData?.content);
    columns = columns?.map((col) => {
      return {
        id: col.id,
        label: col.extraAttributes.label,
        required: col.extraAttributes.required,
        type: col.type,
      };
    });
    setAllColumns(columns);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    axiosInstance
      .get(`/submit/${formData?._id}`)
      .then(({ data }) => {
        setLoading(false);
        let submissions = data?.data?.map((ele) => {
          return { ...JSON.parse(ele.data), createdAt: ele.createdAt };
        });
        setAllSubmissions(submissions);
      })
      .catch((e) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: e?.message,
        });
      });
  };
  if (loading) return <Skeleton className="h-full w-full" />;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Submissions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {allColumns?.map((col) => {
              return (
                <TableHead key={col.id} className="uppercase">
                  {col.label}
                </TableHead>
              );
            })}
            <TableHead className="text-muted-foreground text-right uppercase">
              Submitted at
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSubmissions?.map((row) => {
            return (
              <TableRow>
                {allColumns?.map((col) => {
                  return (
                    <RowCell key={col.id} type={col.type} value={row[col.id]} />
                  );
                })}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsTable;

const RowCell = ({ type, value }: { type: string; value: string }) => {
  let node: ReactNode = value;
  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <>{format(date, "dd/MM/yyyy")}</>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }
  return <TableCell>{node}</TableCell>;
};

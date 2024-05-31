import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MoveRight, SquareGanttChart, Trash, View } from "lucide-react";
import { Button } from "../ui/button";
import { formatDistance } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { useState } from "react";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { toast } from "../ui/use-toast";

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

const formCard = ({ form, loading, handleDelete }) => {
  if (loading)
    return (
      <FormCardSkeleton />
    );
  return (
    <>
      <Card className="border-neutral-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between mb-2">
            <span className="truncate font-semibold text-2xl">{form?.name}</span>
            {form?.published ? (
              <span className="text-xs font-medium bg-white text-black px-2 py-1 rounded-md">
                Published
              </span>
            ):(
              <Trash color="#d80e0e" className="h-5 w-5 cursor-pointer" onClick={()=> {
                handleDelete(form?._id);
              }} />
            )}
            {/* {!form?.published && < >Draft</>} */}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-muted-foreground text-sm mt-2">
            {formatDistance(form?.createdAt, new Date(), {
              addSuffix: true,
            })}
            {form?.published && (
              <span className="flex items-center gap-2">
                <View
                  className="text-muted-foreground w-4 h-4"
                  strokeWidth={1}
                />
                <span>{form?.visits?.toLocaleString() || 0}</span>
                <SquareGanttChart
                  className="text-muted-foreground w-4 h-4"
                  strokeWidth={1}
                />
                <span>{form?.submissions?.toLocaleString() || 0}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form?.description || "No description"}
        </CardContent>
        <CardFooter>
          {form?.published ? (
            <Button className="w-full mt-2 text-md">
              <Link
                to={`/form/${form?._id}`}
                className="flex gap-3 items-center"
              >
                View submissions <MoveRight />
              </Link>
            </Button>
          ) : (
            <Button className="w-full mt-2 text-md gap-4 border-red-500">
              <Link to={`/builder/${form?._id}`}>Edit Form</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default formCard;

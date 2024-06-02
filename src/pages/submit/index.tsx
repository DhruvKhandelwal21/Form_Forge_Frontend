import { useCallback, useEffect, useRef, useState } from "react";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { FormElements } from "@/components/fields/FormElement";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle, MousePointerClick } from "lucide-react";
import { useParams } from "react-router-dom";

const Submit = () => {
  const { shareId } = useParams();
  const { axiosInstance } = useAxiosInstance();
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successFullSubmit, setSuccessFullSubmit] = useState(false);
  const renderRef = useRef(null);

  useEffect(() => {
    if (renderRef.current) return;
    renderRef.current = true;
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    axiosInstance
      .put(`/form/${shareId}/get-form-content`)
      .then((data: { data }) => {
        setLoading(false);
        setFormData(data?.data?.data);
        const fields = JSON.parse(data?.data?.data?.content) || [];
        setElements(fields);
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

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const validateForm = () => {
    for (const field of elements) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }
    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setSubmitting(false);
      toast({
        title: "Error",
        description: "please check the form for errors",
        variant: "destructive",
      });
      return;
    }
    const jsonContent = JSON.stringify(formValues.current);
    await axiosInstance
      .post(`/submit`, { data: jsonContent, formId: formData?._id })
      .then(() => {
        setSubmitting(false);
        setSuccessFullSubmit(true);
        window.history.pushState(null, "", window.location.href);
        window.history.replaceState(null, "", window.location.href);
        toast({
          title: "Success",
          description: `Successfully submitted`,
          variant: "default",
        });
      })
      .catch((e) => {
        setSubmitting(false);
        toast({
          title: "Error",
          description: e?.message,
          variant: "destructive",
        });
      });
  };
  if (loading) {
    return (
      <div className=" h-screen w-full flex justify-center items-center">
        <LoaderCircle strokeWidth={1} className="animate-spin h-4 w-4" />
      </div>
    );
  }

  if (successFullSubmit) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl font-bold">Form submitted</h1>
          <p className="text-muted-foreground">
            Thank you for submitting the form, you can close this page now.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
        {elements.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
            handleSubmit();
          }}
          disabled={submitting}
        >
          {!submitting && (
            <>
              <MousePointerClick className="mr-2" />
              Submit
            </>
          )}
          {submitting && (
            <LoaderCircle strokeWidth={1} className="animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Submit;

import FormCard from "./formCard";
const index = ({allFormsData, loading, handleDelete}) => {
  return (
    <>
      {allFormsData ? (
        allFormsData.map((form) => (
          <FormCard key={form._id} form={form} loading={loading} handleDelete= {handleDelete} />
        ))
      ) : (
        null
      )}
    </>
  );
};

export default index;


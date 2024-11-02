const getAllValuesOfSpecificQuery = (query) => {
  const urlSearchParams = new URLSearchParams();

  return urlSearchParams.getAll(query);
};

const getValueOfSpecificQuery = (query) => {
  const urlSearchParams = new URLSearchParams();

  console.log(urlSearchParams);
  return urlSearchParams.get(query);
};

const addNewQuery = ({ newQueryValue, queryName }) => {
  const searchParams = new URLSearchParams(queryName);
  console.log(searchParams);

  searchParams.set("clothes");
};

export { addNewQuery, getValueOfSpecificQuery };

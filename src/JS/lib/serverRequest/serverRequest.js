const fetchData = async (url) => {
  const res = await fetch(url);
  const result = await res.json();
  return result;
};

export { fetchData };

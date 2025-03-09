const getChartsData = async () => {
  const response = await fetch('http://localhost:3333/charts-data');
  return await response.json();
}

export const ChartRequests = {
  getChartsData
}

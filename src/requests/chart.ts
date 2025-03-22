import { env } from "~/env";

const getDashboardData = async () => {
  const response = await fetch(`${env.VITE_API_ENDPOINT}/dashboard_data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await response.json()
}

export const DashboardRequests = {
  getDashboardData
}

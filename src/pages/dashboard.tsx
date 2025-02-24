import { useQuery } from "@tanstack/react-query"
import { formatPriceInReais } from "../utils"

export const Dashboard = () => {

  const { data: dashboardData } = useQuery({
    queryKey: ['getDashboardData'],
    queryFn: getDashboardData
  })

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <p>Dívidas recorrentes</p>
        <p>{formatPriceInReais(dashboardData?.totalFixedExpenses)}</p>
      </div>
    </div>
  )
}

const getDashboardData = async () => {
  const response = await fetch(`http://localhost:3333/dashboard-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await response.json()
}
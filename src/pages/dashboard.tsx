import { useQuery } from "@tanstack/react-query"
import { formatPriceInReais } from "../utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Minus } from "lucide-react"
import { ExpensesByCategoryChart } from "~/components/expenses-by-category-chart"

export const Dashboard = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ['getDashboardData'],
    queryFn: getDashboardData
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>Despesas Fixas</CardTitle>
                <CardDescription>Total de despesas fixas</CardDescription>
              </div>

              <div>
                <Minus className="text-[#8c78ba]" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">{formatPriceInReais(dashboardData?.totalFixedExpenses)}</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>Despesas Mensais</CardTitle>
                <CardDescription>Despesas realizadas esse mês</CardDescription>
              </div>

              <div>
                <Minus className="text-[#8c78ba]" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">{formatPriceInReais(dashboardData?.totalMonthlyExpenses)}</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>Despesas para o próximo mês</CardTitle>
                <CardDescription>Despesas previstas para o mês que vem</CardDescription>
              </div>

              <div>
                <Minus className="text-[#8c78ba]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{formatPriceInReais(dashboardData?.totalNextMonthExpenses)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <ExpensesByCategoryChart />
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

import { useQuery } from "@tanstack/react-query"
import { formatPriceInReais } from "../utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Minus } from "lucide-react"
import { ExpensesByCategoryChart } from "~/components/expenses-by-category-chart"
import { DashboardRequests } from "~/requests/chart"

export const Dashboard = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ['getDashboardData'],
    queryFn: DashboardRequests.getDashboardData
  })

  const data = dashboardData?.dashboard_data

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
            <p className="text-lg font-semibold">{formatPriceInReais(data?.fixed_expenses)}</p>
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
            <p className="text-lg font-semibold">{formatPriceInReais(data?.monthly_expenses)}</p>
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
            <p className="text-lg font-semibold">{formatPriceInReais(data?.next_month_expeses)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <ExpensesByCategoryChart />
      </div>
    </div>
  )
}


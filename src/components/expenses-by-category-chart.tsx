
"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import { ChartRequests } from "~/requests/chart"

const chartConfig = {
  spent: {
    label: "Gasto",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

export function ExpensesByCategoryChart() {
  const { data: chartsData } = useQuery({
    queryKey: ['getChartsData'],
    queryFn: ChartRequests.getChartsData
  });

  const chartData = chartsData?.spentsByCategory ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>ToDo: Filtro por data</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-48 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 25,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="spent" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


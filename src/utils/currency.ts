const formatCurrencyToFloat = (value: string): number => {
  const cleanValue = +value.replace(/\D/g, '')
  return cleanValue / 100
}

const formatFloatToCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
}

export const CurrencyUtils = {
  formatCurrencyToFloat,
  formatFloatToCurrency
}

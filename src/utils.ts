export const formatPriceInReais = (cents: number): string => {
  if (cents <= 0) return 'R$ 0,00'

  const formattedPrice = (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formattedPrice;
}

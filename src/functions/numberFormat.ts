export default function numberFormat(number: number) {
  return new Intl.NumberFormat('ru-RU').format(number);
}

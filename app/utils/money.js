export default function money(value) {
  return (value || (value == 0)) ? (value / 100).toFixed(2) : '';
}

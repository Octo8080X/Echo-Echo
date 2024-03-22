// 引数で耐えられた文字列を0埋めして返す
export function zeroPadding(num: number, length: number) {
  return ("0000000000" + num).slice(-length);
}
export function getFormatTime(src: Date) {
  const year = src.getFullYear();
  const month = zeroPadding(src.getMonth() + 1, 2);
  // 日を01-32の2桁の数字に変換
  const date = zeroPadding(src.getDate(), 2);
  const hours = zeroPadding(src.getHours(), 2);
  const minutes = zeroPadding(src.getMinutes(), 2);
  const seconds = zeroPadding(src.getSeconds(), 2);
  return `${year}-${month}-${date}-${hours}:${minutes}:${seconds}`;
}

// 引数で与えられた数字の日数分の前の年月日YYYY-MM-DD形式で返す
export function getBeforeDate(date: Date, days: number) {
  date.setDate(date.getDate() - days);
  console.log("date: ", date.getTime())
  return getFormatTime(date);
}

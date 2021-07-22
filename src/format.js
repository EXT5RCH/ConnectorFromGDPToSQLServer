/*
 * 前ゼロ処理
 */
function addZero(i) {
  return Number(i) < 10 ? "0" + i : String(i);
}

/*
 * 日時型に適した値にフォーマット
 */
function dateTimeFormat(value) {
  if (value === null) return value;
  dd = new Date(value.getTime());
  return (
    dd.getUTCFullYear() +
    addZero(dd.getMonth() + 1) +
    addZero(dd.getDate()) +
    addZero(dd.getHours()) +
    addZero(dd.getMinutes()) +
    addZero(dd.getSeconds())
  );
}

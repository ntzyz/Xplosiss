function pad (num) {
  let tmp = '000' + num.toString();
  return tmp.substr(tmp.length - 2);
}

export default function timeToString (timestamp, dateOnly) {
  let date = new Date(timestamp);
  if (dateOnly) {
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  } else {
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}

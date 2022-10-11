function genDate(input) {
  let input_split = input.split("T");
  if (input_split === undefined || input_split === null) {
    return input;
  }
  let d, m, y;
  if (input_split.length > 0) {
    let date = input_split[0].split("-");
    d = date[2];
    m = date[1];
    y = date[0];
    // console.log(m);
  } else {
    return input;
  }
  return `${d} ${month[parseInt(m)]} ${y}`;
}
const month = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEPT",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

export default genDate;

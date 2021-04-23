import React from "react";
import { FixedSizeList } from "react-window";
import moment from "moment";

import "./styles.css";

const DateRange = ({ data }) => {
  const Row = ({ index, style }) => (
    <div className={"Ranges"} style={style}>
      {moment(data[index].startRange).format("DD-MMM-YYYY") +
        " - " +
        moment(data[index].endRange).format("DD-MMM-YYYY")}
    </div>
  );

  return (
    <FixedSizeList
      height={250}
      width={300}
      itemCount={data.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
};

export default DateRange;

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import React, { Component } from "react";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory, {
  selectFilter,
  dateFilter,
  textFilter
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

const origRows = [
  {
    id: 1233,
    request_date: "2018-06-10",
    requested_by: "Andrew Jennings",
    measurement_stream: ["Real Power Consumed (kW)"].join(", "),
    details: `
      Start Date: 10/04/2018
      End Date: 10/05/2018
      Timezone: Australia/Sydney,
      Measurement Data Period: 30 mins
      # Meters: 30
    `,
    link_expiry: new Date("10/07/2018"),
    status: "Ready"
  },
  {
    id: 112412,
    request_date: "2018-06-10",
    requested_by: "Hagrid Jennings",
    measurement_stream: ["Energy Consumed (kWh)"].join(", "),
    details: `
      Start Date: 10/03/2018
      End Date: 10/04/2018
      Timezone: Australia/Sydney,
      Measurement Data Period: 15 mins
      # Meters: 30
    `,
    link_expiry: new Date("10/07/2018"),
    status: "Processing"
  }
];
let manyRows = [];

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

for (let i = 0; i < 1000; i++) {
  manyRows.push(
    Object.assign({}, origRows[0], {
      id: Math.floor(Math.random() * 1000),
      request_date: addDays(new Date(), Math.floor(Math.random() * 100))
    })
  );
  manyRows.push(
    Object.assign({}, origRows[1], {
      id: Math.floor(Math.random() * 1000),
      request_date: addDays(new Date(), Math.floor(Math.random() * 100))
    })
  );
}

function getAvailableOptions(columnKey) {
  const options = origRows.reduce((availableOptions, row) => {
    availableOptions.add(row[columnKey]);
    return availableOptions;
  }, new Set());

  return [...options].reduce((result, option) => {
    result[option] = option;
    return result;
  }, {});
}

const columns = [
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: selectFilter({
      options: getAvailableOptions("status")
    })
  },
  {
    dataField: "request_date",
    text: "Request Date",
    width: 150,
    filterable: true,
    sort: true,
    filter: dateFilter()
  },
  {
    dataField: "requested_by",
    text: "Requested By",
    width: 150,
    filterable: true,
    sort: true,
    filter: selectFilter({
      options: getAvailableOptions("requested_by")
    })
  },
  {
    dataField: "details",
    text: "Details",
    filter: textFilter()
  },
  {
    dataField: "measurement_stream",
    text: "Measurement Streams",
    width: 250,
    filterable: true,
    sort: true,
    filter: selectFilter({
      options: getAvailableOptions("measurement_stream")
    })
  },
  {
    dataField: "link_expiry",
    text: "Link Expiry",
    width: 150,
    filterable: true,
    sort: true,
    filter: dateFilter()
  }
];

class DataJunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: manyRows.slice(0)
    };
  }

  render() {
    return (
      <BootstrapTable
        keyField="id"
        data={this.state.rows}
        columns={columns}
        filter={filterFactory()}
        pagination={paginationFactory()}
        selectRow={{
          mode: "checkbox",
          clickToSelect: true
        }}
      />
    );
  }
}

export default DataJunction;

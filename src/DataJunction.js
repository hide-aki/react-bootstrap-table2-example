import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, {
  dateFilter,
  selectFilter,
  textFilter
} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import overlayFactory from 'react-bootstrap-table2-overlay';
import paginationFactory from 'react-bootstrap-table2-paginator';

const origRows = [
  {
    details: `
    Start Date: 10/04/2018
    End Date: 10/05/2018
    Timezone: Australia/Sydney,
    Measurement Data Period: 30 mins
    # Meters: 30
    `,
    download_url: 'blahbah.com/bah.csv',
    id: 1233,
    link_expiry: new Date('10/07/2018'),
    measurement_stream: ['Real Power Consumed (kW)'].join(', '),
    request_date: '2018-06-10',
    requested_by: 'Andrew Jennings',
    status: 'Ready'
  },
  {
    details: `
      Start Date: 10/03/2018
      End Date: 10/04/2018
      Timezone: Australia/Sydney,
      Measurement Data Period: 15 mins
      # Meters: 30
    `,
    download_url: 'blahbah.com/bah.csv',
    id: 112412,
    link_expiry: new Date('10/07/2018'),
    measurement_stream: ['Energy Consumed (kWh)'].join(', '),
    request_date: '2018-06-10',
    requested_by: 'Hagrid Jennings',
    status: 'Processing'
  }
];

const manyRows = [];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

let baseID = 0;

for (let i = 0; i < 1000; i += 1) {
  manyRows.push({
    ...origRows[0],
    id: baseID,
    request_date: addDays(new Date(), Math.floor(Math.random() * 100))
  });
  baseID += 1;
  manyRows.push({
    ...origRows[1],
    id: baseID,
    request_date: addDays(new Date(), Math.floor(Math.random() * 100))
  });
  baseID += 1;
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

function multiLineFormatter(cellContents) {
  return (
    <React.Fragment>
      {cellContents
        .split('\n')
        .filter(text => text)
        .map(text => <p key={text}>{text}</p>)}
    </React.Fragment>
  );
}

function linkFormatter(cellContents) {
  if (cellContents) {
    return (
      <a href={cellContents} title="Download File">
        Download
      </a>
    );
  }
  // TODO - clock icon
  return <i className="fas fa-clock" />;
}

const columns = [
  {
    dataField: 'request_date',
    filter: dateFilter(),
    text: 'Request Date'
  },
  {
    dataField: 'measurement_stream',
    filter: selectFilter({
      options: { ...getAvailableOptions('measurement_stream') }
    }),
    text: 'Measurement Stream'
  },
  {
    dataField: 'details',
    filter: textFilter(),
    formatter: multiLineFormatter,
    text: 'Data Export Details'
  },
  {
    dataField: 'requested_by',
    filter: selectFilter({
      options: { ...getAvailableOptions('requested_by') }
    }),
    text: 'Requested By'
  },
  {
    dataField: 'download_url',
    formatter: linkFormatter,
    headerStyle: () => {
      return { width: '80px', textAlign: 'center' };
    },
    text: 'Download'
  },
  {
    dataField: 'status',
    filter: selectFilter({
      options: {
        'Processing': 'Processing',
        'Ready': 'Ready',
      }
    }),
    text: 'Status'
  },
  {
    dataField: 'link_expiry',
    filter: dateFilter(),
    text: 'Link Expiry'
  }
];

class DataJunction extends Component {
  state = {
    rows: manyRows.slice(0)
  };

  render() {
    return (
      <BootstrapTable
        keyField="id"
        data={this.state.rows}
        columns={columns}
        filter={filterFactory()}
        pagination={paginationFactory()}
        overlay={overlayFactory({
          background: 'rgba(192,192,192,0.3)',
          spinner: true
        })}
        loading={false}
      />
    );
  }
}

export default DataJunction;

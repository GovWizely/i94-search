import React, { PropTypes } from 'react';
import { values, pickBy, has } from '../../utils/lodash';
import moment from 'moment';
import RC2 from 'react-chartjs2';
import GraphColors from './GraphColors';

const TotalsChartPair = ({ data }) => {
  const dates = Object.keys(data.total_arrivals);

  const first_year = moment(dates[0]).format('YYYY');
  const second_year = moment(dates[dates.length - 1]).format('YYYY');

  const first_data = pickBy(data.total_arrivals, function(value, key) {
    return key.includes(first_year);
  });

  const second_data = pickBy(data.total_arrivals, function(value, key) {
    return key.includes(second_year);
  });

  const chartOneData = {
    labels: Object.keys(first_data),
    datasets: [
        {
            label: 'Total Arrivals',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(first_data),
        },
    ]
  };

  const chartTwoData = {
    labels: Object.keys(second_data),
    datasets: [
        {
            label: 'Total Arrivals',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(second_data),
        },
    ]
  };

  const chartOneOptions = {
        title: {
            display: true,
            text: first_year + ' Total Arrivals Over Time'
        },
        legend: {
            display: false
        },
        scales: { 
          yAxes: [{
              ticks: {
                    maxTicksLimit: 15
                  }
            }]
        }
    }
  const chartTwoOptions = {
        title: {
            display: true,
            text: second_year + ' Total Arrivals Over Time'
        },
        legend: {
            display: false
        },
        scales: { 
          yAxes: [{
              ticks: {
                      maxTicksLimit: 15
                  }
            }]
        }
    }
  return (
    <div>
      <RC2 className='line-graph' data={chartOneData} options={chartOneOptions} type='line'/>
      <RC2 className='line-graph' data={chartTwoData} options={chartTwoOptions} type='line'/>
    </div>
  )
}

const VisaTypesChartPair = ({ data }) => {
  const dates = Object.keys(data.business_visa_arrivals);

  const first_year = moment(dates[0]).format('YYYY')
  const second_year = moment(dates[dates.length - 1]).format('YYYY')

  const first_data_business = pickBy(data.business_visa_arrivals, function(value, key) {
    return key.includes(first_year);
  });

  const second_data_business = pickBy(data.business_visa_arrivals, function(value, key) {
    return key.includes(second_year);
  });

  const first_data_pleasure = pickBy(data.pleasure_visa_arrivals, function(value, key) {
    return key.includes(first_year);
  });

  const second_data_pleasure = pickBy(data.pleasure_visa_arrivals, function(value, key) {
    return key.includes(second_year);
  });

  const first_data_student = pickBy(data.student_visa_arrivals, function(value, key) {
    return key.includes(first_year);
  });

  const second_data_student = pickBy(data.student_visa_arrivals, function(value, key) {
    return key.includes(second_year);
  });

  const chartOneData = {
    labels: Object.keys(first_data_business),
    datasets: [
        {
            label: 'Business Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(first_data_business),
        },
        {
            label: 'Pleasure Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(192,75,192,0.4)',
            borderColor: 'rgba(192,75,192,1)',
            pointBorderColor: 'rgba(192,75,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(first_data_pleasure),
        },
        {
            label: 'Student Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(192,192,75,0.4)',
            borderColor: 'rgba(192,192,75,1)',
            pointBorderColor: 'rgba(192,192,75,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(first_data_student),
        }
    ]
  };

  const chartTwoData = {
    labels: Object.keys(second_data_business),
        datasets: [
        {
            label: 'Business Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(second_data_business),
        },
        {
            label: 'Pleasure Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(192,75,192,0.4)',
            borderColor: 'rgba(192,75,192,1)',
            pointBorderColor: 'rgba(192,75,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(second_data_pleasure),
        },
        {
            label: 'Student Visa Arrivals',
            fill: false,
            backgroundColor: 'rgba(192,192,75,0.4)',
            borderColor: 'rgba(192,192,75,1)',
            pointBorderColor: 'rgba(192,192,75,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            data: values(second_data_student),
        }
    ]
  };
  const chartOneOptions = {
        title: {
            display: true,
            text: first_year + ' Visa Type Arrivals Over Time'
        },
        legend: {
            display: true
        },   
        scales: {       
          yAxes: [{
              ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 15
                  }
            }]
        }
    }
  const chartTwoOptions = {
        title: {
            display: true,
            text: second_year + ' Visa Type Arrivals Over Time'
        },
        legend: {
            display: true
        },   
        scales: {       
          yAxes: [{
              ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 15
                  }
            }]
        }
    }
  return (
    <div>
      <RC2 className='line-graph' data={chartOneData} options={chartOneOptions} type='line'/>
      <RC2 className='line-graph' data={chartTwoData} options={chartTwoOptions} type='line'/>
    </div>
  )
}


const PortsChartPair = ({ data }) => {

  const dates = Object.keys(data.ports_arrivals);
  const first_year = moment(dates[0]).format('YYYY');
  const second_year = moment(dates[dates.length - 1]).format('YYYY');
  
  const first_data = {};
  const second_data = {};

  for (let k in data.ports_arrivals) {
    let entry_array = data.ports_arrivals[k];

    for (let i = 0; i < entry_array.length; i++) {
      let entry = entry_array[i];
      if (k.includes(first_year)) {
        if (!has(first_data, entry.port))
          first_data[entry.port] = {}; 
        first_data[entry.port][k] = entry.amount;
      }
      if (k.includes(second_year)) {
        if (!has(second_data, entry.port))
          second_data[entry.port] = {}; 
        second_data[entry.port][k] = entry.amount;
      }
    }
  }

  const chart_one_datasets = [];
  let chart_one_keys;
  let color_index = 0;

  for (let k in first_data) {
    let entry = first_data[k];
    chart_one_keys = chart_one_keys ? chart_one_keys : Object.keys(entry);
    let dataset = {
      label: k,
      fill: false,
      backgroundColor: 'rgba(' + GraphColors[color_index] + ',0.4)',
      borderColor: 'rgba(' + GraphColors[color_index] + ',1)',
      pointBorderColor: 'rgba(' + GraphColors[color_index] + ',1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHitRadius: 10,
      data: values(entry)
    }
    color_index += 1;
    chart_one_datasets.push(dataset)
    if (color_index >= 10) break;
  }

  const chart_two_datasets = [];
  let chart_two_keys;
  color_index = 0;

  for (let k in first_data) { // We want 2nd datasets to have the same keys
    let entry = second_data[k];
    chart_two_keys = chart_two_keys ? chart_two_keys : Object.keys(entry);
    let dataset = {
      label: k,
      fill: false,
      backgroundColor: 'rgba(' + GraphColors[color_index] + ',0.4)',
      borderColor: 'rgba(' + GraphColors[color_index] + ',1)',
      pointBorderColor: 'rgba(' + GraphColors[color_index] + ',1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHitRadius: 10,
      data: values(entry)
    }
    color_index += 1;
    chart_two_datasets.push(dataset)
    if (color_index >= 10) break;
  }

  const chartOneData = {
    labels: chart_one_keys,
    datasets: chart_one_datasets
  };

  const chartTwoData = {
    labels: chart_two_keys,
    datasets: chart_two_datasets
  };
  const chartOneOptions = {
        title: {
            display: true,
            text: first_year + ' Top 10 Ports Arrivals Over Time'
        },
        legend: {
            display: true
        },
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 15
                }
          }]
        }
    };
  const chartTwoOptions = {
        title: {
            display: true,
            text: second_year + ' Top 10 Ports Arrivals Over Time'
        },
        legend: {
            display: true
        },
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 15
                }
          }]
        }
    };
  return (
    <div>
      <RC2 className='line-graph' data={chartOneData} options={chartOneOptions} type='line'/>
      <RC2 className='line-graph' data={chartTwoData} options={chartTwoOptions} type='line'/>
    </div>
  )
}

export {
  TotalsChartPair,
  VisaTypesChartPair,
  PortsChartPair
};
import React, { useEffect, useState } from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral";
import "./LineGraph.css";

const DATA_URL = "https://disease.sh/v3/covid-19/historical/all?lastdays=120";

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 40)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 2000,
    },
  };

const LineGraph = (props) => {
    const [data, setData] = useState([]);
    
    //Retrieve the data.
    useEffect(() => {
        (async () => {
            await fetch(DATA_URL)
                  .then(res => res.json())
                  .then(data => {
                      setData(buildChartData(data));
                  });
        })();
    }, [props.casesType]);

    //Build data in an appropriate format for the Chart component.
    const buildChartData = (data) => {
        const chartData = [];
        let prevValue;
        for(let date in data[props.casesType]) {
            if(prevValue) {
                const dataPoint = {
                    x: date,
                    y: data[props.casesType][date] - prevValue
                };
                chartData.push(dataPoint);
            }
            prevValue = data[props.casesType][date];
        };
        return chartData;
    };

    return (
        <div className="LineGraph">
            <div className="LineGraph-title">
                <p>WorldWide new {props.casesType}</p>
            </div>
            {data?.length > 0 && (<Line 
                data={{
                    datasets: [
                    {
                        backgroundColor: casesTypeColors[props.casesType].rgb,
                        borderColor: casesTypeColors[props.casesType].hex,
                        data: data,
                    }]}}
                options={options}
                />
            )}
        </div>
    );
};

export default LineGraph;
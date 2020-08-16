import React, { Fragment, useState, useEffect } from "react";
import Chart from "chart.js";

function User({
  patientId,
  groupCode,
  groupName,
  setChange,
  biggestChanges,
  FName,
  LName,
}) {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);

  const toggleView = () => {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };

  const getInfo = async () => {
    try {
      const body = {
        patientId: patientId,
        groupCode: groupCode,
        groupName: groupName,
      };
      const response = await fetch("/server/patients", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(body),
      });
      const parsed = await response.json();
      setData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const findChange = () => {
    if (!data || data.length === 0) return;

    let Hdiff = 0;
    let Rdiff = 0;
    let Sdiff = 0;
    let Pdiff = 0;
    let HRDiff = {};
    let RRDiff = {};
    let pefrDiff = {};
    let spo2Diff = {};

    for (let i = 1; i < data.length; i++) {
      if (Math.abs(data[i].heartrate - data[i - 1].heartrate) > Hdiff) {
        Hdiff = Math.abs(data[i].heartrate - data[i - 1].heartrate);
        HRDiff = data[i];
      }
      if (Math.abs(data[i].resprate - data[i - 1].resprate) > Rdiff) {
        Rdiff = Math.abs(data[i].resprate - data[i - 1].resprate);
        RRDiff = data[i];
      }
      if (Math.abs(data[i].pefr - data[i - 1].pefr) > Pdiff) {
        Pdiff = Math.abs(data[i].pefr - data[i - 1].pefr);
        pefrDiff = data[i];
      }
      if (Math.abs(data[i].spo2 - data[i - 1].spo2) > Sdiff) {
        Sdiff = Math.abs(data[i].spo2 - data[i - 1].spo2);
        spo2Diff = data[i];
      }
    }

    const changeInfo = {
      heartInfo: HRDiff,
      respInfo: RRDiff,
      pefrInfo: pefrDiff,
      spo2Info: spo2Diff,
      FName: FName,
      LName: LName,
      PDiff: Pdiff,
      SDiff: Sdiff,
      HDiff: Hdiff,
      RDiff: Rdiff,
    };

    const changes = [...biggestChanges];
    changes.push(changeInfo);

    setChange([...biggestChanges, changeInfo]);
  };

  //HOOKS

  useEffect(() => {
    findChange();
  }, [data]);

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (!toggle) return;
    const heartRatePoints = data.map((datapoint) => {
      const point = {
        x: new Date(datapoint.datadate),
        y: datapoint.heartrate,
      };
      return point;
    });
    const respRatePoints = data.map((datapoint) => {
      const point = {
        x: new Date(datapoint.datadate),
        y: datapoint.resprate,
      };
      return point;
    });
    const pefrPoints = data
      .filter(
        (datapoint) =>
          datapoint.pefr !== undefined ||
          datapoint.pefr !== null ||
          datapoint.pefr
      )
      .map((datapoint) => {
        const point = {
          x: new Date(datapoint.datadate),
          y: datapoint.pefr,
        };
        return point;
      });
    const spo2Points = data
      .filter(
        (datapoint) =>
          datapoint.spo2 !== undefined ||
          datapoint.spo2 !== null ||
          datapoint.spo2
      )
      .map((datapoint) => {
        const point = {
          x: new Date(datapoint.datadate),
          y: datapoint.spo2,
        };
        return point;
      });

    //MANAGING CHARTS

    const ctx1 = document.getElementById("chart").getContext("2d");
    const ctx2 = document.getElementById("chart-2").getContext("2d");

    const chart1 = new Chart(ctx1, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Heart Rate (Beats Per Minute)",
            data: heartRatePoints,
            backgroundColor: "rgba(221, 63, 63, 0.7)",
            pointBackgroundColor: "rgba(221, 63, 63, 0.5)",
            pointBorderColor: "rgba(221, 63, 63, 1)",
            pointRadius: 7,
            pointHoverRadius: 13,
          },
          {
            label: "Respiratory Rate (Breaths Per Minute)",
            data: respRatePoints,
            backgroundColor: "rgba(63, 79, 221, 0.7)",
            pointBackgroundColor: "rgba(63, 79, 221, 0.5)",
            pointBorderColor: "gba(63, 79, 221, 1)",
            pointRadius: 10,
            pointHoverRadius: 15,
          },
        ],
      },
      options: {
        aspectRatio: 1,

        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 20,
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
            },
          ],
        },
      },
    });
    const chart2 = new Chart(ctx2, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Peak Expiratory Flow Rate",
            data: pefrPoints,
            backgroundColor: "rgba(218, 221, 63, 0.7)",
            pointBackgroundColor: "rgba(218, 221, 63, 0.5)",
            pointBorderColor: "rgba(218, 221, 63, 1)",
            pointRadius: 7,
            pointHoverRadius: 13,
          },
          {
            label: "Blood-Oxygen Saturation",
            data: spo2Points,
            backgroundColor: "rgba(221, 100, 63, 0.7)",
            pointBackgroundColor: "rgba(221, 100, 63, 0.5)",
            pointBorderColor: "rgba(221, 100, 63, 1)",
            pointRadius: 7,
            pointHoverRadius: 13,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 20,
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
            },
          ],
        },
      },
    });
  }, [data, toggle]);

  return (
    <Fragment>
      <div className="container my-10">
        <div className="title-thin my-10">
          <h2>
            {FName}, {LName}
          </h2>
        </div>

        <button
          type="button"
          className="help-button"
          onClick={(e) => toggleView()}
        >
          Info
        </button>

        {toggle && (
          <div className="charts">
            <canvas id="chart"></canvas>
            <canvas id="chart-2"></canvas>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default User;

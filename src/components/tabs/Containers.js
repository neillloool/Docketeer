/* eslint-disable react/prop-types */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ToggleDisplay from '../display/ToggleDisplay';

/**
 *
 * @param {*} props
 * Display all running and stopped containers
 */
const Containers = (props) => {
  const renderStoppedList = props.stoppedList.map((container, i) => {
    return (
      <div className="box" key={`stoppedBox-${i}`}>
        <div className="box-label">
          <h3>{container.Names}</h3>
          <p>ID: {container.ID}</p>
        </div>

        <div className="stopped-info">
          <li>Img: {container.Image}</li>
          <li>Created: {container.RunningFor}</li>
          <li>name: {container.Names}</li>
        </div>
        <div className="stopped-button">
          <button
            className="run-btn"
            onClick={() =>
              props.runStopped(container['ID'], props.runStoppedContainer)
            }
          >
            RUN
          </button>
          <button
            className="stop-btn"
            onClick={() => props.remove(container['ID'], props.removeContainer)}
          >
            REMOVE
          </button>
        </div>
      </div>
    );
  });

  const renderRunningList = props.runningList.map((container, i) => {
    const cpuData = parseFloat(
      container.CPUPerc.substring(0, container.CPUPerc.length - 1)
    ).toFixed(2);
    const memoryData = parseFloat(
      container.MemPerc.substring(0, container.MemPerc.length - 1)
    ).toFixed(2);
    const stack = 'stack';
    const chartInfo = {
      labels: ['CPU', 'Memory'],
      datasets: [
        {
          stack,
          label: Math.random(),
          backgroundColor: ['rgba(44, 130, 201, 1)', 'rgba(19, 221, 29, 1)'],
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 1,
          data: [cpuData, memoryData],
          barPercentage: 0.4,
        },
        {
          stack,
          label: Math.random(),
          backgroundColor: ['rgba(155, 198, 233, 1)', 'rgba(217, 252, 219, 1)'],
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 1,
          data: [(100 - cpuData).toFixed(2), (100 - memoryData).toFixed(2)],
          barPercentage: 0.4,
        },
      ],
    };

    return (
      <div className="box box-running" key={`runningBox-${i}`}>
        <div className="box-label">
          <h3>{container.Name}</h3>
          <p>ID: {container.ID}</p>
        </div>
        <div className="box-info">
          <div className="chart">
            <div className="chart-label">
              <div className="chart-label-container">
                <div className="cpuBox"></div>
                <div>
                  <span className="chart-label-text">{cpuData}%</span>
                </div>
              </div>
              <div className="chart-label-container">
                <div className="memoryBox"></div>
                <div>
                  <span className="chart-label-text">{memoryData}%</span>
                </div>
              </div>
            </div>
            <div className="chart-info">
              <Bar
                data={chartInfo}
                options={{
                  tooltips: {
                    enabled: false,
                  },
                  title: {
                    display: false,
                  },
                  legend: {
                    display: false,
                    position: 'right',
                  },

                  scales: {
                    yAxes: [
                      {
                        gridLines: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                          min: 0,
                          max: 100,
                          stepSize: 20,
                        },
                      },
                    ],
                    xAxes: [
                      {
                        categorySpacing: 0,
                      },
                    ],
                  },
                }}
              />
            </div>
          </div>
          <ToggleDisplay container={container} />
        </div>
        <div className="box-button box-button-running">
          <button
            className="stop-btn"
            onClick={() => props.stop(container.ID, props.stopRunningContainer)}
          >
            STOP
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="renderContainers">
      <div className="header">
        <h1 className="tabTitle">
          Running Containers: {props.runningList.length}
        </h1>
      </div>
      <div className="containers">{renderRunningList}</div>

      <div className="header">
        <h1 className="tabTitle">
          Exited Containers: {props.stoppedList.length}
        </h1>
      </div>
      <div className="stopped-containers">{renderStoppedList}</div>
    </div>
  );
};

export default Containers;

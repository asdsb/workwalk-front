// ChartComponent.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import 'chartjs-adapter-date-fns';

Chart.register(MatrixController, MatrixElement);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('./public/data/chartData.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const ctx = chartRef.current.getContext('2d');

    // 행과 열을 정렬합니다.
    const tickets = [...new Set(data.map(item => item.Ticket))];
    const clusters = [...new Set(data.map(item => item.Cluster))];

    // 히트맵 데이터를 생성합니다.
    const matrixData = data.map(item => ({
      x: item.Cluster,
      y: item.Ticket,
      v: item['Mean Similarity'],
    }));

    // 차트 데이터를 생성합니다.
    const chartData = {
      datasets: [{
        label: 'Mean Similarity',
        data: matrixData,
        backgroundColor: context => {
          const value = context.dataset.data[context.dataIndex].v;
          const alpha = (value - Math.min(...data.map(d => d['Mean Similarity']))) / (Math.max(...data.map(d => d['Mean Similarity'])) - Math.min(...data.map(d => d['Mean Similarity'])));
          return `rgba(0, 0, 255, ${alpha})`;
        },
        borderWidth: 1,
        width: ({chart}) => {
          const size = Math.min(
            (chart.chartArea || {}).width / clusters.length - 1,
            (chart.chartArea || {}).height / tickets.length - 1
          );
          return size;
        },
        height: ({chart}) => {
          const size = Math.min(
            (chart.chartArea || {}).width / clusters.length - 1,
            (chart.chartArea || {}).height / tickets.length - 1
          );
          return size;
        },
      }]
    };

    // 차트 옵션을 설정합니다.
    const options = {
      responsive: true,
      scales: {
        x: {
          type: 'category',
          labels: clusters,
          title: {
            display: true,
            text: 'Cluster',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            display: false // x축 눈금선 숨기기
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          type: 'category',
          labels: tickets,
          title: {
            display: true,
            text: 'Ticket',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            display: false // y축 눈금선 숨기기
          },
          ticks: {
            autoSkip: false,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Mean Similarity by Ticket and Cluster',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.dataset.data[context.dataIndex].v;
              return `${(value * 100).toFixed(2)}%`;
            }
          }
        }
      }
    };

    // 기존 차트 인스턴스가 존재하면 파괴합니다.
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 차트를 생성합니다.
    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
      data: chartData,
      options: options,
    });

    // 컴포넌트가 언마운트될 때 차트를 파괴합니다.
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;

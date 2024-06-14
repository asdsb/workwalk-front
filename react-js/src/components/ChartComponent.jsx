import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(MatrixController, MatrixElement, ChartDataLabels);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/chartData.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const ctx = chartRef.current.getContext('2d');

    // 행과 열을 정렬합니다.
    const tickets = [...new Set(data.map(item => item.Ticket))];
    const clusters = [...new Set(data.map(item => item.Cluster))];

    // 클러스터별 색상 생성
    const clusterColors = clusters.map(() => {
      return [Math.floor(Math.random() * 200) + 55, Math.floor(Math.random() * 200) + 55, Math.floor(Math.random() * 200) + 55];
    });

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
          const clusterIndex = clusters.indexOf(context.dataset.data[context.dataIndex].x);
          const [r, g, b] = clusterColors[clusterIndex];
          const alpha = (value - Math.min(...data.map(d => d['Mean Similarity']))) / (Math.max(...data.map(d => d['Mean Similarity'])) - Math.min(...data.map(d => d['Mean Similarity'])));
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },
        borderWidth: 0,
        width: ({ chart }) => (chart.chartArea || {}).width / clusters.length,
        height: ({ chart }) => (chart.chartArea || {}).height / tickets.length,
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
            text: '군집',
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
            
            padding: 30, // 좌우 간격 조절
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
            text: '업무',
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
            padding: 10, // 상하 간격 조절
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false,
          padding: 40,
          text: 'Mean Similarity by Ticket and Cluster',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          enabled: false // Disable tooltips
        },
        datalabels: {
          display: true,
          formatter: (value, context) => {
            return `${(value.v * 100).toFixed(0)}`;
          },
          color: '#000',
          font: {
            size: 12,
            weight: 'bold'
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

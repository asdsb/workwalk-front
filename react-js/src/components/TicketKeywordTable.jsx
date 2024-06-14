// TicketKeywordTable.jsx
import React, { useEffect, useState } from 'react';

const TicketKeywordTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/chartData.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  // 데이터 처리
  const processData = (data) => {
    const filteredData = data
      .filter(item => item['Mean Similarity'] > 0.03)
      .sort((a, b) => b['Mean Similarity'] - a['Mean Similarity'])
      .reduce((acc, item) => {
        if (!acc[item.Ticket]) {
          acc[item.Ticket] = [];
        }
        acc[item.Ticket].push(item.Representation[0]);
        return acc;
      }, {});

    return Object.entries(filteredData)
      .sort(([a], [b]) => b - a) // 티켓을 내림차순으로 정렬
      .map(([ticket, representations]) => ({
        ticket,
        Representation: representations.join(', ')
      }));
  };

  const processedData = processData(data);

  return (
    <div>
      <h4>2. 업무 별 주요 키워드</h4>
      <table>
        <thead>
          <tr>
            <th>업무</th>
            <th>키워드</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map(row => (
            <tr key={row.ticket}>
              <td>{row.ticket}</td>
              <td>{row.Representation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketKeywordTable;

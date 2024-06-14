// TicketKeywordTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketKeywordTable = ({ userKeyCd, dateYmd }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userKeyCd && dateYmd) {
      axios.get(`http://localhost:3000/group/report`, { params: { USER_KEY_CD: userKeyCd, DATE_YMD: dateYmd } })
        .then(response => setData(response.data))
        .catch(error => console.error('Error fetching data:', error));
    } else {
      console.log('userKeyCd 또는 dateYmd가 정의되지 않았습니다. API 호출 건너뜀.');
    }
  }, [userKeyCd, dateYmd]);


  // 데이터 처리
  const processData = (data) => {
    const filteredData = data
      .filter(item => item.MeanSimilarity > 0.03)
      .sort((a, b) => b.MeanSimilarity - a.MeanSimilarity)
      .reduce((acc, item) => {
        if (!acc[item.Ticket]) {
          acc[item.Ticket] = [];
        }
        acc[item.Ticket].push(item.Representation.split(',')[0]+" ");
        return acc;
      }, {});

    return Object.entries(filteredData)
      .sort(([a], [b]) => b - a) // 티켓을 내림차순으로 정렬
      .map(([ticket, representations]) => ({
        ticket,
        Representation: representations
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

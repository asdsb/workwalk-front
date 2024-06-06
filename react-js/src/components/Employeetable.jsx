import React from 'react';

const Employeetable = () => {
  const data = [
    { name: '김승호', key: 'HKK1234', date: '2023.05.08', department: '개발', phone: '010-1234-1231' },
    { name: '변정욱', key: 'HUL6789', date: '2023.05.08', department: '개발', phone: '010-1234-1232' },
    { name: '정효린', key: 'UWB9237', date: '2023.05.08', department: '디자인', phone: '010-1234-1233' },
    { name: '민경훈', key: 'DHV1628', date: '2023.05.08', department: '경영', phone: '010-1234-1234' },
    { name: '고효영', key: 'CYB8762', date: '2023.05.08', department: '회계', phone: '010-1234-1235' },
  ];

  return (
    <table border="1">
      <thead>
        <tr>
          <th>이름</th>
          <th>key</th>
          <th>등록일</th>
          <th>부서</th>
          <th>휴대전화</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.key}</td>
            <td>{item.date}</td>
            <td>{item.department}</td>
            <td>{item.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Employeetable;

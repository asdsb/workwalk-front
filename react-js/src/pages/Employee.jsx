import React from 'react';
import Employeetable from '../components/Employeetable';

const Employee = () => {
    return (
        <div>
            <div>
                <h2>직원 목록</h2>
                <p>직원명</p>
                <button>찾기</button>
                <button>신규 등록</button>
            </div>
            <div>
                <Employeetable/>
            </div>

            
        </div>
    );
};

export default Employee;
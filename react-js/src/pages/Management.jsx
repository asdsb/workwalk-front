import React, { useState, useEffect, useRef } from 'react';

const Management = () => {
  const [tasks, setTasks] = useState({});
  const [currentTask, setCurrentTask] = useState({ employee: '', status: '', index: -1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    dateStart: '',
    dateEnd: '',
    status: 'notStarted',
    assignee: '',
    reviewer: '',
    description: '',
  });
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('./public/data/ticketemployee.json'); // 실제 경로로 변경
        const data = await response.json();
        setEmployeeData(data);
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      }
    };

    const fetchTicketData = async () => {
      try {
        const response = await fetch('./public/data/ticketData.json'); // 실제 경로로 변경
        const data = await response.json();
        setTicketData(data);
      } catch (error) {
        console.error('Failed to fetch ticket data:', error);
      }
    };

    fetchEmployeeData();
    fetchTicketData();
  }, []);

  useEffect(() => {
    const { title, dateStart, dateEnd, reviewer, description } = modalContent;
    setIsFormValid(title && dateStart && dateEnd && reviewer && description);
  }, [modalContent]);

  const mapTicketsToTasks = (selectedEmployee) => {
    const tasks = { notStarted: [], inProgress: [], completed: [] };

    ticketData.forEach(ticket => {
      if (ticket.userKeyCd === selectedEmployee.USER_KEY_CD) {
        switch (ticket.statusFlg) {
          case 0:
            tasks.notStarted.push(ticket);
            break;
          case 1:
            tasks.inProgress.push(ticket);
            break;
          case 2:
            tasks.completed.push(ticket);
            break;
          default:
            break;
        }
      }
    });

    return tasks;
  };

  const handleEmployeeClick = (employee) => {
    if (!selectedEmployees.includes(employee.USER_NM)) {
      const employeeTasks = mapTicketsToTasks(employee);
      setTasks(prevTasks => ({
        ...prevTasks,
        [employee.USER_NM]: employeeTasks,
      }));
      setSelectedEmployees(prevSelected => [...prevSelected, employee.USER_NM]);
    }
  };

  const addTask = (employee, status, task) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [employee]: {
        ...prevTasks[employee],
        [status]: [...prevTasks[employee][status], task]
      }
    }));
  };

  const openModal = (employee, status, index) => {
    const task = tasks[employee][status][index];
    setCurrentTask({ employee, status, index });
    setModalContent({
      title: task.titleStr,
      dateStart: task.dateStYmd,
      dateEnd: task.dateEndYmd,
      status: status,
      assignee: employee,
      reviewer: task.managerStr,
      description: task.contentStr,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewTaskModalOpen(false);
  };

  const saveTask = () => {
    const { employee, status, index } = currentTask;
    const newTasks = { ...tasks };

    const [task] = newTasks[employee][status].splice(index, 1);

    task.titleStr = modalContent.title;
    task.dateStYmd = modalContent.dateStart;
    task.dateEndYmd = modalContent.dateEnd;
    task.managerStr = modalContent.reviewer;
    task.contentStr = modalContent.description;

    newTasks[employee][modalContent.status].push(task);

    setTasks(newTasks);
    closeModal();
  };

  const deleteTask = () => {
    const { employee, status, index } = currentTask;
    const newTasks = { ...tasks };
    newTasks[employee][status].splice(index, 1);
    setTasks(newTasks);
    closeModal();
  };

  const openNewTaskModal = (employee, status) => {
    setCurrentTask({ employee, status, index: -1 });
    setModalContent({
      title: '',
      dateStart: '',
      dateEnd: '',
      status: status,
      assignee: employee,
      reviewer: '',
      description: '',
    });
    setNewTaskModalOpen(true);
  };

  const registerNewTask = () => {
    const { employee, status } = currentTask;
    if (isFormValid) {
      addTask(employee, status, modalContent);
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalContent(prevContent => ({
      ...prevContent,
      [name]: value
    }));
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    setModalContent(prevContent => ({
      ...prevContent,
      [name]: value,
      dateEnd: name === 'dateStart' && modalContent.dateEnd === '' ? value : modalContent.dateEnd,
    }));
  };

  const removeEmployee = (employee) => {
    setSelectedEmployees(prevSelected => prevSelected.filter(emp => emp !== employee));
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      delete newTasks[employee];
      return newTasks;
    });
  };

  return (
    <div className="management-container">
      <h2>업무 분장</h2>
      <div className="employee-selection-container">
        <div className="dropdown" ref={dropdownRef}>
          <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>직원 선택</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {employeeData.map((employee) => (
                <div key={employee.USER_KEY_CD} className="dropdown-item" onClick={() => handleEmployeeClick(employee)}>
                  {employee.USER_NM}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="selected-employees">
          {selectedEmployees.map((employee) => (
            <div key={employee} className="selected-employee">
              {employee}
              <button className="remove-button" onClick={() => removeEmployee(employee)}>x</button>
            </div>
          ))}
        </div>
      </div>
      <div className="management-content">
        <div className="employee-tasks-name">
          <div className="task-columns">
            <div className="task-column not-started">
              <h3>시작 전</h3>
            </div>
            <div className="task-column in-progress">
              <h3>진행 중</h3>
            </div>
            <div className="task-column completed">
              <h3>완료</h3>
            </div>
          </div>
        </div>
        {selectedEmployees.map((employee) => (
          <div key={employee} className="employee-tasks">
            <details>
              <summary>{employee}</summary>
              <div className="task-columns">
                <div className="task-column not-started">
                  {tasks[employee]?.notStarted.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'notStarted', index)}
                    >
                      {task.titleStr}
                    </div>
                  ))}
                  <div className="task new-task" onClick={() => openNewTaskModal(employee, 'notStarted')}>
                    + New
                  </div>
                </div>
                <div className="task-column in-progress">
                  {tasks[employee]?.inProgress.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'inProgress', index)}
                    >
                      {task.titleStr}
                    </div>
                  ))}
                  <div className="task new-task" onClick={() => openNewTaskModal(employee, 'inProgress')}>
                    + New
                  </div>
                </div>
                <div className="task-column completed">
                  {tasks[employee]?.completed.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'completed', index)}
                    >
                      {task.titleStr}
                    </div>
                  ))}
                  <div className="task new-task" onClick={() => openNewTaskModal(employee, 'completed')}>
                    + New
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="management-modal-overlay">
          <div className="management-modal">
            <div className="modal-header">
              <h3>업무 수정</h3>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  name="title"
                  placeholder="제목"
                  value={modalContent.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>기간</label>
                <div className="date-range">
                  <input
                    type="date"
                    name="dateStart"
                    placeholder="시작일"
                    value={modalContent.dateStart}
                    onChange={handleDateInputChange}
                  />
                  <span className="date-separator">~</span>
                  <input
                    type="date"
                    name="dateEnd"
                    placeholder="종료일"
                    value={modalContent.dateEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>상태</label>
                <select
                  name="status"
                  value={modalContent.status}
                  onChange={handleInputChange}
                >
                  <option value="notStarted">시작 전</option>
                  <option value="inProgress">진행 중</option>
                  <option value="completed">완료</option>
                </select>
              </div>
              <div className="form-group">
                <label>담당자</label>
                <input
                  type="text"
                  name="assignee"
                  placeholder="담당자"
                  value={modalContent.assignee}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>검토자</label>
                <input
                  type="text"
                  name="reviewer"
                  placeholder="검토자"
                  value={modalContent.reviewer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>설명</label>
                <textarea
                  name="description"
                  placeholder="설명"
                  value={modalContent.description}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={closeModal}>취소</button>
              <button onClick={saveTask}>수정</button>
              <button onClick={deleteTask}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {newTaskModalOpen && (
        <div className="management-modal-overlay">
          <div className="management-modal">
            <div className="modal-header">
              <h3>업무 등록</h3>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  name="title"
                  placeholder="제목"
                  value={modalContent.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>기간</label>
                <div className="date-range">
                  <input
                    type="date"
                    name="dateStart"
                    placeholder="시작일"
                    value={modalContent.dateStart}
                    onChange={handleDateInputChange}
                  />
                  <span className="date-separator">~</span>
                  <input
                    type="date"
                    name="dateEnd"
                    placeholder="종료일"
                    value={modalContent.dateEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>상태</label>
                <select
                  name="status"
                  value={modalContent.status}
                  onChange={handleInputChange}
                >
                  <option value="notStarted">시작 전</option>
                  <option value="inProgress">진행 중</option>
                  <option value="completed">완료</option>
                </select>
              </div>
              <div className="form-group">
                <label>담당자</label>
                <input
                  type="text"
                  name="assignee"
                  placeholder="담당자"
                  value={modalContent.assignee}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>검토자</label>
                <input
                  type="text"
                  name="reviewer"
                  placeholder="검토자"
                  value={modalContent.reviewer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>설명</label>
                <textarea
                  name="description"
                  placeholder="설명"
                  value={modalContent.description}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={closeModal}>취소</button>
              <button onClick={registerNewTask} disabled={!isFormValid}>등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;

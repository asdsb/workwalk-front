import React, { useState } from 'react';

const Management = () => {
  const [tasks, setTasks] = useState({
    '김승호': { notStarted: [], inProgress: [], completed: [] },
    '변정욱': { notStarted: [], inProgress: [], completed: [] },
    '정효린': { notStarted: [], inProgress: [], completed: [] },
    '민경훈': { notStarted: [], inProgress: [], completed: [] },
    '고효영': { notStarted: [], inProgress: ['회사 로그인 등록'], completed: [] },
  });

  const [currentTask, setCurrentTask] = useState({ employee: '', status: '', index: -1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    dateStart: '',
    dateEnd: '',
    status: '시작 전',
    assignee: '',
    reviewer: '',
    description: '',
  });
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  const addTask = (employee, status, task) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [employee]: {
        ...prevTasks[employee],
        [status]: [...prevTasks[employee][status], task]
      }
    }));
  };

  const handleTaskChange = (e, employee, status, index) => {
    const newTasks = { ...tasks };
    newTasks[employee][status][index] = e.target.value;
    setTasks(newTasks);
  };

  const openModal = (employee, status, index) => {
    const task = tasks[employee][status][index];
    setCurrentTask({ employee, status, index });
    setModalContent({
      title: task.title,
      dateStart: task.dateStart,
      dateEnd: task.dateEnd,
      status: status,
      assignee: employee,
      reviewer: task.reviewer,
      description: task.description,
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

    // Remove task from its current status
    const [task] = newTasks[employee][status].splice(index, 1);

    // Update task details
    task.title = modalContent.title;
    task.dateStart = modalContent.dateStart;
    task.dateEnd = modalContent.dateEnd;
    task.reviewer = modalContent.reviewer;
    task.description = modalContent.description;

    // Add task to its new status
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
      status: '시작 전',
      assignee: employee,
      reviewer: '',
      description: '',
    });
    setNewTaskModalOpen(true);
  };

  const registerNewTask = () => {
    const { employee, status } = currentTask;
    addTask(employee, status, modalContent);
    closeModal();
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

  return (
    <div className="management-container">
      <h2>업무 분장</h2>
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
        {Object.keys(tasks).map((employee) => (
          <div key={employee} className="employee-tasks">
            <details>
              <summary>{employee}</summary>
              <div className="task-columns">
                <div className="task-column not-started">
                  {tasks[employee].notStarted.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'notStarted', index)}
                    >
                      {task.title}
                    </div>
                  ))}
                  <div className="task new-task" onClick={() => openNewTaskModal(employee, 'notStarted')}>
                    + New
                  </div>
                </div>
                <div className="task-column in-progress">
                  {tasks[employee].inProgress.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'inProgress', index)}
                    >
                      {task.title}
                    </div>
                  ))}
                  <div className="task new-task" onClick={() => openNewTaskModal(employee, 'inProgress')}>
                    + New
                  </div>
                </div>
                <div className="task-column completed">
                  {tasks[employee].completed.map((task, index) => (
                    <div
                      key={index}
                      className="task"
                      onClick={() => openModal(employee, 'completed', index)}
                    >
                      {task.title}
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
        <div className="modal-overlay">
          <div className="modal">
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={modalContent.title}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="dateStart"
              placeholder="시작일"
              value={modalContent.dateStart}
              onChange={handleDateInputChange}
            />
            <input
              type="date"
              name="dateEnd"
              placeholder="종료일"
              value={modalContent.dateEnd}
              onChange={handleInputChange}
            />
            <select
              name="status"
              value={modalContent.status}
              onChange={handleInputChange}
            >
              <option value="notStarted">시작 전</option>
              <option value="inProgress">진행 중</option>
              <option value="completed">완료</option>
            </select>
            <input
              type="text"
              name="assignee"
              placeholder="담당자"
              value={modalContent.assignee}
              onChange={handleInputChange}
              readOnly
            />
            <input
              type="text"
              name="reviewer"
              placeholder="검토자"
              value={modalContent.reviewer}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="설명"
              value={modalContent.description}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={closeModal}>취소</button>
              <button onClick={saveTask}>수정</button>
              <button onClick={deleteTask}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {newTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={modalContent.title}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="dateStart"
              placeholder="시작일"
              value={modalContent.dateStart}
              onChange={handleDateInputChange}
            />
            <input
              type="date"
              name="dateEnd"
              placeholder="종료일"
              value={modalContent.dateEnd}
              onChange={handleInputChange}
            />
            <select
              name="status"
              value={modalContent.status}
              onChange={handleInputChange}
            >
              <option value="notStarted">시작 전</option>
              <option value="inProgress">진행 중</option>
              <option value="completed">완료</option>
            </select>
            <input
              type="text"
              name="assignee"
              placeholder="담당자"
              value={modalContent.assignee}
              onChange={handleInputChange}
              readOnly
            />
            <input
              type="text"
              name="reviewer"
              placeholder="검토자"
              value={modalContent.reviewer}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="설명"
              value={modalContent.description}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={closeModal}>취소</button>
              <button onClick={registerNewTask}>등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;

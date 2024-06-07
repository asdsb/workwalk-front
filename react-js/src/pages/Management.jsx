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
  const [modalText, setModalText] = useState('');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  const addTask = (employee, status, taskText) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [employee]: {
        ...prevTasks[employee],
        [status]: [...prevTasks[employee][status], taskText || 'Untitled']
      }
    }));
  };

  const handleTaskChange = (e, employee, status, index) => {
    const newTasks = { ...tasks };
    newTasks[employee][status][index] = e.target.value;
    setTasks(newTasks);
  };

  const openModal = (employee, status, index) => {
    setCurrentTask({ employee, status, index });
    setModalText(tasks[employee][status][index]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewTaskModalOpen(false);
  };

  const saveTask = () => {
    const { employee, status, index } = currentTask;
    const newTasks = { ...tasks };
    newTasks[employee][status][index] = modalText;
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
    setModalText('');
    setNewTaskModalOpen(true);
  };

  const registerNewTask = () => {
    const { employee, status } = currentTask;
    addTask(employee, status, modalText);
    closeModal();
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
                      {task}
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
                      {task}
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
                      {task}
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
            <textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
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
            <textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="New Task"
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

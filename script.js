'use strict'

const inputElement = document.getElementById("input");
const saveTask = document.getElementById('saveTask');
const prioritySelect = document.getElementById('priority');
const tableBody = document.querySelector('#tableTask tbody');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('total-tasks');
const completedTasksSpan = document.getElementById('completed-tasks');

const getLocalStorage = () => JSON.parse(localStorage.getItem('listTask')) ?? [];
const setLocalStorage = (listTask) => localStorage.setItem("listTask", JSON.stringify(listTask));

const createTask = () => {
  if (inputElement.value.length < 3) {
    showNotification('Sua tarefa precisa ter pelo menos 3 letras!', 'error');
    return;
  }

  const listTask = getLocalStorage();
  const newTask = {
    id: Date.now(),
    text: inputElement.value,
    priority: prioritySelect.value,
    completed: false,
    createdAt: new Date()
  };

  listTask.push(newTask);
  setLocalStorage(listTask);
  inputElement.value = '';
  updateTable();
  showNotification('Tarefa adicionada com sucesso!', 'success');
}

const readTask = () => getLocalStorage();

const deleteTask = (id) => {
  const listTask = readTask();
  const taskIndex = listTask.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    listTask.splice(taskIndex, 1);
    setLocalStorage(listTask);
    updateTable();
    showNotification('Tarefa removida com sucesso!', 'success');
  }
}


const toggleTaskCompletion = (id) => {
  const listTask = readTask();
  const task = listTask.find(task => task.id === id);

  if (task) {
    task.completed = !task.completed;
    setLocalStorage(listTask);
    updateTable();
  }
}

const createRow = (task) => {
  const newRow = document.createElement('tr');
  newRow.className = 'task-row';
  newRow.innerHTML = `
    <td>
      <div class="task-status ${task.completed ? 'completed' : ''}" 
           onclick="toggleTaskCompletion(${task.id})">
        ${task.completed ? '✓' : ''}
      </div>
    </td>
    <td class="${task.completed ? 'completed-text' : ''}">${task.text}</td>
    <td>
      <span class="priority ${task.priority}">
        ${task.priority === 'high' ? 'Alta' :
      task.priority === 'medium' ? 'Média' : 'Baixa'}
      </span>
    </td>
    <td>
      <button class="action-btn" onclick="deleteTask(${task.id})">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;
  return newRow;
}

const clearTable = () => {
  tableBody.innerHTML = '';
}

const updateTable = () => {
  const listTask = readTask();
  clearTable();

  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  const filteredTasks = listTask.filter(task => {
    if (activeFilter === 'all') return true;
    return task.priority === activeFilter;
  });

  filteredTasks.forEach(task => {
    tableBody.appendChild(createRow(task));
  });

  updateStats(listTask);
}

const updateStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  totalTasksSpan.textContent = `${total} tarefa${total !== 1 ? 's' : ''}`;
  completedTasksSpan.textContent = `${completed} concluída${completed !== 1 ? 's' : ''}`;
}

const showNotification = (message, type) => {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    updateTable();
  });
});

saveTask.addEventListener('click', createTask);
inputElement.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') createTask();
});

updateTable();

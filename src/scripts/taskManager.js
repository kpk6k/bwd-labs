import { closeAddTaskModal } from "./addtask_modal";
import { loadTasks } from "./loadTasks";
import { saveTaskHistory } from './taskHistory';

export function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

export function addTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('taskName').value.trim();

    if (taskName === '') {
        alert('Пожалуйста, введите название задачи!');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskExists = tasks.some(task => task.text.toLowerCase() === taskName.toLowerCase());

    if (taskExists) {
        alert('Задача с таким названием уже существует!');
    } else {
        tasks.push({
            text: taskName,
            isChecked: false,
            column: 'taskList',
            history: [] // Добавляем историю изменений
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    closeAddTaskModal();
    loadTasks();
}

export function editTask(index, text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    //сохраняем историю перед изменением
    saveTaskHistory(tasks[index]);
    tasks[index].text = text;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

export function toggleCheck(event) {
    const index = event.target.dataset.index;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    saveTaskHistory(tasks[index]);
    
    tasks[index].isChecked = !tasks[index].isChecked;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskElement = event.target.closest('.task');

    if (tasks[index].isChecked) {
        taskElement.classList.add('checked');
    } else {
        taskElement.classList.remove('checked');
    }
    loadTasks();
}

let draggedTaskIndex;

export function allowDrop(event) {
    event.preventDefault();
}
window.allowDrop = allowDrop;

export function drag(event) {
    draggedTaskIndex = event.target.dataset.index;
}
window.drag = drag;

export function drop(event) {
    event.preventDefault();

    const targetColumn = event.target.closest('td').id;
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (draggedTaskIndex !== undefined && targetColumn) {
        saveTaskHistory(tasks[draggedTaskIndex]);
        tasks[draggedTaskIndex].column = targetColumn;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        loadTasks();
    }
}
window.drop = drop;
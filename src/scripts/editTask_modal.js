import { editTask } from "./taskManager";
import { saveTaskHistory } from './taskHistory';

const editTaskModal = document.createElement('dialog');
editTaskModal.id = 'editTaskDialog';
editTaskModal.innerHTML = `
    <form id="editTaskForm">
        <h4>Редактировать задачу</h4>
        <label for="taskText">Текст задачи:</label>
        <input type="text" id="taskText" required />
        <div class="buttons">
            <button type="submit">Сохранить</button>
            <button id="closeEditTaskDialog" type="button">Закрыть</button>
        </div>
    </form>
`;

document.body.appendChild(editTaskModal);

// Функция для открытия модального окна редактирования
export function openEditTaskModal(index) {
    const taskTextInput = document.getElementById('taskText');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskTextInput.value = tasks[index].text;

    editTaskModal.showModal();
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Обработчик отправки формы
    document.getElementById('editTaskForm').onsubmit = (e) => {
        e.preventDefault();
        const updatedText = taskTextInput.value;
        editTask(index, updatedText); // Сохраняем обновленную задачу
        closeEditTaskModal();
    };
}

// Функция для закрытия модального окна редактирования
export function closeEditTaskModal() {
    editTaskModal.close();
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
}

// Обработчики событий
document.getElementById('closeEditTaskDialog')?.addEventListener('click', closeEditTaskModal);

editTaskModal.addEventListener('click', (event) => {
    if (event.target === editTaskModal) {
        closeEditTaskModal();
    }
});

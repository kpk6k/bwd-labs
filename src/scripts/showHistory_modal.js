import { restoreTaskVersion } from "./taskHistory";

const historyModal = document.createElement('dialog');
historyModal.id = 'historyDialog';
historyModal.innerHTML = `
    <div id="historyDialogContent">
        <h4>История изменений</h4>
        <ul id="historyList"></ul>
        <div class="buttons">
            <button id="closeHistoryDialog" type="button">Закрыть</button>
        </div>
    </div>
`;

document.body.appendChild(historyModal);

// Функция для открытия модального окна с историей
export function openHistoryModal(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    tasks[index].history.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <div class="history-entry">
                <time>${new Date(entry.timestamp).toLocaleString()}</time>
                <div class="changes">${formatChanges(entry)}</div>
                <button class="restore-btn" data-index="${index}">
                    Восстановить
                </button>
            </div>
        `;
        historyList.appendChild(li);
    });

    historyModal.showModal();
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Добавляем обработчики для кнопок восстановления
    document.querySelectorAll('.restore-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const versionIndex = parseInt(e.target.dataset.index);
            restoreTaskVersion(index, versionIndex);
            closeHistoryModal();
        });
    });
}

// Функция для закрытия модального окна
export function closeHistoryModal() {
    historyModal.close();
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
}

// Обработчики событий
document.getElementById('closeHistoryDialog')?.addEventListener('click', closeHistoryModal);

historyModal.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        closeHistoryModal();
    }
});

// Вспомогательная функция для форматирования изменений
function formatChanges(changes) {
    if (!changes) return '<div class="change-item">Нет данных об изменениях</div>';
    
    return Object.entries(changes)
        .map(([key, value]) => {
            switch(key) {
                case 'text':
                    return `
                        <div class="change-item">
                            <strong>Задача:</strong> 
                            <span class="change-value">${value || 'Без названия'}</span>
                        </div>
                    `;
                    
                case 'isChecked':
                    const status = value ? 'выполнено' : 'не выполнено';
                    return `
                        <div class="change-item">
                            <strong>Статус:</strong>
                            <span class="change-status ${status}">${status}</span>
                        </div>
                    `;
                    
                case 'column':
                    const categoryMap = {
                        taskList: 'Задачи',
                        inProgressList: 'В работе',
                        completedList: 'Выполненные'
                    };
                    return `
                        <div class="change-item">
                            <strong>Категория:</strong>
                            <span class="change-category">${categoryMap[value] || value}</span>
                        </div>
                    `;
            }
        })
        .join('');
}
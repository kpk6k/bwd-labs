import { loadTasks } from './loadTasks';

// функции для сохранения и восстановления истории
export function saveTaskHistory(task) {
    // Сохраняем текущее состояние задачи в историю
    const currentState = {
        text: task.text,
        isChecked: task.isChecked,
        column: task.column,
        timestamp: new Date().toISOString()
    };
    task.history.push(currentState);
    // Ограничиваем размер истории, например, до 10 изменений
    if (task.history.length > 10) {
        task.history.shift();
    }
    localStorage.setItem('tasks', JSON.stringify(JSON.parse(localStorage.getItem('tasks'))));
}

export function restoreTaskVersion(index, versionIndex) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];
    console.log(tasks[index]);
    console.log(task && task.history[versionIndex]);

    if (task && task.history[versionIndex]) {
        const version = task.history[versionIndex];
        task.text = version.text;
        task.isChecked = version.isChecked;
        task.column = version.column;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks(); // Обновляем отображение задач
    } else {
        alert('Версия не найдена!');
    }
}

import { getTaskStats } from "./task-service.js";

const priorityLabels = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
};

export function createTaskElement(task) {
    const card = document.createElement("li");

    card.classList.add("task-card");
    card.classList.toggle("is-completed", task.completed);
    card.dataset.taskId = String(task.id);

    const title = document.createElement("h3");
    title.classList.add("task-title");
    title.textContent = task.title;

    const status = document.createElement("span");
    status.classList.add("task-status");
    status.textContent = task.completed
        ? "Выполнена"
        : "В работе";

    const priority = document.createElement("span");
    priority.classList.add("task-priority");
    priority.textContent = priorityLabels[task.priority];

    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle";
    toggleButton.setAttribute(
        "aria-pressed",
        String(task.completed)
    );

    const toggleLabel = document.createElement("span");
    toggleLabel.classList.add("action-label");
    toggleLabel.textContent = "Выполнена";

    toggleButton.append(toggleLabel);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";

    const deleteLabel = document.createElement("span");
    deleteLabel.classList.add("action-label");
    deleteLabel.textContent = "Удалить";

    deleteButton.append(deleteLabel);

    actions.append(toggleButton, deleteButton);

    card.append(title, status, priority, actions);

    return card;
}

export function renderTaskList(listElement, tasks) {
    const cards = tasks.map(createTaskElement);
    listElement.replaceChildren(...cards);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
    const stats = getTaskStats(tasks);

    const values = {
        total: stats.total,
        completed: stats.completed,
        pending: stats.pending,
        progress: `${stats.progress.toFixed(1)}%`,
        visible: visibleCount
    };

    for (const [name, value] of Object.entries(values)) {
        const element = summaryElement.querySelector(
            `[data-stat="${name}"]`
        );

        element.textContent = String(value);
    }
}

export function renderEmptyState(messageElement, total, visibleCount) {
    if (total === 0) {
        messageElement.textContent = "Список задач пуст.";
        messageElement.hidden = false;
    } else if (visibleCount === 0) {
        messageElement.textContent =
            "Нет задач по выбранному фильтру.";
        messageElement.hidden = false;
    } else {
        messageElement.textContent = "";
        messageElement.hidden = true;
    }
}
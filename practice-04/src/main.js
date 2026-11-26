import { demoTasks, variantTasks, variantNumber } from "./data.js";

import {
    addTask,
    findTaskById,
    removeTask,
    setTaskCompleted,
    updateTask
} from "./task-service.js";

import { getVisibleTasks } from "./task-selectors.js";

import {
    renderEmptyState,
    renderSummary,
    renderTaskList
} from "./task-view.js";

import { validateTaskDraft } from "./form-validation.js";

import {
    loadTasks,
    removeSavedTasks,
    saveTasks
} from "./task-storage.js";

const elements = {
    list: document.querySelector("#task-list"),
    filters: document.querySelector("#task-filters"),
    summary: document.querySelector("#task-summary"),
    empty: document.querySelector("#empty-message"),
    message: document.querySelector("#operation-message"),
    datasetLabel: document.querySelector("#dataset-label"),
    storageStatus: document.querySelector("#storage-status"),
    form: document.querySelector("#task-form"),
    formHeading: document.querySelector("#form-heading"),
    formMode: document.querySelector("#form-mode"),
    formMessage: document.querySelector("#form-message"),
    idInput: document.querySelector("#task-id"),
    titleInput: document.querySelector("#task-title"),
    priorityInput: document.querySelector("#task-priority"),
    submitButton: document.querySelector("#form-submit"),
    cancelButton: document.querySelector("#cancel-edit"),
    resetButton: document.querySelector("#reset-data")
};

// Выбор набора данных
const params = new URLSearchParams(window.location.search);

const isVariant = params.get("dataset") === "variant";
const isCheckRun = params.get("mode") === "check";

const initialTasks = isVariant ? variantTasks : demoTasks;
const datasetName = isVariant ? "variant" : "demo";

const storageKey = isCheckRun
    ? `tip-js-practice-04:checks:${datasetName}`
    : `tip-js-practice-04:${datasetName}`;

// Загрузка сохранённых данных
let loaded;

try {
    loaded = loadTasks(
        window.localStorage,
        storageKey,
        initialTasks
    );
} catch (error) {
    loaded = {
        ok: false,
        source: "fallback",
        tasks: initialTasks.map((task) => ({ ...task })),
        error: `Хранилище не инициализировано: ${error.message}`
    };

    console.error(error);
}

let currentTasks = loaded.tasks;
let currentFilter = "all";
let editingId = null;

elements.datasetLabel.textContent = isVariant
    ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
    : "Общий контрольный набор";

if (loaded.source === "storage") {
    elements.storageStatus.textContent =
        "Данные восстановлены из localStorage.";
} else if (loaded.ok) {
    elements.storageStatus.textContent =
        "Используется исходный набор; сохранённых данных пока нет.";
} else {
    elements.storageStatus.textContent = loaded.error;
    elements.storageStatus.classList.add("is-warning");
}

// Отрисовка приложения
function renderApp() {
    const visibleTasks = getVisibleTasks(
        currentTasks,
        currentFilter
    );

    renderTaskList(elements.list, visibleTasks);

    renderSummary(
        elements.summary,
        currentTasks,
        visibleTasks.length
    );

    renderEmptyState(
        elements.empty,
        currentTasks.length,
        visibleTasks.length
    );

    const buttons = elements.filters.querySelectorAll(
        "button[data-filter]"
    );

    buttons.forEach((button) => {
        const isActive =
            button.dataset.filter === currentFilter;

        button.classList.toggle("is-active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}

// Очистка ошибки отдельного поля
function clearFieldError(name) {
    const input = elements.form.elements.namedItem(name);

    const message = elements.form.querySelector(
        `[data-error-for="${name}"]`
    );

    if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLSelectElement
    ) {
        input.setCustomValidity("");
        input.removeAttribute("aria-invalid");
    }

    if (message) {
        message.textContent = "";
    }
}

// Очистка всех ошибок
function clearFormErrors() {
    for (const name of ["id", "title", "priority"]) {
        clearFieldError(name);
    }

    elements.formMessage.textContent = "";
}

// Отображение ошибок валидации
function showFormErrors(errors) {
    clearFormErrors();

    for (const [name, text] of Object.entries(errors)) {
        const input = elements.form.elements.namedItem(name);

        const message = elements.form.querySelector(
            `[data-error-for="${name}"]`
        );

        if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLSelectElement
        ) {
            input.setCustomValidity(text);
            input.setAttribute("aria-invalid", "true");
        }

        if (message) {
            message.textContent = text;
        }
    }

    elements.form.reportValidity();
}

// Переключение режима формы
function setFormMode(id = null) {
    if (id === null) {
        const wasEditing = editingId !== null;

        editingId = null;

        elements.form.reset();
        clearFormErrors();

        elements.idInput.disabled = false;

        elements.formHeading.textContent =
            "Добавление задачи";

        elements.formMode.textContent =
            "Режим создания новой задачи.";

        elements.submitButton.textContent =
            "Добавить задачу";

        elements.cancelButton.hidden = true;

        if (wasEditing) {
            elements.idInput.focus();
        }

        return;
    }

    const task = findTaskById(currentTasks, id);

    if (!task) {
        elements.message.textContent =
            "Редактируемая задача не найдена";

        return;
    }

    editingId = id;

    clearFormErrors();

    elements.idInput.value = String(task.id);
    elements.idInput.disabled = true;

    elements.titleInput.value = task.title;
    elements.priorityInput.value = task.priority;

    elements.formHeading.textContent =
        "Редактирование задачи";

    elements.formMode.textContent =
        `Редактируется задача с id = ${id}.`;

    elements.submitButton.textContent =
        "Сохранить изменения";

    elements.cancelButton.hidden = false;

    elements.titleInput.focus();
}

// Сохранение текущего состояния
function persistCurrentTasks(successMessage) {
    let saved;

    try {
        saved = saveTasks(
            window.localStorage,
            storageKey,
            currentTasks
        );
    } catch (error) {
        saved = {
            ok: false,
            error: `Ошибка сохранения: ${error.message}`
        };
    }

    elements.storageStatus.classList.toggle(
        "is-warning",
        !saved.ok
    );

    elements.storageStatus.textContent = saved.ok
        ? "Изменения сохранены в localStorage."
        : saved.error;

    elements.message.textContent = saved.ok
        ? successMessage
        : `${successMessage} ${saved.error}`;

    renderApp();

    return saved;
}

// Восстановление фокуса
function restoreTaskFocus(id, action) {
    const actionButton = elements.list.querySelector(
        `[data-task-id="${id}"] button[data-action="${action}"]`
    );

    const filterButton = elements.filters.querySelector(
        `[data-filter="${currentFilter}"]`
    );

    (actionButton ?? filterButton)?.focus();
}

// Обработка отправки формы
function handleFormSubmit(event) {
    event.preventDefault();

    clearFormErrors();

    const draft = {
        id: elements.idInput.value,
        title: elements.titleInput.value,
        priority: elements.priorityInput.value
    };

    const validation = validateTaskDraft(
        draft,
        currentTasks,
        editingId
    );

    if (!validation.ok) {
        showFormErrors(validation.errors);
        return;
    }

    const { id, title, priority } = validation.value;

    const isEditing = editingId !== null;

    const result = isEditing
        ? updateTask(currentTasks, id, title, priority)
        : addTask(currentTasks, id, title, priority);

    if (!result.ok) {
        elements.formMessage.textContent = result.error;
        return;
    }

    currentTasks = result.tasks;

    setFormMode();

    persistCurrentTasks(
        isEditing
            ? "Задача успешно изменена."
            : "Задача успешно добавлена."
    );

    elements.idInput.focus();
}

// Обработка действий карточек
function handleTaskListClick(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        "button[data-action]"
    );

    if (!button || !elements.list.contains(button)) {
        return;
    }

    const action = button.dataset.action;

    if (!["toggle", "edit", "delete"].includes(action)) {
        return;
    }

    const card = button.closest("li[data-task-id]");

    if (!card || !elements.list.contains(card)) {
        return;
    }

    const rawId = card.dataset.taskId;
    const id = Number(rawId);

    if (!Number.isSafeInteger(id) || id <= 0) {
        elements.message.textContent =
            "Некорректный идентификатор задачи";

        return;
    }

    const task = findTaskById(currentTasks, id);

    if (!task) {
        elements.message.textContent =
            "Задача не найдена";

        return;
    }

    // Редактирование без записи в хранилище
    if (action === "edit") {
        elements.message.textContent = "";
        setFormMode(id);
        return;
    }

    let result;

    if (action === "toggle") {
        result = setTaskCompleted(
            currentTasks,
            id,
            !task.completed
        );
    } else {
        result = removeTask(currentTasks, id);
    }

    if (!result.ok) {
        elements.message.textContent = result.error;
        return;
    }

    currentTasks = result.tasks;

    // Если удалена редактируемая задача
    if (action === "delete" && editingId === id) {
        setFormMode();
    }

    persistCurrentTasks(
        action === "toggle"
            ? "Статус задачи изменён."
            : "Задача удалена."
    );

    restoreTaskFocus(id, action);
}

// Переключение фильтров
function handleFilterClick(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        "button[data-filter]"
    );

    if (!button || !elements.filters.contains(button)) {
        return;
    }

    const filter = button.dataset.filter;

    if (!["all", "pending", "completed"].includes(filter)) {
        return;
    }

    currentFilter = filter;

    elements.message.textContent = "";

    renderApp();
}

// Сброс сохранённых данных
function handleResetClick() {
    let result;

    try {
        result = removeSavedTasks(
            window.localStorage,
            storageKey
        );
    } catch (error) {
        result = {
            ok: false,
            error: `Ошибка сброса: ${error.message}`
        };
    }

    if (!result.ok) {
        elements.storageStatus.textContent = result.error;
        elements.storageStatus.classList.add("is-warning");
        elements.message.textContent = result.error;
        return;
    }

    currentTasks = initialTasks.map(
        (task) => ({ ...task })
    );

    currentFilter = "all";

    setFormMode();

    elements.storageStatus.classList.remove("is-warning");

    elements.storageStatus.textContent =
        "Используется исходный набор; сохранённых данных пока нет.";

    elements.message.textContent =
        "Сохранённые данные сброшены.";

    renderApp();
}

// Подписки на события
elements.form.addEventListener(
    "submit",
    handleFormSubmit
);

elements.form.addEventListener("input", (event) => {
    if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
    ) {
        clearFieldError(event.target.name);
    }
});

elements.list.addEventListener(
    "click",
    handleTaskListClick
);

elements.filters.addEventListener(
    "click",
    handleFilterClick
);

elements.cancelButton.addEventListener(
    "click",
    () => setFormMode()
);

elements.resetButton.addEventListener(
    "click",
    handleResetClick
);

// Первый запуск
try {
    setFormMode();
    renderApp();
} catch (error) {
    elements.message.textContent =
        `Ошибка запуска: ${error.message}`;

    console.error(error);
}
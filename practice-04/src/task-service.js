// Заготовка модуля. throw ниже отмечает отсутствие реализации,
// а не способ обработки некорректных данных в готовом решении.
// Для предусмотренных ошибок необходимо возвращать { ok: false, error: "..." }.
// console.log(), prompt(), document и чтение внешнего состояния здесь не нужны.

export function createTask(id, title, priority = "medium") {
    if (!Number.isSafeInteger(id) || id <= 0) {
        return {
            ok: false,
            error: "Некорректный идентификатор задачи"
        };
    }

    if (typeof title !== "string") {
        return {
            ok: false,
            error: "Название должно быть строкой"
        };
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
        return {
            ok: false,
            error: "Название должно содержать от 1 до 100 символов"
        };
    }

    if (!["low", "medium", "high"].includes(priority)) {
        return {
            ok: false,
            error: "Некорректный приоритет задачи"
        };
    }

    return {
        ok: true,
        task: {
            id: id,
            title: normalizedTitle,
            completed: false,
            priority: priority
        }
    };
}

export function findTaskById(tasks, id) {
    return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
    return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
    return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed === true
    ).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : (completed / total) * 100;

    return {
        total,
        completed,
        pending,
        progress
    };
}


export function addTask(tasks, id, title, priority = "medium") {
    const result = createTask(id, title, priority);

    if (!result.ok) {
        return result;
    }

    if (findTaskById(tasks, id) !== undefined) {
        return {
            ok: false,
            error: "Задача с таким идентификатором уже существует"
        };
    }

    return {
        ok: true,
        tasks: [...tasks, result.task]
    };
}

export function setTaskCompleted(tasks, id, completed) {
    if (!Number.isSafeInteger(id) || id <= 0) {
        return {
            ok: false,
            error: "Некорректный идентификатор"
        };
    }

    if (typeof completed !== "boolean") {
        return {
            ok: false,
            error: "Статус должен иметь тип boolean"
        };
    }

    if (findTaskById(tasks, id) === undefined) {
        return {
            ok: false,
            error: "Задача не найдена"
        };
    }

    const updatedTasks = tasks.map((task) =>
        task.id === id
            ? { ...task, completed }
            : task
    );

    return {
        ok: true,
        tasks: updatedTasks
    };
}

export function renameTask(tasks, id, title) {
    const result = createTask(id, title);

    if (!result.ok) {
        return result;
    }

    if (findTaskById(tasks, id) === undefined) {
        return {
            ok: false,
            error: "Задача не найдена"
        };
    }

    const updatedTasks = tasks.map((task) =>
        task.id === id
            ? { ...task, title: result.task.title }
            : task
    );

    return {
        ok: true,
        tasks: updatedTasks
    };
}

export function removeTask(tasks, id) {
    if (!Number.isSafeInteger(id) || id <= 0) {
        return {
            ok: false,
            error: "Некорректный идентификатор"
        };
    }

    if (findTaskById(tasks, id) === undefined) {
        return {
            ok: false,
            error: "Задача не найдена"
        };
    }

    return {
        ok: true,
        tasks: tasks.filter((task) => task.id !== id)
    };
}
export function updateTask(tasks, id, title, priority) {
    if (!Number.isSafeInteger(id) || id <= 0) {
        return { ok: false, error: "Некорректный идентификатор" };
    }

    if (!findTaskById(tasks, id)) {
        return { ok: false, error: "Задача не найдена" };
    }

    if (typeof title !== "string") {
        return { ok: false, error: "Название должно быть строкой" };
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
        return { ok: false, error: "Некорректная длина названия" };
    }

    if (!["low", "medium", "high"].includes(priority)) {
        return { ok: false, error: "Некорректный приоритет" };
    }

    return {
        ok: true,
        tasks: tasks.map((task) =>
            task.id === id
                ? { ...task, title: normalizedTitle, priority }
                : task
        )
    };
}
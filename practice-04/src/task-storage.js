export const STORAGE_VERSION = 1;

const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

// Создание независимой копии массива
function cloneTasks(tasks) {
    return tasks.map((task) => ({ ...task }));
}

// Проверка структуры массива задач
export function isValidTaskList(value) {
    if (!Array.isArray(value)) {
        return false;
    }

    const ids = new Set();

    for (const task of value) {
        if (!task || typeof task !== "object" || Array.isArray(task)) {
            return false;
        }

        if (!Number.isSafeInteger(task.id) || task.id <= 0) {
            return false;
        }

        if (ids.has(task.id)) {
            return false;
        }

        if (typeof task.title !== "string") {
            return false;
        }

        const title = task.title.trim();

        if (title.length < 1 || title.length > 100) {
            return false;
        }

        if (typeof task.completed !== "boolean") {
            return false;
        }

        if (!ALLOWED_PRIORITIES.has(task.priority)) {
            return false;
        }

        ids.add(task.id);
    }

    return true;
}

// Загрузка задач из хранилища
export function loadTasks(storage, key, fallbackTasks) {
    try {
        const saved = storage.getItem(key);

        if (saved === null) {
            return {
                ok: true,
                source: "initial",
                tasks: cloneTasks(fallbackTasks)
            };
        }

        const data = JSON.parse(saved);

        if (
            !data ||
            data.version !== STORAGE_VERSION ||
            !isValidTaskList(data.tasks)
        ) {
            throw new Error("Некорректная структура сохранённых данных");
        }

        return {
            ok: true,
            source: "storage",
            tasks: cloneTasks(data.tasks)
        };

    } catch (error) {
        return {
            ok: false,
            source: "fallback",
            tasks: cloneTasks(fallbackTasks),
            error: `Ошибка загрузки: ${error.message}`
        };
    }
}

// Сохранение задач в хранилище
export function saveTasks(storage, key, tasks) {
    try {
        if (!isValidTaskList(tasks)) {
            return {
                ok: false,
                error: "Некорректный список задач"
            };
        }

        const data = {
            version: STORAGE_VERSION,
            tasks
        };

        storage.setItem(key, JSON.stringify(data));

        return {
            ok: true
        };

    } catch (error) {
        return {
            ok: false,
            error: `Ошибка сохранения: ${error.message}`
        };
    }
}

// Удаление сохранённых данных
export function removeSavedTasks(storage, key) {
    try {
        storage.removeItem(key);

        return {
            ok: true
        };

    } catch (error) {
        return {
            ok: false,
            error: `Ошибка удаления: ${error.message}`
        };
    }
}
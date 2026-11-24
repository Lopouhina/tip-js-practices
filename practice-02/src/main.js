import { demoTasks, variantNumber, variantTasks } from "./data.js";

import {
    findTaskById,
    getPendingTasks,
    getTaskTitles,
    getTaskStats,
    addTask,
    setTaskCompleted,
    renameTask,
    removeTask
} from "./task-service.js";


// Вывод статистики задач

function printStats(tasks) {
    const { total, completed, pending, progress } = getTaskStats(tasks);

    console.log("Всего задач:", total);
    console.log("Выполнено:", completed);
    console.log("Осталось:", pending);

    if (total === 0) {
        console.log("Задач пока нет");
    } else {
        console.log(`Прогресс: ${progress.toFixed(1)}%`);
    }
}


// Общий демонстрационный сценарий

console.log("Практическая работа №2");
console.log("Общий демонстрационный сценарий");

const originalDemoTasks = demoTasks.map((task) => ({ ...task }));

let currentTasks = demoTasks;


// Обработка результата операции

function applyResult(result, stage) {
    console.log(`\n${stage}`);

    if (result.ok) {
        currentTasks = result.tasks;
    } else {
        console.log("Ошибка:", result.error);
    }

    printStats(currentTasks);
}


// Этап 1. Исходный набор

console.log("\n1. Исходный набор");

console.table(currentTasks);

console.log("\nНазвания задач:");
console.log(getTaskTitles(currentTasks));

console.log("\nНевыполненные задачи:");
console.table(getPendingTasks(currentTasks));

console.log("\nПоиск задачи с id = 4:");
console.log(findTaskById(currentTasks, 4));

console.log("\nИсходная сводка:");
printStats(currentTasks);


// Этап 2. Добавление задачи

applyResult(
    addTask(currentTasks, 20, "Добавить проверку", "high"),
    "2. Добавление задачи id = 20"
);


// Этап 3. Выполнение задачи

applyResult(
    setTaskCompleted(currentTasks, 4, true),
    "3. Выполнение задачи id = 4"
);


// Этап 4. Переименование задачи

applyResult(
    renameTask(currentTasks, 10, "Подготовить инструкцию запуска"),
    "4. Переименование задачи id = 10"
);


// Этап 5. Удаление задачи

applyResult(
    removeTask(currentTasks, 7),
    "5. Удаление задачи id = 7"
);


// Этап 6. Обработка ошибки

const stateBeforeError = currentTasks;
const valuesBeforeError = JSON.stringify(currentTasks);

applyResult(
    addTask(currentTasks, 20, "Повторная задача", "low"),
    "6. Попытка добавить задачу с повторяющимся id = 20"
);

console.log(
    "Состояние после ошибки не изменилось:",
    currentTasks === stateBeforeError &&
    JSON.stringify(currentTasks) === valuesBeforeError
);


// Итоговый список

console.log("\nИтоговый список задач:");
console.table(currentTasks);

console.log(
    "Идентификаторы итогового списка:",
    currentTasks.map((task) => task.id)
);

console.log("\nИтоговые невыполненные задачи:");
console.table(getPendingTasks(currentTasks));

console.log("\nИтоговая сводка:");
printStats(currentTasks);


// Проверка неизменности исходных данных

console.log("\nИсходный массив demoTasks:");
console.table(demoTasks);

console.log(
    "Исходный массив demoTasks не изменился:",
    JSON.stringify(demoTasks) === JSON.stringify(originalDemoTasks)
);


// Индивидуальный вариант №6



console.log(`Индивидуальный вариант №${variantNumber}`);
console.log("Проверка пользовательского интерфейса");


const originalVariantTasks = variantTasks.map((task) => ({ ...task }));

let currentVariantTasks = variantTasks;


// Обработка операций индивидуального сценария

function applyVariantResult(result, stage) {
    console.log(`\n${stage}`);

    if (result.ok) {
        currentVariantTasks = result.tasks;
        console.log("Операция выполнена успешно");
    } else {
        console.log("Ошибка:", result.error);
    }

    printStats(currentVariantTasks);
}


// Этап 1. Исходный набор

console.log("\n1. Исходные задачи индивидуального варианта:");

console.table(currentVariantTasks);

console.log("\nИсходная сводка:");
printStats(currentVariantTasks);


// Этап 2. Добавление задачи

applyVariantResult(
    addTask(
        currentVariantTasks,
        80,
        "Проверить отображение всплывающих окон",
        "low"
    ),
    "2. Добавление задачи id = 80"
);


// Этап 3. Повторная установка статуса

const beforeStatusChange = currentVariantTasks;
const taskBeforeStatusChange = findTaskById(currentVariantTasks, 11);

applyVariantResult(
    setTaskCompleted(currentVariantTasks, 11, true),
    "3. Установка completed = true для id = 11"
);

console.log(
    "Создан новый массив:",
    currentVariantTasks !== beforeStatusChange
);

console.log(
    "Создан новый объект задачи:",
    findTaskById(currentVariantTasks, 11) !== taskBeforeStatusChange
);


// Этап 4. Переименование задачи

applyVariantResult(
    renameTask(
        currentVariantTasks,
        23,
        "Проверить кнопки и их состояния"
    ),
    "4. Переименование задачи id = 23"
);

console.log("Переименованная задача:");
console.log(findTaskById(currentVariantTasks, 23));


// Этап 5. Удаление задачи

applyVariantResult(
    removeTask(currentVariantTasks, 37),
    "5. Удаление задачи id = 37"
);


// Этап 6. Обработка повторяющегося идентификатора

const variantStateBeforeError = currentVariantTasks;
const variantValuesBeforeError = JSON.stringify(currentVariantTasks);

applyVariantResult(
    addTask(
        currentVariantTasks,
        80,
        "Повторная проверка интерфейса",
        "low"
    ),
    "6. Повторное добавление задачи id = 80"
);

console.log(
    "Состояние после ошибки не изменилось:",
    currentVariantTasks === variantStateBeforeError &&
    JSON.stringify(currentVariantTasks) === variantValuesBeforeError
);


// Итоговый список индивидуального варианта

console.log("\nИтоговый список задач индивидуального варианта:");

console.table(currentVariantTasks);

console.log(
    "Идентификаторы итогового списка:",
    currentVariantTasks.map((task) => task.id)
);

console.log("\nНевыполненные задачи:");
console.table(getPendingTasks(currentVariantTasks));

console.log(
    "Идентификаторы невыполненных задач:",
    getPendingTasks(currentVariantTasks).map((task) => task.id)
);

console.log("\nИтоговая сводка индивидуального варианта:");
printStats(currentVariantTasks);


// Проверка неизменности исходного массива варианта

console.log("\nИсходный массив variantTasks:");
console.table(variantTasks);

console.log(
    "Исходный массив variantTasks не изменился:",
    JSON.stringify(variantTasks) === JSON.stringify(originalVariantTasks)
);

console.log(
    "Общий массив demoTasks не изменился:",
    JSON.stringify(demoTasks) === JSON.stringify(originalDemoTasks)
);
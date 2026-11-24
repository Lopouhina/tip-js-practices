import assert from "node:assert/strict";

import {
    createTask,
    addTask,
    renameTask,
    getTaskStats
} from "./src/task-service.js";


// Проверка 1. Название задачи на русском языке

const first = createTask(101, "  Подготовить отчёт  ");

assert.equal(first.ok, true);
assert.equal(first.task.title, "Подготовить отчёт");
assert.equal(first.task.priority, "medium");

console.log("OK: 01. Создание задачи с русским названием");


// Проверка 2. Неизменность данных после ошибочного переименования

const tasks = [first.task];
const original = JSON.stringify(tasks);

const second = renameTask(tasks, 101, "   ");

assert.equal(second.ok, false);
assert.equal(JSON.stringify(tasks), original);

console.log("OK: 02. Ошибочное переименование не изменяет данные");


// Проверка 3. Статистика после добавления задачи

const third = addTask(tasks, 205, "Проверить отчёт", "high");

assert.equal(third.ok, true);

assert.deepEqual(getTaskStats(third.tasks), {
    total: 2,
    completed: 0,
    pending: 2,
    progress: 0
});

assert.equal(tasks.length, 1);

console.log("OK: 03. Статистика после добавления задачи");

console.log("\nСобственных проверок пройдено: 3 из 3");
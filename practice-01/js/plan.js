
"use strict";

// Практическая работа №1
// Задание 4. План выполнения задач по дням
// Вариант №6

const totalTasks = 18;
const completedTasks = 6;
const dailyLimit = 5;

// Проверка исходных данных
if (
    !Number.isInteger(totalTasks) ||
    !Number.isInteger(completedTasks) ||
    totalTasks < 0 ||
    totalTasks > 1000 ||
    completedTasks < 0 ||
    completedTasks > totalTasks ||
    !Number.isInteger(dailyLimit) ||
    dailyLimit < 1 ||
    dailyLimit > 1000
) {
    console.log("Ошибка: некорректные данные");
} else {
    let remainingTasks = totalTasks - completedTasks;
    let day = 0;

    console.log("Осталось задач:", remainingTasks);

    if (remainingTasks === 0) {
        console.log("Все задачи уже выполнены");
    } else {
        // Распределение задач по дням
        while (remainingTasks > 0) {
            day++;

            const tasksToday = Math.min(dailyLimit, remainingTasks);

            remainingTasks -= tasksToday;

            console.log(
                `День ${day}: выполнено ${tasksToday}, осталось ${remainingTasks}`
            );
        }
    }

    console.log("Потребуется дней:", day);
}

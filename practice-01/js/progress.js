
"use strict";

// Практическая работа №1
// Задание 3. Сводка выполнения задач
// Вариант №6

const totalTasks = 18;
const completedTasks = 6;

// Проверка корректности данных
if (
    !Number.isInteger(totalTasks) ||
    !Number.isInteger(completedTasks) ||
    totalTasks < 0 ||
    totalTasks > 1000 ||
    completedTasks < 0 ||
    completedTasks > totalTasks
) {
    console.log("Ошибка: некорректные данные");
} else if (totalTasks === 0) {
    console.log("Задач пока нет");
} else {
    // Вычисление оставшихся задач и процента
    const remainingTasks = totalTasks - completedTasks;
    const progressPercent = (completedTasks / totalTasks) * 100;

    // Определение статуса
    let status;

    if (completedTasks === totalTasks) {
        status = "Завершено";
    } else if (completedTasks === 0) {
        status = "Не начато";
    } else {
        status = "В работе";
    }

    // Вывод результата
    console.log("Всего задач:", totalTasks);
    console.log("Выполнено:", completedTasks);
    console.log("Осталось:", remainingTasks);
    console.log(`Прогресс: ${progressPercent.toFixed(1)}%`);
    console.log("Статус:", status);
}

import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

// ---------- вспомогательные функции вывода (только отображение) ----------

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`\n[${label}]`);
  if (total === 0) {
    console.log("Задач пока нет");
    return;
  }
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  console.log(`Прогресс: ${progress.toFixed(1)}%`);
}

function printTasks(label, tasks) {
  console.log(`\n[${label}]`);
  for (const { id, title, completed, priority } of tasks) {
    console.log(`  #${id} ${completed ? "✓" : " "} [${priority}] ${title}`);
  }
}

function printTitles(label, tasks) {
  console.log(`\n[${label}]`);
  console.log("  " + getTaskTitles(tasks).join(" | "));
}

function printPending(label, tasks) {
  const pending = getPendingTasks(tasks);
  console.log(`\n[${label}] (${pending.length})`);
  for (const { id, title } of pending) {
    console.log(`  #${id} ${title}`);
  }
}

// Применяет операцию: при успехе возвращает новый массив, при ошибке — старый.
function apply(current, result, actionName) {
  if (result.ok) {
    console.log(`  ✓ ${actionName}`);
    return result.tasks;
  }
  console.error(`  ✗ ${actionName}: ${result.error}`);
  return current;
}

// ---------- общий сценарий ----------

console.log("=".repeat(60));
console.log("ОБЩИЙ СЦЕНАРИЙ (demoTasks)");
console.log("=".repeat(60));

let currentTasks = demoTasks;

printTasks("Исходные задачи", currentTasks);
printTitles("Названия", currentTasks);
printPending("Невыполненные", currentTasks);
printStats("Исходная сводка", currentTasks);

currentTasks = apply(
  currentTasks,
  addTask(currentTasks, 20, "Добавить проверку", "high"),
  "добавление id 20"
);
printStats("После добавления id 20", currentTasks);

currentTasks = apply(
  currentTasks,
  setTaskCompleted(currentTasks, 4, true),
  "id 4 → completed = true"
);
printStats("После выполнения id 4", currentTasks);

currentTasks = apply(
  currentTasks,
  renameTask(currentTasks, 10, "Подготовить инструкцию запуска"),
  "переименование id 10"
);
printStats("После переименования id 10", currentTasks);

currentTasks = apply(
  currentTasks,
  removeTask(currentTasks, 7),
  "удаление id 7"
);
printStats("После удаления id 7", currentTasks);

// Обработка отказа: повторный id
console.log("\n[Проверка отказа: повторяющийся id]");
const dupResult = addTask(currentTasks, 4, "Дубликат");
if (!dupResult.ok) {
  console.error(`  ✗ Ожидаемый отказ: ${dupResult.error}`);
} else {
  currentTasks = dupResult.tasks;
  console.log("  ✓ (неожиданно) добавлено");
}

console.log("\n[Итоговый список]");
console.log("  ids: " + currentTasks.map((t) => t.id).join(", "));
const lastPending = getPendingTasks(currentTasks);
console.log(
  "  невыполненные: " +
    (lastPending.length ? lastPending.map((t) => t.id).join(", ") : "нет")
);

// Подтверждение неизменности demoTasks
const demoTasksIntact =
  demoTasks.length === 4 &&
  demoTasks[0].id === 1 &&
  demoTasks[0].completed === true &&
  demoTasks[1].completed === false &&
  demoTasks[2].id === 7 &&
  demoTasks[3].title === "Оформить README";
console.log(
  `\n[demoTasks] исходный набор ${demoTasksIntact ? "не изменён ✓" : "ИЗМЕНЁН ✗"}`
);

// ---------- сценарий индивидуального варианта ----------

console.log("\n" + "=".repeat(60));
console.log(`ИНДИВИДУАЛЬНЫЙ ВАРИАНТ № ${variantNumber}`);
console.log("=".repeat(60));

let currentVariant = variantTasks;

printTasks("Исходные задачи варианта", currentVariant);
printStats("Исходная сводка варианта", currentVariant);

currentVariant = apply(
  currentVariant,
  addTask(currentVariant, 80, "Собрать слайды выступления", "medium"),
  "добавление id 80"
);
printStats("После добавления id 80", currentVariant);

currentVariant = apply(
  currentVariant,
  setTaskCompleted(currentVariant, 11, true),
  "id 11 → completed = true"
);
printStats("После установки completed = true для id 11", currentVariant);

currentVariant = apply(
  currentVariant,
  renameTask(currentVariant, 23, "Отрепетировать вступительное слово"),
  "переименование id 23"
);
printStats("После переименования id 23", currentVariant);

currentVariant = apply(
  currentVariant,
  removeTask(currentVariant, 37),
  "удаление id 37"
);
printStats("После удаления id 37", currentVariant);

// Повторное добавление id 80 — ожидаемый отказ
console.log("\n[Проверка отказа: повторное добавление id 80]");
const dupVariant = addTask(currentVariant, 80, "Ещё одна задача");
if (!dupVariant.ok) {
  console.error(`  ✗ Ожидаемый отказ: ${dupVariant.error}`);
} else {
  currentVariant = dupVariant.tasks;
  console.log("  ✓ (неожиданно) добавлено");
}

printTasks("Итоговые задачи варианта", currentVariant);
printStats("Итоговая сводка варианта", currentVariant);

const variantIntact =
  variantTasks.length === 6 &&
  variantTasks.map((t) => t.id).join(",") === "11,23,37,41,58,64" &&
  variantTasks[0].completed === true &&
  variantTasks[1].completed === false;
console.log(
  `\n[variantTasks] исходный набор ${
    variantIntact ? "не изменён ✓" : "ИЗМЕНЁН ✗"
  }`
);
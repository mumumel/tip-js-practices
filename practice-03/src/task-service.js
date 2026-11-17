export function createTask(id, title, priority = "medium") {
  if (typeof id !== "number") {
    return { ok: false, error: "id должен быть числом" };
  }

  if (typeof title !== "string") {
    return { ok: false, error: "Название задачи должно быть строкой" };
  }

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным безопасным целым числом" };
  }

  const cleanTitle = title.trim();
  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return { ok: false, error: "Название должно содержать от 1 до 100 символов после trim()" };
  }

  if (priority !== "low" && priority !== "medium" && priority !== "high") {
    return { ok: false, error: 'Приоритет должен быть "low", "medium" или "high"' };
  }

  return {
    ok: true,
    task: {
      id,
      title: cleanTitle,
      completed: false,
      priority,
    },
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
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  const exists = tasks.some((task) => task.id === id);
  if (exists) {
    return { ok: false, error: `Задача с id = ${id} уже существует` };
  }

  const created = createTask(id, title, priority);
  if (!created.ok) {
    return created;
  }

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  const idCheck = createTask(id, "x");
  if (!idCheck.ok) {
    return idCheck;
  }

  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть true или false" };
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed };
    }
    return task;
  });

  return { ok: true, tasks: newTasks };
}

export function renameTask(tasks, id, title) {
  const created = createTask(id, title);
  if (!created.ok) {
    return created;
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, title: created.task.title };
    }
    return task;
  });

  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  const idCheck = createTask(id, "x");
  if (!idCheck.ok) {
    return idCheck;
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.filter((task) => task.id !== id);

  return { ok: true, tasks: newTasks };
}
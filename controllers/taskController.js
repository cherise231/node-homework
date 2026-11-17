const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
// const pool = require("../db/pg-pool");
const prisma = require("../db/prisma");

exports.create = async (req, res) => {
  if (!req.body) req.body = {};

  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const task = await prisma.task.create({
    data: {
      title: value.title,
      isCompleted: value.isCompleted,
      userId: global.user_id,
    },
    select: { title: true, isCompleted: true, id: true },
  });
  // const result = await pool.query(
  //   `INSERT INTO tasks (title, is_completed, user_id)
  //    VALUES ($1, $2, $3)
  //    RETURNING id, title, is_completed`,
  //   [value.title, value.isCompleted, global.user_id],
  // );

  return res.status(201).json(task);
};

exports.index = async (req, res) => {
  // const result = await pool.query(
  //   `SELECT id, title, is_completed
  //    FROM tasks
  //    WHERE user_id = $1`,
  //   [global.user_id],
  // );
  const tasks = await prisma.task.findMany({
    where: {
      userId: global.user_id, // only the tasks for this user!
    },
    select: { title: true, isCompleted: true, id: true },
  });

  if (tasks.length === 0) {
    return res.status(404).json({
      message: "No task found for user",
    });
  }

  return res.status(200).json(tasks);
};

exports.show = async (req, res) => {
  const taskId = parseInt(req.params?.id);
  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  // const result = await pool.query(
  //   `SELECT id, title, is_completed
  //    FROM tasks
  //    WHERE id = $1 AND user_id = $2`,
  //   [taskId, global.user_id],
  // );

  const result = await prisma.task.findUnique({
    where: {
      id: taskId,
      userId: global.user_id,
    },
    select: { title: true, isCompleted: true, id: true },
  });

  if (!result) {
    return res.status(404).json({
      message: "No matching task exists.",
    });
  }
  return res.status(200).json(result);
};

exports.update = async (req, res, next) => {
  // if req.body is empty, replace with an empty object
  if (!req.body) req.body = {};

  // checks incoming data, error contains validation errors, value contains the validated data
  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  // convert req.params.id to a number
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  try {
    const task = await prisma.task.update({
      data: value,
      where: {
        id: taskId,
        userId: global.user_id,
      },
      select: { title: true, isCompleted: true, id: true },
    });

    return res.status(200).json(task);

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "The task was not found.",
      });
    } else {
      return next(err); // Pass other errors to the global error handler
    }
  }

  // const result = await pool.query(
  //   `UPDATE tasks
  //    SET title = COALESCE($1, title),
  //        is_completed = COALESCE($2, is_completed)
  //    WHERE id = $3 AND user_id = $4
  //    RETURNING id, title, is_completed`,
  //   [value.title ?? null, value.isCompleted ?? null, taskId, global.user_id],
  // );

  // if (result.rows.length === 0) {
  //   return res.status(404).json({
  //     message: "No matching task exists.",
  //   });
  // }
  // return res.status(200).json(result.rows[0]);
};

exports.deleteTask = async (req, res, next) => {
  const taskId = parseInt(req.params?.id);
  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  // const result = await pool.query(
  //   `DELETE FROM tasks
  //    WHERE id = $1 AND user_id = $2
  //    RETURNING id, title, is_completed`,
  //   [taskId, global.user_id],
  // );

  try {
    const task = await prisma.task.delete({
      where: {
        id: taskId,
        userId: global.user_id,
      },
      select: { title: true, isCompleted: true, id: true },
    });

    return res.status(200).json(task);

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "No matching task exists.",
      });
    } else {
      return next(err); // Pass other errors to the global error handler
    }
  }

  // if (result.rows.length === 0) {
  //   return res.status(404).json({
  //     message: "No matching task exists.",
  //   });
  // }
  // return res.status(200).json(result.rows[0]);
  
};

module.exports = {
  create: exports.create,
  index: exports.index,
  show: exports.show,
  update: exports.update,
  deleteTask: exports.deleteTask,
};

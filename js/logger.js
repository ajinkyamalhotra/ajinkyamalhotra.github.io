// logger.js

// Internal task counter and a map to store task details.
let taskCounter = 0;
const tasksInProgress = new Map();

/**
 * Generates a unique task ID.
 * @returns {number} A unique task ID.
 */
function generateTaskId() {
    return ++taskCounter;
}

/**
 * Logs the start of an action with a unique task ID.
 * @param {string} action - Description of the action.
 * @param {number} taskId - Unique task ID.
 */
export function logStart(action, taskId) {
    tasksInProgress.set(taskId, action);
    console.log(
        `%c🚀 START [#${taskId}]: ${action}`,
        "color: #1E90FF; font-weight: bold; font-size: 12px;"
    );
}

/**
 * Logs the end of an action and removes it from the in-progress map.
 * @param {string} action - Description of the action.
 * @param {number} taskId - Unique task ID.
 */
export function logEnd(action, taskId) {
    console.log(
        `%c✅ COMPLETED [#${taskId}]: ${action}`,
        "color: #32CD32; font-weight: bold; font-size: 12px;"
    );
    tasksInProgress.delete(taskId);
}

/**
 * Wraps a synchronous function call with start and end logs
 * @param {string} action - Description of the action.
 * @param {Function} fn - The function to execute.
 * @returns {*} The result of executing fn.
 */
export function logAction(action, fn) {
    const taskId = generateTaskId();
    logStart(action, taskId);
    const result = fn();
    logEnd(action, taskId);
    return result;
}

/**
 * Wraps an asynchronous function call with start and end logs
 * If an error occurs, the full stack trace is logged.
 * @param {string} action - Description of the action.
 * @param {Function} asyncFn - The asynchronous function to execute.
 * @returns {Promise<*>} The result of executing asyncFn.
 */
export async function logActionAsync(action, asyncFn) {
    const taskId = generateTaskId();
    logStart(action, taskId);
    try {
        const result = await asyncFn();
        logEnd(action, taskId);
        return result;
    } catch (error) {
        console.error(
            `%c❌ ERROR in [#${taskId}]: ${action}\n${error.stack}`,
            "color: red; font-weight: bold; font-size: 12px;"
        );
        logEnd(action, taskId);
        throw error;
    }
}

/**
 * Returns an array of unfinished tasks as objects with taskId and action.
 * @returns {Array} List of unfinished tasks.
 */
export function getUnfinishedTasks() {
    const unfinished = [];
    tasksInProgress.forEach((action, taskId) => {
        unfinished.push({ taskId, action });
    });
    return unfinished;
}

/**
 * Returns the number of tasks that have started but not finished.
 * @returns {number} The number of unfinished tasks.
 */
export function getUnfinishedTaskCount() {
    return tasksInProgress.size;
}

/**
 * Resets the task counters and internal map.
 */
export function resetTaskCounters() {
    taskCounter = 0;
    tasksInProgress.clear();
}

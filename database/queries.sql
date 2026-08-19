-- Get all tasks
SELECT * FROM tasks;


-- Get a task by ID
SELECT * FROM tasks
WHERE id = 1;


-- Add a new task
INSERT INTO tasks (title, description)
VALUES ('Learn Git', 'Practice Git and GitHub workflow');


-- Update a task
UPDATE tasks
SET completed = TRUE
WHERE id = 1;


-- Delete a task
DELETE FROM tasks
WHERE id = 1;
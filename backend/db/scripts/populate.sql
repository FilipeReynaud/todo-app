insert into "user"
  (id, username, email)
values
  (default, 'test', 'test@gmail.com');

insert into task_type
  (id, "label")
values
  (default, 'Main'),
  (default, 'Sub');

insert into collection
  (id, "name", user_id)
values
  (default, 'ToDo-App', 1);

insert into task
  (id, title, is_completed, task_type, collection_id)
values
  (default, 'Design app architecture', false, 1, 1),
  (default, 'Design DB', false, 1, 1),
  (default, 'Design API', false, 1, 1),
  (default, 'Design FE', false, 1, 1),
  (default, 'Implement FE', false, 1, 1),
  (default, 'Implement BE', false, 1, 1)
;

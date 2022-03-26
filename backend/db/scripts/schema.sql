DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS collection;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS task_type;


create table "user"
(
  id serial primary key,
  username varchar(255) not null,
  email varchar(255) not null
);

create table task_type
(
  id serial primary key,
  label varchar(255) not null
);

create table collection
(
  id serial primary key,
  "name" varchar(255) not null,
  user_id bigint references "user" (id)
);

create table task
(
  id serial primary key,
  title varchar(255) not null,
  is_completed bool not null,
  task_type bigint references task_type (id),
  collection_id bigint references collection (id)
);

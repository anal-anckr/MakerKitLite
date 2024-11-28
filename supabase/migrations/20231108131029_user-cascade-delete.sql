alter table users
drop constraint if exists users_id_fkey,
add constraint users_id_fkey
foreign key (id)
references auth.users
on delete cascade;
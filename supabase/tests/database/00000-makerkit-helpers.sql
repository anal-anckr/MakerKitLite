create schema if not exists makerkit;

-- anon, authenticated, and service_role should have access to tests schema
grant USAGE on schema makerkit to anon, authenticated, service_role;

-- Don't allow public to execute any functions in the tests schema
alter default PRIVILEGES in schema makerkit revoke execute on FUNCTIONS from public;

-- Grant execute to anon, authenticated, and service_role for testing purposes
alter default PRIVILEGES in schema makerkit grant execute on FUNCTIONS to anon,
  authenticated, service_role;

create or replace function makerkit.create_db_user(user_id uuid)
  returns void
  as $$
begin
  insert into public.users(
    id
)
  values(
    user_id
);

end;

$$
language PLPGSQL;

begin;

select
  no_plan();

select
  isnt_empty($$
    select id from "auth"."users" where email = 'test@makerkit.dev'
$$, 'can select a user');

select
  *
from
  finish();

rollback;

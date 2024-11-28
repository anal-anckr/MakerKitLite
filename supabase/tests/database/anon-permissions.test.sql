begin;

create extension "basejump-supabase_test_helpers" version '0.0.6';

select
  no_plan();

set local role anon;

select throws_ok($$
  select
    * from users
$$, 'permission denied for table users');

select throws_ok($$
  select
    * from customers_subscriptions
$$, 'permission denied for table customers_subscriptions');

select throws_ok($$
  select
    * from subscriptions
$$, 'permission denied for table subscriptions');

select
  *
from
  finish();

rollback;

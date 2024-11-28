begin;

select
  plan (3);

set LOCAL search_path = core, PUBLIC, extensions;

select
  has_table ('customers_subscriptions');

select
  has_table ('users');

select
  has_table ('subscriptions');

select
  *
from
  finish ();

rollback;


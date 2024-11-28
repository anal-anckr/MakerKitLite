insert into auth.users
  values ('00000000-0000-0000-0000-000000000000',
  '059b89cf-0417-4692-abdf-cb065496ea4c', 'authenticated', 'authenticated',
  'test@makerkit.dev', '$2a$10$pbq2o5WRV0xvI/T7BeqFSOxUI7uNtNtdp0GiZQ8IJ.MRAIa4zUWwu', '2022-12-15 17:36:17.018386+00', null, '', NULL, '', null, '', '', null, '2022-12-15 17:36:17.020686+00', '{"provider": "email", "providers": ["email"], "role": "super-admin"}', '{}', true, '2022-12-15 17:36:17.013909+00', '2022-12-15 18:36:07.166183+00', null, null,
    '', '', null, default, '', 0, NULL, '', null);

insert into auth.users
  values ('00000000-0000-0000-0000-000000000000', '2b4a6624-7118-4551-8f0f-6b753e32e139', 'authenticated', 'authenticated', 'test2@makerkit.dev', '$2a$10$qnNMdqnF6hipOVe9sN.rXu7nK2bFcNzyu5GLzHKZpG9CA7kObkcbi', '2022-12-15 19:24:42.345467+00', null, '', NULL, '', null, '', '', null, '2022-12-15 19:24:42.347755+00', '{"provider": "email", "providers": ["email"]}', '{}', null, '2022-12-15 19:24:42.341975+00', '2022-12-15 19:24:42.349475+00', null, null,
    '', '', null, default, '', 0, NULL, '', null);

insert into auth.users
  values ('00000000-0000-0000-0000-000000000000',
  'e6058751-75dc-4831-b773-dd6e0c821963', 'authenticated', 'authenticated',
  'test-update-password@makerkit.dev', '$2a$10$xTcejQ5rqsn2R3p9jx4XhO18/Gv844c38YhXLgle5sbbtruLcr.x2', '2022-12-15 19:24:42.345467+00',
  null, '', NULL, '', null, '', '', null, '2022-12-15 19:24:42.347755+00', '{"provider": "email", "providers": ["email"]}', '{}', null, '2022-12-15 19:24:42.341975+00', '2022-12-15 19:24:42.349475+00', null, null, '', '', null, default, '', 0, NULL, '', null);

insert into auth.identities (id, provider, provider_id, user_id, identity_data,
last_sign_in_at, created_at, updated_at) values (
    '059b89cf-0417-4692-abdf-cb065496ea4c', 'email', 'email_01',
    '059b89cf-0417-4692-abdf-cb065496ea4c', '{}', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00'
);

insert into auth.identities (id, provider, provider_id, user_id, identity_data,
last_sign_in_at, created_at, updated_at) values (
    'e6058751-75dc-4831-b773-dd6e0c821963', 'email', 'email_02',
    'e6058751-75dc-4831-b773-dd6e0c821963', '{}', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00'
);

insert into auth.identities (id, provider, provider_id, user_id, identity_data,
last_sign_in_at, created_at, updated_at) values (
    '2b4a6624-7118-4551-8f0f-6b753e32e139', 'email', 'email_03',
    '2b4a6624-7118-4551-8f0f-6b753e32e139', '{}', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00', '2022-12-15 19:24:42.345467+00'
);
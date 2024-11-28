alter table "public"."users" add constraint "users_display_name_check" CHECK ((length(display_name) < 50)) not valid;

alter table "public"."users" validate constraint "users_display_name_check";

alter table "public"."users" add constraint "users_photo_url_check" CHECK ((length(photo_url) < 500)) not valid;

alter table "public"."users" validate constraint "users_photo_url_check";



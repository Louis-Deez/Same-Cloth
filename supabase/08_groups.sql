--  groups and communities
--  groups are created through one function
--  interest criteria and the owner membership are saved or not



-- group
-- created by points at public profile and posts 
create table if not exists public.community_group (
    group_id        uuid primary key default gen_random_uuid(),
    name            text not null check (char_length(btrim(name)) between 3 and 60),
    description     text check (description is null or char_length(description) <= 300),
    created_by      uuid not null references public.public_profile(user_id) on delete cascade,
    created_at      timestamp with time zone not null default now()
);
-- stops two groups from sharing same name even if its lower or uper cases
create unique index if not exists community_group_name_unique_idx
    on public.community_group (lower(name));


-- interests that define a group
-- these are answer option ids.
-- users pick at signup and matching is simply based on overlapping interests
create table if not exists public.community_group_criteria (
    group_id        uuid not null references public.community_group(group_id) on delete cascade,
    option_id       int  not null references public.answer_option(option_id),

    primary key (group_id, option_id)
);


-- who belongs to a group created by the host
create table if not exists public.community_group_member (
    group_id        uuid not null references public.community_group(group_id) on delete cascade,
    user_id         uuid not null references public.public_profile(user_id) on delete cascade,
    role            text not null default 'member' check (role in ('owner', 'member')),
    joined_at       timestamp with time zone not null default now(),

    primary key (group_id, user_id)
);


-- data needed for the groups page
create index if not exists community_group_feed_idx
    on public.community_group (created_at desc, group_id desc);

create index if not exists community_group_criteria_option_idx
    on public.community_group_criteria (option_id);

create index if not exists community_group_member_user_idx
    on public.community_group_member (user_id);


-- creation function
-- security, allows it to create the owner row, which users cannot create themselves
-- gets the user id from auth.uid, not from user input
-- removes duplicate option ids to prevent primary key conflicts
create or replace function public.create_community_group(
    group_name          text,
    group_description   text default null,
    option_ids          int[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    current_user_id     uuid := (select auth.uid());
    clean_name          text := btrim(coalesce(group_name, ''));
    clean_description   text := nullif(btrim(coalesce(group_description, '')), '');
    picked_ids          int[];
    new_group_id        uuid;
begin
    if current_user_id is null then
        raise exception 'you must be signed in to create a group';
    end if;

    select coalesce(array_agg(distinct picked.id), '{}')
        into picked_ids
        from unnest(option_ids) as picked(id);

    if cardinality(picked_ids) = 0 then
        raise exception 'pick at least one interest for the group';
    end if;

    if exists (
        select 1
        from unnest(picked_ids) as picked(id)
        where not exists (
            select 1 from public.answer_option as option_row
            where option_row.option_id = picked.id
        )
    ) then
        raise exception 'one of the picked interests does not exist';
    end if;

    insert into public.community_group (name, description, created_by)
    values (clean_name, clean_description, current_user_id)
    returning group_id into new_group_id;

    insert into public.community_group_criteria (group_id, option_id)
    select new_group_id, picked.id
    from unnest(picked_ids) as picked(id);

    insert into public.community_group_member (group_id, user_id, role)
    values (new_group_id, current_user_id, 'owner');

    return new_group_id;
end;
$$;

-- only signed in users can use it
revoke all on function public.create_community_group(text, text, int[]) from public;
revoke all on function public.create_community_group(text, text, int[]) from anon;
grant execute on function public.create_community_group(text, text, int[]) to authenticated;


-- access rules
-- signed in users can view all groups, but only the owner can edit or delete them
-- groups can only be created through the function above
alter table public.community_group          enable row level security;
alter table public.community_group_criteria enable row level security;
alter table public.community_group_member   enable row level security;

drop policy if exists "Authenticated users can view groups"   on public.community_group;
drop policy if exists "Group owners can update their groups"  on public.community_group;
drop policy if exists "Group owners can delete their groups"  on public.community_group;

create policy "Authenticated users can view groups" on public.community_group
    for select to authenticated
        using (true);

create policy "Group owners can update their groups" on public.community_group
    for update to authenticated
        using ((select auth.uid()) = created_by)
        with check ((select auth.uid()) = created_by);

create policy "Group owners can delete their groups" on public.community_group
    for delete to authenticated
        using ((select auth.uid()) = created_by);

drop policy if exists "Authenticated users can view group criteria" on public.community_group_criteria;

create policy "Authenticated users can view group criteria" on public.community_group_criteria
    for select to authenticated
        using (true);

drop policy if exists "Authenticated users can view group members" on public.community_group_member;

create policy "Authenticated users can view group members" on public.community_group_member
    for select to authenticated
        using (true);


-- table permissions
-- grants control what signed in users can do, while rls controls which rows they can access
-- owners can only edit the name and description, not the creator or date
grant select                         on public.community_group          to authenticated;
grant update (name, description)     on public.community_group          to authenticated;
grant delete                         on public.community_group          to authenticated;
grant select                         on public.community_group_criteria to authenticated;
grant select                         on public.community_group_member   to authenticated;

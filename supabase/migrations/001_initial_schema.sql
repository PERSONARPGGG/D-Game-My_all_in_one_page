-- Supabase 초기 스키마 (SQL Editor에서 실행)
-- 이 파일은 supabase/migrations/001_initial_schema.sql로도 저장됨

-- 1. 카테고리 (계층형, 사용자 커스텀 가능)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  icon text,
  color text,
  display_order int default 0,
  parent_id uuid references categories(id) on delete set null,
  is_system boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. 소스 (RSS, API, 스크래퍼, 수동)
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('rss','api','scraper','manual','reddit','dcinside','official')),
  url text,
  config jsonb default '{}',
  category_id uuid references categories(id) on delete set null,
  is_active boolean default true,
  last_fetched_at timestamptz,
  fetch_interval_minutes int default 60,
  error_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 아티클 (정규화된 통합 포맷)
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  url text not null unique,
  summary text,
  content text,
  thumbnail text,
  author text,
  published_at timestamptz,
  fetched_at timestamptz default now(),
  -- AI 인리치먼트
  ai_summary text,
  ai_tags text[],
  ai_actions jsonb default '[]',
  ai_importance int default 3 check (ai_importance between 1 and 5),
  ai_category_slug text,
  raw_data jsonb default '{}',
  -- 메타
  is_breaking boolean default false,
  is_read boolean default false,
  is_bookmarked boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_articles_category_published on articles(category_id, published_at desc);
create index if not exists idx_articles_user_category on articles(category_id) where category_id is not null;
create index if not exists idx_articles_breaking on articles(is_breaking, published_at desc) where is_breaking = true;
create index if not exists idx_articles_search on articles using gin (to_tsvector('korean', title || ' ' || coalesce(content,'')));

-- 4. 사용자 선호도
create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  categories jsonb default '[]',
  keywords jsonb default '[]',
  briefing_time_morning time default '07:00',
  briefing_time_evening time default '21:00',
  notification_settings jsonb default '{"breaking":true,"daily":true,"keywords":true,"gamePatch":true,"gameEvent":true,"gameCoupon":true}',
  theme text default 'system' check (theme in ('light','dark','amoled','system')),
  tone text default 'manager' check (tone in ('brother','manager','senior','entj')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. 하이라이트/메모
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references articles(id) on delete cascade,
  text text not null,
  note text,
  tags text[],
  location jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. 액션 아이템 (실천 트래커)
create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references articles(id) on delete set null,
  title text not null,
  description text,
  status text default 'pending' check (status in ('pending','doing','done','archived')),
  due_date date,
  completed_at timestamptz,
  streak_count int default 0,
  category_slug text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. 일일/주간 리포트
create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  briefing_content jsonb default '{}',
  articles_viewed int default 0,
  actions_completed int default 0,
  reading_time_minutes int default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- 8. 구독 관리 (사용자별 소스 구독)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  source_id uuid references sources(id) on delete cascade,
  is_active boolean default true,
  custom_name text,
  notify_breaking boolean default true,
  notify_daily boolean default true,
  created_at timestamptz default now(),
  unique(user_id, source_id)
);

-- 9. 포트폴리오
create table if not exists portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  name text,
  quantity numeric not null default 0,
  avg_price numeric,
  current_price numeric,
  currency text default 'USD',
  asset_type text check (asset_type in ('stock','etf','crypto','reit','cash')),
  sector text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, ticker)
);

create table if not exists portfolio_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  holding_id uuid references portfolio_holdings(id) on delete cascade,
  type text not null check (type in ('buy','sell','dividend','split','transfer_in','transfer_out')),
  quantity numeric not null,
  price numeric not null,
  fee numeric default 0,
  tax numeric default 0,
  executed_at timestamptz not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists portfolio_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  alert_type text not null check (alert_type in ('price_above','price_below','trailing_stop','earnings','dividend','news')),
  condition jsonb not null,
  is_active boolean default true,
  triggered_at timestamptz,
  created_at timestamptz default now()
);

-- 10. 게임 트래킹
create table if not exists user_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  game_id text not null,
  game_name text not null,
  display_name text,
  platform text,
  cover_image text,
  is_active boolean default true,
  notify_patch boolean default true,
  notify_event boolean default true,
  notify_coupon boolean default true,
  notify_server boolean default true,
  custom_keywords text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, game_id)
);

create table if not exists game_patches (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  version text not null,
  title text,
  content text,
  url text,
  published_at timestamptz,
  fetched_at timestamptz default now(),
  raw_data jsonb default '{}',
  unique(game_id, version)
);

create table if not exists game_events (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  rewards jsonb default '[]',
  conditions text,
  url text,
  event_type text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists game_coupons (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  code text not null,
  rewards jsonb default '[]',
  expires_at timestamptz,
  url text,
  is_used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now(),
  unique(game_id, code)
);

-- RLS (Row Level Security)
alter table categories enable row level security;
alter table sources enable row level security;
alter table articles enable row level security;
alter table user_preferences enable row level security;
alter table highlights enable row level security;
alter table actions enable row level security;
alter table daily_reports enable row level security;
alter table subscriptions enable row level security;
alter table portfolio_holdings enable row level security;
alter table portfolio_transactions enable row level security;
alter table portfolio_alerts enable row level security;
alter table user_games enable row level security;
alter table game_patches enable row level security;
alter table game_events enable row level security;
alter table game_coupons enable row level security;

-- Policies: 본인 데이터만 접근
create policy "own_data" on categories for all using (auth.uid() = user_id);
create policy "own_data" on sources for all using (auth.uid() = user_id);
create policy "own_data" on articles for all using (
  auth.uid() = (select user_id from sources where id = articles.source_id limit 1)
  or auth.uid() = (select user_id from user_preferences where user_id = auth.uid() limit 1)
);
create policy "own_data" on user_preferences for all using (auth.uid() = user_id);
create policy "own_data" on highlights for all using (auth.uid() = user_id);
create policy "own_data" on actions for all using (auth.uid() = user_id);
create policy "own_data" on daily_reports for all using (auth.uid() = user_id);
create policy "own_data" on subscriptions for all using (auth.uid() = user_id);
create policy "own_data" on portfolio_holdings for all using (auth.uid() = user_id);
create policy "own_data" on portfolio_transactions for all using (auth.uid() = user_id);
create policy "own_data" on portfolio_alerts for all using (auth.uid() = user_id);
create policy "own_data" on user_games for all using (auth.uid() = user_id);
create policy "public_read" on game_patches for select using (true);
create policy "public_read" on game_events for select using (true);
create policy "public_read" on game_coupons for select using (true);

-- updated_at 트리거
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_categories_updated before update on categories for each row execute function update_updated_at();
create trigger trg_sources_updated before update on sources for each row execute function update_updated_at();
create trigger trg_articles_updated before update on articles for each row execute function update_updated_at();
create trigger trg_user_preferences_updated before update on user_preferences for each row execute function update_updated_at();
create trigger trg_highlights_updated before update on highlights for each row execute function update_updated_at();
create trigger trg_actions_updated before update on actions for each row execute function update_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions for each row execute function update_updated_at();
create trigger trg_portfolio_holdings_updated before update on portfolio_holdings for each row execute function update_updated_at();
create trigger trg_user_games_updated before update on user_games for each row execute function update_updated_at();
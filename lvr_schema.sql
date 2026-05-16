-- ============================================================
-- 實價登錄資料庫 Migration
-- 專案：znmaewkznmwsqjnndqrw (Project Estimator V3 / AGI Hub 共用)
-- 資料來源：政府資料開放平臺 OGDL v1 (可商用)
-- 覆蓋範圍：全台 22 縣市，2012Q3 至今
-- 執行方式：貼入 Supabase Dashboard > SQL Editor 執行
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. 買賣成交資料表 (lvr_trades) — 約 475 萬筆
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lvr_trades (
  id                BIGSERIAL PRIMARY KEY,
  city              TEXT        NOT NULL,    -- 縣市（中文，e.g. 台北市）
  district          TEXT,                   -- 鄉鎮市區
  address           TEXT,                   -- 土地位置建物門牌
  land_area         NUMERIC,                -- 土地移轉總面積(平方公尺)
  usage             TEXT,                   -- 土地使用分區
  transaction_type  TEXT,                   -- 交易筆棟數描述
  shift_date        TEXT,                   -- 交易年月日（原始民國格式）
  iso_trade_date    DATE,                   -- 交易年月日（ISO 轉換）
  floor_info        TEXT,                   -- 樓層範圍
  total_floor       TEXT,                   -- 總樓層數
  building_type     TEXT,                   -- 建物型態
  purpose           TEXT,                   -- 主要用途
  build_material    TEXT,                   -- 主要建材
  complete_date     TEXT,                   -- 建築完成年月
  building_area     NUMERIC,               -- 建物移轉總面積(平方公尺)
  ping              NUMERIC GENERATED ALWAYS AS (ROUND((building_area / 3.3058)::NUMERIC, 2)) STORED,
  room_count        TEXT,                   -- 格局-房
  hall_count        TEXT,                   -- 格局-廳
  bath_count        TEXT,                   -- 格局-衛
  total_price       BIGINT,                 -- 總價元
  unit_price        BIGINT,                 -- 單價元/平方公尺
  unit_price_ping   BIGINT GENERATED ALWAYS AS ((unit_price * 3.3058)::BIGINT) STORED,
  parking_type      TEXT,                   -- 車位類別
  parking_area      NUMERIC,               -- 車位移轉總面積(平方公尺)
  parking_price     BIGINT,                -- 車位總價元
  note              TEXT,                   -- 備註
  season            TEXT        NOT NULL,   -- 季別 (e.g. "2026Q1")

  CONSTRAINT lvr_trades_uniq UNIQUE (city, iso_trade_date, address, total_price)
);

COMMENT ON TABLE public.lvr_trades IS '不動產買賣成交資訊 — 政府實價登錄開放資料 (OGDL v1)';
COMMENT ON COLUMN public.lvr_trades.ping IS '坪數（由 building_area 自動計算，1坪=3.3058㎡）';
COMMENT ON COLUMN public.lvr_trades.unit_price_ping IS '單價元/坪（由 unit_price 自動換算）';

-- ────────────────────────────────────────────────────────────
-- 2. 租賃成交資料表 (lvr_rentals) — 約 73 萬筆
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lvr_rentals (
  id                BIGSERIAL PRIMARY KEY,
  city              TEXT        NOT NULL,
  district          TEXT,
  address           TEXT,
  building_type     TEXT,
  floor_info        TEXT,
  total_floor       TEXT,
  building_area     NUMERIC,
  ping              NUMERIC GENERATED ALWAYS AS (ROUND((building_area / 3.3058)::NUMERIC, 2)) STORED,
  room_count        TEXT,
  hall_count        TEXT,
  bath_count        TEXT,
  rental_price      BIGINT,                -- 月租金(元)
  rental_type       TEXT,                  -- 租賃型態（整層/分租/雅房）
  shift_date        TEXT,
  iso_trade_date    DATE,
  has_parking       BOOLEAN DEFAULT FALSE,
  has_furniture     BOOLEAN DEFAULT FALSE,
  note              TEXT,
  season            TEXT        NOT NULL,

  CONSTRAINT lvr_rentals_uniq UNIQUE (city, iso_trade_date, address, rental_price)
);

COMMENT ON TABLE public.lvr_rentals IS '不動產租賃成交資訊 — 政府實價登錄開放資料 (OGDL v1)';

-- ────────────────────────────────────────────────────────────
-- 3. 預售屋資料表 (lvr_presale) — 約 55 萬筆
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lvr_presale (
  id                BIGSERIAL PRIMARY KEY,
  city              TEXT        NOT NULL,
  district          TEXT,
  project_name      TEXT,                  -- 建案名稱
  address           TEXT,
  building_area     NUMERIC,
  ping              NUMERIC GENERATED ALWAYS AS (ROUND((building_area / 3.3058)::NUMERIC, 2)) STORED,
  floor_info        TEXT,
  total_floor       TEXT,
  room_count        TEXT,
  total_price       BIGINT,
  unit_price        BIGINT,
  unit_price_ping   BIGINT GENERATED ALWAYS AS ((unit_price * 3.3058)::BIGINT) STORED,
  shift_date        TEXT,
  iso_trade_date    DATE,
  is_cancellation   BOOLEAN DEFAULT FALSE, -- 是否為解約
  note              TEXT,
  season            TEXT        NOT NULL,

  CONSTRAINT lvr_presale_uniq UNIQUE (city, iso_trade_date, address, total_price, is_cancellation)
);

COMMENT ON TABLE public.lvr_presale IS '預售屋成交資訊（含解約）— 政府實價登錄開放資料 (OGDL v1)';

-- ────────────────────────────────────────────────────────────
-- 4. 建立查詢效能索引
-- ────────────────────────────────────────────────────────────

-- lvr_trades 索引
CREATE INDEX IF NOT EXISTS idx_trades_city        ON public.lvr_trades(city);
CREATE INDEX IF NOT EXISTS idx_trades_district    ON public.lvr_trades(city, district);
CREATE INDEX IF NOT EXISTS idx_trades_date        ON public.lvr_trades(iso_trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_season      ON public.lvr_trades(season);
CREATE INDEX IF NOT EXISTS idx_trades_type        ON public.lvr_trades(building_type);
CREATE INDEX IF NOT EXISTS idx_trades_price       ON public.lvr_trades(unit_price);

-- lvr_rentals 索引
CREATE INDEX IF NOT EXISTS idx_rentals_city       ON public.lvr_rentals(city);
CREATE INDEX IF NOT EXISTS idx_rentals_district   ON public.lvr_rentals(city, district);
CREATE INDEX IF NOT EXISTS idx_rentals_date       ON public.lvr_rentals(iso_trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_rentals_season     ON public.lvr_rentals(season);
CREATE INDEX IF NOT EXISTS idx_rentals_price      ON public.lvr_rentals(rental_price);

-- lvr_presale 索引
CREATE INDEX IF NOT EXISTS idx_presale_city       ON public.lvr_presale(city);
CREATE INDEX IF NOT EXISTS idx_presale_district   ON public.lvr_presale(city, district);
CREATE INDEX IF NOT EXISTS idx_presale_project    ON public.lvr_presale(project_name);
CREATE INDEX IF NOT EXISTS idx_presale_season     ON public.lvr_presale(season);

-- ────────────────────────────────────────────────────────────
-- 5. Row Level Security (RLS) — 符合 Supabase 2026 安全標準
-- ────────────────────────────────────────────────────────────

-- 實價登錄為政府公開資料，允許任何人讀取（anon + authenticated）
-- 寫入只允許 service_role（後端匯入腳本用）

ALTER TABLE public.lvr_trades   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lvr_rentals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lvr_presale  ENABLE ROW LEVEL SECURITY;

-- 公開讀取政策（實價登錄是公開資料）
DROP POLICY IF EXISTS "Public read lvr_trades"   ON public.lvr_trades;
DROP POLICY IF EXISTS "Public read lvr_rentals"  ON public.lvr_rentals;
DROP POLICY IF EXISTS "Public read lvr_presale"  ON public.lvr_presale;

CREATE POLICY "Public read lvr_trades"   ON public.lvr_trades   FOR SELECT USING (true);
CREATE POLICY "Public read lvr_rentals"  ON public.lvr_rentals  FOR SELECT USING (true);
CREATE POLICY "Public read lvr_presale"  ON public.lvr_presale  FOR SELECT USING (true);

-- 明確授權 (Supabase 2026 安全標準)
GRANT SELECT ON public.lvr_trades   TO anon, authenticated;
GRANT SELECT ON public.lvr_rentals  TO anon, authenticated;
GRANT SELECT ON public.lvr_presale  TO anon, authenticated;

GRANT ALL    ON public.lvr_trades   TO service_role;
GRANT ALL    ON public.lvr_rentals  TO service_role;
GRANT ALL    ON public.lvr_presale  TO service_role;

GRANT USAGE, SELECT ON SEQUENCE public.lvr_trades_id_seq   TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.lvr_rentals_id_seq  TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.lvr_presale_id_seq  TO service_role;

-- ────────────────────────────────────────────────────────────
-- 6. 預建常用查詢視圖 (Views) — 給 AGI 大腦直接呼叫
-- ────────────────────────────────────────────────────────────

-- 近 8 季各縣市每坪均價趨勢（買賣）
CREATE OR REPLACE VIEW public.v_trades_quarterly_avg AS
SELECT
  city,
  district,
  building_type,
  season,
  COUNT(*)                             AS deal_count,
  ROUND(AVG(unit_price_ping))::BIGINT  AS avg_unit_ping,   -- 平均每坪單價
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_price_ping))::BIGINT AS median_unit_ping,
  ROUND(AVG(total_price))::BIGINT      AS avg_total_price,
  ROUND(AVG(ping))::NUMERIC            AS avg_ping
FROM public.lvr_trades
WHERE building_area > 0
  AND unit_price > 0
  AND building_type IN ('住宅大樓', '套房', '公寓', '透天厝', '店面')
GROUP BY city, district, building_type, season
ORDER BY season DESC, city, district;

COMMENT ON VIEW public.v_trades_quarterly_avg IS '各縣市/行政區/建物型態的季度均價視圖，供 AGI 不動產大腦快速查詢';

-- 近 8 季各縣市租金行情
CREATE OR REPLACE VIEW public.v_rentals_quarterly_avg AS
SELECT
  city,
  district,
  building_type,
  season,
  COUNT(*)                                  AS deal_count,
  ROUND(AVG(rental_price))::BIGINT          AS avg_monthly_rent,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY rental_price))::BIGINT AS median_monthly_rent,
  ROUND(AVG(ping))::NUMERIC                 AS avg_ping,
  ROUND(AVG(rental_price / NULLIF(ping, 0)))::BIGINT AS avg_rent_per_ping -- 每坪月租
FROM public.lvr_rentals
WHERE building_area > 0
  AND rental_price > 0
GROUP BY city, district, building_type, season
ORDER BY season DESC, city, district;

COMMENT ON VIEW public.v_rentals_quarterly_avg IS '各縣市/行政區租金季度行情視圖，供 AGI 不動產大腦快速查詢';

-- 授權視圖讀取
GRANT SELECT ON public.v_trades_quarterly_avg   TO anon, authenticated, service_role;
GRANT SELECT ON public.v_rentals_quarterly_avg  TO anon, authenticated, service_role;

-- ────────────────────────────────────────────────────────────
-- 7. 重整 Schema 快取
-- ────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- ✅ 執行完畢！請到 Supabase Dashboard > Table Editor 確認：
--    lvr_trades / lvr_rentals / lvr_presale 三張表已建立
-- ============================================================

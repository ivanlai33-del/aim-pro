-- 升級 ticket_messages 資料表：增加 is_admin 欄位
ALTER TABLE public.ticket_messages 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

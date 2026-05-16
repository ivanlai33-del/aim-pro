// src/lib/lvrService.ts
import { supabase } from './supabaseClient'; // 引入專案既有的 Supabase Client

export interface RealEstateMarketSummary {
    city: string;
    district: string;
    building_type: string;
    season: string;
    avg_unit_ping: number;     // 每坪均價 (元/坪)
    median_unit_ping: number;  // 每坪中位數
    avg_total_price: number;   // 平均總價 (元)
    deal_count: number;        // 成交樣本數
}

export interface RentalMarketSummary {
    city: string;
    district: string;
    usage_type?: string;       // 建物用途 (例如: 商業店面、辦公室)
    avg_monthly_rent_ping: number; // 每坪月租金均價
    deal_count: number;        // 樣本數
}

export class LvrService {
    /**
     * 模式 A-1：直接連線 Supabase 撈取買賣行情摘要 (速度最快)
     * 適用於：裝潢預算合理性防護機制 (防止 Over-capitalization) 及 Generative UI 行情卡片
     * @param city 縣市 (例如: 台北市)
     * @param district 行政區 (可選，例如: 南港區)
     */
    static async getMarketSummary(city: string, district?: string): Promise<RealEstateMarketSummary[]> {
        try {
            let query = supabase
                .from('v_trades_quarterly_avg')
                .select('*')
                .eq('city', city)
                .order('season', { ascending: false });

            if (district) {
                query = query.eq('district', district);
            }

            const { data, error } = await query;
            if (error) {
                throw new Error(`Supabase v_trades_quarterly_avg 查詢失敗: ${error.message}`);
            }

            return data as RealEstateMarketSummary[];
        } catch (err) {
            console.error('LvrService getMarketSummary error:', err);
            throw err;
        }
    }

    /**
     * 模式 A-2：直接連線 Supabase 撈取商圈租賃大數據行情摘要
     * 適用於：商業空間展店租金試算 (精算損益平衡點)
     * @param city 縣市 (例如: 台北市)
     * @param district 行政區 (可選，例如: 大安區)
     */
    static async getRentalSummary(city: string, district?: string): Promise<RentalMarketSummary[]> {
        try {
            let query = supabase
                .from('lvr_rentals')
                .select('*')
                .eq('city', city);

            if (district) {
                query = query.eq('district', district);
            }

            const { data, error } = await query;
            if (error) {
                throw new Error(`Supabase lvr_rentals 查詢失敗: ${error.message}`);
            }

            return data as RentalMarketSummary[];
        } catch (err) {
            console.error('LvrService getRentalSummary error:', err);
            throw err;
        }
    }

    /**
     * 模式 B：呼叫 AGI Navigation Hub 的微服務 API (跨域封裝)
     * 適用於：微服務架構解耦、多專案共用與遠端備援調度
     * @param city 縣市
     * @param district 行政區
     * @param hubBaseUrl AGI Hub 網址 (預設 http://localhost:3033)
     */
    static async fetchFromAgiHub(
        city: string,
        district?: string,
        hubBaseUrl: string = 'http://localhost:3033'
    ) {
        let url = `${hubBaseUrl}/api/v1/lvr?mode=summary&city=${encodeURIComponent(city)}`;
        if (district) {
            url += `&district=${encodeURIComponent(district)}`;
        }

        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`無法從 AGI Hub 取得實價登錄微服務資料 (Status: ${res.status})`);
            }
            return await res.json();
        } catch (err) {
            console.error('LvrService fetchFromAgiHub error:', err);
            throw err;
        }
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // fallback to anon if service missing in dev

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            userId,
            tier,
            amount,
            companyName,
            taxId,
            contactName,
            email,
            bankLast5,
            transferDate
        } = body;

        if (!userId || !tier || !amount || !companyName || !contactName || !email || !bankLast5 || !transferDate) {
            return NextResponse.json({ error: '請填寫所有必填欄位' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('subscription_requests')
            .insert([{
                user_id: userId,
                tier,
                amount,
                company_name: companyName,
                tax_id: taxId || null,
                contact_name: contactName,
                email,
                bank_last_5: bankLast5,
                transfer_date: transferDate,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: '儲存申請失敗，請聯絡客服' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Submit Request Error:', error);
        return NextResponse.json({ error: '伺服器內部錯誤' }, { status: 500 });
    }
}

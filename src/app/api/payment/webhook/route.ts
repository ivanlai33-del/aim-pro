import { NextResponse } from 'next/server';
import { decryptTradeInfo } from '@/lib/newebpay';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { PRICING_CONFIG, SubscriptionTier } from '@/config/subscription';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const status = formData.get('Status');
        const merchantId = formData.get('MerchantID');
        const tradeInfo = formData.get('TradeInfo') as string;

        if (!tradeInfo) {
            return NextResponse.json({ error: 'Missing TradeInfo' }, { status: 400 });
        }

        // 1. Decrypt
        const result = decryptTradeInfo(tradeInfo);
        console.log('NewebPay Webhook Received:', result);

        const supabase = createSupabaseServerClient();
        const orderNo = result.Result?.MerchantOrderNo || result.MerchantOrderNo;

        // 2. Find the payment record
        const { data: payment, error: findError } = await supabase
            .from('payments')
            .select('*')
            .eq('order_no', orderNo)
            .single();

        if (findError || !payment) {
            console.error('Order not found:', orderNo);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 3. Handle Success
        if (result.Status === 'SUCCESS') {
            const tier = payment.tier as SubscriptionTier;
            const config = PRICING_CONFIG[tier];
            const aiCredits = config.limits.aiCreditsMonthly;

            // 3.1 Update Payment Status
            await supabase
                .from('payments')
                .update({ 
                    status: 'success', 
                    newebpay_data: result 
                })
                .eq('id', payment.id);

            // 3.2 Update User Profile (Tier & Quota)
            // Note: In production, use service_role for this or a stored procedure
            const { error: profileError } = await supabase
                .from('users_profile')
                .update({
                    tier: tier,
                    ai_quota: aiCredits,
                    updated_at: new Date().toISOString()
                })
                .eq('id', payment.user_id);

            if (profileError) {
                console.error('Profile Update Error:', profileError);
                return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
            }

            return NextResponse.json({ status: 'success' });
        } else {
            // 4. Handle Failure
            await supabase
                .from('payments')
                .update({ 
                    status: 'failed', 
                    newebpay_data: result 
                })
                .eq('id', payment.id);

            return NextResponse.json({ status: 'failed', message: result.Message });
        }

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

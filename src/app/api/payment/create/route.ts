import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { calculateSubscriptionPrice } from '@/lib/subscriptionUtils';
import { encryptTradeInfo, generateTradeSha, generateOrderData } from '@/lib/newebpay';
import { SubscriptionTier, PricingPeriod } from '@/config/subscription';

export async function POST(request: Request) {
    try {
        const supabase = createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { tier, period, addOnCount = 0 } = body as { 
            tier: SubscriptionTier; 
            period: PricingPeriod; 
            addOnCount?: number 
        };

        if (!tier || !period) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Calculate final amount
        const calculation = calculateSubscriptionPrice(tier, period, addOnCount);
        
        // 2. Create Order in Database
        const orderNo = `PE${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const { error: dbError } = await supabase.from('payments').insert({
            user_id: user.id,
            tier: tier,
            amount: calculation.totalPrice,
            status: 'pending',
            order_no: orderNo
        });

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
        }

        // 3. Prepare URLs
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
        const returnUrl = `${origin}/dashboard/settings?payment=success`;
        const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`;

        // 4. Generate Order Data (NewebPay format)
        const orderData = {
            MerchantID: process.env.NEXT_PUBLIC_NEWEBPAY_MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now() / 1000).toString(),
            Version: '2.0',
            MerchantOrderNo: orderNo,
            Amt: calculation.totalPrice,
            ItemDesc: `AI Project Estimator - ${calculation.details.tierName} (${calculation.details.billingPeriod})`,
            Email: user.email || '',
            LoginType: 0,
            NotifyURL: notifyUrl,
            ReturnURL: returnUrl,
            ClientBackURL: returnUrl,
        };

        // 5. Encrypt
        const tradeInfo = encryptTradeInfo(orderData);
        const tradeSha = generateTradeSha(tradeInfo);

        return NextResponse.json({
            status: 'success',
            data: {
                MerchantID: orderData.MerchantID,
                TradeInfo: tradeInfo,
                TradeSha: tradeSha,
                Version: orderData.Version,
                PaymentUrl: process.env.NEWEBPAY_API_URL,
                OrderNo: orderData.MerchantOrderNo,
                Amt: orderData.Amt
            }
        });

    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

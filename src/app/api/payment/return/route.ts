import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const status = formData.get('Status');
        const merchantOrderNo = formData.get('MerchantOrderNo');
        
        console.log(`Payment Return received for Order: ${merchantOrderNo}, Status: ${status}`);

        // Construct the final destination URL
        const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://aim.ycideas.com';
        const redirectUrl = new URL('/dashboard', origin);
        
        if (status === 'SUCCESS') {
            redirectUrl.searchParams.set('payment', 'success');
        } else {
            redirectUrl.searchParams.set('payment', 'failed');
            redirectUrl.searchParams.set('msg', '付款未完成或已取消');
        }

        // Perform a 303 See Other redirect to change POST to GET
        return NextResponse.redirect(redirectUrl.toString(), 303);
        
    } catch (error) {
        console.error('Payment Return Error:', error);
        return NextResponse.redirect(new URL('/dashboard?payment=error', process.env.NEXT_PUBLIC_APP_URL || 'https://aim.ycideas.com').toString(), 303);
    }
}

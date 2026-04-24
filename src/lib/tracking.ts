import { supabase } from './supabaseClient';

export type EventType = 
  | 'LOGIN' 
  | 'CREATE_PROJECT' 
  | 'GENERATE_REPORT' 
  | 'EXPORT_REPORT' 
  | 'UPGRADE_CLICK' 
  | 'OPEN_FINANCE' 
  | 'SWITCH_TEAM'
  | 'VIEW_SETTINGS'
  | 'AI_CHAT';

export async function trackEvent(eventType: EventType, metadata: any = {}) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { error } = await supabase.from('user_events').insert({
            user_id: session.user.id,
            event_type: eventType,
            metadata: {
                ...metadata,
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
            },
            user_agent: navigator.userAgent
        });

        if (error) console.error('Tracking Error:', error);
    } catch (err) {
        // Silent fail to not disturb user
        console.warn('Silent Tracking Fail:', err);
    }
}

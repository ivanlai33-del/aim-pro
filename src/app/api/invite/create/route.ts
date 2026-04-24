import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

/**
 * API Route to create a team invitation
 * POST /api/invite/create
 * Body: { teamId: string, email: string, role: string }
 */
export async function POST(request: Request) {
    const supabase = createSupabaseServerClient();
    
    try {
        const { teamId, email, role } = await request.json();

        if (!teamId || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify requester's permission (Must be Owner or Admin of the target team)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: membership, error: memError } = await supabase
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', user.id)
            .in('role', ['owner', 'admin'])
            .single();

        if (memError || !membership) {
            return NextResponse.json({ error: 'Permission denied. Only Owners and Admins can invite.' }, { status: 403 });
        }

        // 2. Check if user is already a member
        // In a real app, we'd lookup auth.users by email, but email is private in Supabase Auth.
        // We can check our own team_members if we store emails there, or just allow the invite.
        
        // 3. Create the invitation
        const { data: invitation, error: inviteError } = await supabase
            .from('team_invitations')
            .insert({
                team_id: teamId,
                email: email.toLowerCase(),
                role: role,
                inviter_id: user.id,
                status: 'pending'
            })
            .select()
            .single();

        if (inviteError) {
            console.error('Invite Creation Error:', inviteError);
            return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
        }

        // 4. In a real production app, you would call an Email Service (SendGrid/Postmark) here.
        // For now, we return the invitation details so the UI can show the link.
        
        return NextResponse.json({ 
            success: true, 
            invitation: {
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                token: invitation.token,
                expires_at: invitation.expires_at
            }
        });

    } catch (err) {
        console.error('Create Invite Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

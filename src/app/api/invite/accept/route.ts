import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

/**
 * API Route to accept a team invitation
 * POST /api/invite/accept
 * Body: { token: string }
 */
export async function POST(request: Request) {
    const supabase = createSupabaseServerClient();
    
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Missing invitation token' }, { status: 400 });
        }

        // 1. Get current authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
        }

        // 2. Find the invitation
        const { data: invitation, error: inviteError } = await supabase
            .from('team_invitations')
            .select('*')
            .eq('token', token)
            .eq('status', 'pending')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (inviteError || !invitation) {
            return NextResponse.json({ error: 'Invalid or expired invitation token' }, { status: 404 });
        }

        // 3. Prevent duplicate membership
        const { data: existingMember } = await supabase
            .from('team_members')
            .select('*')
            .eq('team_id', invitation.team_id)
            .eq('user_id', user.id)
            .single();

        if (existingMember) {
            // Already a member, just mark invite as accepted and move on
            await supabase
                .from('team_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitation.id);
                
            return NextResponse.json({ message: 'You are already a member of this team' });
        }

        // 4. Atomic Transaction Logic: Add to team members and update invitation status
        // Note: In a production app, use a RPC call for atomic transaction if possible.
        // Here we do them sequentially for simplicity.
        
        const { error: joinError } = await supabase
            .from('team_members')
            .insert({
                team_id: invitation.team_id,
                user_id: user.id,
                role: invitation.role
            });

        if (joinError) {
            console.error('Join Error:', joinError);
            return NextResponse.json({ error: 'Failed to join the team' }, { status: 500 });
        }

        // 5. Mark invitation as accepted
        await supabase
            .from('team_invitations')
            .update({ status: 'accepted' })
            .eq('id', invitation.id);

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully joined the team!',
            teamId: invitation.team_id
        });

    } catch (err) {
        console.error('Accept Invite Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

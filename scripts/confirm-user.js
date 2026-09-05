/**
 * Confirm User via Service Role (Admin)
 * Run: node scripts/confirm-user.js <email>
 *
 * NOTE: This requires SUPABASE_SERVICE_ROLE_KEY
 * Get it from: https://supabase.com/dashboard/project/gdtqrpkoocyqoeikwumq/settings/api
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdtqrpkoocyqoeikwumq.supabase.co'

// You need to add this to .env.local:
// VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.log('❌ VITE_SUPABASE_SERVICE_ROLE_KEY not found in environment')
  console.log('\n💡 Get your service role key from:')
  console.log('   https://supabase.com/dashboard/project/gdtqrpkoocyqoeikwumq/settings/api')
  console.log('\n   Add it to .env.local:')
  console.log('   VITE_SUPABASE_SERVICE_ROLE_KEY=your_key_here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const email = process.argv[2] || 'test@ajax.nl'

async function confirmUser() {
  console.log('🔧 Confirming user:', email, '\n')

  try {
    // Get user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.log('❌ Error listing users:', listError.message)
      return
    }

    const user = users.find(u => u.email === email)

    if (!user) {
      console.log('❌ User not found:', email)
      return
    }

    console.log('✅ Found user:', user.id)

    // Update user to confirmed
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    )

    if (error) {
      console.log('❌ Error confirming user:', error.message)
    } else {
      console.log('✅ User confirmed successfully!')
      console.log('\n🎉 You can now login with:')
      console.log('   Email:', email)
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

confirmUser()

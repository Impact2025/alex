/**
 * Create Test User in Supabase
 * Run: node scripts/create-test-user.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdtqrpkoocyqoeikwumq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdHFycGtvb2N5cW9laWt3dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQzNTYsImV4cCI6MjA3NTA5MDM1Nn0.R8XnzTW2upcPiAEpkm3bHCM6ZjquOf-y87o7ZhWpe1M'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  console.log('🔧 Creating test user...\n')

  const testEmail = 'test@ajax.nl'
  const testPassword = 'Test123!'

  try {
    // Try to sign up
    console.log('📝 Attempting to register:', testEmail)
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  User already exists!')
        console.log('\n✅ You can login with:')
        console.log('   Email:', testEmail)
        console.log('   Password:', testPassword)
        console.log('   Or Pincode: (if you set one)')
      } else {
        console.log('❌ Error:', error.message)

        if (error.message.includes('Email not confirmed')) {
          console.log('\n💡 Email verification is ENABLED in Supabase')
          console.log('   Option 1: Check your email inbox for verification link')
          console.log('   Option 2: Disable email verification in Supabase Dashboard:')
          console.log('   https://supabase.com/dashboard/project/gdtqrpkoocyqoeikwumq/auth/settings')
        }
      }
    } else if (data.user) {
      console.log('✅ Test user created successfully!')
      console.log('\nUser Details:')
      console.log('   ID:', data.user.id)
      console.log('   Email:', data.user.email)
      console.log('   Confirmed:', data.user.confirmed_at ? 'YES' : 'NO (check email)')

      console.log('\n🔑 Login credentials:')
      console.log('   Email:', testEmail)
      console.log('   Password:', testPassword)

      if (!data.user.confirmed_at) {
        console.log('\n⚠️  Email verification required!')
        console.log('   Check your email or disable verification in Supabase settings')
      }
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }

  console.log('\n✨ Done!\n')
}

createTestUser()

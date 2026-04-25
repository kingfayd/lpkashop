import { createClient } from '@supabase/supabase-js'

// ============================================================
// GANTI INI DENGAN SERVICE ROLE KEY DARI SUPABASE DASHBOARD
// Settings -> API -> service_role (secret)
// ============================================================
const SUPABASE_SERVICE_ROLE_KEY = 'PASTE_SERVICE_ROLE_KEY_DISINI'

// Password baru yang lo mau set
const NEW_PASSWORD = 'Admin@12345'

// ============================================================

const SUPABASE_URL = 'https://mvoguqxnsgeocdizoumt.supabase.co'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function main() {
  if (SUPABASE_SERVICE_ROLE_KEY === 'PASTE_SERVICE_ROLE_KEY_DISINI') {
    console.error('❌ ERROR: Ganti dulu SUPABASE_SERVICE_ROLE_KEY di file ini!')
    process.exit(1)
  }

  console.log('🔍 Mencari semua user di Supabase Auth...\n')

  // List semua user
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error('❌ Gagal list users:', listError.message)
    process.exit(1)
  }

  if (!users || users.length === 0) {
    console.log('⚠️  Tidak ada user ditemukan di Supabase Auth.')
    process.exit(0)
  }

  console.log(`✅ Ditemukan ${users.length} user:\n`)
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. ID: ${u.id}`)
    console.log(`     Email: ${u.email}`)
    console.log(`     Created: ${u.created_at}`)
    console.log(`     Last Sign In: ${u.last_sign_in_at || 'belum pernah login'}`)
    console.log()
  })

  // Reset password semua user (atau user pertama kalau cuma 1)
  const targetUser = users[0]
  console.log(`🔄 Reset password untuk: ${targetUser.email}`)
  console.log(`   Password baru: ${NEW_PASSWORD}\n`)

  const { data, error: updateError } = await supabase.auth.admin.updateUserById(
    targetUser.id,
    { password: NEW_PASSWORD }
  )

  if (updateError) {
    console.error('❌ Gagal reset password:', updateError.message)
    process.exit(1)
  }

  console.log('✅ Password berhasil direset!')
  console.log()
  console.log('================================')
  console.log('  LOGIN CREDENTIALS BARU:')
  console.log(`  Email   : ${targetUser.email}`)
  console.log(`  Password: ${NEW_PASSWORD}`)
  console.log('================================')
  console.log()
  console.log('⚠️  Jangan lupa hapus file reset_admin_password.mjs setelah berhasil login!')
}

main().catch(console.error)

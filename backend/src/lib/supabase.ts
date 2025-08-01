import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create Supabase client for user operations (with anon key)
export const createUserClient = (accessToken?: string) => {
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  })
}

// Helper function to get user from JWT token
export const getUserFromToken = async (token: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      throw error
    }
    
    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// Helper function to create user
export const createUser = async (email: string, password: string, userData?: any) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    })
    
    if (error) {
      throw error
    }
    
    return data.user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Helper function to update user
export const updateUser = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, updates)
    
    if (error) {
      throw error
    }
    
    return data.user
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Helper function to delete user
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId)
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Helper function to list users
export const listUsers = async (page = 1, perPage = 20) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error listing users:', error)
    throw error
  }
}

// Helper function to send password reset email
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    })
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Helper function to verify OTP
export const verifyOTP = async (phone: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

// Helper function to upload file to storage
export const uploadFile = async (bucket: string, path: string, file: Buffer, contentType?: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || 'application/octet-stream',
        upsert: true
      })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Helper function to get file URL
export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Helper function to delete file
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Helper function to create bucket
export const createBucket = async (name: string, isPublic = false) => {
  try {
    const { error } = await supabase.storage.createBucket(name, {
      public: isPublic
    })
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error creating bucket:', error)
    throw error
  }
}

// Helper function to list files in bucket
export const listFiles = async (bucket: string, path = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

export default supabase
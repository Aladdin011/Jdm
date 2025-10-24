import supabase from "../lib/supabaseClient";

type RegisterPayload = {
  email: string;
  password: string;
  role?: "admin" | "staff" | "user";
  department?: string;
};

export async function register({
  email,
  password,
  role = "user",
  department,
}: RegisterPayload) {
  // Use Supabase Auth to sign up the user
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error };

  // Create a profile row in `users` table to store role/department mapping
  const profile = await supabase.from("users").insert([
    {
      auth_id: data.user?.id,
      email,
      role,
      department,
    },
  ]);

  return { user: data.user, profile };
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function fetchProfileByAuthId(authId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();
  return { data, error };
}

export async function fetchTasks() {
  const { data, error } = await supabase.from("tasks").select("*");
  return { data, error };
}

export async function createTask(payload: {
  title: string;
  description?: string;
  assigned_to?: string;
}) {
  const { data, error } = await supabase.from("tasks").insert([payload]);
  return { data, error };
}

export async function fetchMessages(conversationWith?: string) {
  let q = supabase.from("messages").select("*");
  if (conversationWith)
    q = q.or(
      `sender_id.eq.${conversationWith},receiver_id.eq.${conversationWith}`,
    );
  const { data, error } = await q;
  return { data, error };
}

export async function sendMessage(payload: {
  sender_id: string;
  receiver_id: string;
  message_text: string;
}) {
  const { data, error } = await supabase.from("messages").insert([payload]);
  return { data, error };
}

export async function uploadFile(
  bucket: string,
  file: File | Blob,
  path: string,
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  return { data, error };
}

// Admin helpers
export async function listUsers() {
  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
}

export async function updateUserRole(userId: string, role: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);
  return { data, error };
}

export async function updateUserDepartment(userId: string, department: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ department })
    .eq("id", userId);
  return { data, error };
}

export async function setUserBlocked(userId: string, blocked: boolean) {
  const { data, error } = await supabase
    .from("users")
    .update({ blocked })
    .eq("id", userId);
  return { data, error };
}

// Contact helpers
export async function submitContact(payload: any) {
  const { data, error } = await supabase.from("contacts").insert([payload]);
  return { data, error };
}

export async function listContacts(params?: any) {
  const { data, error } = await supabase.from("contacts").select("*");
  return { data, error };
}

export async function deleteContact(id: string) {
  const { data, error } = await supabase.from("contacts").delete().eq("id", id);
  return { data, error };
}

// Testimonials
export async function submitTestimonial(payload: any) {
  const { data, error } = await supabase.from("testimonials").insert([payload]);
  return { data, error };
}

export async function listTestimonials(params?: any) {
  const { data, error } = await supabase.from("testimonials").select("*");
  return { data, error };
}

export async function getTestimonialById(id: string) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function updateTestimonial(id: string, updateData: any) {
  const { data, error } = await supabase
    .from("testimonials")
    .update(updateData)
    .eq("id", id);
  return { data, error };
}

export async function deleteTestimonial(id: string) {
  const { data, error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);
  return { data, error };
}

// Contact / testimonial management helpers

// Profile & auth helpers
export async function updateProfile(profileData: any) {
  // Update auth user and profile row in public.users
  const { data: currentUserData, error: getUserErr } =
    await supabase.auth.getUser();
  const authId = currentUserData?.user?.id;
  if (!authId) return { error: "Not authenticated" };

  const results: any = {};

  if (profileData.email || profileData.password) {
    const { data, error } = await supabase.auth.updateUser({
      email: profileData.email,
      password: profileData.password,
    });
    results.auth = { data, error };
  }

  const updatePayload: any = {};
  if (profileData.department) updatePayload.department = profileData.department;
  if (Object.keys(updatePayload).length) {
    const { data, error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("auth_id", authId);
    results.profile = { data, error };
  }

  return results;
}

export async function sendPasswordReset(email: string) {
  try {
    // Prefer Supabase v2 API: auth.resetPasswordForEmail
    // @ts-ignore
    if ((supabase.auth as any).resetPasswordForEmail) {
      const res = await (supabase.auth as any).resetPasswordForEmail(email);
      return { data: res?.data ?? res, error: res?.error ?? null };
    }
    // Fallback to older client API
    // @ts-ignore
    const res = await (supabase.auth as any).api.resetPasswordForEmail(email);
    return { data: res?.data ?? res, error: res?.error ?? null };
  } catch (err) {
    return { error: err };
  }
}

// File upload helpers
export async function uploadMultipleFiles(
  bucket: string,
  files: Array<File | Blob>,
  folder = "",
) {
  const uploaded: Array<{ path: string; error?: any }> = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const filename = `file_${Date.now()}_${i}`;
    const path = folder ? `${folder}/${filename}` : filename;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, f as any);
    uploaded.push({ path: data?.path || path, error });
  }
  return { uploaded };
}

// Analytics & Notifications
export async function trackEvent(event: string, data?: any, userId?: string) {
  const { data: d, error } = await supabase
    .from("analytics")
    .insert([{ event, data, user_id: userId }]);
  return { data: d, error };
}

export async function listNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
}

export async function markNotificationRead(id: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  return { data, error };
}

// Projects helpers
export async function listProjects(params?: any) {
  let q = supabase.from("projects").select("*");
  if (params?.category) q = q.eq("category", params.category);
  const { data, error } = await q;
  return { data, error };
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 3600,
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);
    if (error) return { error };
    return { url: data?.signedUrl };
  } catch (err) {
    return { error: err };
  }
}

// Request a signed upload URL from a server-side Edge Function to avoid exposing service keys
export async function requestSignedUploadUrl(
  path: string,
  bucket = "Project_Files",
  expires = 3600,
) {
  try {
    const resp = await fetch("/.netlify/functions/create_upload_url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path, expires }),
    });
    const body = await resp.json();
    return body;
  } catch (err) {
    return { error: err };
  }
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function getUserAnalytics(userId: string) {
  try {
    const { data, error } = await supabase.rpc("get_user_analytics", {
      p_user_id: userId,
    });
    return { data, error };
  } catch (err) {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  }
}

export async function getLeadScoring() {
  try {
    const { data, error } = await supabase.rpc("get_lead_scoring");
    return { data, error };
  } catch (err) {
    const { data: fallback, error: e2 } = await supabase
      .from("contacts")
      .select("status, id", { count: "exact" });
    return { data: fallback, error: e2 };
  }
}

// Note: profile update helper exists above as updateProfile(profileData)

export async function createProject(payload: any) {
  const { data, error } = await supabase.from("projects").insert([payload]);
  return { data, error };
}

export async function updateProject(id: string, payload: any) {
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id);
  return { data, error };
}

export async function deleteProject(id: string) {
  const { data, error } = await supabase.from("projects").delete().eq("id", id);
  return { data, error };
}

export default {
  register,
  login,
  signOut,
  getCurrentUser,
  fetchProfileByAuthId,
  fetchTasks,
  createTask,
  fetchMessages,
  sendMessage,
  uploadFile,
  listUsers,
  updateUserRole,
  updateUserDepartment,
  setUserBlocked,
  getPublicUrl,
  createSignedUrl,
  trackEvent,
  listNotifications,
  markNotificationRead,
};

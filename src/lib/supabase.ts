import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type List = {
  id: string;
  user_id: string;
  title: string;
  background_type: 'color' | 'photo' | 'custom';
  background_value: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  list_id: string | null;
  user_id: string;
  title: string;
  completed: boolean;
  important: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export async function getLists() {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as List[];
}

export async function createList(list: Partial<List>) {
  const { data, error } = await supabase
    .from('lists')
    .insert([list])
    .select()
    .single();

  if (error) throw error;
  return data as List;
}

export async function updateList(id: string, updates: Partial<List>) {
  const { data, error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as List;
}

export async function deleteList(id: string) {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getTasks(listId?: string | null) {
  let query = supabase.from('tasks').select('*');
  
  if (listId) {
    query = query.eq('list_id', listId);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function getImportantTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('important', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(task: Partial<Task>) {
  console.log('Creating task in Supabase:', task);
  
  try {
    // Regular insert without setting session
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating task:', error);
      throw error;
    }
    
    console.log('Task created successfully:', data);
    return data as Task;
  } catch (error) {
    console.error('Exception creating task:', error);
    throw error;
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function searchTasks(query: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, lists(title)')
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Task & { lists: { title: string } | null })[];
}

// Function to ensure Clerk user exists in Supabase
export async function syncUserWithSupabase(clerkUserId: string, email: string) {
  try {
    // Attempt to create a user in Supabase auth if needed
    // This API call would typically be made from your backend
    // Since we're using Supabase's RLS (Row Level Security), we need to have
    // a user in Supabase that matches the Clerk user ID for permissions
    
    // Check if this user already exists in a users table (if you have one)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for a new user
      console.error('Error checking for existing user:', error);
      throw error;
    }
    
    // If user doesn't exist, create a new entry
    if (!data) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            clerk_id: clerkUserId, 
            email: email
          }
        ]);
        
      if (insertError) {
        console.error('Error creating user in Supabase:', insertError);
        throw insertError;
      }
      
      console.log('User synced with Supabase successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync user with Supabase:', error);
    return false;
  }
}
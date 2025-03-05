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
    // Make sure we're not sending any unwanted properties
    const cleanTask = {
      title: task.title,
      completed: task.completed || false,
      important: task.important || false,
      user_id: task.user_id,
      list_id: task.list_id || null,
      due_date: task.due_date || null
    };
    
    console.log('Clean task data:', cleanTask);
    
    // Regular insert without setting session
    const { data, error } = await supabase
      .from('tasks')
      .insert([cleanTask])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating task:', error);
      throw new Error(`Supabase error: ${error.message || error.details || 'Unknown database error'}`);
    }
    
    console.log('Task created successfully:', data);
    return data as Task;
  } catch (error) {
    console.error('Exception creating task:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the error with its message
    } else {
      throw new Error('Unknown error occurred while creating task');
    }
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
    console.log('Syncing user with Supabase:', clerkUserId, email);
    
    // Try to create user in Supabase auth (if it doesn't exist already)
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: clerkUserId, // Using clerk ID as password for simplicity
        email_confirm: true,
        user_metadata: { clerk_id: clerkUserId }
      });
      
      if (authError) {
        // User likely already exists, which is fine
        console.log('User already exists in Supabase auth or creation failed:', authError.message);
      } else {
        console.log('Created user in Supabase auth:', authData);
      }
    } catch (authCreateError) {
      console.error('Error in auth user creation (can be ignored if user exists):', authCreateError);
    }
    
    // Now check if this user already exists in a users table
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
    } else {
      console.log('User already exists in Supabase users table:', data);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync user with Supabase:', error);
    return false;
  }
}
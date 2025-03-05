-- Drop old policies
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

-- Create new policies that don't use auth.uid()
CREATE POLICY "Anyone can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- Do the same for lists
DROP POLICY IF EXISTS "Users can create their own lists" ON lists;
DROP POLICY IF EXISTS "Users can view their own lists" ON lists;
DROP POLICY IF EXISTS "Users can update their own lists" ON lists;
DROP POLICY IF EXISTS "Users can delete their own lists" ON lists;

CREATE POLICY "Anyone can create lists"
  ON lists
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view lists"
  ON lists
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update lists"
  ON lists
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete lists"
  ON lists
  FOR DELETE
  TO authenticated
  USING (true); 
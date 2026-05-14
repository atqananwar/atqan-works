import { createClient } from '@/lib/supabase/client';
import type { Skill } from '@/types';

export async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills();
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );
}

export async function createSkill(
  skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
): Promise<Skill> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSkill(
  id: string,
  skill: Partial<Omit<Skill, 'id' | 'created_at'>>
): Promise<Skill> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .update({ ...skill, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

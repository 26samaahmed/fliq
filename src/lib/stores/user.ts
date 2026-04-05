import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);

// Optional: persist user on page refresh
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('user');
  if (saved) user.set(JSON.parse(saved));
  
  user.subscribe((value) => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  });
}
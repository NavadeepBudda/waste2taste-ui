import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface FoodWasteRecord {
  id?: number
  food_name: string
  disposal_mass: number
  location?: string
  session_id?: string
  created_at?: string
}

// Utility functions for food waste data
export const foodWasteService = {
  // Insert a single food waste record
  async insertRecord(record: Omit<FoodWasteRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('food_waste')
      .insert([record])
      .select()
    
    if (error) throw error
    return data
  },

  // Insert multiple food waste records
  async insertRecords(records: Omit<FoodWasteRecord, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('food_waste')
      .insert(records)
      .select()
    
    if (error) throw error
    return data
  },

  // Get recent food waste records
  async getRecentRecords(hoursBack: number = 24, limit: number = 100) {
    const { data, error } = await supabase
      .from('food_waste')
      .select('*')
      .gte('created_at', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Get all records
  async getAllRecords(limit: number = 1000) {
    const { data, error } = await supabase
      .from('food_waste')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Get records by date range
  async getRecordsByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('food_waste')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get aggregated data for analysis
  async getAggregatedData(hoursBack: number = 24) {
    const { data, error } = await supabase
      .from('food_waste')
      .select('food_name, disposal_mass')
      .gte('created_at', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    // Group by food name and sum disposal mass
    const aggregated = data?.reduce((acc, record) => {
      const existing = acc.find(item => item.food_name === record.food_name)
      if (existing) {
        existing.disposal_mass += record.disposal_mass
      } else {
        acc.push({ ...record })
      }
      return acc
    }, [] as { food_name: string; disposal_mass: number }[])
    
    return aggregated || []
  }
}
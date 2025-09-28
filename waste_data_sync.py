"""
Waste Data Sync - Drop this file into your teammate's project
Zero-config data syncing to Supabase
"""

import os
from typing import Dict, List, Union, Any
import json

# Configuration - your teammate sets these once
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-anon-key')

def sync_to_database(data: Union[Dict[str, float], List[Dict]], 
                    location: str = "Analysis", 
                    auto_send: bool = True) -> bool:
    """
    Automatically sync food waste data to the shared database.
    
    Args:
        data: Food waste results - any of these formats:
              - {"food_name": disposal_mass, ...}
              - [{"food_name": "Pizza", "disposal_mass": 15.2}, ...]
              - pandas DataFrame with food_name and disposal_mass columns
        location: Where this data was collected (optional)
        auto_send: If True, sends immediately. If False, just logs locally.
    
    Returns:
        bool: True if successful, False otherwise
    
    Usage in your existing code:
        # At the end of your analysis function:
        results = {"Pizza": 15.2, "Salad": 8.7}
        sync_to_database(results)  # That's it!
    """
    
    if not auto_send:
        print(f"📝 Would sync {len(data) if isinstance(data, (list, dict)) else '?'} records to database")
        return True
    
    try:
        # Lazy import - only install if actually sending
        from supabase import create_client
        
        # Create client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Convert data to standard format
        records = _format_data(data, location)
        
        if not records:
            print("⚠️  No valid data to sync")
            return False
        
        # Send to database
        result = supabase.table('food_waste').insert(records).execute()
        print(f"✅ Synced {len(records)} food waste records to shared database")
        return True
        
    except ImportError:
        print("📦 To sync data, install: pip install supabase")
        return False
    except Exception as e:
        print(f"⚠️  Sync failed: {str(e)}")
        return False


def _format_data(data: Any, location: str) -> List[Dict[str, Any]]:
    """Convert various data formats to database records"""
    
    # Handle pandas DataFrame
    if hasattr(data, 'iterrows'):  # Duck typing for pandas DataFrame
        records = []
        for _, row in data.iterrows():
            if 'food_name' in row and 'disposal_mass' in row:
                records.append({
                    "food_name": str(row['food_name']),
                    "disposal_mass": float(row['disposal_mass']),
                    "location": location,
                    "session_id": f"analysis_{hash(str(data))}"
                })
        return records
    
    # Handle dictionary {food_name: mass}
    elif isinstance(data, dict):
        return [
            {
                "food_name": str(food_name),
                "disposal_mass": float(disposal_mass),
                "location": location,
                "session_id": f"analysis_{hash(str(data))}"
            }
            for food_name, disposal_mass in data.items()
            if disposal_mass > 0
        ]
    
    # Handle list of dictionaries
    elif isinstance(data, list):
        records = []
        for item in data:
            if isinstance(item, dict):
                food_name = item.get('food_name') or item.get('name')
                disposal_mass = item.get('disposal_mass') or item.get('mass') or item.get('weight')
                
                if food_name and disposal_mass:
                    records.append({
                        "food_name": str(food_name),
                        "disposal_mass": float(disposal_mass),
                        "location": item.get('location', location),
                        "session_id": item.get('session_id', f"analysis_{hash(str(data))}")
                    })
        return records
    
    else:
        print(f"⚠️  Unsupported data format: {type(data)}")
        return []


# Decorator for automatic syncing
def auto_sync(location: str = "Analysis", enabled: bool = True):
    """
    Decorator to automatically sync function results to database
    
    Usage:
        @auto_sync(location="Kitchen Lab", enabled=True)
        def analyze_food_waste():
            return {"Pizza": 15.2, "Salad": 8.7}
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            
            if enabled and result:
                sync_to_database(result, location)
            
            return result
        return wrapper
    return decorator


# Context manager for batch syncing
class DataSync:
    """
    Context manager for collecting and syncing data
    
    Usage:
        with DataSync(location="Lab A") as sync:
            sync.add("Pizza", 15.2)
            sync.add("Salad", 8.7)
            # Automatically syncs when exiting context
    """
    
    def __init__(self, location: str = "Analysis", auto_sync: bool = True):
        self.location = location
        self.auto_sync = auto_sync
        self.data = {}
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.auto_sync and self.data:
            sync_to_database(self.data, self.location)
    
    def add(self, food_name: str, disposal_mass: float):
        """Add a food waste record"""
        self.data[food_name] = disposal_mass
    
    def add_batch(self, data: Dict[str, float]):
        """Add multiple records"""
        self.data.update(data)


# Configuration helpers
def setup_credentials(supabase_url: str, supabase_key: str):
    """Set up Supabase credentials programmatically"""
    global SUPABASE_URL, SUPABASE_KEY
    SUPABASE_URL = supabase_url
    SUPABASE_KEY = supabase_key
    print("✅ Supabase credentials configured")


def test_connection() -> bool:
    """Test if database connection works"""
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Try a simple query
        result = supabase.table('food_waste').select('id').limit(1).execute()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False


# ==========================================
# EXAMPLES FOR YOUR TEAMMATE TO COPY:
# ==========================================

def example_simple_integration():
    """Example 1: Add one line to existing analysis function"""
    
    def analyze_food_waste():
        # Their existing analysis code here...
        results = {
            "Pizza": 15.2,
            "Chicken": 8.7,
            "Salad": 12.3
        }
        
        # Add this ONE line at the end:
        sync_to_database(results, location="Research Kitchen")
        
        return results

def example_decorator():
    """Example 2: Use decorator for automatic syncing"""
    
    @auto_sync(location="Lab B", enabled=True)
    def analyze_food_waste():
        # Their analysis code...
        return {"Pizza": 15.2, "Salad": 8.7}
    
    # Results automatically sync when function completes

def example_context_manager():
    """Example 3: Use context manager for gradual data collection"""
    
    def process_food_items():
        with DataSync(location="Dining Hall") as sync:
            
            # As they analyze each item, add it:
            sync.add("Pizza", 15.2)
            sync.add("Salad", 8.7)
            sync.add("Soup", 12.3)
            
            # Or add batch:
            more_results = {"Bread": 5.1, "Pasta": 18.9}
            sync.add_batch(more_results)
            
        # Data automatically syncs when exiting 'with' block

def example_pandas_integration():
    """Example 4: Works with pandas DataFrames"""
    
    def analyze_with_pandas():
        import pandas as pd
        
        # Their DataFrame with results
        df = pd.DataFrame({
            'food_name': ['Pizza', 'Salad', 'Soup'],
            'disposal_mass': [15.2, 8.7, 12.3]
        })
        
        # Sync DataFrame directly:
        sync_to_database(df, location="Data Analysis Lab")
        
        return df


if __name__ == "__main__":
    # Test the connection
    print("🧪 Testing waste data sync...")
    
    if SUPABASE_URL == 'https://your-project.supabase.co':
        print("⚠️  Please set SUPABASE_URL and SUPABASE_KEY first")
    else:
        test_connection()
        
        # Run a test sync
        test_data = {"Test Pizza": 1.0}
        sync_to_database(test_data, location="Test Lab")
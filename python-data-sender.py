"""
Food Waste Data Sender - Python Script
Send food waste data directly to Supabase from Python code
"""

import os
from supabase import create_client, Client
from datetime import datetime
from typing import List, Dict, Any
import json

# Supabase configuration
SUPABASE_URL = "https://your-project.supabase.co"  # Replace with your actual URL
SUPABASE_KEY = "your-anon-key"  # Replace with your actual anon key

class FoodWasteDataSender:
    def __init__(self, url: str = SUPABASE_URL, key: str = SUPABASE_KEY):
        """Initialize the Supabase client"""
        self.supabase: Client = create_client(url, key)
        print(f"✅ Connected to Supabase at {url}")

    def send_single_record(self, food_name: str, disposal_mass: float, 
                          location: str = None, session_id: str = None) -> Dict[str, Any]:
        """Send a single food waste record"""
        try:
            record = {
                "food_name": food_name,
                "disposal_mass": disposal_mass,
                "location": location,
                "session_id": session_id or f"python_session_{int(datetime.now().timestamp())}"
            }
            
            result = self.supabase.table('food_waste').insert(record).execute()
            print(f"✅ Sent: {food_name} ({disposal_mass}g)")
            return result.data[0] if result.data else None
            
        except Exception as e:
            print(f"❌ Error sending {food_name}: {str(e)}")
            raise

    def send_multiple_records(self, records: List[Dict[str, Any]], 
                            session_id: str = None) -> List[Dict[str, Any]]:
        """Send multiple food waste records at once"""
        try:
            # Add session_id and ensure required fields
            session_id = session_id or f"python_batch_{int(datetime.now().timestamp())}"
            
            formatted_records = []
            for record in records:
                formatted_record = {
                    "food_name": record["food_name"],
                    "disposal_mass": record["disposal_mass"],
                    "location": record.get("location"),
                    "session_id": session_id
                }
                formatted_records.append(formatted_record)
            
            result = self.supabase.table('food_waste').insert(formatted_records).execute()
            print(f"✅ Sent {len(formatted_records)} records in batch")
            return result.data
            
        except Exception as e:
            print(f"❌ Error sending batch: {str(e)}")
            raise

    def send_from_analysis_results(self, analysis_results: Dict[str, float], 
                                 location: str = "Analysis Location") -> List[Dict[str, Any]]:
        """
        Send data from analysis results (common format)
        Expected format: {"food_name": disposal_mass, ...}
        """
        records = []
        for food_name, disposal_mass in analysis_results.items():
            records.append({
                "food_name": food_name,
                "disposal_mass": disposal_mass,
                "location": location
            })
        
        return self.send_multiple_records(records)

    def send_from_dataframe(self, df, food_name_col: str = "food_name", 
                          disposal_mass_col: str = "disposal_mass",
                          location_col: str = None) -> List[Dict[str, Any]]:
        """
        Send data from a pandas DataFrame
        """
        try:
            import pandas as pd
            
            records = []
            for _, row in df.iterrows():
                record = {
                    "food_name": row[food_name_col],
                    "disposal_mass": float(row[disposal_mass_col]),
                    "location": row[location_col] if location_col and location_col in df.columns else None
                }
                records.append(record)
            
            return self.send_multiple_records(records)
            
        except ImportError:
            print("❌ pandas not installed. Install with: pip install pandas")
            raise
        except Exception as e:
            print(f"❌ Error processing DataFrame: {str(e)}")
            raise


# Example usage functions
def example_single_item():
    """Example: Send a single food waste item"""
    sender = FoodWasteDataSender()
    
    sender.send_single_record(
        food_name="Soggy Pizza",
        disposal_mass=15.2,
        location="Main Cafeteria"
    )


def example_multiple_items():
    """Example: Send multiple items from analysis results"""
    sender = FoodWasteDataSender()
    
    # Simulate analysis results (this is what your teammate would have)
    waste_analysis = {
        "Overcooked Broccoli": 12.3,
        "Dry Chicken Breast": 8.7,
        "Bland Mac and Cheese": 18.5,
        "Tough Steak": 22.1,
        "Mushy Rice": 10.5
    }
    
    # Send all results at once
    sender.send_from_analysis_results(
        analysis_results=waste_analysis,
        location="University Dining Hall"
    )


def example_from_dataframe():
    """Example: Send data from pandas DataFrame"""
    try:
        import pandas as pd
        
        # Create sample DataFrame (your teammate would have real data)
        df = pd.DataFrame({
            'food_name': ['Pizza', 'Salad', 'Soup', 'Bread'],
            'disposal_mass': [15.2, 8.7, 12.3, 5.5],
            'location': ['Hall A', 'Hall A', 'Hall B', 'Hall B']
        })
        
        sender = FoodWasteDataSender()
        sender.send_from_dataframe(df)
        
    except ImportError:
        print("pandas not available for this example")


def example_custom_batch():
    """Example: Send custom batch with detailed info"""
    sender = FoodWasteDataSender()
    
    # Custom records with more details
    records = [
        {
            "food_name": "Leftover Pizza Slices",
            "disposal_mass": 234.5,
            "location": "Student Center Food Court"
        },
        {
            "food_name": "Wilted Salad Mix",
            "disposal_mass": 89.2,
            "location": "Healthy Options Station"
        },
        {
            "food_name": "Cold Soup",
            "disposal_mass": 156.8,
            "location": "Soup Bar"
        }
    ]
    
    sender.send_multiple_records(records, session_id="lunch_analysis_2024")


if __name__ == "__main__":
    print("🍽️ Food Waste Data Sender")
    print("=" * 40)
    
    # Update these with your actual Supabase credentials first!
    if SUPABASE_URL == "https://your-project.supabase.co":
        print("❌ Please update SUPABASE_URL and SUPABASE_KEY with your actual credentials")
        exit(1)
    
    # Run examples
    try:
        print("\n1. Sending single item...")
        example_single_item()
        
        print("\n2. Sending multiple items from analysis...")
        example_multiple_items()
        
        print("\n3. Sending from DataFrame...")
        example_from_dataframe()
        
        print("\n4. Sending custom batch...")
        example_custom_batch()
        
        print("\n✅ All examples completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
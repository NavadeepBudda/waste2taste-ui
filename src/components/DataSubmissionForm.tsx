import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { foodWasteService } from '@/lib/supabase';
import { Plus, Trash2, Upload } from 'lucide-react';

interface FoodItem {
  food_name: string;
  disposal_mass: number;
}

export const DataSubmissionForm = () => {
  const [items, setItems] = useState<FoodItem[]>([{ food_name: '', disposal_mass: 0 }]);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { food_name: '', disposal_mass: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FoodItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validItems = items.filter(item => item.food_name.trim() && item.disposal_mass > 0);
    if (validItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No valid items',
        description: 'Please add at least one item with a name and mass.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const records = validItems.map(item => ({
        food_name: item.food_name.trim(),
        disposal_mass: item.disposal_mass,
        location: location.trim() || undefined,
        session_id: `session_${Date.now()}`
      }));

      await foodWasteService.insertRecords(records);
      
      toast({
        title: 'Data submitted successfully!',
        description: `${records.length} food waste record(s) added to the database.`
      });

      // Reset form
      setItems([{ food_name: '', disposal_mass: 0 }]);
      setLocation('');
      
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: 'Please check your Supabase configuration and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Submit Food Waste Data
        </CardTitle>
        <CardDescription>
          Add food waste records directly to the database. Data will be available immediately for analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Dining Hall A, Cafeteria B"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Food items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Food Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`food-name-${index}`}>Food Name</Label>
                  <Input
                    id={`food-name-${index}`}
                    type="text"
                    placeholder="e.g., Pizza, Salad, Soup"
                    value={item.food_name}
                    onChange={(e) => updateItem(index, 'food_name', e.target.value)}
                    required
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`disposal-mass-${index}`}>Mass (grams)</Label>
                  <Input
                    id={`disposal-mass-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={item.disposal_mass || ''}
                    onChange={(e) => updateItem(index, 'disposal_mass', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Data'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
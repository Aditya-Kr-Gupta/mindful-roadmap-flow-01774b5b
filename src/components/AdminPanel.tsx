
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRoadmap } from '@/hooks/useRoadmap';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash } from 'lucide-react';

export const AdminPanel = () => {
  const { data: roadmap = [] } = useRoadmap();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    day_number: '',
    title: '',
    description: '',
    week_info: '',
    category: '',
    estimated_time: '',
    difficulty: 'Beginner',
    tasks: '',
  });

  const resetForm = () => {
    setFormData({
      day_number: '',
      title: '',
      description: '',
      week_info: '',
      category: '',
      estimated_time: '',
      difficulty: 'Beginner',
      tasks: '',
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tasksArray = formData.tasks.split('\n').filter(task => task.trim());
      
      const roadmapData = {
        day_number: parseInt(formData.day_number),
        title: formData.title,
        description: formData.description,
        week_info: formData.week_info,
        category: formData.category,
        estimated_time: formData.estimated_time,
        difficulty: formData.difficulty,
        tasks: tasksArray,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('learning_roadmap')
          .update(roadmapData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast.success('Roadmap item updated successfully!');
      } else {
        const { error } = await supabase
          .from('learning_roadmap')
          .insert(roadmapData);
        
        if (error) throw error;
        toast.success('Roadmap item created successfully!');
      }

      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save roadmap item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      day_number: item.day_number.toString(),
      title: item.title,
      description: item.description,
      week_info: item.week_info,
      category: item.category,
      estimated_time: item.estimated_time,
      difficulty: item.difficulty,
      tasks: Array.isArray(item.tasks) ? item.tasks.join('\n') : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this roadmap item?')) return;

    try {
      const { error } = await supabase
        .from('learning_roadmap')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Roadmap item deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete roadmap item');
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Day
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Roadmap Day' : 'Add New Roadmap Day'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="day_number">Day Number</Label>
                  <Input
                    id="day_number"
                    type="number"
                    min="1"
                    max="90"
                    value={formData.day_number}
                    onChange={(e) => setFormData({ ...formData, day_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="week_info">Week Info</Label>
                <Input
                  id="week_info"
                  value={formData.week_info}
                  onChange={(e) => setFormData({ ...formData, week_info: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimated_time">Estimated Time</Label>
                  <Input
                    id="estimated_time"
                    value={formData.estimated_time}
                    onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tasks">Tasks (one per line)</Label>
                <Textarea
                  id="tasks"
                  rows={6}
                  placeholder="Enter each task on a new line..."
                  value={formData.tasks}
                  onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Roadmap Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roadmap.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.day_number}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.difficulty === 'Beginner'
                            ? 'bg-green-100 text-green-800'
                            : item.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>{item.estimated_time}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

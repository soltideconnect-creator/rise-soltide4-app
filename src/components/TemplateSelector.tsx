import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { templateService } from '@/services/templateService';
import { Sparkles } from 'lucide-react';
import type { HabitTemplate, TemplateCategory } from '@/types/template';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: HabitTemplate) => void;
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('health');
  const categories = templateService.getCategories();

  const handleSelectTemplate = (template: HabitTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Habit Templates
          </DialogTitle>
          <DialogDescription>
            Choose from 24 pre-built habit templates to get started quickly
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as TemplateCategory)}>
          <TabsList className="grid w-full grid-cols-3 xl:grid-cols-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 py-2"
              >
                <span className="text-xl">{category.emoji}</span>
                <span className="text-xs hidden xl:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {templateService.getTemplatesByCategory(category.id).map((template) => (
                  <Card 
                    key={template.id} 
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{template.emoji}</span>
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: template.suggestedColor }}
                        />
                        <span className="text-muted-foreground">Suggested color</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Days:</span>
                        <div className="flex gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div
                              key={index}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                template.suggestedDays.includes(index)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>

                      {template.suggestedTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Reminder:</span>
                          <span className="font-medium">{template.suggestedTime}</span>
                        </div>
                      )}

                      <Button 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template);
                        }}
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

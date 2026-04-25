import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sparkles, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Play,
  Zap
} from 'lucide-react';
import { Task } from '@/types';

interface AtomicTaskItemProps {
  task: Task;
  onDecompose: (taskId: string) => void;
  onComplete: (taskId: string, subTaskId?: string) => void;
  onFocus: (task: Task) => void;
  loading: boolean;
}

const AtomicTaskItem: React.FC<AtomicTaskItemProps> = ({ 
  task, 
  onDecompose, 
  onComplete, 
  onFocus,
  loading 
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className={`overflow-hidden transition-all ${task.status === 'done' ? 'opacity-60 grayscale' : 'hover:border-primary/50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox 
            checked={task.status === 'done'} 
            onCheckedChange={() => onComplete(task.id)}
            className="w-5 h-5"
          />
          
          <div className="flex-1">
            <h4 className={`font-medium ${task.status === 'done' ? 'line-through' : ''}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px]">
                <Zap className="w-3 h-3 mr-1" />
                10 pts
              </Badge>
              {task.subtasks && task.subtasks.length > 0 && (
                <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Atómica
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(!task.subtasks || task.subtasks.length === 0) && task.status !== 'done' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDecompose(task.id)}
                disabled={loading}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Desglosar
              </Button>
            )}
            
            {task.status !== 'done' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onFocus(task)}
                className="gap-1"
              >
                <Play className="w-4 h-4" />
                Enfoque
              </Button>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {expanded && task.subtasks && (
          <div className="mt-4 ml-9 space-y-3 border-l-2 border-primary/20 pl-4 animate-in slide-in-from-top-2">
            {task.subtasks.map((st) => (
              <div key={st.id} className="flex items-center gap-3">
                <Checkbox 
                  checked={st.completed} 
                  onCheckedChange={() => onComplete(task.id, st.id)}
                />
                <span className={`text-sm ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AtomicTaskItem;

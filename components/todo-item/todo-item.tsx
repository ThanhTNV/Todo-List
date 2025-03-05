import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

type TodoItemProps = {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <motion.div
      key={todo.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-4 group"
    >
      <Button
        size="icon"
        variant="outline"
        className={cn(
          'h-6 w-6 rounded-full p-0 border-2',
          todo.completed
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 border-transparent'
            : 'border-gray-300 dark:border-gray-600',
        )}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed && <Check className="h-3 w-3 text-white" />}
      </Button>
      <span
        className={cn(
          'flex-1 text-sm',
          todo.completed &&
            'line-through text-gray-400 dark:text-gray-500',
        )}
      >
        {todo.text}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </Button>
    </motion.div>
  );
}
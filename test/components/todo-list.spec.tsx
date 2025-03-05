import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../../components/todo-list/todo-list';

// Test data
const ACTIVE_TODO = {
  id: 'test-id-1',
  text: 'Active todo',
  completed: false,
  createdAt: new Date(),
};

const COMPLETED_TODO = {
  id: 'test-id-2',
  text: 'Completed todo',
  completed: true,
  createdAt: new Date(),
};

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

// Helper functions
const setupUser = () => userEvent.setup();

const setupTodos = (todos: Todo[]) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

describe('TodoList Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial Rendering', () => {
    it('renders the empty state correctly', () => {
      render(<TodoList />);

      expect(screen.getByText('Tasks')).toBeDefined();
      expect(screen.getByPlaceholderText('Add a new task...')).toBeDefined();
      expect(screen.getByText('Add your first task!')).toBeDefined();
      expect(screen.getByText('0 items left')).toBeDefined();
    });

    it('loads todos from localStorage if available', () => {
      setupTodos([ACTIVE_TODO]);
      render(<TodoList />);

      expect(screen.getByText('Active todo')).toBeDefined();
      expect(screen.getByText('1 item left')).toBeDefined();
    });
  });

  describe('Adding Todos', () => {
    it('adds a todo by clicking the add button', async () => {
      const user = setupUser();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getAllByRole('button')[0]; // Add button with plus icon

      await user.type(input, 'New test todo');
      await user.click(addButton);

      expect(screen.getByText('New test todo')).toBeDefined();
      expect(screen.getByText('1 item left')).toBeDefined();
    });

    it('adds a todo by pressing Enter', async () => {
      const user = setupUser();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, 'Enter key todo{Enter}');

      expect(screen.getByText('Enter key todo')).toBeDefined();
    });

    it('prevents adding empty todos', async () => {
      const user = setupUser();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getAllByRole('button')[0];

      await user.type(input, '   ');
      await user.click(addButton);

      expect(screen.getByText('Add your first task!')).toBeDefined();
      expect(screen.getByText('0 items left')).toBeDefined();
    });
  });

  describe('Todo Item Interactions', () => {
    it('marks a todo as completed when checkbox is clicked', async () => {
      const user = setupUser();
      setupTodos([ACTIVE_TODO]);
      render(<TodoList />);

      const todoItem = screen
        .getByText('Active todo')
        .closest('div') as HTMLElement;
      const checkButton = within(todoItem).getAllByRole('button')[0]; // First button is checkbox

      await user.click(checkButton);

      const todoText = screen.getByText('Active todo');
      expect(todoText.className).toContain('line-through');
      expect(screen.getByText('0 items left')).toBeDefined();
    });

    it('deletes a todo when delete button is clicked', async () => {
      const user = setupUser();
      setupTodos([ACTIVE_TODO]);
      render(<TodoList />);

      const todoItem = screen
        .getByText('Active todo')
        .closest('div') as HTMLElement;
      const buttons = within(todoItem).getAllByRole('button');
      const deleteButton = buttons[buttons.length - 1]; // Last button is delete

      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('Active todo')).toBeNull();
      });
      expect(screen.getByText('Add your first task!')).toBeDefined();
    });

    it('edits a todo via the edit button', async () => {
      const user = setupUser();
      setupTodos([ACTIVE_TODO]);
      render(<TodoList />);

      const todoItem = screen
        .getByText('Active todo')
        .closest('div') as HTMLElement;
      const buttons = within(todoItem).getAllByRole('button');
      const editButton = buttons[buttons.length - 2]; // Second to last is edit

      await user.click(editButton);

      const editInput = screen.getByDisplayValue('Active todo');
      await user.clear(editInput);
      await user.type(editInput, 'Edited todo{Enter}');

      expect(screen.getByText('Edited todo')).toBeDefined();
    });
  });

  describe('Filtering Todos', () => {
    beforeEach(() => {
      setupTodos([ACTIVE_TODO, COMPLETED_TODO]);
    });

    it('shows all todos by default', () => {
      render(<TodoList />);

      expect(screen.getByText('Active todo')).toBeDefined();
      expect(screen.getByText('Completed todo')).toBeDefined();
    });

    it('filters to show only active todos', async () => {
      const user = setupUser();
      render(<TodoList />);

      const activeButton = screen.getByRole('button', { name: 'Active' });
      await user.click(activeButton);

      expect(activeButton).toHaveClass('dark:bg-gray-800');

      await waitFor(() => {
        expect(screen.queryByText('Completed todo')).toBeNull();
      });
      expect(screen.getByText('Active todo')).toBeDefined();
    });

    it('filters to show only completed todos', async () => {
      const user = setupUser();
      render(<TodoList />);

      const completedButton = screen.getByRole('button', { name: 'Completed' });
      await user.click(completedButton);

      expect(completedButton).toHaveClass('dark:bg-gray-800');

      await waitFor(() => {
        expect(screen.queryByText('Active todo')).toBeNull();
      });
      expect(screen.getByText('Completed todo')).toBeDefined();
    });

    it('returns to all todos view', async () => {
      const user = setupUser();
      render(<TodoList />);

      // First filter to active
      const activeButton = screen.getByRole('button', { name: 'Active' });
      await user.click(activeButton);

      // Then back to all
      const allButton = screen.getByRole('button', { name: 'All' });
      await user.click(allButton);

      expect(allButton).toHaveClass('dark:bg-gray-800');

      expect(screen.getByText('Active todo')).toBeDefined();
      expect(screen.getByText('Completed todo')).toBeDefined();
    });
  });

  describe('Batch Actions', () => {
    it('clears all completed todos', async () => {
      const user = setupUser();
      setupTodos([ACTIVE_TODO, COMPLETED_TODO]);
      render(<TodoList />);

      const clearButton = screen.getByText('Clear completed');
      const completedButton = screen.getByText('Completed');

      await user.click(clearButton);
      await user.click(completedButton);

      await waitFor(() => {
        expect(screen.getByText('No completed tasks')).toBeDefined();
        expect(screen.queryByText('Completed todo')).toBeNull();
      });
      expect(screen.getByText('No completed tasks')).toBeDefined();
      expect(screen.queryByText('Completed todo')).toBeNull();
    });
  });
});

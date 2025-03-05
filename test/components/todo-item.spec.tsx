import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../../components/todo-item/todo-item';

describe('TodoItem Component', () => {
  // Mock functions for callbacks
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  
  // Sample todo item
  const todo = {
    id: 'test-id-1',
    text: 'Test todo',
    completed: false,
    createdAt: new Date(),
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders a todo item correctly', () => {
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test todo')).toBeDefined();
    const checkButton = screen.getAllByRole('button')[0];
    expect(checkButton.className).not.toContain('from-violet-500');
  });

  it('renders a completed todo with strike-through', () => {
    const completedTodo = {
      ...todo,
      completed: true
    };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const todoText = screen.getByText('Test todo');
    expect(todoText.className).toContain('line-through');
    
    // Check that the checkbox has the completed class with gradient
    const checkButton = screen.getAllByRole('button')[0];
    expect(checkButton.className).toContain('from-violet-500');
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkButton = screen.getAllByRole('button')[0];
    await user.click(checkButton);

    expect(mockOnToggle).toHaveBeenCalledWith(todo.id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons[buttons.length - 1]; // Last button is the delete button
    
    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(todo.id);
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const buttons = screen.getAllByRole('button');
    const editButton = buttons[buttons.length - 2]; // Second-to-last is edit button
    
    await user.click(editButton);

    // Should now have an input with the todo text
    expect(screen.getByDisplayValue('Test todo')).toBeDefined();
  });

  it('calls onEdit when edit is saved by pressing Enter', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Enter edit mode by clicking edit button
    const buttons = screen.getAllByRole('button');
    const editButton = buttons[buttons.length - 2];
    await user.click(editButton);

    // Edit the text and press Enter
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo{Enter}');

    expect(mockOnEdit).toHaveBeenCalledWith(todo.id, 'Updated todo');
  });

  it('calls onEdit when edit is saved by clicking outside (blur)', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Enter edit mode by clicking edit button
    const buttons = screen.getAllByRole('button');
    const editButton = buttons[buttons.length - 2];
    await user.click(editButton);

    // Edit the text
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo');

    // Trigger blur by clicking outside
    await user.click(document.body);

    expect(mockOnEdit).toHaveBeenCalledWith(todo.id, 'Updated todo');
  });

  it('enters edit mode when double-clicking on text', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);

    // Should now have an input with the todo text
    expect(screen.getByDisplayValue('Test todo')).toBeDefined();
  });

  it('does not allow editing completed todos', async () => {
    const user = userEvent.setup();
    const completedTodo = {
      ...todo,
      completed: true
    };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);

    // Should not enter edit mode for completed todos
    expect(screen.queryByDisplayValue('Test todo')).toBeNull();
  });

  it('cancels editing when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Enter edit mode
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);

    // Edit text
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.type(input, 'Updated todo');

    // Press Escape
    await user.keyboard('{Escape}');

    // Should exit edit mode without saving changes
    expect(screen.getByText('Test todo')).toBeDefined();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('does not save empty text when editing', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Enter edit mode
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);

    // Clear text and try to save
    const input = screen.getByDisplayValue('Test todo');
    await user.clear(input);
    await user.keyboard('{Enter}');

    // Should not call onEdit with empty text
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('hides edit button for completed todos', () => {
    const completedTodo = {
      ...todo,
      completed: true
    };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // For completed todos, we should have only checkbox and delete button
    const buttons = screen.getAllByRole('button');
    
    // Check that there are only 2 buttons (no edit button)
    expect(buttons.length).toBe(2);
    
    // Confirm we can't find an edit button with the Edit2 icon
    const editIcon = screen.queryByText('Edit2');
    expect(editIcon).toBeNull();
  });
});
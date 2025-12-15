import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input, Button } from '@/components/ui';

/**
 * **Feature: blockchain-voting-frontend, Property 13: Form Feedback Consistency**
 * **Validates: Requirements 3.5**
 * 
 * Property: For any form interaction, appropriate visual feedback and error 
 * states should be displayed based on input validity
 */
describe('Form Feedback Properties', () => {
  it('should display error states consistently for invalid inputs', () => {
    const testCases = [
      { error: 'Required field', hasError: true },
      { error: 'Invalid format', hasError: true },
      { error: 'Too short', hasError: true },
      { error: undefined, hasError: false }, // No error
    ];

    testCases.forEach(({ error, hasError }, index) => {
      const { container, unmount } = render(
        <Input 
          label={`Test Input ${index}`}
          error={error}
          data-testid={`test-input-${index}`}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeTruthy();
      
      if (hasError && error) {
        // Should have error styling
        expect(input?.className).toContain('border-red-500');
        // Should display error message
        expect(screen.getByText(error)).toBeInTheDocument();
      } else {
        // Should have normal styling
        expect(input?.className).toContain('border-gray-300');
      }
      
      unmount(); // Clean up between test cases
    });
  });

  it('should provide consistent focus feedback across form elements', () => {
    render(
      <div>
        <Input label="Input 1" data-testid="input-1" />
        <Input label="Input 2" data-testid="input-2" />
        <Button data-testid="button-1">Submit</Button>
      </div>
    );

    const input1 = screen.getByTestId('input-1');
    const input2 = screen.getByTestId('input-2');
    const button1 = screen.getByTestId('button-1');

    // Verify focus styles are present in class names (Tailwind CSS classes)
    expect(input1.className).toContain('focus:ring-2');
    expect(input2.className).toContain('focus:ring-2');
    expect(button1.className).toContain('focus-visible:ring-2');

    // Test that elements can receive focus
    input1.focus();
    expect(document.activeElement).toBe(input1);

    input2.focus();
    expect(document.activeElement).toBe(input2);

    button1.focus();
    expect(document.activeElement).toBe(button1);
  });

  it('should handle disabled states consistently', () => {
    render(
      <div>
        <Input label="Disabled Input" disabled data-testid="disabled-input" />
        <Button disabled data-testid="disabled-button">Disabled Button</Button>
      </div>
    );

    const disabledInput = screen.getByTestId('disabled-input');
    const disabledButton = screen.getByTestId('disabled-button');

    // Should have disabled attributes
    expect(disabledInput).toBeDisabled();
    expect(disabledButton).toBeDisabled();

    // Should have disabled styling
    expect(disabledInput.className).toContain('disabled:opacity-50');
    expect(disabledButton.className).toContain('disabled:opacity-50');

    // Should not be focusable
    fireEvent.click(disabledInput);
    expect(disabledInput).not.toHaveFocus();

    fireEvent.click(disabledButton);
    expect(disabledButton).not.toHaveFocus();
  });

  it('should provide loading state feedback consistently', () => {
    const { rerender } = render(
      <Button loading={false} data-testid="loading-button">
        Submit
      </Button>
    );

    const button = screen.getByTestId('loading-button');
    
    // Initially not loading
    expect(button).not.toBeDisabled();
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();

    // When loading
    rerender(
      <Button loading={true} data-testid="loading-button">
        Submit
      </Button>
    );

    // Should be disabled when loading
    expect(button).toBeDisabled();
    // Should show loading spinner
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should validate input value changes trigger appropriate feedback', () => {
    const mockOnValueChange = vi.fn();
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        label="Test Input"
        onValueChange={mockOnValueChange}
        onChange={mockOnChange}
        data-testid="change-input"
      />
    );

    const input = screen.getByTestId('change-input');

    // Test various input values
    const testValues = ['a', 'test', 'longer test value', '123'];
    
    testValues.forEach(value => {
      fireEvent.change(input, { target: { value } });
    });

    // Should have been called for each change
    expect(mockOnChange).toHaveBeenCalledTimes(testValues.length);
    expect(mockOnValueChange).toHaveBeenCalledTimes(testValues.length);
    
    // Check that the last call was with the last value
    expect(mockOnValueChange).toHaveBeenLastCalledWith('123');
  });

  it('should maintain consistent styling across different input states', () => {
    const states = [
      { props: {}, expectedClasses: ['border-gray-300'] },
      { props: { error: 'Error' }, expectedClasses: ['border-red-500'] },
      { props: { disabled: true }, expectedClasses: ['disabled:opacity-50'] },
    ];

    states.forEach(({ props, expectedClasses }, index) => {
      const { container } = render(
        <Input 
          label={`Test Input ${index}`}
          data-testid={`state-input-${index}`}
          {...props}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeTruthy();

      expectedClasses.forEach(className => {
        expect(input?.className).toContain(className);
      });
    });
  });
});
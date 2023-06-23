import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Form from '../../../../src/presentation/modules/category/components/Form';

describe('Form', () => {
  const handleSubmit = jest.fn();
  const handleChange = jest.fn();
  const handleToggle = jest.fn();

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Form
          category={{}}
          isDisabled={false}
          handleToggle={handleToggle}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
  });

  it('should render the form correctly', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should call the handleChange function when input fields change', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(nameInput, { target: { value: 'New Category' } });
    fireEvent.change(descriptionInput, { target: { value: 'Category description' } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('should call the handleToggle function when the switch changes', () => {
    const switchInput = screen.getByLabelText(/active/i);
    fireEvent.click(switchInput);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(expect.any(Object), true);

    fireEvent.click(switchInput);
    expect(handleToggle).toHaveBeenCalledTimes(2);
    expect(handleToggle).toHaveBeenCalledWith(expect.any(Object), false);
  });

  it('should call the handleSubmit function when the form is submitted', async () => {
    const saveButton = screen.getByText('Save');

    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

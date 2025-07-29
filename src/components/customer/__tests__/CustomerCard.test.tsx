import { render, screen, fireEvent } from '@testing-library/react'
import { CustomerCard } from '../CustomerCard'
import { Customer } from '@/types'

const mockCustomer: Customer = {
  id: '1',
  guardian_name: '홍길동',
  pet_name: '마루',
  species: '푸들',
  weight: 3.5,
  phone: '010-1234-5678',
  memo: '다리를 만지면 예민해요',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockOnEdit = jest.fn()
const mockOnDelete = jest.fn()

describe('CustomerCard Component', () => {
  beforeEach(() => {
    mockOnEdit.mockClear()
    mockOnDelete.mockClear()
  })

  it('renders customer information correctly', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('마루')).toBeInTheDocument()
    expect(screen.getByText('(홍길동)')).toBeInTheDocument()
    expect(screen.getByText('견종: 푸들')).toBeInTheDocument()
    expect(screen.getByText('3.5kg')).toBeInTheDocument()
    expect(screen.getByText('010-1234-5678')).toBeInTheDocument()
    expect(screen.getByText('메모: 다리를 만지면 예민해요')).toBeInTheDocument()
  })

  it('renders customer without optional fields', () => {
    const minimalCustomer: Customer = {
      id: '2',
      guardian_name: '김철수',
      pet_name: '뽀삐',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    render(
      <CustomerCard
        customer={minimalCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('뽀삐')).toBeInTheDocument()
    expect(screen.getByText('(김철수)')).toBeInTheDocument()
    expect(screen.queryByText('견종:')).not.toBeInTheDocument()
    expect(screen.queryByText('kg')).not.toBeInTheDocument()
    expect(screen.queryByText('010-')).not.toBeInTheDocument()
    expect(screen.queryByText('메모:')).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByRole('button', { name: '' }) // Edit icon button
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
    expect(mockOnEdit).toHaveBeenCalledWith(mockCustomer)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[1] // Second button is delete
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
    expect(mockOnDelete).toHaveBeenCalledWith(mockCustomer)
  })

  it('displays weight with Weight icon', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const weightElement = screen.getByText('3.5kg')
    expect(weightElement.closest('div')).toHaveClass('flex', 'items-center')
  })

  it('displays phone with Phone icon', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const phoneElement = screen.getByText('010-1234-5678')
    expect(phoneElement.closest('div')).toHaveClass('flex', 'items-center')
  })

  it('displays memo in highlighted box', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const memoElement = screen.getByText('메모: 다리를 만지면 예민해요')
    expect(memoElement.closest('div')).toHaveClass('bg-yellow-50')
  })
})
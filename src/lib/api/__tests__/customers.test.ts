import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, searchCustomers } from '../customers'
import { supabase } from '@/lib/supabase/client'
import { Customer } from '@/types'

// Supabase 모킹
jest.mock('@/lib/supabase/client')

const mockSupabase = supabase as jest.Mocked<typeof supabase>

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

describe('customers API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCustomers', () => {
    it('should fetch customers successfully', async () => {
      const mockData = [mockCustomer]
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      } as any)

      const result = await getCustomers()

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
      expect(result).toEqual(mockData)
    })

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Database error')
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      } as any)

      await expect(getCustomers()).rejects.toThrow('Database error')
    })

    it('should return empty array when no data', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any)

      const result = await getCustomers()
      expect(result).toEqual([])
    })
  })

  describe('getCustomer', () => {
    it('should fetch single customer successfully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockCustomer,
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await getCustomer('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
      expect(result).toEqual(mockCustomer)
    })

    it('should throw error when customer not found', async () => {
      const mockError = new Error('Customer not found')
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      } as any)

      await expect(getCustomer('1')).rejects.toThrow('Customer not found')
    })
  })

  describe('createCustomer', () => {
    it('should create customer successfully', async () => {
      const newCustomerData = {
        guardian_name: '김철수',
        pet_name: '뽀삐',
        species: '말티즈',
      }

      const createdCustomer = {
        ...newCustomerData,
        id: '2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: createdCustomer,
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await createCustomer(newCustomerData)

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
      expect(result).toEqual(createdCustomer)
    })

    it('should throw error when creation fails', async () => {
      const mockError = new Error('Creation failed')
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      } as any)

      await expect(createCustomer({
        guardian_name: '김철수',
        pet_name: '뽀삐',
      })).rejects.toThrow('Creation failed')
    })
  })

  describe('updateCustomer', () => {
    it('should update customer successfully', async () => {
      const updateData = { species: '요크셔테리어' }
      const updatedCustomer = { ...mockCustomer, ...updateData }

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: updatedCustomer,
                error: null,
              }),
            }),
          }),
        }),
      } as any)

      const result = await updateCustomer('1', updateData)

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
      expect(result).toEqual(updatedCustomer)
    })
  })

  describe('deleteCustomer', () => {
    it('should delete customer successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
      } as any)

      await deleteCustomer('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
    })

    it('should throw error when deletion fails', async () => {
      const mockError = new Error('Deletion failed')
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: mockError,
          }),
        }),
      } as any)

      await expect(deleteCustomer('1')).rejects.toThrow('Deletion failed')
    })
  })

  describe('searchCustomers', () => {
    it('should search customers successfully', async () => {
      const searchResults = [mockCustomer]
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: searchResults,
                error: null,
              }),
            }),
          }),
        }),
      } as any)

      const result = await searchCustomers('마루')

      expect(mockSupabase.from).toHaveBeenCalledWith('customers')
      expect(result).toEqual(searchResults)
    })

    it('should return empty array when no search results', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      } as any)

      const result = await searchCustomers('nonexistent')
      expect(result).toEqual([])
    })
  })
})
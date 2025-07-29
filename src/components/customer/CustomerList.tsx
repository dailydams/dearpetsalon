'use client'

import { useState, useEffect } from 'react'
import { Customer } from '@/types'
import { CustomerCard } from './CustomerCard'
import { CustomerForm } from './CustomerForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, searchCustomers } from '@/lib/api/customers'

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch()
      } else {
        loadCustomers()
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const data = await searchCustomers(searchQuery)
      setCustomers(data)
    } catch (error) {
      console.error('Error searching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCustomer = await createCustomer(customerData)
      setCustomers(prev => [newCustomer, ...prev])
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  const handleUpdate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCustomer) return

    try {
      const updatedCustomer = await updateCustomer(editingCustomer.id, customerData)
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === editingCustomer.id ? updatedCustomer : customer
        )
      )
      setEditingCustomer(null)
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  }

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`${customer.pet_name} (${customer.guardian_name}) 고객 정보를 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteCustomer(customer.id)
      setCustomers(prev => prev.filter(c => c.id !== customer.id))
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingCustomer(null)
  }

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="보호자명 또는 반려견명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 고객 등록
        </Button>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchQuery ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
          </div>
          {!searchQuery && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 고객 등록하기
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Customer Form Modal */}
      <CustomerForm
        customer={editingCustomer}
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingCustomer ? handleUpdate : handleCreate}
      />
    </div>
  )
}
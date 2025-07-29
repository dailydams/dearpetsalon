'use client'

import { useState, useEffect, useRef } from 'react'
import { Customer } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { searchCustomers } from '@/lib/api/customers'
import { Plus, User } from 'lucide-react'

interface CustomerAutocompleteProps {
  selectedCustomer: Customer | null
  onCustomerSelect: (customer: Customer | null) => void
  onNewCustomerClick: () => void
}

export function CustomerAutocomplete({ 
  selectedCustomer, 
  onCustomerSelect, 
  onNewCustomerClick 
}: CustomerAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Customer[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedCustomer) {
      setQuery(`${selectedCustomer.pet_name} (${selectedCustomer.guardian_name})`)
      setShowSuggestions(false)
    }
  }, [selectedCustomer])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim() && !selectedCustomer) {
        handleSearch()
      } else if (!query.trim()) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query, selectedCustomer])

  const handleSearch = async () => {
    try {
      setLoading(true)
      const results = await searchCustomers(query)
      setSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    if (selectedCustomer) {
      onCustomerSelect(null)
    }
  }

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (query.trim() && !selectedCustomer && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="customer">고객 선택 *</Label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            id="customer"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="보호자명 또는 반려견명을 입력하세요"
            className={selectedCustomer ? 'bg-green-50 border-green-300' : ''}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">
                        {customer.pet_name} ({customer.guardian_name})
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer.species && `${customer.species} • `}
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={onNewCustomerClick}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          신규
        </Button>
      </div>
      
      {selectedCustomer && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-800">
                {selectedCustomer.pet_name} ({selectedCustomer.guardian_name})
              </div>
              <div className="text-sm text-green-600">
                {selectedCustomer.species && `${selectedCustomer.species} • `}
                {selectedCustomer.weight && `${selectedCustomer.weight}kg • `}
                {selectedCustomer.phone}
              </div>
              {selectedCustomer.memo && (
                <div className="text-xs text-green-600 mt-1">
                  메모: {selectedCustomer.memo}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCustomerSelect(null)}
              className="text-green-600 hover:text-green-700"
            >
              변경
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
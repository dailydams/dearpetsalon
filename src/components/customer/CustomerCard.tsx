'use client'

import { Customer } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Phone, Weight } from 'lucide-react'

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {customer.pet_name}
            </h3>
            <span className="text-sm text-gray-500">
              ({customer.guardian_name})
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            {customer.species && (
              <p>견종: {customer.species}</p>
            )}
            {customer.weight && (
              <div className="flex items-center space-x-1">
                <Weight className="h-3 w-3" />
                <span>{customer.weight}kg</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>
          
          {customer.memo && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-gray-700">
              <strong>메모:</strong> {customer.memo}
            </div>
          )}
        </div>
        
        <div className="flex space-x-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(customer)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(customer)}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
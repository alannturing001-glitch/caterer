'use client';

import React from 'react';
import { formatQuotationStatus, formatBookingStatus, formatPaymentStatus } from '@/lib/format';

type StatusType = 'quotation' | 'booking' | 'payment';

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Reusable status badge component
 * Displays status with appropriate color based on status type
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, size = 'md', className = '' }) => {
  const getStatusInfo = () => {
    switch (type) {
      case 'quotation':
        return formatQuotationStatus(status);
      case 'booking':
        return formatBookingStatus(status);
      case 'payment':
        return formatPaymentStatus(status);
      default:
        return { label: status, color: 'gray' };
    }
  };

  const { label, color } = getStatusInfo();

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 border border-gray-300',
    blue: 'bg-blue-100 text-blue-800 border border-blue-300',
    green: 'bg-green-100 text-green-800 border border-green-300',
    red: 'bg-red-100 text-red-800 border border-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    orange: 'bg-orange-100 text-orange-800 border border-orange-300',
    purple: 'bg-purple-100 text-purple-800 border border-purple-300',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-1 text-xs font-medium rounded',
    md: 'px-3 py-1 text-sm font-medium rounded-md',
    lg: 'px-4 py-2 text-base font-semibold rounded-lg',
  };

  return (
    <span className={`${colorClasses[color]} ${sizeClasses[size]} inline-block ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;

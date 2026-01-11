'use client';

import { useId } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/common/shadcn/button';
import { Calendar } from '@/components/common/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/common/shadcn/popover';
import { cn } from '@/lib/utils';

interface DateSelectProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateSelect({
  label,
  value,
  onChange,
  placeholder = 'Select date',
}: DateSelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={`Clear ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            aria-label={value ? `${label}: ${format(value, 'MMMM d, yyyy')}` : `${label}: ${placeholder}`}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {value ? format(value, 'yyyy-MM-dd') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} autoFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
}

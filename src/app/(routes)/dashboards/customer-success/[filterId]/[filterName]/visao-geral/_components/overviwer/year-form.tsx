'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  year: z
    .number({
      required_error: 'A year of birth is required.',
    })
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
})

export function YearForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const years = Array.from(
    { length: 2025 - 2023 },
    (_, i) => 2023 + i,
  ).reverse()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              {/* <FormLabel>Year of birth</FormLabel> */}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[120px] gap-2 pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarDays size={16} />
                      {field.value ? (
                        field.value
                      ) : (
                        <span>{new Date().getFullYear()}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="max-h-[200px] overflow-y-auto">
                    {years.map((year) => (
                      <div
                        key={year}
                        onClick={() => field.onChange(year)}
                        className={cn(
                          'cursor-pointer px-4 py-2 text-sm hover:bg-slate-200',
                          field.value === year && 'bg-slate-300',
                        )}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {/* <FormDescription>selecione o ano</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  )
}

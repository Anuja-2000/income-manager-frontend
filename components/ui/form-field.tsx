import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, required, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <label 
          htmlFor={htmlFor}
          className="text-sm font-semibold text-green-700 block"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }

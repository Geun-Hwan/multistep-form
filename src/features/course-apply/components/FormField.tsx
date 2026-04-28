interface Props {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  id?: string
}

export default function FormField({ label, error, required, children, id }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

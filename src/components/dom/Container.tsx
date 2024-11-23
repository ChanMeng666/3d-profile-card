type ContainerProps = {
  children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="w-full h-screen">
      {children}
    </div>
  )
} 
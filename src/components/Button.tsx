interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

export default function Button(props: ButtonProps) {
    const { className, children, ...rest } = props
    return (
        <button
            {...rest}
            className={`text-white bg-black/25 border active:scale-90 transition-transform duration-300 border-white/20 backdrop-blur-xs leading-none size-12 grid place-items-center rounded-full ${className}`}>
            {children}
        </button>
    )
}
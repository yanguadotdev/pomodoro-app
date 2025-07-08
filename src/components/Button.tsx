interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant: 'blue' | 'green' | 'red' | 'black'
}

const colorVariants = {
    blue: 'bg-blue-300/20 border-blue-300 text-blue-300 focus:outline-blue-300',
    green: 'bg-green-500/20 border-green-500 text-green-500 focus:outline-green-500',
    red: 'bg-red-500/20 border-red-500 text-red-500 focus:outline-red-500',
    black: 'bg-black/20 border-black text-black focus:outline-black'
}

export default function Button(props: ButtonProps) {
    const { className, children, variant, ...rest } = props
    return (
        <button
            {...rest}
            className={`p-3 border border-b-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:border-b-4 active:border-b ${colorVariants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}
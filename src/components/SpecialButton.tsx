import { cn } from "@/lib/utils"

interface SpecialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: 'green' | 'red' | 'orange'
    rounded?: boolean
    className?: string
}

const colorVariants = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
}

export default function SpecialButton({ children, className, variant = 'orange', rounded, ...props }: SpecialButtonProps) {
    return (
        <button
            {...props}
            className={cn(`relative inline-flex transition-all duration-300 active:translate-y-0.5 items-center justify-center px-8 py-2.5 overflow-hidden text-white bg-gray-800 group`, rounded ? 'rounded-full size-14 p-0' : 'w-full rounded-md', className)}
        >
            {
                !rounded && (
                    <span
                        className={cn(`absolute w-0 h-0 transition-all duration-300 ease-out rounded-full group-hover:w-96 group-hover:h-56`, colorVariants[variant])}
                    ></span>
                )
            }
            <span className={cn("absolute bottom-0 left-0 h-full", rounded ? '-ml-6' : '-ml-2')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-auto h-full opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                >
                    <path
                        fillOpacity=".1"
                        fillRule="nonzero"
                        fill="#FFF"
                        d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                </svg>
            </span>
            <span className={cn("absolute top-0 right-0 w-12 h-full", rounded ? '-mr-8' : '-mr-3')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="object-cover w-full h-full"
                    viewBox="0 0 487 487"
                >
                    <path
                        fillOpacity=".1"
                        fillRule="nonzero"
                        fill="#FFF"
                        d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    ></path>
                </svg>
            </span>
            <span
                className={cn("absolute inset-0 w-full h-full -mt-1 transition-all duration-300 group-active:mt-0 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200", rounded ? 'mt-0' : '-mt-1')}
            ></span>
            <span className="relative font-semibold">{children}</span>
        </button>

    )
}
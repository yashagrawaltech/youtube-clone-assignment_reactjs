import { twMerge } from 'tailwind-merge';

const variantStyles = {
    default: 'bg-transparent border-gray-400 text-gray-700 hover:bg-gray-100',
    destructive:
        'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700',
    secondary: 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300',
    ghost: 'bg-transparent border-transparent text-gray-700 hover:bg-gray-100',
    link: 'bg-transparent border-transparent text-blue-600 underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent',
};

const Button = ({ children, variant = 'default', className, onClick }) => {
    return (
        <button
            className={twMerge(
                'h-10 px-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition duration-200 ease-in-out',
                variantStyles[variant] || variantStyles.default,
                className
            )}
            onClick={onClick} // Add onClick prop here
        >
            {children}
        </button>
    );
};

export default Button;

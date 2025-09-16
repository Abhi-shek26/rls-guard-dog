import { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button' | 'a';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, as: Component = 'button', ...props }, ref) => {
    return (
      <Component
        className={`w-full inline-block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;

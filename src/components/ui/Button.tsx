import { forwardRef } from 'react';

type ButtonAsButton = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
};
type ButtonAsAnchor = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: 'a';
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', children, as = 'button', ...props }, ref) => {
    const Component = as === 'a' ? 'a' : 'button';

    return (
      <Component
        ref={ref as any}
        className={`w-full inline-block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;

import { forwardRef, ElementType } from 'react';

type ButtonProps<T extends ElementType> = {
  as?: T; 
} & Omit<React.ComponentProps<T>, 'as'>;

const Button = forwardRef(
  <T extends ElementType = 'button'>(
    { as, className, children, ...props }: ButtonProps<T>,
    ref: React.Ref<any>
  ) => {
    const Component = as || 'button';

    return (
      <Component
        className={`w-full inline-block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;

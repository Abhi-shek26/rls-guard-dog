import { forwardRef, ElementType, ReactNode } from 'react';

type ButtonProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<C>;

type ButtonComponent = <C extends ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: React.Ref<any> }
) => React.ReactElement | null;

const Button = forwardRef(function Button<C extends ElementType = 'button'>(
  { as, className, children, ...props }: ButtonProps<C>,
  ref: React.Ref<any>
) {
  const Component = as || 'button';
  return (
    <Component
      ref={ref}
      className={`w-full inline-block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
      {...props}
    >
      {children}
    </Component>
  );
});

(Button as React.ComponentType).displayName = 'Button';
export default Button as ButtonComponent;

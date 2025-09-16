import {
  forwardRef,
  ElementType,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';

type ButtonProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>['ref'];

type PolymorphicComponent = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;

// ✅ define inner function separately
const ButtonInner = <T extends ElementType = 'button'>(
  { as, className, children, ...props }: ButtonProps<T>,
  ref: PolymorphicRef<T>
) => {
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
};

// ✅ cast after wrapping
const Button = forwardRef(ButtonInner) as PolymorphicComponent;

Button.displayName = 'Button';

export default Button;

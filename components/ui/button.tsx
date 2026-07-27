import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-g focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
  {
    variants: {
      variant: {
        solid: 'bg-g text-cream hover:bg-g/90',
        outline: 'border border-g text-g hover:bg-g/10',
        ghost: 'text-ink/45 hover:text-g',
        link: 'text-g underline-offset-2 hover:underline',
      },
      size: {
        default: 'text-0_8 px-3 py-1.5',
        sm: 'text-0_7 px-2.5 py-1',
        icon: 'p-0',
      },
    },
    defaultVariants: { variant: 'outline', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

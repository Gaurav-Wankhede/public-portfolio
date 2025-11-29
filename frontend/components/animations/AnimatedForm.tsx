'use client';

import { useEffect, useRef } from 'react';
import { animateFormFields, setupButtonAnimations } from '@/lib/animations/gsap-animations';

interface AnimatedFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function AnimatedForm({ children, className = '', onSubmit }: AnimatedFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Animate form fields
    const fields = form.querySelectorAll('.animate-form-field, input, textarea, select');
    if (fields.length > 0) {
      animateFormFields(Array.from(fields));
    }

    // Animate buttons
    const buttons = form.querySelectorAll('.animate-button, button[type="submit"]');
    if (buttons.length > 0) {
      setupButtonAnimations(Array.from(buttons));
    }
  }, []);

  return (
    <form 
      ref={formRef}
      className={`animated-form ${className}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

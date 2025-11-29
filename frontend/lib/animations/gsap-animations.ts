'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation configurations
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
  },
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.3)',
  },
  stagger: {
    cards: 0.1,
    items: 0.05,
  },
};

// Page entrance animations
export const animatePageEntrance = (container: HTMLElement) => {
  const tl = gsap.timeline();
  
  // Fade in container
  tl.fromTo(container, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.ease.smooth }
  );

  // Animate children with stagger
  const children = container.querySelectorAll('.animate-child');
  if (children.length > 0) {
    tl.fromTo(children,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
        stagger: ANIMATION_CONFIG.stagger.items
      },
      '-=0.3'
    );
  }

  return tl;
};

// Card animations
export const animateCards = (cards: NodeListOf<Element> | Element[]) => {
  return gsap.fromTo(cards,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: ANIMATION_CONFIG.stagger.cards,
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

// Button hover animations
export const setupButtonAnimations = (buttons: NodeListOf<Element> | Element[]) => {
  buttons.forEach((button) => {
    const element = button as HTMLElement;
    
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: 1.05,
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });
  });
};

// Form field animations
export const animateFormFields = (fields: NodeListOf<Element> | Element[]) => {
  fields.forEach((field, index) => {
    gsap.fromTo(field,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: field,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
};

// Horizontal scroll section
export const createHorizontalScroll = (
  container: HTMLElement,
  track: HTMLElement,
  cards: Element[]
) => {
  if (!container || !track || cards.length === 0) return;

  // Kill any existing ScrollTriggers for this container
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger === container) {
      trigger.kill();
    }
  });

  // Calculate scroll distance properly
  const trackWidth = track.scrollWidth;
  const containerWidth = container.offsetWidth;
  const scrollDistance = Math.max(0, trackWidth - containerWidth);
  
  // If no scroll needed, don't create ScrollTrigger
  if (scrollDistance <= 0) {
    return;
  }

  // Create simple, slow horizontal scroll
  const scrollTrigger = ScrollTrigger.create({
    trigger: container,
    start: 'top center',
    end: `+=${scrollDistance}`,
    pin: true,
    scrub: 2, // Slower animation (higher value = slower)
    anticipatePin: 1,
    animation: gsap.to(track, {
      x: -scrollDistance,
      ease: 'none',
    }),
    onEnter: () => {
      container.classList.add('horizontal-active');
    },
    onLeave: () => {
      container.classList.remove('horizontal-active');
    },
    onEnterBack: () => {
      container.classList.add('horizontal-active');
    },
    onLeaveBack: () => {
      container.classList.remove('horizontal-active');
    },
  });

  // Return cleanup function
  return () => {
    if (scrollTrigger) {
      scrollTrigger.kill();
    }
    // Reset track position
    gsap.set(track, { x: 0 });
    // Remove active class
    container.classList.remove('horizontal-active');
  };
};

// Text reveal animation
export const animateTextReveal = (elements: NodeListOf<Element> | Element[]) => {
  elements.forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
};

// Loading animation
export const animateLoading = (element: HTMLElement) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: 'none',
    repeat: -1,
  });
};

// Success/Error message animations
export const animateMessage = (element: HTMLElement, type: 'success' | 'error') => {
  const tl = gsap.timeline();
  
  // Initial state
  gsap.set(element, { opacity: 0, y: -20, scale: 0.9 });
  
  // Animate in
  tl.to(element, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: ANIMATION_CONFIG.duration.fast,
    ease: type === 'success' ? ANIMATION_CONFIG.ease.bounce : ANIMATION_CONFIG.ease.smooth,
  });

  // Auto hide after 3 seconds
  tl.to(element, {
    opacity: 0,
    y: -20,
    duration: ANIMATION_CONFIG.duration.fast,
    ease: ANIMATION_CONFIG.ease.smooth,
  }, '+=3');

  return tl;
};

// Navigation animations
export const animateNavigation = (nav: HTMLElement) => {
  const links = nav.querySelectorAll('a, button');
  
  gsap.fromTo(nav,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.ease.smooth }
  );

  gsap.fromTo(links,
    { opacity: 0, y: -10 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: ANIMATION_CONFIG.stagger.items,
      delay: 0.2,
    }
  );
};

// Cleanup function for ScrollTrigger
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  ScrollTrigger.refresh();
};

// Initialize all animations for a page
export const initializePageAnimations = (container: HTMLElement) => {
  // Page entrance
  animatePageEntrance(container);

  // Cards
  const cards = container.querySelectorAll('.animate-card');
  if (cards.length > 0) animateCards(cards);

  // Buttons
  const buttons = container.querySelectorAll('.animate-button');
  if (buttons.length > 0) setupButtonAnimations(buttons);

  // Form fields
  const formFields = container.querySelectorAll('.animate-form-field');
  if (formFields.length > 0) animateFormFields(formFields);

  // Text reveals
  const textElements = container.querySelectorAll('.animate-text');
  if (textElements.length > 0) animateTextReveal(textElements);

  // Navigation
  const nav = container.querySelector('nav');
  if (nav) animateNavigation(nav);
};

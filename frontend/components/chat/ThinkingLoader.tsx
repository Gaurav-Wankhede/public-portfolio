import { Atom } from 'react-loading-indicators';
import { useTheme } from 'next-themes';

const AIAgentLoader = () => {
  const { theme } = useTheme();
  
  // Dynamic colors based on theme
  const loaderColor = theme === 'dark' 
    ? ['var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)']
    : ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']; // cyan, blue, purple, pink

  return (
    <div className="flex items-center justify-center py-8 w-full">
      <Atom 
        color={loaderColor}
        size="medium"
        text=""
        textColor=""
        speedPlus={0} // Medium/normal speed
        easing="ease-in-out"
      />
    </div>
  );
};

export default AIAgentLoader;

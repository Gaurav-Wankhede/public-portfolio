import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set to true when the component mounts
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh' }} className="relative">
            {/* Background animations for loader */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 animate-gradient-background" />
                <div className="absolute inset-0 bg-[url(/grid.svg)] dark:bg-[url(/grid-dark.svg)] bg-repeat bg-center [mask-image:radial-gradient(white,transparent_85%)] dark:[mask-image:radial-gradient(white,transparent_85%)] opacity-30 dark:opacity-50 pointer-events-none" />
            </div>
            
            {isClient && (
                <>
                    <DotLottieReact
                        src="https://lottie.host/fa114f5b-d9d0-43ca-bfc8-c4c50ec2f41a/2Uj2bDHrGV.lottie"
                        loop
                        autoplay
                        onError={() => console.error('Failed to load animation')}
                    />
                    <div 
                        className="text-center mt-4 opacity-0 animate-fadeIn"
                        style={{ 
                            animation: 'fadeIn 0.5s ease-in forwards',
                            animationDelay: '5s'
                        }}
                    >
                        <p>If loading takes too long, please refresh the page.</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Loader;
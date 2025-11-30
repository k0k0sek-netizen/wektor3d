/** @jsxRuntime automatic */
/** @jsxImportSource react */
import React, { Suspense, Component } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Stage, OrbitControls, Float, Center, Html, useProgress } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';

// 1. Prosty Error Boundary (łapie błędy 404/uszkodzone pliki)
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="text-red-500 bg-black/80 p-4 rounded-xl border border-red-500 text-center w-64">
                        <p className="font-bold">Błąd wczytywania modelu</p>
                        <p className="text-xs mt-2 text-zinc-400">{this.state.error.message}</p>
                        <p className="text-xs mt-2 text-orange-500">Sprawdź nazwę pliku w folderze public!</p>
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

// 2. Komponent Ładowania (Pokazuje % podczas pobierania)
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="text-orange-500 font-mono font-bold text-lg bg-black/50 p-2 rounded backdrop-blur-sm">
                {progress.toFixed(0)}%
            </div>
        </Html>
    );
}

function Model({ url }) {
    const is3MF = url.toLowerCase().endsWith('.3mf');
    const LoaderType = is3MF ? ThreeMFLoader : STLLoader;

    // To tutaj następuje "Suspense" (czekanie na plik)
    const result = useLoader(LoaderType, url);

    if (is3MF) {
        return (
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Center top>
                    <primitive object={result} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow />
                </Center>
            </Float>
        );
    }

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Center top>
                <mesh geometry={result} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                    <meshPhysicalMaterial color="#f97316" roughness={0.5} metalness={0.2} clearcoat={0.1} />
                </mesh>
            </Center>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="w-full h-[400px] md:h-[500px] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group cursor-grab active:cursor-grabbing touch-none select-none">

            <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
                <div className="bg-black/50 backdrop-blur-md text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/20 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    PODGLĄD 3D
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none opacity-50 text-xs text-white select-none">
                Obracaj • Przybliżaj • Przesuwaj
            </div>

            <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 150] }} shadows>
                {/* ErrorBoundary łapie błędy, Suspense pokazuje Loader w trakcie wczytywania */}
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <Stage environment="city" intensity={0.6} contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5 }}>
                            {/* UPEWNIJ SIĘ, ŻE PLIK ISTNIEJE W PUBLIC */}
                            <Model url="/model.3mf" />
                        </Stage>
                    </Suspense>
                </ErrorBoundary>

                <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
            </Canvas>
        </div>
    );
}

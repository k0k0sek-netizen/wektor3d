/** @jsxRuntime automatic */
/** @jsxImportSource react */
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Stage, OrbitControls, Float, Center, Html, useProgress } from '@react-three/drei';
import { STLLoader, ThreeMFLoader } from 'three-stdlib';

// --- KOMPONENTY POMOCNICZE ---

// Error Boundary (łapie błędy uszkodzonych plików)
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidUpdate(prevProps) {
        // Reset błędu, gdy zmieni się plik (url)
        if (this.props.url !== prevProps.url) {
            this.setState({ hasError: false, error: null });
        }
    }
    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="text-red-500 bg-black/90 p-6 rounded-2xl border border-red-500/50 text-center w-80 shadow-2xl backdrop-blur-md">
                        <p className="font-bold text-lg mb-2">Ups! Błąd pliku</p>
                        <p className="text-sm text-zinc-400 mb-4">{this.state.error?.message || "Nie udało się wczytać modelu."}</p>
                        <button
                            onClick={this.props.onReset}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            Spróbuj inny plik
                        </button>
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="text-orange-500 font-mono font-bold text-2xl animate-pulse">
                    {progress.toFixed(0)}%
                </div>
                <div className="text-zinc-500 text-xs uppercase tracking-widest">Wczytywanie...</div>
            </div>
        </Html>
    );
}

// --- GŁÓWNY MODEL ---

function Model({ url, fileName }) {
    // Wybór loadera na podstawie rozszerzenia
    const is3MF = fileName.toLowerCase().endsWith('.3mf');
    const LoaderType = is3MF ? ThreeMFLoader : STLLoader;

    // Wczytanie (to tutaj dzieje się magia Suspense)
    const result = useLoader(LoaderType, url);

    // Logika czyszczenia pamięci (dla 3MF, które tworzy tekstury)
    useEffect(() => {
        return () => {
            if (is3MF) {
                // Opcjonalne czyszczenie zasobów Three.js jeśli potrzebne
            }
        };
    }, [url, is3MF]);

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
                    <meshPhysicalMaterial
                        color="#f97316"
                        roughness={0.4}
                        metalness={0.3}
                        clearcoat={0.2}
                        flatShading={false}
                    />
                </mesh>
            </Center>
        </Float>
    );
}

// --- GŁÓWNA SCENA ---

export default function Scene3D() {
    const [modelData, setModelData] = useState({
        url: '/model.3mf', // Domyślny plik startowy
        name: 'model.3mf'
    });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Obsługa wgrania pliku
    const handleFile = (file) => {
        if (!file) return;

        // Sprawdź rozszerzenie
        const name = file.name.toLowerCase();
        if (!name.endsWith('.stl') && !name.endsWith('.3mf')) {
            alert('Obsługiwane są tylko pliki .stl oraz .3mf');
            return;
        }

        // Stwórz tymczasowy URL
        const objectUrl = URL.createObjectURL(file);

        // Zapisz w stanie
        setModelData({
            url: objectUrl,
            name: file.name
        });
    };

    // Eventy Drag & Drop
    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // Obsługa przycisku "Wgraj"
    const onUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`w-full h-[400px] md:h-[600px] bg-zinc-900/50 rounded-2xl overflow-hidden border transition-colors duration-300 shadow-2xl relative group select-none ${isDragging ? 'border-orange-500 bg-zinc-900/80' : 'border-zinc-800'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >

            {/* UI: Nakładka informacyjna */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-md text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/20 flex items-center gap-2 w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    INTERAKTYWNY PODGLĄD
                </div>
                <div className="text-zinc-500 text-[10px] font-mono pl-1">
                    {modelData.name}
                </div>
            </div>

            {/* UI: Instrukcja / Przycisk */}
            <div className="absolute bottom-6 left-0 w-full z-10 flex flex-col items-center gap-3 pointer-events-none">
                <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-orange-400 scale-110' : 'text-zinc-400'}`}>
                    {isDragging ? 'UPUŚĆ PLIK TUTAJ' : 'Przeciągnij plik STL / 3MF lub'}
                </p>

                {/* Przycisk musi mieć pointer-events-auto, bo kontener ma pointer-events-none */}
                <button
                    onClick={onUploadClick}
                    className="pointer-events-auto bg-zinc-800 hover:bg-orange-600 text-white text-sm font-bold py-2 px-6 rounded-full border border-zinc-700 hover:border-orange-500 transition-all shadow-lg flex items-center gap-2 group/btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Wgraj swój model
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".stl,.3mf"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
            </div>

            {/* SCENA 3D */}
            <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 150] }} shadows>
                {/* Przekazujemy key={url} aby wymusić reset sceny przy zmianie pliku */}
                <ErrorBoundary key={modelData.url} url={modelData.url} onReset={() => setModelData({ url: '/model.3mf', name: 'model.3mf' })}>
                    <Suspense fallback={<Loader />}>
                        <Stage environment="city" intensity={0.6} contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5 }}>
                            <Model url={modelData.url} fileName={modelData.name} />
                        </Stage>
                    </Suspense>
                </ErrorBoundary>

                <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
            </Canvas>
        </div>
    );
}

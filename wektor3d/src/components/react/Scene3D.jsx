/** @jsxRuntime automatic */
/** @jsxImportSource react */
import { Canvas, useLoader } from '@react-three/fiber';
import { Stage, OrbitControls, Float, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';

function Model({ url }) {
    // Sprawdź rozszerzenie pliku
    const is3MF = url.toLowerCase().endsWith('.3mf');
    const Loader = is3MF ? ThreeMFLoader : STLLoader;

    // Załaduj model
    const result = useLoader(Loader, url);

    // Logika renderowania (3MF zwraca obiekt/grupę, STL zwraca geometrię)
    if (is3MF) {
        return (
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Center top>
                    <primitive
                        object={result}
                        rotation={[-Math.PI / 2, 0, 0]}
                        castShadow
                        receiveShadow
                    />
                </Center>
            </Float>
        );
    }

    // Fallback dla STL (nadpisujemy materiał na nasz brandowy pomarańcz)
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Center top>
                <mesh geometry={result} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                    <meshPhysicalMaterial
                        color="#f97316"
                        roughness={0.5}
                        metalness={0.2}
                        clearcoat={0.1}
                    />
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
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    PODGLĄD 3D
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none opacity-50 text-xs text-white select-none">
                Obracaj • Przybliżaj • Przesuwaj
            </div>

            <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 150] }} shadows>
                <Stage environment="city" intensity={0.6} contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5 }}>
                    {/* ZMIEŃ NAZWĘ PLIKU TUTAJ: np. /model.3mf lub /model.stl */}
                    <Model url="/model.3mf" />
                </Stage>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
            </Canvas>
        </div>
    );
}

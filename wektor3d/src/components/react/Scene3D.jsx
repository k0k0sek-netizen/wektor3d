/** @jsxRuntime automatic */
/** @jsxImportSource react */
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';

function Model() {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
                {/* Przykładowy kształt - Ikozaedr (wygląda technicznie) */}
                <icosahedronGeometry args={[1, 0]} />
                {/* Materiał: Pomarańczowy, błyszczący, lekko zniekształcony */}
                <MeshDistortMaterial
                    color="#f97316"
                    envMapIntensity={0.4}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.1}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="w-full h-[400px] md:h-[500px] bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group cursor-grab active:cursor-grabbing touch-none select-none">

            {/* Nakładka informacyjna */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
                <div className="bg-black/50 backdrop-blur-md text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/20 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    INTERAKTYWNY PODGLĄD
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none opacity-50 text-xs text-white select-none">
                Obracaj • Przybliżaj • Przesuwaj
            </div>

            <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 4] }}>
                {/* Oświetlenie studyjne (automatyczne) */}
                <Stage environment="city" intensity={0.5} contactShadow={false} shadows={false}>
                    <Model />
                </Stage>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enablePan={false} />
            </Canvas>
        </div>
    );
}

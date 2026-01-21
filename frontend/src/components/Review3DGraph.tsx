import { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line, Billboard } from '@react-three/drei';
import { scaleLinear } from 'd3-scale';
import { UiReview } from '../api/backend';
import * as THREE from 'three';

interface Review3DGraphProps {
    reviews: UiReview[];
}

const Axis = ({ start, end, label, labelPosition, tickDirection, axisColor }: { start: [number, number, number], end: [number, number, number], label: string, labelPosition: [number, number, number], tickDirection: [number, number, number], axisColor: string }) => {
    // Calculate arrow orientation
    const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
    const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

    // Calculate tick marks (0 to 5)
    const ticks = useMemo(() => {
        const t = [];
        for (let i = 0; i <= 5; i++) {
            const ratio = i / 5;
            const pos = new THREE.Vector3().lerpVectors(startVec, endVec, ratio);
            const tickEnd = pos.clone().add(new THREE.Vector3(...tickDirection).multiplyScalar(0.2));
            t.push([pos, tickEnd]);
        }
        return t;
    }, [startVec, endVec, tickDirection]);

    return (
        <group>
            {/* Shaft */}
            <Line
                points={[start, end]}
                color={axisColor}
                lineWidth={3}
            />



            {/* Ticks */}
            {ticks.map((tick, i) => (
                <Line
                    key={i}
                    points={[tick[0] as [number, number, number], tick[1] as [number, number, number]]}
                    color={axisColor}
                    lineWidth={2}
                />
            ))}

            <Billboard position={labelPosition}>
                <Text
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label}
                </Text>
            </Billboard>
        </group>
    );
};

const DataPoint = ({ position, color, review }: { position: [number, number, number], color: string, review: UiReview }) => {
    const [hovered, setHover] = useState(false);

    return (
        <group>
            <mesh
                position={position}
                onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={hovered ? 'white' : color} emissive={hovered ? 'white' : color} emissiveIntensity={0.5} />
            </mesh>
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="bg-black/80 text-white p-2 rounded text-xs w-40 pointer-events-none z-50">
                        <div className="font-bold mb-1">@{review.username}</div>
                        <div>Vis: {review.breakdown.visual} | Act: {review.breakdown.action} | Sce: {review.breakdown.scenario}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export function Review3DGraph({ reviews }: Review3DGraphProps) {
    // Scales map 0-5 ratings to -2 to 2 coordinate space
    const scale = useMemo(() => scaleLinear().domain([0, 5]).range([-2.5, 2.5]), []);

    if (reviews.length === 0) return null;

    return (
        <div style={{ width: 250, height: 250 }} className="bg-[#1a1f29] rounded-lg border border-gray-800 relative z-0">
            <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
                {/* <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} /> */}

                <OrbitControls enableZoom={true} enablePan={true} />

                <group>
                    {/* Grid helpers for visual context */}
                    <gridHelper args={[5, 5, 0x888888, 0x555555]} position={[0, -2.5, 0]} />

                    {/* Axes */}
                    {/* X Axis (Visual) - Ticks up (Y) */}
                    <Axis
                        start={[-2.5, -2.5, -2.5]}
                        end={[2.5, -2.5, -2.5]}
                        label="Visual"
                        labelPosition={[3, -2.7, -2.5]}
                        tickDirection={[0, 1, 0]}
                        axisColor="rgba(255, 90, 90, 1)"
                    />
                    {/* Y Axis (Action) - Ticks right (X) */}
                    <Axis
                        start={[-2.5, -2.5, -2.5]}
                        end={[-2.5, 2.5, -2.5]}
                        label="Action"
                        labelPosition={[-2.5, 3, -2.5]}
                        tickDirection={[1, 0, 0]}
                        axisColor="rgba(89, 255, 89, 1)"
                    />
                    {/* Z Axis (Scenario) - Ticks right (X) */}
                    <Axis
                        start={[-2.5, -2.5, -2.5]}
                        end={[-2.5, -2.5, 2.5]}
                        label="Scenario"
                        labelPosition={[-2.5, -2.7, 3]}
                        tickDirection={[1, 0, 0]}
                        axisColor="rgba(103, 103, 255, 1)"
                    />

                    {reviews.map((review) => (
                        <DataPoint
                            key={review.id}
                            position={[
                                scale(review.breakdown.visual),
                                scale(review.breakdown.action),
                                scale(review.breakdown.scenario)
                            ]}
                            color="#00c030" // Letterboxd green
                            review={review}
                        />
                    ))}
                </group>
            </Canvas>

            <div className="absolute bottom-2 right-2 text-xs text-gray-500 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00c030]"></div>
                    <span>Review</span>
                </div>
            </div>
        </div>
    );
}

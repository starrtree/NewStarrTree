import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { AdditiveBlending, Box3, CanvasTexture, Color, MathUtils, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/AxStarr.glb`;
const HOLD_TIME = 1.45;
const INTERACTIVE_TIME = 5.15;

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const smoothstep = (start, end, value) => {
  const x = clamp01((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp01(value), 3);

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.12, 'rgba(255,248,214,0.98)');
  gradient.addColorStop(0.35, 'rgba(255,203,92,0.48)');
  gradient.addColorStop(1, 'rgba(255,178,48,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function StarBirth({ getTimelineTime }) {
  const coreRef = useRef();
  const haloRef = useRef();
  const ringRef = useRef();
  const lightRef = useRef();
  const glowTexture = useMemo(createGlowTexture, []);

  useEffect(() => () => glowTexture.dispose(), [glowTexture]);

  useFrame(() => {
    const time = getTimelineTime();
    const charge = smoothstep(0.12, 1.45, time);
    const ignition = smoothstep(1.42, 2.05, time);
    const dissolve = smoothstep(2.25, 3.65, time);
    const pulse = 1 + Math.sin(time * 9) * 0.05 * (1 - ignition);

    if (coreRef.current) {
      const size = (0.045 + charge * 0.095 + ignition * 0.2) * pulse;
      coreRef.current.scale.setScalar(size);
      coreRef.current.material.opacity = 1 - dissolve;
      coreRef.current.visible = dissolve < 0.995;
    }

    if (haloRef.current) {
      const size = 0.48 + charge * 0.7 + ignition * 5.5;
      haloRef.current.scale.set(size, size, 1);
      haloRef.current.material.opacity = Math.max(
        0,
        0.16 + charge * 0.2 + ignition * 0.62 - dissolve * 0.98
      );
      haloRef.current.visible = dissolve < 0.995;
    }

    if (ringRef.current) {
      const ringScale = 0.16 + ignition * 3.8;
      ringRef.current.scale.setScalar(ringScale);
      ringRef.current.material.opacity = Math.max(0, ignition * (1 - dissolve) * 0.65);
    }

    if (lightRef.current) {
      lightRef.current.intensity = Math.max(
        0,
        0.6 + charge * 6 + ignition * 22 - dissolve * 24
      );
      lightRef.current.distance = 5 + ignition * 7;
    }
  });

  return (
    <group position={[0, 0, 0.25]}>
      <pointLight ref={lightRef} color="#ffd67d" intensity={0} distance={8} decay={2} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#fff7d6" transparent toneMapped={false} />
      </mesh>
      <sprite ref={haloRef} scale={[0.5, 0.5, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffd370"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.82, 1, 64]} />
        <meshBasicMaterial
          color="#fff1b8"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function StarrModel({ getTimelineTime, onReady, onError }) {
  const emergenceRef = useRef();
  const modelRef = useRef();
  const [model, setModel] = useState(null);
  const [fitScale, setFitScale] = useState(1);
  const [modelOffset, setModelOffset] = useState([0, 0, 0]);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        const scene = gltf.scene;

        scene.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;

          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.filter(Boolean).forEach((material) => {
            if ('envMapIntensity' in material) material.envMapIntensity = 1.15;
            if ('roughness' in material) {
              material.roughness = Math.max(0.38, material.roughness ?? 0.55);
            }
            if (!material.map && material.color) material.color = new Color('#f3dfb0');
            material.needsUpdate = true;
          });
        });

        const bounds = new Box3().setFromObject(scene);
        const size = bounds.getSize(new Vector3());
        const center = bounds.getCenter(new Vector3());
        const normalizedScale = size.y > 0 ? 4.4 / size.y : 1;

        setFitScale(normalizedScale);
        setModelOffset([-center.x, -center.y, -center.z]);
        setModel(scene);
        onReady();
      },
      undefined,
      (error) => {
        if (cancelled) return;
        console.error('Unable to load AxStarr.glb', error);
        onError(`Model not found at ${MODEL_URL}`);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [onError, onReady]);

  useFrame(() => {
    if (!emergenceRef.current || !modelRef.current) return;

    const time = getTimelineTime();
    const reveal = easeOutCubic((time - 1.83) / 2.35);
    const hoverBlend = smoothstep(3.7, 4.9, time);
    const hover = Math.sin((time - 3.8) * 0.82) * 0.105 * hoverBlend;
    const breathe = 1 + Math.sin((time - 3.5) * 0.68) * 0.006 * hoverBlend;

    const emergenceScale = Math.max(0.001, reveal * breathe);
    emergenceRef.current.scale.setScalar(emergenceScale);
    emergenceRef.current.position.y = MathUtils.lerp(-0.22, 0, reveal) + hover;
    emergenceRef.current.position.z = MathUtils.lerp(-1.4, 0, reveal);
    modelRef.current.rotation.y = Math.sin(time * 0.18) * 0.045 * hoverBlend;
  });

  if (!model) return null;

  return (
    <group ref={emergenceRef} scale={0.001}>
      <group ref={modelRef} scale={fitScale} position={modelOffset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function IntroCamera({ interactive, getTimelineTime }) {
  const { camera } = useThree();

  useFrame(() => {
    if (interactive) return;
    const time = getTimelineTime();
    const dolly = smoothstep(1.7, 4.85, time);
    camera.position.x = 0;
    camera.position.y = MathUtils.lerp(0.08, 0.18, dolly);
    camera.position.z = MathUtils.lerp(8.4, 6.7, dolly);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CinematicControls({ interactive, reducedMotion }) {
  const timeoutRef = useRef();
  const [userControlling, setUserControlling] = useState(false);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const beginControl = () => {
    window.clearTimeout(timeoutRef.current);
    setUserControlling(true);
  };

  const releaseControl = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setUserControlling(false), 3500);
  };

  return (
    <OrbitControls
      makeDefault
      enabled={interactive}
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minDistance={4.8}
      maxDistance={9.2}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.72}
      target={[0, 0, 0]}
      autoRotate={interactive && !userControlling && !reducedMotion}
      autoRotateSpeed={0.34}
      onStart={beginControl}
      onEnd={releaseControl}
    />
  );
}

function CinematicWorld({ lowPower, reducedMotion, onModelReady, onModelError, onInteractive }) {
  const { clock } = useThree();
  const readyAtRef = useRef(null);
  const interactiveSentRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [interactive, setInteractive] = useState(false);

  const getTimelineTime = useCallback(() => {
    const elapsed = clock.getElapsedTime();
    if (!ready || readyAtRef.current === null) return Math.min(elapsed, HOLD_TIME);
    return HOLD_TIME + (elapsed - readyAtRef.current);
  }, [clock, ready]);

  const markReady = useCallback(() => {
    if (readyAtRef.current !== null) return;
    readyAtRef.current = clock.getElapsedTime();
    setReady(true);
    onModelReady();
  }, [clock, onModelReady]);

  useFrame(() => {
    const time = getTimelineTime();
    if (time >= INTERACTIVE_TIME && !interactiveSentRef.current) {
      interactiveSentRef.current = true;
      setInteractive(true);
      onInteractive();
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 9, 32]} />
      <ambientLight intensity={0.16} />
      <hemisphereLight color="#fff2ce" groundColor="#08030d" intensity={0.42} />
      <directionalLight position={[4, 5, 6]} color="#ffe0a0" intensity={1.7} />
      <directionalLight position={[-4, 1, 2]} color="#96a8ff" intensity={0.55} />

      <Stars
        radius={70}
        depth={32}
        count={lowPower ? 170 : 340}
        factor={2.1}
        saturation={0.2}
        fade
        speed={reducedMotion ? 0 : 0.12}
      />

      <StarBirth getTimelineTime={getTimelineTime} />
      <StarrModel
        getTimelineTime={getTimelineTime}
        onReady={markReady}
        onError={onModelError}
      />
      <IntroCamera interactive={interactive} getTimelineTime={getTimelineTime} />
      <CinematicControls interactive={interactive} reducedMotion={reducedMotion} />

      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.25}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function StarrScene({ onModelReady, onModelError, onInteractive }) {
  const lowPower = useMemo(
    () => window.matchMedia('(max-width: 760px)').matches,
    []
  );
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 0.08, 8.4], fov: 42, near: 0.1, far: 100 }}
      dpr={lowPower ? 1 : [1, 1.45]}
      gl={{
        antialias: !lowPower,
        alpha: false,
        powerPreference: 'high-performance'
      }}
    >
      <CinematicWorld
        lowPower={lowPower}
        reducedMotion={reducedMotion}
        onModelReady={onModelReady}
        onModelError={onModelError}
        onInteractive={onInteractive}
      />
    </Canvas>
  );
}

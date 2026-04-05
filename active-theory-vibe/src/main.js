/**
 * ACTIVE THEORY INSPIRED 3D LANDING PAGE
 * Senior Creative Technologist Implementation
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. SCENE SETUP
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const loader = new THREE.Group();
scene.add(loader);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 2. CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// 3. RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// NEW: Add basic lights for fallback visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 4. CUSTOM SHADER MATERIAL (GLSL)
const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vDist;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Bulge Effect: Reactive to mouse proximity
        float dist = distance(modelPosition.xy, uMouse * 5.0);
        vDist = dist;
        float bulge = exp(-dist * dist) * 0.5 * uScroll;
        modelPosition.xyz += normal * bulge;

        vec4 viewPosition = viewMatrix * modelPosition;
        vViewDir = normalize(-viewPosition.xyz);
        
        gl_Position = projectionMatrix * viewPosition;
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vDist;
    uniform float uTime;
    uniform vec3 uColor;

    void main() {
        // Fresnel Effect for glow
        float fresnel = pow(1.0 - dot(vNormal, vViewDir), 2.0);
        
        // Base color mixed with glowing edges
        vec3 color = mix(uColor, vec3(1.0, 0.9, 0.7), fresnel);
        
        // Subtle scanline / holographic effect
        float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.02;
        
        gl_FragColor = vec4(color + scanline, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color('#c4874a') }
    }
});

// 5. ASSET LOADING
const gltfLoader = new GLTFLoader();
const preloader = document.querySelector('.progress');

gltfLoader.load(
    'public/bird_in_space.glb', 
    (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = shaderMaterial;
                child.frustumCulled = false;
            }
        });
        
        // Center and maximize scale for impact
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Zoom out 1.5x

        model.position.sub(center);
        model.scale.setScalar(4 / maxDim); // Scale to fit well
        
        loader.add(model);
        
        // Transition Loader
        gsap.to('#loader', {
            opacity: 0,
            duration: 1.2,
            ease: 'expo.inOut',
            onComplete: () => {
                document.querySelector('#loader').style.display = 'none';
                initAnimations(model);
            }
        });
    },
    (xhr) => {
        const progress = (xhr.loaded / (xhr.total || 2170244)) * 100;
        preloader.style.width = `${progress}%`;
    }
);

// 6. ANIMATIONS & INTERACTIVITY
function initAnimations(model) {
    // Scroll Fly-through logic
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(model.position, {
        z: 2,
        y: 1,
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        }
    });

    gsap.to(shaderMaterial.uniforms.uScroll, {
        value: 1,
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            scrub: true
        }
    });

    // Reveal elements
    document.querySelectorAll('.rev').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            scrollTrigger: {
                trigger: el,
                start: 'top 80%'
            }
        });
    });
}

// 7. MOUSE TRACKING
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
    
    // Lerp rotation for smooth follow
    gsap.to(loader.rotation, {
        y: mouse.x * 0.2,
        x: -mouse.y * 0.2,
        duration: 2,
        ease: 'power2.out'
    });

    // Update shader mouse uniform
    shaderMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);
});

// 8. TICK LOOP
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    shaderMaterial.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Handle Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

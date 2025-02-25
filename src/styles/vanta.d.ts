declare module 'vanta/dist/vanta.net.min' {
    import * as THREE from 'three';
    
    interface VantaNetOptions {
      el: HTMLElement;
      THREE?: typeof THREE;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      color?: string;
      backgroundColor?: string;
      points?: number;
      maxDistance?: number;
      spacing?: number;
    }
  
    function NET(options: VantaNetOptions): {
      destroy: () => void;
    };
    
    export default NET;
  }
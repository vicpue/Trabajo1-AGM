import {
    Object3D,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
  } from 'three'
  
  export default class Cubo extends Object3D {
    constructor() {
      super()
  
        const geoCubo = new THREE.BoxGeometry(6, 0.5, 0.5);
        const matCubo = new THREE.MeshBasicMaterial({ color: 0xB0FCFC});
        const mesh = new Mesh(geometry, material)

        const mesh = new THREE.Mesh(geoCubo, matCubo);
        this.add(mesh)

       //Cubo 
  
  
    }
  }
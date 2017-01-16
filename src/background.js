'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Background extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.canvasRender();
  }

  canvasRender() {
    let canvas = document.querySelector('canvas#bg');
    let ctx = canvas.getContext('2d');
    let boxSize = 50;
    let borderWidth = 2;
    let diffCount = 50;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    let render = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let n = 0; n != diffCount; ++n) {
        let x = Math.floor(Math.random() * (canvas.width / boxSize / window.devicePixelRatio)) * boxSize * window.devicePixelRatio;
        let y = Math.floor(Math.random() * (canvas.height / boxSize / window.devicePixelRatio)) * boxSize * window.devicePixelRatio;
        ctx.fillStyle = `rgb(${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 30)})`;
        ctx.fillRect(x, y, boxSize * window.devicePixelRatio, boxSize * window.devicePixelRatio);
      }

      ctx.strokeStyle = '#222';
      ctx.lineWidth = borderWidth * window.devicePixelRatio;
      for (let x = 0; x < canvas.width; x += boxSize * window.devicePixelRatio) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += boxSize * window.devicePixelRatio) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }

    render();

    window.addEventListener('resize', () => {
      if (!/(mobile|android)/i.test(navigator.userAgent)) {
        console.log('Redraw background...');
        render();
      }
    });
  }

  render() {
    return (
      <canvas id="bg"></canvas>
    )
  }

}

export default Background;

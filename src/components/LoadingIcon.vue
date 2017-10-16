<template lang="pug">
  // Codes from http://tobiasahlin.com/spinkit/, modified, licensed under MIT.
  div.wrapper: div.sk-circle
    div.sk-child.sk-circle1
    div.sk-child.sk-circle2
    div.sk-child.sk-circle3
    div.sk-child.sk-circle4
    div.sk-child.sk-circle5
    div.sk-child.sk-circle6
    div.sk-child.sk-circle7
    div.sk-child.sk-circle8
    div.sk-child.sk-circle9
    div.sk-child.sk-circle10
    div.sk-child.sk-circle11
    div.sk-child.sk-circle12
</template>

<script>
export default {
  name: 'loading-icon',
};
</script>

<style lang="scss">
@import '../style/global.scss';
div.wrapper {
  width: 100%;
  height: 100vh;
}

.sk-circle {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 0 auto;
  transform: translateY(50vh);
}
.sk-circle .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.sk-circle .sk-child:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  border-radius: 100%;
  -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
          animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
}
.sk-circle .sk-circle2 { transform: rotate(30deg); }
.sk-circle .sk-circle3 { transform: rotate(60deg); }
.sk-circle .sk-circle4 { transform: rotate(90deg); }
.sk-circle .sk-circle5 { transform: rotate(120deg); }
.sk-circle .sk-circle6 { transform: rotate(150deg); }
.sk-circle .sk-circle7 { transform: rotate(180deg); }
.sk-circle .sk-circle8 { transform: rotate(210deg); }
.sk-circle .sk-circle9 { transform: rotate(240deg); }
.sk-circle .sk-circle10 { transform: rotate(270deg); }
.sk-circle .sk-circle11 { transform: rotate(300deg); }
.sk-circle .sk-circle12 { transform: rotate(330deg); }
.sk-circle .sk-circle2:before { animation-delay: -1.1s; }
.sk-circle .sk-circle3:before { animation-delay: -1s; }
.sk-circle .sk-circle4:before { animation-delay: -0.9s; }
.sk-circle .sk-circle5:before { animation-delay: -0.8s; }
.sk-circle .sk-circle6:before { animation-delay: -0.7s; }
.sk-circle .sk-circle7:before { animation-delay: -0.6s; }
.sk-circle .sk-circle8:before { animation-delay: -0.5s; }
.sk-circle .sk-circle9:before { animation-delay: -0.4s; }
.sk-circle .sk-circle10:before { animation-delay: -0.3s; }
.sk-circle .sk-circle11:before { animation-delay: -0.2s; }
.sk-circle .sk-circle12:before { animation-delay: -0.1s; }

@keyframes sk-circleBounceDelay {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}
.sk-circle .sk-child:before {
  background-color: $loading_indicator_color;
}
</style>
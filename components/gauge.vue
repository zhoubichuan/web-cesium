<template>
  <div>
    <div class="map" ref="cesiumContainer"></div>
  </div>
</template>

<script>
export default {
  name: "WebCesium3",
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let osm = Cesium.createOpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      });
      let viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
        imageryProvider: osm,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
        selectionIndicator: false,
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: false, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: false, //是否显示点击要素之后显示的信息
        fullscreenButton: false,
        shouldAnimate: true, //动画播放
        homeButton: false, //隐藏视角返回初始位置按钮
        navigationInstructionsInitiallyVisible: false, //隐藏导航说明
        creditContainer: document.createElement("div"), //隐藏logo
        scene3DOnly: true, //当 true 时，每个几何实例将仅以 3D 呈现以节省 GPU 内存
        skyBox: false, //天空盒用于渲染星星。当 undefined 时，使用默认的星星。如果设置为 false ，则不会添加天空盒、太阳或月亮
        skyAtmosphere: false, //蔚蓝的天空，以及围绕着地球四肢的光芒。设置为 false 将其关闭
        useDefaultRenderLoop: true, //如果此小部件应控制渲染循环，则为 true，否则为 false
        requestRenderMode: true, //请求渲染模式
        vrButton: false, //隐藏VR按钮，默认false
        sceneMode: 3, //初始场景模式 1：2D 2：2D循环 3：3D，默认3
        mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系，默认Ellipsoid.WGS84
        shadows: false, //确定阴影是否由光源投射,默认false
      });
      //取消双击事件
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      //设置homebutton的位置
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        110.15,
        34.54,
        110.25,
        34.56
      ); //Rectangle(west, south, east, north)
      //设置初始位置
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110.2, 34.55, 3000000),
      });

      //开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;

      function computeCircle(radius) {
        let positions = [];
        for (let i = 0; i < 360; i++) {
          let radians = Cesium.Math.toRadians(i);
          positions.push(
            new Cesium.Cartesian2(
              radius * Math.cos(radians),
              radius * Math.sin(radians)
            )
          );
        }
        return positions;
      }
      let startTime = Cesium.JulianDate.now();
      let redTube = viewer.entities.add({
        name: "动态纹理",
        polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -85.0, 32.0, -85.0, 36.0, -89.0, 36.0,
          ]),
          shape: computeCircle(6000.0),
          material: new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty(function () {
              return Cesium.Color.fromRandom({
                minimumRed: 0.75,
                minimumGreen: 0.75,
                minimumBlue: 0.75,
                alpha: 1.0,
              });
            }, false)
          ),
        },
      });

      viewer.zoomTo(viewer.entities);
    },
  },
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
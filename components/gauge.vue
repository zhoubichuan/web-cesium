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
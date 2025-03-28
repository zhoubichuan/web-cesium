<template>
  <div class="map">
    <div class="map" ref="cesiumContainer"></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "urlTemplateImageryProvider",
  props: {
    config: {
      type: Object,
      default: () => ({ basemap: 'vector', fromDegrees: [110.2, 34.55, 3000000] }),
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const maps = {
        // 天地图矢量图
        vector: {
          url: 'http://{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=816517e17d1cc31c6eec03ef9fc4bb5b',
          subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          maximumLevel: 18,
          minimumLevel: 1,
          credit: 'Tianditu'
        },
        osm: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c'], // 子域名列表
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          minimumLevel: 0,
          maximumLevel: 18,
          credit: '© OpenStreetMap contributors'
        },
        voyager: {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 19,
          credit: '© CartoDB © OpenStreetMap'
        },
        // 谷歌地图
        google: {
          url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 19,
          credit: '© Google'
        },
        // 卫星图
        satellite: {
          url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 19,
          credit: '© Google'
        }
      }
      this.$emit("cesiumBeforeCreate");
      let osm = new Cesium.UrlTemplateImageryProvider(maps[this.config.basemap]);
      this.$emit("cesiumCreated", osm);
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
      this.$emit("cesiumBeforeMount", viewer);
      //取消双击事件
      // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      //   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      // );
      //设置homebutton的位置
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE =new Cesium.Rectangle.fromDegrees(
        110.15,
        34.54,
        110.25,
        34.56
      ); //Rectangle(west, south, east, north)
      //设置初始位置

      // 设置目标位置的经纬度和高度
      var destination = new Cesium.Cartesian3.fromDegrees(...this.config.fromDegrees);

      //开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;

      var orientation = {
        heading: Cesium.Math.toRadians(0), // 水平方向的旋转角度
        pitch: Cesium.Math.toRadians(-90), // 俯仰角度
        roll: 0 // 翻滚角度
      };
      //摄像机飞入操作，设置目标点和相机角度，以及整个过程的动画时长，Cesium会根据整个动画时长来设置飞入动画的整个事件进度
      // viewer.camera.setView({
      //   destination,
      // });

      viewer.camera.flyTo({
        destination: destination,
        orientation: orientation,
        duration: 5, // 过渡动画的持续时间(秒)
        //飞完之后设置相机的角度
        complete: () => {
          this.$emit("cesiumMounted", viewer);
        },
      })

    },
  },
};
</script>
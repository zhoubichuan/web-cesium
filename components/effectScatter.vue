<template>
  <div class="map" ref="cesiumContainer"></div>
</template>

<script>
export default {
  name: "WebCesium2",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let osm = new Cesium.UrlTemplateImageryProvider({
        url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
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
      });

      //取消双击事件
      //viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      //设置homebutton的位置
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        116.15,
        40.54,
        116.25,
        40.56
      ); //Rectangle(west, south, east, north)
      //设置初始位置
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.2, 40.55, 3000000),
      });

      //开启深度检测
      //viewer.scene.globe.depthTestAgainstTerrain = true;

      let tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: this.$withBase("/Source/3DTiles/building/tileset.json"),
        })
      );

      //创建平移矩阵方法
      // let translation = Cesium.Cartesian3.fromArray([2000000, 2000000, 100000]);
      // m = Cesium.Matrix4.fromTranslation(translation);
      // tileset._modelMatrix = m;

      //
      let params = {
        tx: 110.5, //模型中心X轴坐标（经度，单位：十进制度）
        ty: 30, //模型中心Y轴坐标（纬度，单位：十进制度）
        tz: 1120, //模型中心Z轴坐标（高程，单位：米）
        rx: 60, //X轴（经度）方向旋转角度（单位：度）
        ry: 30, //Y轴（纬度）方向旋转角度（单位：度）
        rz: 0, //Z轴（高程）方向旋转角度（单位：度）
      };
      //平移、贴地、旋转模型
      function update3dtilesMaxtrix(tileset) {
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(
          params.tx,
          params.ty,
          params.tz
        );
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }

      viewer.scene.primitives.add(tileset);

      tileset.readyPromise
        .then(function (tileset) {
          viewer.scene.primitives.add(tileset);
          viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(
              0.5,
              -0.2,
              tileset.boundingSphere.radius * 1.0
            )
          );
          //平移、贴地、旋转模型
          update3dtilesMaxtrix(tileset);
        })
        .otherwise(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
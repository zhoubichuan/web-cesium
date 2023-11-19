<template>
  <div>
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
/*备注说明:配置底图列表 
 *type代表地图服务类型(0代表ArcGisMapServerImageryProvider;
      1代表createOpenStreetMapImageryProvider; 
      2代表WebMapTileServiceImageryProvider;
      3代表createTileMapServiceImageryProvider; 
      4代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr) 
  *proxyUrl代理请求服务 
  *iconUrl图标 
  *name显示名称 
  *Url地图Url 
*/

// [
//   //{"id":0,"label":"广东影像",className:"imgType",type:5,proxyUrl:'',Url:'http://gisserver:18081/geoserver/gwc/service/wms',credit:'wms服务',layers: 'GD:GDImage',tilingScheme:new Cesium.WebMercatorTilingScheme()},
//   //{"id":1,"label":"广东海图",className:"vecType",type:5,proxyUrl:'',Url:'http://gisserver:18081/geoserver/gwc/service/wms',credit:'wms服务',layers: 'GD:SeaMap',tilingScheme:new Cesium.WebMercatorTilingScheme()},
//   {"id":0,"label":"广东影像",className:"imgType",type:0,proxyUrl:GLOBAL.domainRest+'/mapproxy/support',Url:'http://GISSERVER:6080/arcgis/rest/services/GDImage/MapServer'},
//   {"id":1,"label":"广东海图",className:"vecType",type:0,proxyUrl:GLOBAL.domainRest+'/mapproxy/support',Url:'http://GISSERVER:6080/arcgis/rest/services/SeaMap/MapServer'},
//   {"id":2,"label":"影像图",className:"imgType",type:0,proxyUrl:'',Url:'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'},
//   {"id":3,"label":"街道图",className:"vecType",type:0,proxyUrl:'',Url:'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer'},
//   {"id":4,"label":"WMS",className:"imgType",type:5,proxyUrl:'',Url:'http://gisserver:18081/geoserver/gwc/service/wms',credit:'wms服务',layers: 'GD:GDImage',tilingScheme:new Cesium.WebMercatorTilingScheme()},
//   {"id":5,"label":"OSM",className:"vecType",type:1,proxyUrl:'',Url:'https://a.tile.openstreetmap.org/'},
//   {"id":6,"label":"天地街道",className:"vecType",type:2,proxyUrl:'',Url:'http://t{l}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',layer: 'tdtVecBasicLayer',style: 'default',format: 'image/jpeg',tileMatrixSetID:'tdtMap'},
//   {"id":7,"label":"天地影像",className:"imgType",type:2,proxyUrl:'',Url:'http://t{l}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',layer: 'tdtImgBasicLayer',style: 'default',format: 'image/jpeg',tileMatrixSetID:'tdtMap'},
// ]
export default {
  name: "WebCesium",

  mounted() {
    this.init();
  },

  methods: {
    init() {
      let viewer = new Cesium.Viewer(this.$refs.map, {
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        }),
        baseLayerPicker: false,
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏图层选择控件
        fullscreenButton: false, // 隐藏全屏按钮
        vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: false, // 隐藏Home按钮
        infoBox: false, // 隐藏点击要素之后显示的信息窗口
        sceneModePicker: false, // 隐藏场景模式选择控件
        selectionIndicator: true, // 显示实体对象选择框，默认true
        timeline: false, // 隐藏时间线控件
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        shouldAnimate: true, // 开启动画自动播放
        sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
        requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
        // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
        maximumRenderTimeChange: Infinity,
      });
      var layers = viewer.scene.imageryLayers;
      var blackMarble = layers.addImageryProvider(
        new Cesium.createTileMapServiceImageryProvider({
          url: "//cesiumjs.org/tilesets/imagery/blackmarble",
          maximumLevel: 8,
          credit: "Black Marble imagery courtesy NASA Earth Observatory",
        })
      );
      blackMarble.alpha = 0.5; // 0.0  全透明.  1.0 不透明.
      blackMarble.brightness = 2.0; // > 1.0 增加亮度  < 1.0减少亮度
      layers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "../images/Cesium_Logo_overlay.png",
          rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
        })
      );

      // 隐藏下方Cesium logo
      viewer.cesiumWidget.creditContainer.style.display = "none";
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
html,
body,
.map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
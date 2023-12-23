<template>
  <div class="map" ref="cesiumContainer"></div>
</template>

<script>
export default {
  name: "WebCesium",
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
      var viewer = new Cesium.Viewer(this.$refs.cesiumContainer);
      var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles",
        requestVertexNormals: true,
        requestWaterMask: true,
        ...this.config
      });
      viewer.terrainProvider = terrainProvider;
    },
  },
};
</script>
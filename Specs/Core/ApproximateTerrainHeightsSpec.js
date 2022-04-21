defineSuite([
    'Core/ApproximateTerrainHeights',
    'Core/Cartesian3',
    'Core/Math',
    'Core/Rectangle'
], function(
    ApproximateTerrainHeights,
    Cartesian3,
    CesiumMath,
    Rectangle) {
    'use strict';

    beforeAll(function() {
        return ApproximateTerrainHeights.initialize();
    });

    afterAll(function() {
        ApproximateTerrainHeights._initPromise = undefined;
        ApproximateTerrainHeights._terrainHeights = undefined;
    });

    it('initializes', function() {
        return ApproximateTerrainHeights.initialize()
            .then(function() {
                expect(ApproximateTerrainHeights._terrainHeights).toBeDefined();
            });
    });

    it('getMinimumMaximumHeights computes minimum and maximum terrain heights', function() {
        var result = ApproximateTerrainHeights.getMinimumMaximumHeights(Rectangle.fromDegrees(-121.0, 10.0, -120.0, 11.0));
        expect(result.minimumTerrainHeight).toEqualEpsilon(-476.125711887558, CesiumMath.EPSILON10);
        expect(result.maximumTerrainHeight).toEqualEpsilon(-28.53441619873047, CesiumMath.EPSILON10);
    });

    it('getMinimumMaximumHeights throws with no rectangle', function() {
        expect(function() {
            return ApproximateTerrainHeights.getMinimumMaximumHeights();
        }).toThrowDeveloperError();
    });

    it('getMinimumMaximumHeights throws if ApproximateTerrainHeights was not initialized first', function() {
        var heights = ApproximateTerrainHeights._terrainHeights;
        ApproximateTerrainHeights._terrainHeights = undefined;
        expect(function() {
            return ApproximateTerrainHeights.getMinimumMaximumHeights(Rectangle.fromDegrees(-121.0, 10.0, -120.0, 11.0));
        });
        ApproximateTerrainHeights._terrainHeights = heights;
    });

    it('getBoundingSphere computes a bounding sphere', function() {
        var result = ApproximateTerrainHeights.getBoundingSphere(Rectangle.fromDegrees(-121.0, 10.0, -120.0, 11.0));
        expect(result.center).toEqualEpsilon(new Cartesian3(-3183013.8480289434, -5403772.557261968, 1154581.5817616477), CesiumMath.EPSILON10);
        expect(result.radius).toEqualEpsilon(77884.16539096291, CesiumMath.EPSILON10);
    });

    it('getBoundingSphere throws with no rectangle', function() {
        expect(function() {
            return ApproximateTerrainHeights.getBoundingSphere();
        }).toThrowDeveloperError();
    });

    it('getBoundingSphere throws if ApproximateTerrainHeights was not initialized first', function() {
        var heights = ApproximateTerrainHeights._terrainHeights;
        ApproximateTerrainHeights._terrainHeights = undefined;
        expect(function() {
            return ApproximateTerrainHeights.getBoundingSphere(Rectangle.fromDegrees(-121.0, 10.0, -120.0, 11.0));
        });
        ApproximateTerrainHeights._terrainHeights = heights;
    });
});

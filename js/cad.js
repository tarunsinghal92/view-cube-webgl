var gui = new dat.GUI();
var camera, scene, renderer, mesh, stats;
var camera_angle = {
    x: 0,
    y: 0,
    z: 90
}
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 60;

    scene = new THREE.Scene();

    // world
    mesh = new THREE.Object3D();
    mesh.add(new THREE.LineSegments(
        new THREE.Geometry(),
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        })
    ));

    mesh.add(new THREE.Mesh(
        new THREE.Geometry(),
        new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        })
    ));
    var options = chooseFromHash(mesh);
    // mesh.rotation.x = -1.57;
    scene.add(mesh);

    // lights
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    // axisHelper
    var axisHelper = new THREE.AxisHelper(5);
    scene.add(axisHelper);

    //camera helper
    // var helper = new THREE.CameraHelper(camera);
    // scene.add(helper);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.domElement.id = 'cad-zone';
    document.body.appendChild(renderer.domElement);

    //control the orbital camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
}

function animate() {
    TWEEN.update();
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function rotate_cad(rotationVector) {
    mesh.rotation.x = rotationVector.x;
    mesh.rotation.y = rotationVector.y;
    mesh.rotation.z = rotationVector.z;
}

function change_cad_camera(data) {
    // console.log(data.delta_angle);
    /**
     * change camera position
     *
     * x = r sinq cosf,     y = r sinq sinf,     z = r cosq,
     * r = (x2 + y2 + z2)1/2,     q =tan-1(z/(x2+y2)1/2),     f = tan-1(y/x).
     * http://electron9.phys.utk.edu/vectors/3dcoordinates.htm
     */
    var c_pos = JSON.parse(JSON.stringify(camera.position));

    // console.log(c_pos); console.log(radius);
    if (data.delta_angle.z != 0) {
        //initial angle
        var iangle = toRadians(camera_angle.z);

        //final angle
        var fangle = iangle + toRadians(data.delta_angle.z);
        camera_angle.z = toDegree(fangle);

        //get radius
        var radius = Math.sqrt(c_pos.x * c_pos.x + c_pos.y * c_pos.y);

        //modify the point
        c_pos.x = radius * Math.cos(fangle);
        c_pos.y = radius * Math.sin(fangle);

        //debug
        console.log(data.delta_angle);
        console.log(camera.position);
        console.log(c_pos);
        console.log('z:' + toDegree(iangle) + '=>' + toDegree(fangle));
    }
    if (data.delta_angle.x != 0) {
        //initial angle
        var iangle = toRadians(camera_angle.x);

        //final angle
        var fangle = iangle + toRadians(data.delta_angle.x);
        camera_angle.x = toDegree(fangle);

        //get radius
        var radius = Math.sqrt(c_pos.z * c_pos.z + c_pos.y * c_pos.y);

        //modify the point
        c_pos.y = radius * Math.cos(fangle);
        c_pos.z = radius * Math.sin(fangle);

        //debug
        console.log(camera.position);
        console.log(c_pos);
        console.log('x:' + toDegree(iangle) + '=>' + toDegree(fangle));
    }
    if (data.delta_angle.y != 0) {
        //initial angle
        var iangle = toRadians(camera_angle.y);

        //final angle
        var fangle = iangle + toRadians(data.delta_angle.y);
        camera_angle.y = toDegree(fangle);

        //get radius
        var radius = Math.sqrt(c_pos.x * c_pos.x + c_pos.z * c_pos.z);

        //modify the point
        c_pos.z = radius * Math.cos(fangle);
        c_pos.x = radius * Math.sin(fangle);

        //debug
        console.log(camera.position);
        console.log(c_pos);
        console.log('y:' + toDegree(iangle) + '=>' + toDegree(fangle));
    }

    //take camera to new point with animation
    tweenCamera(c_pos);
}

function tweenCamera(position) {
    // Position the camera to fit
    var tween = new TWEEN.Tween(camera.position).to({
        x: position.x,
        y: position.y,
        z: position.z,
    }).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }).start();
}

function toDegree(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

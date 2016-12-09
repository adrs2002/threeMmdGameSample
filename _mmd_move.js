//書き足したコード置き場


var container, stats;

var mesh, camera, scene, renderer;
var mixer;

var A_stand, A_wark, A_run, A_atk;

var ready = false;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();
var keikokuDiv = null;

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.set(0,5,25);
	camera.lookAt(new THREE.Vector3(0,5,0));

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0x887766);
    directionalLight.position.set(-1, 1, 1).normalize();
    scene.add(directionalLight);

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xffffff));
    container.appendChild(renderer.domElement);

    // model
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };

    var modelFile = 'contents/tiny/tiny_v300.pmx';
    var vmdFiles = ['contents/vmd/run_a.vmd' /*, 'contents/vmd/atk2.vmd' ,  'contents/vmd/wark_a.vmd', 'contents/vmd/run_a.vmd'*/ ];
    var stageFile = 'https://threejs.org/examples/models/mmd/stage/stage.pmd';

    var loader = new THREE.MMDLoader();
    loader.setDefaultTexturePath('https://threejs.org/examples/models/mmd/default/');

    loader.load(modelFile, vmdFiles, function (object) {

        mesh = object;
		
		mixer = new THREE.AnimationMixer(mesh);
		A_stand =  mixer.clipAction(mesh.geometry.animations[0]);
		A_stand.play();
		
            
        loader.loadModel(stageFile, function (stage) {

            scene.add(stage);
            scene.add(mesh);

            ready = true;
        }, onProgress, onError);

		
    }, onProgress, onError);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    helper.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

// easy mobile device detection
function isMobileDevice() {

    if (navigator === undefined || navigator.userAgent === undefined) {

        return true;

    }

    var s = navigator.userAgent;

    if (s.match(/iPhone/i)
        //				     || s.match( /iPad/i )
        || s.match(/iPod/i)
        || s.match(/webOS/i)
        || s.match(/BlackBerry/i)
        || (s.match(/Windows/i) && s.match(/Phone/i))
        || (s.match(/Android/i) && s.match(/Mobile/i))) {

        return true;

    }

    return false;

}

/////////////////////////////////


function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {


    if (ready) {

        var delta = clock.getDelta();
        mixer.update(delta);

    }
    renderer.render(scene, camera);
}



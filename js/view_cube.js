window.log = function() {
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};

// Namespace
var ViewCube = ViewCube || {};

ViewCube = (function() {
    'use_strict';

    // default rotation on every click event
    var configuration = {};

    // variable to store rotation of view cube
    var angle = {
        x: 0,
        y: 0,
        z: 0
    };
    // var angle = {
    //     x: -30,
    //     y: 45,
    //     z: 0
    // };

    //change in angles
    var delta_angle = {
        x: 0,
        y: 0,
        z: 0
    }

    // default rotation on every click event
    var rotation_angle = 30;

    // is draggable or not
    var is_draggable = false;

    // main setup
    var setup = function(config = {}) {

        //set configuration
        set_configuration(config);

        //prepare & append the dube dom in html
        $('body').append(get_viewcube_html());

        //event handlers arrows
        $('#controls [class*=rotate]').click(rotate_click_events);

        //event handlers for views
        $('#view_dropdown_container .vc_views li, #cube figure').click(set_view);

        //set drag/drop
        if (is_draggable) $('#view_cube').draggable();
    }

    /**
     * return required information
     */
    function get_viewcube_data() {
        return {
            current_angle: angle,
            delta_angle: delta_angle,
            configuration: configuration
        };
    }

    /**
     * set configuration
     */
    function set_configuration(config) {
        configuration = config;
        if (typeof config.rotation_angle !== 'undefined') {
            rotation_angle = config.rotation_angle;
        }
        if (typeof config.is_draggable !== 'undefined') {
            is_draggable = config.is_draggable;
        }
    }

    /**
     * handler for rotate events
     */
    function rotate_click_events(event) {
        switch (event.target.className) {
            case 'rotate-x-cw':
                set_rotation(angle.x + rotation_angle, angle.y, angle.z);
                break;
            case 'rotate-x-acw':
                set_rotation(angle.x - rotation_angle, angle.y, angle.z);
                break;
            case 'rotate-y-cw':
                set_rotation(angle.x, angle.y + rotation_angle, angle.z);
                break;
            case 'rotate-y-acw':
                set_rotation(angle.x, angle.y - rotation_angle, angle.z);
                break;
            case 'rotate-z-cw':
                set_rotation(angle.x, angle.y, angle.z + rotation_angle);
                break;
            case 'rotate-z-acw':
                set_rotation(angle.x, angle.y, angle.z - rotation_angle);
                break;
            default:
        }
    }

    /**
     * set rotation angle in var
     */
    function set_rotation(x, y, z) {

        //store old angle values
        var old_angle = JSON.parse(JSON.stringify(angle));

        // todo stabalize fast rotation
        angle.x = x;
        angle.y = y;
        angle.z = z;

        //store delta angle [new - old]
        delta_angle.x = old_angle.x - angle.x;
        delta_angle.y = old_angle.y - angle.y;
        delta_angle.z = old_angle.z - angle.z;

        //rotate
        rotate_cube(angle);

        //its the time for callback
        configuration.callback(get_viewcube_data());
    }

    /**
     * main function that rotate the cube
     */
    function rotate_cube(angle) {
        $('#cube').css("-webkit-transform", "translateZ( -50px) rotateX(" + angle.x + "deg) rotateY(" + angle.y + "deg) rotateZ(" + angle.z + "deg)");
        $('#cube').css("-moz-transform", "translateZ( -50px) rotateX(" + angle.x + "deg) rotateY(" + angle.y + "deg) rotateZ(" + angle.z + "deg)");
        $('#cube').css("-o-transform", "translateZ( -50px) rotateX(" + angle.x + "deg) rotateY(" + angle.y + "deg) rotateZ(" + angle.z + "deg)");
        $('#cube').css("transform", "translateZ( -50px) rotateX(" + angle.x + "deg) rotateY(" + angle.y + "deg) rotateZ(" + angle.z + "deg)");
    }

    /**
     * definition of angles for different views
     */
    function set_view(event) {
        console.log(event);
        switch (event.target.className) {
            case 'default':
                set_rotation(-30, 45, 0); //isometric
                break;
            case 'isometric':
                set_rotation(-30, 45, 0);
                break;
            case 'trimetric':
                set_rotation(-30, 30, 0);
                break;
            case 'dimetric':
                set_rotation(-15, 45, 0);
                break;
            case 'zoom-to-fit':
                // write webgl func
                break;
            case 'front':
                set_rotation(0, 0, 0);
                break;
            case 'back':
                set_rotation(-180, 0, 0);
                break;
            case 'top':
                set_rotation(-90, 0, 0);
                break;
            case 'bottom':
                set_rotation(90, 0, 0);
                break;
            case 'left':
                set_rotation(90, 0, 0);
                break;
            case 'right':
                set_rotation(-90, 0, 0);
                break;
            default:
        }
    }

    /**
     * get html
     */
    function get_viewcube_html() {
        var html = '<link rel="stylesheet" href="./css/view_cube.css" media="screen"> \
                    <div id="view_cube"> \
                    <section id="controls"> \
                        <div class="rotate-x-cw"></div> \
                        <div class="rotate-x-acw"></div> \
                        <div class="rotate-y-cw"></div> \
                        <div class="rotate-y-acw"></div> \
                        <div class="rotate-z-cw"></div> \
                        <div class="rotate-z-acw"></div> \
                        <div id="view_dropdown_container"> \
                            <ul> \
                                <li> \
                                    <a class="dropdown"></a> \
                                    <ul class="vc_views"> \
                                        <li class="default"> Default View </li> \
                                        <li class="separator"></li> \
                                        <li class="front"> Front View </li> \
                                        <li class="top"> Top View </li> \
                                        <li class="left"> Left View </li> \
                                        <li class="right"> Right View </li> \
                                        <li class="bottom"> Bottom View </li> \
                                        <li class="back"> Back View </li> \
                                        <li class="separator"></li> \
                                        <li class="isometric"> Isometric View </li> \
                                        <li class="dimetric"> Dimetric View </li> \
                                        <li class="trimetric"> Trimetric View </li> \
                                        <li class="separator"></li> \
                                        <li class="zoom-to-fit"> Zoom To Fit </li> \
                                    </ul> \
                                </li> \
                            </ul> \
                        </div> \
                    </section> \
                    <section class="container"> \
                        <div id="cube" class="show-front"> \
                            <figure class="front">front</figure> \
                            <figure class="back">back</figure> \
                            <figure class="right">right</figure> \
                            <figure class="left">left</figure> \
                            <figure class="top">top</figure> \
                            <figure class="bottom">bottom</figure> \
                        </div> \
                    </section> \
                </div>';
        return html;
    }

    // PUBLIC INTERFACE
    return {
        init: function(config) {
            setup(config);
        },
        get_data: function() {
            return get_viewcube_data();
        }
    };
})();

//launch view cube
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        ViewCube.init({
            'is_draggable': false,
            'rotation_angle': 30,
            'callback': change_cad_camera
        });
    }
};

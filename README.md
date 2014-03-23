##ng-media [![Build Status](https://travis-ci.org/caitp/ng-media.svg?branch=master)](https://travis-ci.org/caitp/ng-media) [![devDependency Status](https://david-dm.org/caitp/ng-media/dev-status.svg?branch=master)](https://david-dm.org/caitp/ng-media#info=devDependencies)

###[AngularJS](http://angularjs.org/) support for HTML5 media elements

ng-media provides a simple, declarative means for using HTML5 audio and video elements.

A simple example:

```html
<div data-html5-video="movies/easterbunny.mp4"
     track="captions/easterbunny.vtt"
     controls="true">
  <p class="bordered-text">
    HTML, including custom video controls, can be overlayed easily over the
    video frame.
  </p>
</div>
```

More advanced features are also possible:

```js
$scope.videoSources = [{
  src: "media/farmville.webm",
  type: "video/webm",
  media: "screen"
}, 'media/farmville.mp4'];

$scope.videoTracks = {
  src: "captions/moocow.vtt",
  kind: "captions",
  type: "text/vtt"
};
```

```html
<script type="text/ng-template" id="customControls.tpl">
  <div class="custom-controls">
    <button ng-click="video.$play()">Play Button</button>
    <button ng-click="video.$pause()">Pause Button</button>
    <!-- Volume controls -->
    <input ng-init="vol=1" type="range" min="0" max="1" step="0.05"
           ng-model="vol" ng-change="video.$volume(vol)" />
  </div>
</script>
<div data-html5-video="videoSources"
     track="videoTracks"
     controls-url="customControls.tpl"></div>
```

**coming soon**

- Register handlers for media events
- Improved video controller API
- Integrated support for playlists
- Audio directive
- Live demo
- ngdocs page

**hopefully some day**

- DSP effects (one can dream!)
- WebRTC support

###Contributing

Pull requests, bug reports and suggestions are quite welcome.

Code submissions should follow the [Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml), and each and every new feature or bug fix should incorporate one or more meaningful tests to assist in preventing future regressions.

###License

The MIT License (MIT)

Copyright (c) 2013 Caitlin Potter & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

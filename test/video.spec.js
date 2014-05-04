describe('html5Video', function() {
  var element;


  afterEach(function() {
    element.remove();
    element = null;
  });


  describe('overlay', function() {
    it('should match the dimensions of video', inject(function($compile, $document, $rootScope) {
      element = $compile('<div data-html5-video="test.ts" width="640" height="360"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $rootScope.$digest();
      var overlay = element.children('div')[0];
      expect(overlay.offsetWidth).toEqual(640);
      expect(overlay.offsetHeight).toEqual(360);
    }));


    it('should have directive child nodes inserted into it', inject(function($compile, $rootScope) {
      element = $compile('<div data-html5-video="test.mp4"><p>Transcluded Node</p></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('p').length).toEqual(1);
      expect(element.find('p').text()).toEqual('Transcluded Node');
    }));
  });


  describe('controls', function() {
    angular.forEach(['', 'true', '1', 'NaN', 'null', 'undefined'], function(value) {
      it('should set video.controls=true if controls="' + value + '"', inject(function($compile, $rootScope) {
        element = $compile('<div data-html5-video="test.vp8" controls="'+value+'"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.find('video').prop('controls')).toEqual(true);
      }));
    });


    angular.forEach(['0', 'false'], function(value) {
      it('should set video.controls=false if controls="' + value + '"', inject(function($compile, $rootScope) {
        element = $compile('<div data-html5-video="test.vp8" controls="'+value+'"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.find('video').prop('controls')).toBeFalsy();
      }));
    });


    it('should set video.controls=false if controls-url supplied', inject(function($compile, $httpBackend, $rootScope) {
      $httpBackend.expectGET('ctrl.tpl').respond('');
      element = $compile('<div data-html5-video="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('video').prop('controls')).toBeFalsy();
    }));


    it('should inject html5VideoController into controls template as `video`', inject(function($compile, $document, $httpBackend, $rootScope) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls"></div>');
      element = $compile('<div data-html5-video="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();
      var controls = angular.element(document.getElementById('controls'));
      expect(controls.scope().video).toEqual(element.controller('html5Video'));
    }));


    it('should $compile directives in controls-url template', inject(function($compile, $document, $httpBackend, $rootScope) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;" ng-click="video.$play()"></div>');
      element = $compile('<div data-html5-video="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();
      var controller = element.controller('html5Video'),
          video = element.find('video')[0];
      spyOn(controller, '$play');
      var controls = angular.element(document.getElementById('controls'));
      controls.triggerHandler('click');
      expect(controller.$play).toHaveBeenCalled();
    }));


    it('should play video when video.$play() called', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;" ng-click="video.$play()"></div>');
      element = $compile('<div data-html5-video="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      spyOn(video, 'play');

      var controls = angular.element(document.getElementById('controls'));
      controls.triggerHandler('click');

      expect(video.play).toHaveBeenCalled();
    }));


    it('should load video when video.$play() called with new source', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;" ng-click="video.$play()"></div>');
      element = $compile('<div data-html5-video src="source" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      spyOn(video, 'load');

      $rootScope.source = "test.vp8";
      $rootScope.$digest();

      var controls = angular.element(document.getElementById('controls'));
      controls.triggerHandler('click');

      expect(video.load).toHaveBeenCalled();
    }));


    it('should pause video when video.$pause() called', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;" ng-click="video.$pause()"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      video.play();
      spyOn(video, 'pause');

      var controls = angular.element(document.getElementById('controls'));
      controls.triggerHandler('click');

      expect(video.pause).toHaveBeenCalled();
    }));


    it('should report playback status when video.$paused() called', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;" ng-click="video.$pause()"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      expect(videoCtrl.$paused()).toBe(true);
      video.play();

      expect(videoCtrl.$paused()).toBe(false);

      controls.triggerHandler('click');
      expect(videoCtrl.$paused()).toBe(true);
    }));


    it('should report playback rate when video.$playbackRate() called with no arguments', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();

      expect(videoCtrl.$playbackRate()).toBe(1);
    }));


    it('should set playback rate when video.$playbackRate() called with value', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();
      videoCtrl.$playbackRate(0.5);
      
      expect(videoCtrl.$playbackRate()).toBe(0.5);
    }));


    it('should report playback volume when video.$volume() called with no arguments', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();

      expect(videoCtrl.$volume()).toBe(1);
    }));


    it('should set playback volume when video.$volume() called with value', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();
      videoCtrl.$volume(0.5);
      
      expect(videoCtrl.$volume()).toBe(0.5);
    }));


    it('should report muted status when video.$mute() called with no arguments', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();

      expect(videoCtrl.$mute()).toBe(false);
    }));


    it('should mute volume when video.$mute() called with truthy value', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();
      videoCtrl.$mute({});
      expect(videoCtrl.$mute()).toBe(true);
      videoCtrl.$mute(true);
      expect(videoCtrl.$mute()).toBe(true);
      videoCtrl.$mute("0");
      expect(videoCtrl.$mute()).toBe(true);
    }));


    it('should unmute volume when video.$mute() called with falsy value', inject(function($compile, $rootScope, $httpBackend, $document) {
      $httpBackend.expectGET('ctrl.tpl').respond('<div id="controls" style="width: 100px; height: 100px;"></div>');
      element = $compile('<div data-html5-video src="test.vp8" controls="true" controls-url="ctrl.tpl"></div>')($rootScope, function(dom) {
        $document.find('body').prepend(dom);
      });
      $httpBackend.flush();
      $rootScope.$digest();

      var video = element.find('video')[0];
      var controls = angular.element(document.getElementById('controls'));
      var videoCtrl = controls.scope().video;

      video.play();
      videoCtrl.$mute(false);
      expect(videoCtrl.$mute()).toBe(false);
      videoCtrl.$mute(null);
      expect(videoCtrl.$mute()).toBe(false);
      videoCtrl.$mute("");
      expect(videoCtrl.$mute()).toBe(false);
      videoCtrl.$mute(undefined);
      expect(videoCtrl.$mute()).toBe(false);
    }));
  });


  describe('sources', function() {
    angular.forEach(['html5-video', 'src'], function(attr) {
      angular.forEach({
        'as a string literal': {
          value: "test.vp9",
          expected: [{ src: "test.vp9$" }]
        },
        'as an interpolated string': {
          setup: function(scope) { scope.source = "test.vp9"; },
          value: "{{source}}",
          expected: [{ src: "test.vp9$" }]
        },
        'as a scope value': {
          setup: function(scope) { scope.test = { vp9: "test.vp8" }; },
          value: "test.vp9",
          expected: [{ src: "test.vp8$" }]
        },
        'as an object': {
          value: "{src: 'test.webm', type: 'video/webm' }",
          expected: [ { src: "test.webm$", type: "video/webm" }]
        },
        'as an array of strings': {
          value: "['test.vp8', 'test.ts']",
          expected: [ { src: "test.vp8$" }, { src: "test.ts" }]
        },
        'as an array of objects': {
          value: "[{src: 'test.webm', type: 'video/webm' }, {src: 'test.mp4', type: 'video/mp4' }]",
          expected: [ { src: "test.webm$", type: "video/webm" },
                      { src: "test.mp4$", type: "video/mp4" }]
        }
      }, function(test, desc) {
        it('should support specifying sources using the `' + attr + '` attribute', inject(function($compile, $rootScope) {
          if (test.setup) {
            test.setup($rootScope);
          }
          var attrs = attr === 'src' ? 'data-html5-video src="' + test.value + '"' : 'data-html5-video="' + test.value + '"';
          element = $compile('<div ' + attrs + '></div>')($rootScope);
          $rootScope.$digest();
          var sources = element.find('source');
          expect(sources.length).toEqual(test.expected.length);
          angular.forEach(test.expected, function(e, i) {
            var source = sources.eq(i);
            if (typeof e.src === 'string') {
              expect(source.attr('src')).toMatch(e.src);
            }
            if (typeof e.type === 'string') {
              expect(source.attr('type')).toEqual(e.type);
            }
          });
        }));
      });
    });


    it('should update sources when interpolated value changes', inject(function($compile, $rootScope) {
      $rootScope.source = "test1.mp4";
      element = $compile('<div data-html5-video src="{{source}}"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('source').length).toEqual(1);
      expect(element.find('source').prop('src')).toMatch(/test1\.mp4$/);
      $rootScope.$apply(function() { $rootScope.source = 'test2.vp8'; });
      expect(element.find('source').length).toEqual(1);
      expect(element.find('source').prop('src')).toMatch(/test2\.vp8$/);
    }));


    it('should update sources when parsed value changes', inject(function($compile, $rootScope) {
      $rootScope.source = "test1.mp4";
      element = $compile('<div data-html5-video src="source"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('source').length).toEqual(1);
      expect(element.find('source').prop('src')).toMatch(/test1\.mp4$/);
      $rootScope.$apply(function() { $rootScope.source = 'test2.vp8'; });
      expect(element.find('source').length).toEqual(1);
      expect(element.find('source').prop('src')).toMatch(/test2\.vp8$/);
    }));


    it('should remove falsy sources from sources', inject(function($compile, $rootScope) {
      $rootScope.sources = ['', null, false, undefined];
      element = $compile('<div data-html5-video src="sources"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('source').length).toBe(0);
    }));
  });

  describe('tracks', function() {
    angular.forEach({
      'as a string literal': {
        value: "test.vtt",
        expected: [{ src: "test.vtt$", kind: "subtitles" }]
      },
      'as an interpolated string': {
        setup: function(scope) { scope.source = "test.vtt"; },
        value: "{{source}}",
        expected: [{ src: "test.vtt$", kind: "subtitles" }]
      },
      'as a scope value': {
        setup: function(scope) { scope.test = { vtt: "parsed.vtt" }; },
        value: "test.vtt",
        expected: [{ src: "parsed.vtt$", kind: "subtitles" }]
      },
      'as an object': {
        value: "{src: 'test.vtt', type: 'text/vtt', kind: 'captions' }",
        expected: [ { src: "test.vtt$", type: "text/vtt", kind: "captions" }]
      },
      'as an array of strings': {
        value: "['test1.vtt', 'test2.vtt']",
        expected: [ { src: "test1.vtt$", kind: "subtitles" }, { src: "test2.vtt$", kind: "subtitles" }]
      },
      'as an array of objects': {
        value: "[{src: 'test.vtt', type: 'text/vtt', kind: 'captions' }, {src: 'test2.vtt', type: 'text/vtt' }]",
        expected: [ { src: "test.vtt$", type: "text/vtt", kind: "captions" },
                    { src: "test2.vtt$", type: "text/vtt", kind: "subtitles" }]
      }
    }, function(test, desc) {
      it('should support specifying tracks using the `track` attribute', inject(function($compile, $rootScope) {
        if (test.setup) {
          test.setup($rootScope);
        }
        var attrs = 'data-html5-video="test.mp4" track="' + test.value + '"';
        element = $compile('<div ' + attrs + '></div>')($rootScope);
        $rootScope.$digest();
        var tracks = element.find('track');
        expect(tracks.length).toEqual(test.expected.length);
        angular.forEach(test.expected, function(e, i) {
          var track = tracks.eq(i);
          if (typeof e.src === 'string') {
            expect(track.prop('src')).toMatch(e.src);
          }
          if (typeof e.kind === 'string') {
            expect(track.prop('kind')).toEqual(e.kind);
          }
          if (typeof e.type === 'string') {
            expect(track.prop('type')).toEqual(e.type);
          }
        });
      }));
    });


    it('should update tracks when interpolated value changes', inject(function($compile, $rootScope) {
      $rootScope.track = "test1.vtt";
      element = $compile('<div data-html5-video src="test.mp4" track="{{track}}"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('track').length).toEqual(1);
      expect(element.find('track').prop('src')).toMatch(/test1\.vtt$/);
      $rootScope.$apply(function() { $rootScope.track = 'test2.vtt'; });
      expect(element.find('track').length).toEqual(1);
      expect(element.find('track').prop('src')).toMatch(/test2\.vtt$/);
    }));


    it('should update tracks when parsed value changes', inject(function($compile, $rootScope) {
      $rootScope.track = "test1.vtt";
      element = $compile('<div data-html5-video src="test.vp8" track="track"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('track').length).toEqual(1);
      expect(element.find('track').prop('src')).toMatch(/test1\.vtt$/);
      $rootScope.$apply(function() { $rootScope.track = 'test2.vtt'; });
      expect(element.find('track').length).toEqual(1);
      expect(element.find('track').prop('src')).toMatch(/test2\.vtt$/);
    }));


    it('should remove falsy sources from tracks', inject(function($compile, $rootScope) {
      $rootScope.tracks = ['', null, false, undefined];
      element = $compile('<div data-html5-video src="test.vp8" track="tracks"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('track').length).toBe(0);
    }));


    describe('overlayUrl', function() {
      it('should replace inline overlay with template', inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('overlay.html', '<p>This is overlay from template</p>');
        element = $compile('<div data-html5-video data-overlay-url="overlay.html"><span>derp</span></div>')($rootScope);
        $rootScope.$digest();
        expect(element.find('span').length).toBe(0);
        expect(element.find('p').length).toBe(1);
        expect(element.find('p').text()).toBe('This is overlay from template');
      }));
    });
  });


  describe('preload', function() {
    it('should be databound', inject(function($compile, $rootScope) {
      element = $compile('<div data-html5-video preload="$preload"></div>')($rootScope);
      $rootScope.$preload = 'metadata';
      $rootScope.$digest();
      var video = element.find('video')[0];

      expect(video.preload).toBe('metadata');

      $rootScope.$preload = 'none';
      $rootScope.$digest();

      expect(video.preload).toBe('none');
    }));


    it('should treat `false` as `none`', inject(function($compile, $rootScope) {
      element = $compile('<div data-html5-video preload="$preload"></div>')($rootScope);
      $rootScope.$preload = false;
      $rootScope.$digest();
      var video = element.find('video')[0];

      expect(video.preload).toBe('none');
    }));


    it('should treat `true` as `auto`', inject(function($compile, $rootScope) {
      element = $compile('<div data-html5-video preload="$preload"></div>')($rootScope);
      $rootScope.$preload = true;
      $rootScope.$digest();
      var video = element.find('video')[0];

      expect(video.preload).toBe('auto');
    }));
  });
});

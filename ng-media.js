(function(window, document, undefined) {'use strict';

var html5VideoController = [
  '$scope',
  '$injector',
  '$attr',
  'directiveName',
  'element',
  'video',
  'overlay', function($scope, $injector, $attr, directiveName, element, video, overlay) {
  var $parse = $injector.get('$parse'),
      $interpolate = $injector.get('$interpolate'),
      $http = $injector.get('$http'),
      $templateCache = $injector.get('$templateCache'),
      $compile = $injector.get('$compile');
  
  var exprs = {
    track: $parse($attr.track || ''),
    width: $parse($attr.width || ''),
    height: $parse($attr.height || ''),
    poster: $interpolate($attr.poster || '', false),
    preload: $parse($attr.preload || ''),
    autoplay: $interpolate($attr.autoplay || '', false)
  };

  var _src,
      _track,
      _poster,
      _width,
      _height,
      _autoplay,
      _preload,
      changeDetected = 0,
      srcChanging = false,
      srcChanged = false,
      trackChanged = false,
      dimensionsChanged = false,
      posterChanged = false,
      autoplayChanged = false,
      preloadChanged = false,
      _sources = [],
      _tracks = [];

  if (angular.isDefined($attr.controlsUrl) && $attr.controlsUrl.length) {
    $attr.$set('controls', undefined);
    var url;
    try {
      url = $scope.$eval($attr.controlsUrl);
    } catch (e) {}

    if (typeof url === 'undefined') {
      url = $interpolate($attr.controlsUrl, false)($scope);
    }

    var videoCtrl = this;
    $http.get(url, { cache: true }).then(function(res) {
      var controlScope = $scope.$new();
      controlScope.video = videoCtrl;
      $compile(res.data)(controlScope, function(dom) {
        angular.element(element).append(dom);
      });
    });
  }

  if (angular.isDefined($attr.controls) && ['false', '0'].indexOf($attr.controls) < 0) {
    video.controls = true;
  }

  var $videoWatcher = function() {
    var src,
        track,
        width = exprs.width($scope),
        height = exprs.height($scope),
        poster = exprs.poster($scope),
        autoplay = !!exprs.autoplay($scope),
        preload = exprs.preload($scope),
        srcSource,
        trackSource;

    try {
      srcSource = $attr.src || $attr[directiveName] || '';
      src = $scope.$eval(srcSource);
    } catch (e) {}
    if (typeof src === 'undefined' && srcSource.length) {
      src = $interpolate(srcSource, false)($scope);
    }

    try {
      trackSource = $attr.track || '';
      track = $scope.$eval(trackSource);
    } catch (e) {}

    if (typeof track === 'undefined' && trackSource.length) {
      track = $interpolate(trackSource, false)($scope);
    }

    if (!angular.equals(src, _src)) {
      ++changeDetected;
      _src = src;
      srcChanged = true;
    }

    if (!angular.equals(track, _track)) {
      ++changeDetected;
      _track = track;
      trackChanged = true;
    }

    if (width !== _width) {
      ++changeDetected;
      _width = width;
      dimensionsChanged = true;
    }

    if (height !== _height) {
      ++changeDetected;
      _height = height;
      dimensionsChanged = true;
    }

    if (poster !== _poster) {
      ++changeDetected;
      _poster = poster;
      posterChanged = true;
    }

    if (autoplay !== _autoplay) {
      ++changeDetected;
      _autoplay = !!autoplay;
      autoplayChanged = true;
    }

    if (preload !== _preload) {
      ++changeDetected;
      _preload = preload;
      preloadChanged = true;
    }
    return changeDetected;
  };

  var updateSrc = function(sources) {
    angular.forEach(_sources, function(src, i) {
      (src.parentNode || src.parentElement).removeChild(src);      
    });
    _sources = [];
    var last = video.firstChild;
    angular.forEach(sources, function(_src, i) {
      var source = document.createElement('source'), src = _src;
      if (typeof _src === 'object') {
        source.type = _src.type;
        source.media = _src.media;
        src = _src.src;
      }
      if (!src) {
        source = null;
      } else {
        source.src = src;
        _sources.push(source);
        video.insertBefore(source, last);
        last = last && last.nextSibling;
      }
    });
  };

  var updateTrack = function(tracks) {
    angular.forEach(_tracks, function(track, i) {
      (track.parentNode || track.parentElement).removeChild(track);      
    });
    _tracks = [];
    angular.forEach(tracks, function(_src, i) {
      var track = document.createElement('track'), src = _src;
      if (typeof _src === 'object') {
        track.kind = _src.kind || 'subtitles';
        track.charset = _src.charset;
        track.srclang = _src.srclang;
        track.label = _src.label;
        
        track.type = _src.type;
        track.media = _src.media;
        src = _src.src;
      } else {
        track.kind = 'subtitles';
      }
      if (!src) {
        console.log("no src attribute!");
        track = null;
      } else {
        track.src = src;
        _tracks.push(track);
        video.insertBefore(track, null);
      }
    });
  };

  var $videoUpdate = function() {
    if (srcChanged) {
      updateSrc(angular.isArray(_src) ? _src : [_src]);
      srcChanging = true;
      srcChanged = false;
    }

    if (trackChanged) {
      updateTrack(angular.isArray(_track) ? _track : [_track]);
      trackChanged = false;
    }

    if (dimensionsChanged) {
      video.width = _width;
      video.height = _height;
      dimensionsChanged = false;
    }

    if (posterChanged) {
      video.poster = _poster;
      posterChanged = false;
    }

    if (autoplayChanged) {
      video.autoplay = _autoplay;
      autoplayChanged = false;
    }

    if (preloadChanged) {
      video.preload = _preload;
      preloadChanged = false;
    }
  };

  $scope.$watch($videoWatcher, $videoUpdate);

  this.$play = function() {
    if (srcChanged) {
      video.load();
      srcChanged = false;
    }
    video.play();
  };

  this.$pause = function() {
    video.pause();
  };

  this.$paused = function() {
    return video.paused;
  };

  this.$playbackRate = function(rate) {
    if (arguments.length) {
      video.playbackRate = rate;
      return this;
    } else {
      return video.playbackRate;
    }
  };

  this.$volume = function(volume) {
    if (arguments.length) {
      video.volume = volume;
      return this;
    } else {
      return video.volume;
    }
  };

  this.$mute = function(setting) {
    if (arguments.length) {
      video.muted = !!setting;
      return this;
    } else {
      return video.muted;
    }
  };
}];

var html5Video = ['$controller', '$interpolate', '$compile', '$http', '$templateCache',
function($controller, $interpolate, $compile, $http, $templateCache) {
  return {
    restrict: "A",
    transclude: true,
    template: '<div class="html5-video"></div>',
    replace: true,
    compile: function(element, attr) {
      var overlayUrl = attr.overlayUrl;
      return function($scope, $element, $attr, undefined, $transclude) {
        var video = document.createElement('video');
        var attrOverlay;
        var $overlay = angular.element('<div class="html5-video-overlay"></div>');
        if (overlayUrl) {
          $http.get($interpolate(overlayUrl, false)($scope), { cache: $templateCache })
            .success(function(tpl) {
              $overlay.html(tpl);
              $compile($overlay)($scope, function(node) {
                $element.append(node);
              });
            });
          attrOverlay = true;
        }

        $element.data('$html5VideoController', $controller('html5VideoController', {
          $scope: $scope,
          $attr: $attr,
          directiveName: 'html5Video',
          element: $element[0],
          video: video,
          overlay: $overlay[0]
        }));
        $element.append(video);
        if (!attrOverlay) {
          $element.append($overlay);
          $transclude($scope, function(dom) {
            $overlay.append(dom);
          });
        }
      };
    }
  };
}];


angular.module('media', [])
.directive({
  'html5Video': html5Video
})
.controller({
  'html5VideoController': html5VideoController
});

!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">.html5-video{position:relative;overflow:auto;display:inline-block;margin:0;}.html5-video-overlay{margin:0;position:absolute;top:0;left:0;z-index:100;background:none;overflow:hidden;pointer-events:none;width:100%;height:100%;}</style>');

})(window, document);
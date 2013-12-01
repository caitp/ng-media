//@controller html5VideoController
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
    poster: $interpolate($attr.poster || '', false)
  };

  var _src,
      _track,
      _poster,
      _width,
      _height,
      changeDetected = 0,
      srcChanging = false,
      srcChanged = false,
      trackChanged = false,
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
    }

    if (height !== _height) {
      ++changeDetected;
      _height = height;
    }

    if (poster !== _poster) {
      ++changeDetected;
      _poster = poster;
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

    video.width = _width;
    video.height = _height;
    video.poster = _poster;
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

//@directive html5Video
var html5Video = ['$controller', function($controller) {
  return {
    restrict: "A",
    transclude: true,
    template: '<div class="html5-video"></div>',
    replace: true,
    link: function($scope, $element, $attr, undefined, $transclude) {
      var video = document.createElement('video');
      var $overlay = angular.element('<div class="html5-video-overlay"></div>');
      $element.append(video);
      $element.append($overlay);

      $element.data('$html5VideoController', $controller('html5VideoController', {
        $scope: $scope,
        $attr: $attr,
        directiveName: 'html5Video',
        element: $element[0],
        video: video,
        overlay: $overlay[0]
      }));

      $transclude($scope, function(dom) {
        $overlay.append(dom);
      });
    }
  };
}];

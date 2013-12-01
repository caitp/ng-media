angular.module('media.tests', [])
.directive({
  'html5Video': html5Video
})
.controller({
  'html5VideoController': html5VideoController
});

beforeEach(function() {
  module('media.tests');
});

var linkCSS = function(path) {
  var link = document.createElement('link');
  link.href = path;
  link.rel = "stylesheet";
  link.type = "text/css";
  document.head.appendChild(link);
};

linkCSS("/base/css/video.css");

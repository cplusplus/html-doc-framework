/* Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* The <cxx-include href> element replaces itself with the contents at
 * 'href'. It doesn't use a shadow root so that the other document
 * acts exactly as part of the current document. */

(function() {
    "use strict";
    var includeProto = Object.create(HTMLElement.prototype);
    includeProto.attachedCallback = function() {
        var self = this;
        fetch(this.getAttribute('href'))
            .then(function(response) { return response.text(); })
            .then(function(text) {
                var parent = Polymer.dom(self).parentNode;
                var div = document.createElement('div');
                div.innerHTML = text;
                var nextSibling;
                for (var elem = Polymer.dom(div).firstChild; elem; elem = nextSibling) {
                    nextSibling = Polymer.dom(elem).nextSibling;
                    Polymer.dom(parent).insertBefore(elem, self);
                }
                Polymer.dom(parent).removeChild(self);
            });
    };
    document.registerElement('cxx-include', {prototype: includeProto});
})();

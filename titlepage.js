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

(function() {
    Polymer({
        is: 'cxx-titlepage',

        properties: {
            projectNumber: {
                type: Object,
                value: null,
            },
            hasDocnum: Boolean,
            hasPubdate: Boolean,
            hasEditor: Boolean,
            hasRevises: Boolean,
            title: {
                type: String,
                value: null,
            },
            stage: {
                type: String,
                value: null,
            },
            completedDomReady: {
                type: Boolean,
                value: false,
            },
        },

        // Template helpers:
        concat: function() {
            return Array.prototype.join.call(arguments, '');
        },
        stageIs: function(stage) {
            return Array.prototype.slice.call(arguments, 1).some(function(expected) {
                return stage === expected;
            });
        },

        // Other members:
        computeStage: function() {
            if (this.stage) {
                console.error('Move the document stage into a "cxx-' + this.stage +
                              '" class on <body>.');
            }

            var stages = ['draft', 'pdts', 'dts', 'ts'];
            var presentStages = stages.filter(function(stage) {
                return document.body.classList.contains('cxx-' + stage);
            });
            if (presentStages.length == 0) {
                console.error('Couldn\'t find a document stage in body.classList:', document.body.classList);
            } else if (presentStages.length > 1) {
                console.error('Found multiple document stages in body.classList:', presentStages);
            } else {
                this.stage = presentStages[0];
            }
            Polymer.dom(this).classList.add('cxx-' + this.stage);
        },

        addISOSections: function() {
            if (this.stage !== 'ts') {
                // Only include the ISO requirements in the
                // document sent for publication.
                return;
            }
            var toc = Polymer.dom(document).querySelector('cxx-toc');
            if (toc) {
                var foreword = document.createElement('cxx-foreword');
                foreword.id = 'foreword';
                document.body.insertBefore(foreword, toc.nextSibling);
            }
        },

        ready: function() {
            this.projectNumber = Polymer.dom(this).querySelector('cxx-project-number');
            this.hasDocnum = !!Polymer.dom(this).querySelector('cxx-docnum');
            var pubdate = Polymer.dom(this).querySelector('time[pubdate]');
            this.hasPubdate = !!pubdate;
            if (pubdate) {
                var splitPubdate = pubdate.textContent.split('-');
                this.pubyear = splitPubdate[0];
                this.pubmonth = splitPubdate[1];
                this.pubday = splitPubdate[2];
            }
            this.hasEditor = !!Polymer.dom(this).querySelector('cxx-editor');
            this.hasRevises = !!Polymer.dom(this).querySelector('cxx-revises');

            var title = Polymer.dom(this).querySelector('h1:lang(en)') || Polymer.dom(this).querySelector('h1');
            if (title) {
                this.title = Polymer.dom(title).textContent;
            }
            this.title_fr = Polymer.dom(this).querySelector('h2:lang(fr)');
            if (this.title_fr) {
                this.title_fr = Polymer.dom(this.title_fr).textContent;
            }

            this.computeStage();
            var stage_suffix = '';
            if (this.stage == 'draft') {
                stage_suffix = ", Working Draft";
            } else if (this.stage == 'pdts') {
                stage_suffix = ", PDTS"
            } else if (this.stage == 'dts') {
                stage_suffix = ", DTS"
            }
            if (this.title) {
                document.title = this.title + stage_suffix;
            }

            this.addISOSections();
            this.completedDomReady = true;
        },
    });
    Polymer({is: 'cxx-project-number'});
    Polymer({
        is: 'cxx-docnum',
        created: function() {
            // .docname is used to set up page headers in the PDF version.
            Polymer.dom(this).classList.add('docname');
        },
    });
    Polymer({is: 'cxx-editor'});
})();

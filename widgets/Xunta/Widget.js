

define(['dojo/_base/declare', 'jimu/BaseWidget', 'dojo/on', 'dojo/dom', 'dojo/_base/lang', 'esri/tasks/QueryTask', 'esri/tasks/query', 'esri/SpatialReference', 'esri/graphic', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Color'], function (declare, BaseWidget, on, dom, lang, QueryTask, Query, SpatialReference, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color) {
      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'xunta',
            // this property is set by the framework when widget is loaded.
            // name: 'Xunta',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function postCreate() {
                  this.inherited(arguments);
                  console.log('Xunta::postCreate');
            },

            cargaConcellos: function cargaConcellos() {

                  var codigoprovincia = this.selectProvincia.value;
                  console.log(codigoprovincia);
                  if (codigoprovincia == -1) return;

                  this.selectConcellos.innerHTML = "";

                  var myquerytask = new QueryTask(this.config.serviceUrlconcellos);
                  console.log(myquerytask);

                  var myquery = new Query();
                  myquery.returnGeometry = false;
                  myquery.outFields = ["CODCONC", "CONCELLO"];
                  myquery.orderByFields = ["CONCELLO"];
                  myquery.where = "CODPROV = " + codigoprovincia;

                  console.log(myquery);

                  myquerytask.execute(myquery, lang.hitch(this, function (result) {
                        console.log(result);

                        var opcion = document.createElement("option");
                        opcion.value = -1;
                        opcion.text = "Seleccione Concello";
                        this.selectConcellos.add(opcion);

                        for (var i = 0; i < result.features.length; i++) {
                              opcion = document.createElement("option");
                              console.log(opcion);
                              opcion.value = result.features[i].attributes.CODCONC;
                              opcion.text = result.features[i].attributes.CONCELLO;
                              this.selectConcellos.add(opcion);
                        };
                  }));
            },

            cargaParroquias: function cargaParroquias() {

                  var codigoconcello = this.selectConcellos.value;
                  console.log(codigoconcello);

                  this.selectParroquias.innerHTML = "";

                  var myquerytask2 = new QueryTask(this.config.serviceUrlparroquias);
                  console.log(myquerytask2);

                  var myquery2 = new Query();
                  myquery2.returnGeometry = false;
                  myquery2.outFields = ["CODPARRO", "PARROQUIA"];
                  myquery2.orderByFields = ["PARROQUIA"];
                  myquery2.where = "CODCONC = " + codigoconcello;

                  console.log(myquery2);

                  myquerytask2.execute(myquery2, lang.hitch(this, function (resultado) {
                        console.log(resultado);

                        var opciones = document.createElement("option");
                        opciones.text = "Seleccione Concello";
                        this.selectConcellos.add(opciones);

                        for (var i = 0; i < resultado.features.length; i++) {
                              opcion3 = document.createElement("option");
                              console.log(opcion3);
                              opcion3.value = resultado.features[i].attributes.CODPARRO;
                              opcion3.text = resultado.features[i].attributes.PARROQUIA;
                              this.selectParroquias.add(opcion3);
                        };
                  }));
            },
            zoomConcello: function zoomConcello() {

                  var codigoconcello = this.selectConcellos.value;

                  var myquerytaskC = new QueryTask(this.config.serviceUrlconcellos);

                  var zoomC = new Query();
                  zoomC.returnGeometry = true;
                  zoomC.where = "CODCONC = " + codigoconcello;
                  zoomC.outSpatialReference = new SpatialReference(102100);

                  myquerytaskC.execute(zoomC, lang.hitch(this, function (evt) {

                        console.log(evt);

                        if (evt.features.length > 0) {

                              var myconcello = evt.features[0].geometry;

                              var simbolo = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([255,0,0]), 2),new Color([254, 126, 32,0.25])
                              );

                              var grafico = new Graphic(myconcello, simbolo);
                              // this.map.graphics.clear();
                              this.map.graphics.add(grafico);
                              this.map.setExtent(myconcello.getExtent(), true);
                        }
                  }));
            },
            zoomParroquia: function zoomParroquia() {

                  var codigoparroquia = this.selectParroquias.value;

                  var myquerytaskP = new QueryTask(this.config.serviceUrlparroquias);

                  var zoomP = new Query();
                  zoomP.returnGeometry = true;
                  zoomP.where = "CODPARRO = " + codigoparroquia;
                  zoomP.outSpatialReference = new SpatialReference(102100);

                  myquerytaskP.execute(zoomP, lang.hitch(this, function (evt1) {

                        console.log(evt1);

                        if (evt1.features.length > 0) {

                              var myparroquia = evt1.features[0].geometry;

                              var simbolop = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                    new Color([224, 254, 32]), 2),new Color([234, 252, 4,0.25])
                              );

                              var grafico2 = new Graphic(myparroquia, simbolop);
                              // this.map.graphics.clear();
                              this.map.graphics.add(grafico2);
                              this.map.setExtent(myparroquia.getExtent(), true);
                        }
                  }));
            }
      }

      // startup: function() {
      //   this.inherited(arguments);
      //   console.log('Xunta::startup');
      // },

      // onOpen: function(){
      //   console.log('Xunta::onOpen');
      // },

      // onClose: function(){
      //   console.log('Xunta::onClose');
      // },

      // onMinimize: function(){
      //   console.log('Xunta::onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('Xunta::onMaximize');
      // },

      // onSignIn: function(credential){
      //   console.log('Xunta::onSignIn', credential);
      // },

      // onSignOut: function(){
      //   console.log('Xunta::onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('Xunta::onPositionChange');
      // },

      // resize: function(){
      //   console.log('Xunta::resize');
      // }

      //methods to communication between widgets:

      );
});
//# sourceMappingURL=Widget.js.map

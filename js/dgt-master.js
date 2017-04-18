(function(){
  //alert('Ancho: ' + $(window).width() + ' | Alto: ' + $(window).height())
  // Variables Editables:
  var $textThComplet = 'Page % - LISTINGS % to %'; // Éste es el texto que aparecerá en el separador cuando se cargue más items en la vista mapa, de la página 'Search Results'. Ejm: Page 2 - LISTINGS 25 to 48
  //
  var $cuerpo = $('body');
  var $ventana = $(window);
  var $htmlcuerpo = $('html, body');
  // Seleccionador de clases en los filtros.
  var $viewFilter = $('#filter-views');
  if ($viewFilter.length) {
    var $wrapResult = $('#wrap-result');
    // Cambio de vista por SELECT NATIVO
    $viewFilter.on('change', 'select', function(){
      switch($(this).find('option:selected').val()) {
        case 'grid':
          $viewFilter.removeClass('list map').addClass('grid');
          $wrapResult.removeClass('view-list view-map').addClass('view-grid');
          $cuerpo.removeClass('view-list view-map');
          break
        case 'list':
          $viewFilter.removeClass('grid map').addClass('list');
          $wrapResult.removeClass('view-grid view-map').addClass('view-list');
          $cuerpo.addClass('view-list').removeClass('view-map');
          break
        case 'map':
          $viewFilter.removeClass('list grid').addClass('map');
          $wrapResult.removeClass('view-list view-grid').addClass('view-map');
          $cuerpo.removeClass('view-list').addClass('view-map');
          break
      }
    }); 
    // Cambio de estado por select combertido a lista
    $viewFilter.on('click', 'li', function(){
      $(this).addClass('active').siblings().removeClass('active');
      switch($(this).attr('class').split(' ')[0]) {
        case 'grid':
          $wrapResult.removeClass('view-list view-map').addClass('view-grid');
          $cuerpo.removeClass('view-list view-map');
          scrollResultados(false)
          break
        case 'list':
          $wrapResult.removeClass('view-grid view-map').addClass('view-list');
          $cuerpo.addClass('view-list').removeClass('view-map');
          scrollResultados(false)
          break
        case 'map':
          $wrapResult.removeClass('view-list view-grid').addClass('view-map');
          $cuerpo.removeClass('view-list').addClass('view-map');
          scrollResultados(true);
          break
      }
    });

    function scrollResultados(estado) {
      var $wrapListResult = $('#wrap-list-result');
      if (estado) { // creo slider
        if ($ventana.width() >= 1024) {
          if (!$wrapListResult.hasClass('ps-container')) {
            $wrapListResult.perfectScrollbar({suppressScrollX: true});
            $wrapListResult.on('ps-y-reach-end', function(){
              if (!$wrapListResult.hasClass('loading-more')) {
                $wrapListResult.addClass('loading-more');
                console.log('ahora cargaré más ITEMS');
                /////// PAUSADO
                //-------- luego de cargar los nuevos items POR AJAX-------
                /*
                var moreItems = false; // pongo esto para ver si hay más items a agregar, puede ser que el resultado solo alcanse para 1 página.
                // 'Page % - LISTINGS % to %'
                if (!moreItems) { // 
                  var $textThComplet;
                  var $currentPage = $resultSearch.attr('data-cpage');
                  if ($currentPage !== undefined) {
                    $resultSearch.attr('data-cpage', Number($currentPage) + 1)
                    //$textThComplet = 
                  } else {
                    // estoy en la primera página, asi que le pongo que estaré en la 2
                    $resultSearch.attr('data-cpage', '2');
                  }
                  $resultSearch.append('<li class="th-page">' + $textThComplete + '</li>' + $resultSearch.html()).promise().done(function(){
                    $wrapListResult.perfectScrollbar('update');
                    $wrapListResult.removeClass('loading-more');
                  });
                }
                ////// AUN FALTA TRABAJAR EN ESTO
                */
              }
            });

          }
        } 
      } else { // lo destruyo
        if ($wrapListResult.hasClass('ps-container')) {
          $wrapListResult.perfectScrollbar('destroy'); 
          /*
          $wrapListResult.removeClass('ps-container ps-theme-default ps-active-y');
          $wrapListResult.removeAttr('data-ps-id');
          $wrapListResult.find('.ps-scrollbar-x-rail, .ps-scrollbar-y-rail').remove();
          $wrapListResult.off('ontouchstart, touchend, touchmove, touchend');
          */
        }
      }
    }
    // touchend de select 'Vista grid, list y map' a lista con botones.
    // Por defecto compruebo para mutar.
    if ($ventana.width() >= 768){
      mutaSelectViews(true);//,por defecto que mute
    }
    // Al redimencionar muto los selects o Ul si corresponde
    $ventana.on('resize', function(){
      var $widthVentana = $ventana.width();
      if($widthVentana >= 768){
        mutaSelectViews(true)
      } else if($widthVentana < 768) {
        mutaSelectViews(false);
      }
    });

    function mutaSelectViews(estado){
      if (estado){
        if(!$viewFilter.find('ul').length){
          //console.log('muto a lista, el Ancho es: ' + $ventana.width());
          var $optionActive = $viewFilter.find('option:selected').val();
          $viewFilter.find('option').each(function(){
            $(this).replaceWith('<li class="' + $(this).val() + '">' + $(this).text() + '</li>');
          });
          var $theSelect = $viewFilter.find('select');
          $theSelect.replaceWith('<ul>' + $theSelect.html() + '</ul>');
          $viewFilter.find('.' + $optionActive).addClass('active');
          $viewFilter.removeClass($optionActive);
        }
      } else {
        if(!$viewFilter.find('select').length){
          //console.log('muto a select nativo, el Ancho es: ' + $ventana.width());
          var $indexLiActive = $viewFilter.find('.active').index();
          var $classLiActive = $viewFilter.find('.active').attr('class').split(' ')[0];
          $viewFilter.find('li').each(function(){
            $(this).replaceWith('<option value="' + $(this).attr('class').split(' ')[0] + '">' + $(this).text() + '</option>');
          });
          var $theUl = $viewFilter.find('ul');
          $theUl.replaceWith('<select>' + $theUl.html() + '</select>');
          $viewFilter.find('option').eq($indexLiActive).prop('selected', true).siblings().prop('selected', false);
          $viewFilter.addClass($classLiActive);
        }
      } 
    }
  }
  // Results Search
  var $resultSearch = $('#result-search');
  if ($resultSearch.length) {
    // Agregando a favoritos cada propiedad.
    $resultSearch.on('click', '.btn-check', function(){
      // Anclas para trabajar
      var $favoriteLink = $('#link-favorites > a');
      var $nFavorite = $favoriteLink.find('span:eq(1)');
      // Cambiando a active el check
      var $elCheck = $(this).find('span');
      if (!$elCheck.hasClass('active')) {
        $elCheck.addClass('active');
        // Agregando 1 más a 'favoritos'
        if ($favoriteLink.length) { // Habrá páginas en donde no exista el boton de 'favoritos, por eso compruebo su existencia'
          if (Number($nFavorite.text()) == 0) {
            $nFavorite.text('1');
            $favoriteLink.addClass('active');
          } else {
            $nFavorite.text(Number($nFavorite.text()) + 1);
          }
        }
      } else {
        $elCheck.removeClass('active');
        if ($favoriteLink.length) { // Habrá páginas en donde no exista el boton de 
          var $nFavorite = $('#link-favorites a span:eq(1)');
          var restaFavorite = Number($nFavorite.text()) - 1;
          $nFavorite.text(restaFavorite);
          // Quito el active al favorite
          if (restaFavorite == 0) {
            $favoriteLink.removeClass('active');
          }
        }
      }
    });
    // Creando los mini sliders
    function creaMiniSliders(){
      var $properties = $resultSearch.find('.propertie');
      var nproperties = $properties.length;
      for(var p = 0; p < nproperties; p++) {
        var $miniSlider = $properties.eq(p).find('.wrap-slider');
        if ($miniSlider.length) {
          var $ulSlider = $miniSlider.find('> ul');
          var $lisSlider = $ulSlider.find('> li');
          var nLisEx = $lisSlider.length;
          if (nLisEx > 1) {
            $ulSlider.css('width', (nLisEx * 100) + '%');
            $lisSlider.css('width', (100 / nLisEx) + '%');
          } 
          // activando el el primer frame
          /* Se quita esto, por creación dinámica de ITEMS, (ajax).
          else {
            // No hay items para q sea slide
            $miniSlider.find('.next').css('display', 'none');
            $miniSlider.find('.prev').css('display', 'none');
          }
          */
        };
      }
    }
    // creando el slider por defecto
    //creaMiniSliders();

    $resultSearch.find('.propertie').each(function(){
      apareceImagen($(this).find('.wrap-slider li:eq(0)'));
    });

    // Agregando función click a .next y .prev al slider interno, preparado para contenido creado dinámicamente
    $resultSearch.on('click', '.next', function(){
      var $wrapSlider = $(this).parent();
      var $ulSliderb = $wrapSlider.find('> ul');
      if (!$ulSliderb.hasClass('swiping')) {
        // variables a usar
        var $lisSliderb = $ulSliderb.find('> li');
        var nLisB = $lisSliderb.length;
        //
        var $marginLeftUl = $ulSliderb.css('margin-left');
        if ($marginLeftUl == '0px') {
          $ulSliderb.addClass('swiping');
          if ($ulSliderb.hasClass('created')) {
            $ulSliderb.css('margin-left', '-100%');
            var $liactive = $lisSliderb.eq(1);
            apareceImagen($liactive);
            $liactive.addClass('active');
            $ulSliderb.removeClass('swiping');
          } else {
            $ulSliderb.css('margin-left', '-100%');
            $wrapSlider.addClass('loading');
            var $newImages = '';
            $.each(getGallery($wrapSlider.parent().attr('data-mls'), $wrapSlider.parent().attr('data-counter')), function(i, m){
              $newImages = $newImages + '<li><img src="#" data-src="' + m + '" title="#" alt="#"></li>';
            });
            // Construyo el slider
            $ulSliderb.append($newImages);
            var $lisSlider = $ulSliderb.find('> li');
            var nLisEx = $lisSlider.length;
            setTimeout(function(){
              // creo el slider
              $ulSliderb.css('width', (nLisEx * 100) + '%');
              $lisSlider.css('width', (100 / nLisEx) + '%');
              var $segundoFrame = $lisSlider.eq(1);
              $segundoFrame.addClass('active');
              apareceImagen($segundoFrame);
            }, 500)
            setTimeout(function(){
              $wrapSlider.removeClass('loading');
            }, 1000)
            $ulSliderb.addClass('created').removeClass('swiping');
          }

        } else {
          var nLiactive = itemActivo($lisSliderb);
          if ((nLiactive + 1) !== nLisB) {
            $ulSliderb.addClass('swiping');
            $ulSliderb.css('margin-left', '-' + ((nLiactive + 1) * 100) + '%'); 
            var $liactive = $lisSliderb.eq(nLiactive + 1);
            apareceImagen($liactive);
            $liactive.addClass('active').siblings().removeClass('active');
            $ulSliderb.removeClass('swiping');
          } else {
            $ulSliderb.addClass('swiping');
            $ulSliderb.css('margin-left', '0');
            $lisSliderb.eq(nLisB - 1).removeClass('active');
            $ulSliderb.removeClass('swiping');
          }
        }
      }
    });
    $resultSearch.on('click', '.prev', function(){
      var $ulSliderb = $(this).parent().find('> ul');
      if (!$ulSliderb.hasClass('swiping')) {
        // variables a usar
        var $lisSliderb = $ulSliderb.find('> li');
        var nLisB = $lisSliderb.length;
        var $marginLeftUl = $ulSliderb.css('margin-left');
        if ($marginLeftUl != '0px') {
          var nLiactive = itemActivo($lisSliderb);
          $ulSliderb.addClass('swiping');
          $ulSliderb.css('margin-left',  '-' + ((nLiactive - 1) * 100) + '%'); 
          var $liactive = $lisSliderb.eq(nLiactive - 1);
          $liactive.addClass('active').siblings().removeClass('active');
          $ulSliderb.removeClass('swiping');
          if (nLiactive == 1) {
            $lisSliderb.eq(0).removeClass('active');
          }
        }
      }
    });
    // Para mover los mini sliders con touch,
    var xDown = null;                                                 
    var yDown = null; 
    $resultSearch.on('touchstart', '.propertie', function(evt){
      xDown = evt.touches[0].clientX;                               
      yDown = evt.touches[0].clientY;
    });
    $resultSearch.on('touchmove', '.propertie', function(evt) {
      if ( ! xDown || ! yDown ) {
        return;
      }
      var xUp = evt.touches[0].clientX;                      
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) { // si se mueve derecha o izquierda
        evt.preventDefault();
        if ( xDiff > 0 ) { // izquierda
          $(this).find('.next').click();
        } else { // derecha
          $(this).find('.prev').click();
        }                       
      }
      xDown = null;
      yDown = null;
    });
  }
  // Expande y contrae los mini filtros de 'all filters' en versión mobile de la web
  var $miniFilters = $('#mini-filters');
  if ($miniFilters.length) {
    // Expando y contrigo el filtro
    $miniFilters.find('h4').on('click', function(){
      var $theLi = $(this).parent().parent(); // aun no se sabe si es un LI por eso no usé .closest()
      if (!$theLi.hasClass('expanded')) {
        $theLi.addClass('expanded');
        $theLi.siblings().removeClass('expanded');
      } else {
        $theLi.removeClass('expanded');
      }
      // ver si creo el slider de 'cities'
      if ($theLi.hasClass('cities') && !$citiesList.hasClass('ps-container')) {
        setTimeout(function(){
          $citiesList.perfectScrollbar({
            suppressScrollX : true,
            minScrollbarLength : '42'
          });
        }, ((Number($theLi.css('transition-duration').replace('s' ,'')) * 1000) * 2));
        //console.log('Se demora: ' + ((Number($theLi.css('transition-duration').replace('s' ,'')) * 1000) * 2)  + ' segnudos');
      }
    });
  }

  // Creando el scroll de 'Choose cities' del 'All filter'.
  var $citiesList = $('#cities-list');
  if ($citiesList.length) {
    $ventana.on('resize', function(){
      if ($citiesList.hasClass('ps-container')) {
        $citiesList.perfectScrollbar('update');
      }
    }); 
  };

  // Abre y cierra el 'All Filters'
  // Pruebas varias:

  // aparesco individualmente los filtros si estoy en tablet
  var $theFilters = $('#filters');
  if ($theFilters.length) {
    $theFilters.on('click', 'li', function(){
      var $allFilters = $('#all-filters');
      var $wrapFilters = $('#wrap-filters');
      var $nameClass = $(this).attr('class').split(' ')[0];
      //$(this).toggleClass('active'); // activo o desactivo el LI clickeado , mostrando su flechita volteada
        switch ($nameClass) {
          case 'all':
            // activo y desactivo el LI clickeado
            if (!$(this).hasClass('active')) {
              $(this).addClass('active').siblings().removeClass('active'); // activo el Li del Header del Filters
            } else {
              $(this).removeClass('active');
            }
            // Apareciendo y/o mutando el 'All filter'
            if (!$allFilters.hasClass('visible')){ // lo pongo asi, x siacaso yá esté visible individualmente y no se oculte, sino, muestre todos
              $allFilters.addClass('visible');
              console.log('hacer visible el "all filter"');
            } else { // oculto si no se está viendo individualmente.
              
              if ($allFilters.hasClass('individual') && $allFilters.hasClass('visible')){
                $allFilters.removeClass('individual');
                console.log('está visible e individual');
              } else {
                if (!$allFilters.hasClass('individual') && $allFilters.hasClass('visible')){
                  $allFilters.removeClass('visible');
                  console.log('no tiene individual, y si tiene visible');
                }
              }

            }

            // verifico la dimención de la pantalla, parar mostrando en fixed o como modal en conjunto.
            if ($ventana.width() <= 640) {
              $cuerpo.toggleClass('fixed');
              $allFilters.css({
                'top': ($wrapFilters.outerHeight() + $wrapFilters.offset().top) + 'px',
                'left' : '0px',
                'height': 'calc(100vh - ' + ($wrapFilters.outerHeight() + $theFilters.find('li.save').outerHeight()) + 'px)'
              });
            } else if ($ventana.width() > 640 && $ventana.width() <= 768) {
              //console.log('mayor a 640 pero menor a 768');
              $cuerpo.toggleClass('fixed');
              $allFilters.css({
                'left' : '0px',
                'top' : $wrapFilters.offset().top + 'px',
                'height': 'calc(100vh - ' + ($wrapFilters.outerHeight() + $applyFilters.outerHeight()) + 'px)'
              });

            } else if ($ventana.width() <= 768) {
              //$allFilters.css('top', ($wrapFilters.offset().top + $wrapFilters.outerHeight()) + 'px');
              console.log('me estoy ejecutando');
              $cuerpo.toggleClass('fixed'); // le pongo fixed al body para q no se pueda bajar más.
            } else {  
              //console.log('mayor a 768, supongo');
              $allFilters.css({
                'left' : '0px',
                'top' :  $wrapFilters.outerHeight() + 'px'
              });
            }

            if ($ventana.width() <= 768) {
              // Scrolleo si es necesario.
              var $SetScrollTop = $wrapFilters.offset().top - Number($wrapFilters.css('margin-top').replace('px', ''));
              if ($ventana.scrollTop() !== $SetScrollTop) {
                $htmlcuerpo.animate({scrollTop:$SetScrollTop}, 800);
              }
            }

            // Creo el scroll interno invisible del 'all filter'.
            if (!$allFilters.hasClass('ps-container')) {
              setTimeout(function(){
                $allFilters.perfectScrollbar({
                  suppressScrollX : true,
                  minScrollbarLength : '42'
                });
              }, ((Number($allFilters.css('transition-duration').replace('s' ,'')) * 1000) * 2));
            }

            break
          case 'save': // // Click en 'Save' de 'Filters'
            // Acá la función de 'Guardar la busqueda', && continuar función con Jhon.
            console.log('LI: Save Search');
            break
          default:
            if ($cuerpo.hasClass('fixed')) {
              $cuerpo.removeClass('fixed');
            }
            if ($allFilters.hasClass('ps-container')) {
              $allFilters.perfectScrollbar('destroy'); 
            }
            var $miniFilter = $miniFilters.find('li.' + $nameClass); //  busco el mini filter vinculado al LI clickeado de la cabezera de filters
            if ($miniFilter.length) { // existe un LI de mini filter vinculado al LI de la cabezera de filtros.
              if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active'); // activo el Li del Header del Filters , que fué clickeado
                $miniFilter.addClass('visible').siblings().removeClass('visible'); //  aparesco el 'Mimi filter'
                if (!$allFilters.hasClass('individual')) { // agrego la 'individualidad' solo si se viene de 'All filter', xq sino, yá la tiene.
                  $allFilters.addClass('individual');
                }
                if (!$allFilters.hasClass('visible')) { // agrego la 'individualidad' solo si se viene de 'All filter', xq sino, yá la tiene.
                  $allFilters.addClass('visible');
                }
                $allFilters.css({
                  'top': $wrapFilters.outerHeight() + 'px', // aparesco el filtro individual, justo abajito del boton LI que se hizo click
                  'left' : (($(this).offset().left + ($(this).outerWidth() / 2)) - 150) + 'px',
                  'height' : 'auto'
                });
              } else {
                $allFilters.removeClass('visible');
                $miniFilter.removeClass('visible');
                $(this).removeClass('active');
                setTimeout(function(){
                  $allFilters.removeClass('individual');
                }, (Number($allFilters.css('transition-duration').replace('s' ,'')) * 1000) * 2)
              }
            } else {
              console.log('El LI clickeado no está vinculado a la visualizacion de un mini filtro');
              if ($nameClass == 'save'){
                console.log('guardaré la busqueda') ;
              }
            }
        }
    });
    // Escondo el 'All Filters' con el boton 'Apply filters', simulando click en 'All Filters'
    var $applyFilters = $('#apply-filters');
    if ($applyFilters.length) {
      $applyFilters.on('click', function(){
        $theFilters.find('.all').trigger('click');
      });
    }
  }
  
  // Range de 'All Filters'
  dgt_rangeSlide('#range-price', 0, 50000000, 50000, '#price_from', '#price_to', '$', '', true, 1000000, 250000);
  dgt_rangeSlide('#range-living', 0, 10000, 50, '#living_from', '#living_to', '', 'SF', true);
  dgt_rangeSlide('#range-year', 1900, 2021, 1, '#year_from', '#year_to', '', '', false);

  dgt_rangeSliderSnap('#range-baths', 0, 8);
  dgt_rangeSliderSnap('#range-beds', 0, 13);

  // Funciones generales
  function apareceImagen(li){
    var $laImagen = li.find('> img');
    var $srcOriginal = $laImagen.attr('data-src');
    if ($srcOriginal !== undefined) {
      $laImagen.attr('src', $srcOriginal).removeAttr('data-src');
      li.addClass('loading');
      $laImagen.on('load', function(){
        li.removeClass('loading');
      });
    }
  }
  function itemActivo(losLi){ // refactorizar esto (nueva idea para la función).
    var nLis = losLi.length;
    for(var s = 0; s < nLis; s++) {
      if (losLi.eq(s).hasClass('active')) {
        return s;
      }
    }
  }
  function getGallery(mls, counter) {
    // ejemplo: http://retsimages.s3.amazonaws.com/34/A10172834_2.jpg
    var cdn = 'http://retsimages.s3.amazonaws.com';
    var folder = mls.substring((mls.length) - 2); // 34
    var list = [];
    var img ='';
    if(counter <= 0) {
      list.push(dgtCredential.imgComingSoon);
    } else {
      for(var i = 1; i <= counter; i++) {
        img = cdn+'/'+folder+'/'+mls+'_'+i+'.jpg';
        list.push(img);
      }
    }
    return list;
  }

  function dgt_rangeSlide(elementRange, minr, maxr, stepTo, pricefrom, priceto, typev1, typev2, boolComa, maxStep, newStep) {
     $(elementRange).slider({
        range: true,
        min: minr,
        max: maxr,
        values: [ minr, maxr],
        step: stepTo,
        slide: function( event, ui ) {
           if(ui.values[0] > maxStep) {
              newSepTo(elementRange, newStep);
              //console.log('soy mas que: ' + maxStep);
           } else {
              //if (step != stepTo) {
                 newSepTo(elementRange, stepTo);
                 //console.log('soy menos que: ' + maxStep);
              //}
           }

           if ( boolComa == true ){
              $( pricefrom).val( typev1 + separadorComa(ui.values[ 0 ]) + " " + typev2 );
              $( priceto  ).val( typev1 + separadorComa(ui.values[ 1 ]) + " " + typev2 );
           } else {
              $( pricefrom ).val( typev1 + ui.values[ 0 ] + " " + typev2 );
              $( priceto   ).val( typev1 + ui.values[ 1 ] + " " + typev2 );
           }
        },
        //Terminar de realizar la validaciÃ³n del Callback --------------------------
        /*
        change: function(){
           console.log('terminar de arrastrar');
           setTimeout( function() {
              var rangefrom = $( pricefrom).val();
              var rangeto = $( priceto).val();
              if( $( pricefrom).val() == rangefrom || $(priceto).val() == rangeto ) {
                 console.log('Daniel: ya cambie');
              }
           }, 2000);
        }
        */
     });
  };
  function newSepTo(elementRange, newStep) {
    $(elementRange).slider({
      step: newStep
    }); 
  };
  function separadorComa(valor) {
    var nums = new Array();
    var simb = ","; //Éste es el separador
    valor = valor.toString();
    valor = valor.replace(/\D/g, "");   //Ésta expresión regular solo permitira ingresar números
    nums = valor.split(""); //Se vacia el valor en un arreglo
    var long = nums.length - 1; // Se saca la longitud del arreglo
    var patron = 3; //Indica cada cuanto se ponen las comas
    var prox = 2; // Indica en que lugar se debe insertar la siguiente coma
    var res = "";
    while (long > prox) {
     nums.splice((long - prox),0,simb); //Se agrega la coma
     prox += patron; //Se incrementa la posición próxima para colocar la coma
    }
    for (var i = 0; i <= nums.length-1; i++) {
     res += nums[i]; //Se crea la nueva cadena para devolver el valor formateado
    }
    return res;
  };
  function dgt_rangeSliderSnap(elementRange, minr, maxr){
    $(elementRange).slider({
        min:minr,
        max:maxr,
        animate:true,
        range:true, 
        values:[minr,maxr]
     });
  };

  (function($) {
    var extensionMethods = {
        pips: function( settings ) {
          options = {
            first:   "number",  
            last:    "number",  
            rest:    "pip"       
          };
          $.extend( options, settings );
          this.element.addClass('ui-slider-pips').find( '.ui-slider-pip' ).remove();
          var pips = this.options.max - this.options.min;     
          for( i=0; i<=pips; i++ ) {
            var s = $('<span class="ui-slider-pip"><span class="ui-slider-line"></span><span class="ui-slider-number">'+i+'</span></span>');
            if( 0 == i ) {
               s.addClass('ui-slider-pip-first');
               if( "number" == options.first ) { s.addClass('ui-slider-pip-number'); }
               if( false == options.first ) { s.addClass('ui-slider-pip-hide'); }
            } else if ( pips == i ) {
               s.addClass('ui-slider-pip-last');
               if( "number" == options.last ) { s.addClass('ui-slider-pip-number'); }
               if( false == options.last ) { s.addClass('ui-slider-pip-hide'); }
            } else {
               if( "number" == options.rest ) { s.addClass('ui-slider-pip-number'); }
               if( false == options.rest ) { s.addClass('ui-slider-pip-hide'); }
            }
            if( this.options.orientation == "horizontal" ) 
               s.css({ left: '' + (100/pips)*i + '%'  });
            else
               s.css({ top: '' + (100/pips)*i + '%'  });
            this.element.append( s );
          }
        }
    };
    $.extend(true, $['ui']['slider'].prototype, extensionMethods);
  })(jQuery);
}());
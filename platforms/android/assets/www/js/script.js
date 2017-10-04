var o = {};

o.init = function () {
  o.d = $("#document");
  o.w = $(window);

  o.section = 1;
  o.cards = [0,0,0,0,0];
  o.maxCards = [];
  o.sectionsActive = 4;
  o.maxCardsPerSection = o.settings["maxCards"];
  o.subpage = "stories";
  o.mouse = {x: 0, y: 0};

  $(document).mousemove(function(event) {
    o.mouse.x = event.pageX;
    o.mouse.y = event.pageY;
  });

  $(document).on('touchmove', 'body', function(e) {
    o.mouse.x = e.originalEvent.touches[0].pageX;
    o.mouse.y = e.originalEvent.touches[0].pageY;
  });

  //z, g, m, c
  o.sn = ["z", "g", "m", "c"];
  //o.sName = ['Research', 'Interaction', 'Dialogue', 'Collaboration'];

  //o.sDesc = [
  //  'Challenging tasks and questions to re-think and analyze your environment and people you are surrounded by.',
  //  'Be the person you want to meet. By easy actions, explore your presence in any public space. Light interaction helps you change the atmosphere of the place where you are at the moment.',
  //  'Have you ever wanted to talk to someone interesting but you never know how to start? This game gives you a good opportunity to act. Start the conversation with a stranger and get to know the people who walk by.',
  //  'The most challenging category. To fulfill the level you have to develop a daring attitude to collaborate with people you don\'t know. To succeed you need to find people willing to collaborate with you on the given tasks. This is opening space for new interesting connections.',
  //];


  o.yesColors = ["#330099" , "#0000FF" , "#3333CC" , "#0033CC" , "#336600" , "#0066FF" , "#339900" , "#339999" , "#0099CC",
    "#009900" , "#33CC66" , "#33CCCC" , "#00CCFF" , "#00CC00" , "#33FF99" , "#00FFFF" , "#00FF33" , "#99FF66" , "#99FFCC",
    "#66FFFF" , "#66FF00" , "#99CC00" , "#66CCFF" , "#66CCCC" , "#66CC00" , "#999900" , "#9999CC" , "#669999" , "#669900",
    "#996600" , "#996666" , "#996699" , "#9966CC" , "#993333" ,  "#6633FF" , "#663399" , "#663366" , "#990066" , "#990099",
    "#6600FF" , "#9900CC" , "#660066" , "#660000" , "#FF0000" , "#FF0099" , "#CC00CC" , "#CC0066" , "#CC0000" , "#FF3300",
    "#CC33CC" , "#CC3399" , "#FF6600" , "#FF6699" , "#FF6666" , "#CC6699" , "#CC6600" , "#FF9900" , "#FF9999" , "#CC99CC",
    "#CC9900" , "#FFCC00" , "#FFCC99", "#CCCCCC" , "#CCCCFF" , "#CCCC33" , "#FFFF00" , "#FFFF99" ,"#CCFFFF" , "#CCFFCC" ,
    "#CCFF00"];

  if($("#game").length){
    o.initGame();
  }

  //o.newSection(true);

  $(".about .fa-info, .closeDialog").click(function () {
    $("body").toggleClass("infoOpened");
  });
  
  $(".fa-home").click(function(){
    window.location.reload(true);
  });

  $(".finish").fadeOut(100);

  $(".finish button").click(function () {
    window.location.reload();
  });

  o.tutSlide = 0;

  $("#tutorial button").click(function () {
    o.tutSlide++;
    if(o.tutSlide === $("#tutorial .slide").length){
      $("#tutorial").fadeOut();
      o.newSection(true);
      $(".switch").removeClass("disable");
    }else{
      $("#tutorial .slide").eq(o.tutSlide).fadeIn();
      $("#tutorial .slide").eq(o.tutSlide-1).fadeOut();
    }
  });

  $(".switchbtn").click(function () {
    if(o.subpage == "stories"){
      $(".switchbtn")
        .html(o.menuLabels[o.subpage])
        .removeClass("yellowbg")
        .addClass("redbg");
      $(".dotline")
        .removeClass("redbg")
        .addClass("yellowbg");

      o.subpage = "howto";

      $(".content.stories").fadeOut(200);
      setTimeout(function () {
        $(".content.info").fadeIn(500)
      })

    }else{
      $(".switchbtn")
        .html(o.menuLabels[o.subpage])
        .addClass("yellowbg")
        .removeClass("redbg");
      $(".dotline")
        .addClass("redbg")
        .removeClass("yellowbg");

      o.subpage = "stories";

      $(".content.info").fadeOut(200);
      setTimeout(function () {
        $(".content.stories").fadeIn(500)
      })
    }


  });

  $(".playbtn").click(function () {
    $("#game").fadeIn(400);
    $("header, footer, .content").fadeOut(500)

  });

  o.w.resize(o.resize);
  o.resize();
};

o.resize = function () {
  o.ww = o.w.width();
  o.wh = o.w.height();
};

o.initDrag = function () {
  var counter = "<span>"+(1+o.cards[o.section])+"/"+o.maxCards[o.section]+" </span>";
  $(".section").eq(o.section).find(".card").eq(0).addClass("drag").find(".in").append(counter);

  $(".counter").html((1+o.cards[4])+"/"+o.maxCards[4]);

  o.drag = new Draggabilly( '.drag', {
    axis: 'x'
  });

  o.drag.on("dragMove", o.dragMove);
  o.drag.on("dragEnd", o.dragStop);

  o.setProgress();

};

o.dragMove = function () {
  var x = this.dragPoint.x;
  var xx = this.dragPoint.x;

  if(!$(".info").hasClass("show")){
    $(".info").addClass("show");
  }

  if(x < 0){
    x = x*-1;
  }

  var rotate = (xx / (o.ww/2))*10;
  var zoom = 1 - (x / (o.ww/2))/3;

  $(".drag .in").css({
    '-webkit-transform' : 'rotate(' + rotate + 'deg) scale('+zoom+', '+zoom+')',
    '-moz-transform'    : 'rotate(' + rotate + 'deg) scale('+zoom+', '+zoom+')',
    '-ms-transform'     : 'rotate(' + rotate + 'deg) scale('+zoom+', '+zoom+')',
    '-o-transform'      : 'rotate(' + rotate + 'deg) scale('+zoom+', '+zoom+')',
    'transform'         : 'rotate(' + rotate + 'deg) scale('+zoom+', '+zoom+')',
    //'box-shadow'        : '0 '+zoom*10+'px '+zoom*50+'px rgba(0, 0, 0, 0.3)'
  });

  //console.log(zoom, x);
};

o.dragStop = function () {
  o.checkDrop(o.mouse);

  $(".drag").css({left: 0, zoom: 1});
  var zoom = 0;
  $(".drag .in").css({
    '-webkit-transform' : 'rotate(' + zoom + 'deg)',
    '-moz-transform'    : 'rotate(' + zoom + 'deg)',
    '-ms-transform'     : 'rotate(' + zoom + 'deg)',
    '-o-transform'      : 'rotate(' + zoom + 'deg)',
    'transform'         : 'rotate(' + zoom + 'deg)',
    //'box-shadow'        : '0 10px 50px rgba(0, 0, 0, 0.3)'
  });
  $(".info").removeClass("show");
};

o.checkDrop = function (m) {
  var leftWidth = $(".left").width();
  if(m.x < leftWidth){
    o.cards[o.section]++;
    o.cards[4]++;

    //console.log(o.cards[o.section], o.maxCards[o.section]);
    if(o.maxCards[o.section] === o.cards[o.section]){
      //console.log("newSection");
      o.newSection(false);
    }else{
      o.newCard(false);
    }

    if(o.cards[4] === o.maxCards[4]){
      o.isThisEnd();
    }
    //console.log("NO!");
  }

  var rightWidth = $(".right").width();
  if((o.ww - m.x) < rightWidth){
    o.cards[o.section]++;
    o.cards[4]++;

    if(o.maxCards[o.section] === o.cards[o.section]){
      //console.log("newSection");
      o.newSection(false);
    }else{
      o.newCard(true);
    }

    if(o.cards[4] === o.maxCards[4]){
      o.isThisEnd();
    }
    //navigator.vibrate(500);
    //console.log("YES!");
  }

  //console.log(m.x, o.ww - m.x, leftWidth, rightWidth);
};

o.isThisEnd = function () {
  //console.log("hej boha");
  setTimeout(function () {
    $(".finish").fadeIn(3000);
  }, 500);
  o.setProgress();
};

o.newSection = function (isStart) {
  isStart = typeof isStart !== 'undefined' ? isStart : true;

  if(o.drag){
    o.drag.destroy();
  }

  if(!isStart) {
    $(".section").eq(o.section).find(".card").eq(0).remove();
    $(".section").eq(o.section).hide();
  }

  setTimeout(function () {
    $("#sec-select").show(function () {
      $(this).addClass("show");
    });
  }, 300);

};

o.checkSections = function () {

};

o.sectionSelect = function () {
  $(".switch").click(function () {
    if(!$(this).hasClass("disable")){
      $(this).css({opacity: 0});
      $("#sec-select").show(function () {
        $(".section .drag").removeClass("drag");
        $(this).addClass("show");
        //o.setProgress();
      });
    }
  });

  $("#sec-select").on("click", ".sec-row, .closeDialog", function () {
    var section = $(this).attr("data-section");
    var $this = this;
    $("#sec-select").removeClass("show");

    $("#share").addClass("show");

    if(o.drag){
      o.drag.destroy();
      $(".section:not(:eq("+o.section+")) .drag").removeClass(".drag");
    }

    setTimeout(function () {
      $(".section").eq(section).fadeIn(function () {
        $($this).remove();
        $("#sec-select").hide();
        o.setProgress();
      });
      o.section = section;
      o.refreshSection();
      $(".section:not(:eq("+o.section+"))").fadeOut(1);
      o.initDrag();

      $(".switch").css({opacity: 1});
    }, 400);



  });
};

o.newCard = function (dir) {
  o.drag.destroy();
  $(".section").eq(o.section).find(".card").eq(0).remove();

  if(dir){
    $(".yes").css({
      opacity: 1,
      zIndex: 999,
      backgroundColor: o.yesColors[Math.floor(Math.random()*70)]
    });

    //console.log(o.yesColors[Math.random()*70]);
    //$(".yes").html("<img src='/images/yes.gif'>");
  }

  setTimeout(function () {
    $(".section").eq(o.section).find(".card").eq(0).addClass("drag");
    $(".yes").css({
      opacity: 0,
      zIndex: -1
    });
    o.initDrag();
  }, 1500);


};

o.initGame = function () {
  $.each(o.c, function (k, v) {
    if(v.length < o.maxCardsPerSection){
      o.maxCards[k] = v.length;
    }else{
      o.maxCards[k] = o.maxCardsPerSection;
    }

    //console.log(k);
    $(".sec-row[data-section='"+k+"']").html(o.sName[k]);

    v = o.shuffle(v);
    for(var i = 0; i < o.maxCardsPerSection; i++){
      var card = "<div class='card'><div class='in'>"+v[i]+"<span class='hashtag'>"+o.settings['hashtag']+"</span></div></div>";
      $(".section").eq(k).append(card);
    }
  });

  var totalCards = 0;
  $.each(o.maxCards, function (k, v) {
    totalCards = totalCards + v;
  });
  o.maxCards[4] = totalCards;
  o.sectionSelect();
};

o.refreshSection = function () {
  $("#sidebar .section-name").html(o.sName[o.section]);
  $("#sidebar .section-desc").html(o.sDesc[o.section]);
  $("#sidebar").removeAttr("class");
  $("#sidebar").addClass("sec"+(o.section*1+1));

};

o.infoSection = function () {

  $(".info p").slideUp(10);

  $("h2").click(function () {
    //console.log("ads");
    $(".info p").slideUp();
    $(this).parent().find("p").stop().slideDown();
  });

};

o.setProgress = function () {
  var rows = 4;

  $("#sec-select").html("");

  $.each(o.cards, function (i, v) {
    if(i == 4) return;
    var size = v / o.maxCards[i] * 25;
    $(".progressbar div").eq(i).css({width: size+"%"});

    if(v < o.maxCards[i] && o.section != i){
      $("#sec-select").append('<div class="sec-row sec'+(i+1)+'" data-section="'+(i)+'">'+o.sName[i]+'</div>');
    }else{
      rows--;
    }

    $("#sec-select").removeAttr("class");
    $("#sec-select").addClass("row" + rows);

    //console.log(i, v);
  });

  //$("#sec-select").prepend('<span class="closeDialog" data-section="'+o.section+'"><i class="fa fa-times" aria-hidden="true"></i></span>');

  if(rows === 0){
    $(".switch").addClass("disable");
  }else{
    $(".switch").removeClass("disable");
  }

  //console.log(rows);
};


o.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

o.loadDb = function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDEfYfBkS-cClQkF4tC3l6vYrdrQrta3kQ",
    authDomain: "bttcards.firebaseapp.com",
    databaseURL: "https://bttcards.firebaseio.com",
    projectId: "bttcards",
    storageBucket: "bttcards.appspot.com",
    messagingSenderId: "906755631573"
  };
  firebase.initializeApp(config);
  o.db = firebase.database();
  o.c = [];

  var settings = o.db.ref('settings');
  o.settings = [];
  settings.on('value', function(snapshot) {
    $.each(snapshot.val(), function (k, v) {
      if(v) {
        o.settings[k] = v;
      }
    });
  });

  var starter = setInterval(function () {
    if(o.settings['languages']){
      o.languagePick();
      if(o.cordova) navigator.splashscreen.hide();
      clearInterval(starter);
    }
    //console.log(o.settings);
  }, 500);
};

o.languagePick = function () {
  var langs = o.settings['languages'].split(",");
  $.each(langs, function (k,v) {
    var dets = v.split("|");
    $(".intro").append("<div class='pick' data-lang='"+dets[1]+"'>"+dets[0]+"</div>")
  });

  $(".intro").on("click", ".pick", function () {
    var lang = $(this).attr("data-lang");
    o.lang = lang;

    $(".intro").fadeOut();


    var yellow = o.db.ref( o.lang + '/yellow');
    o.c[0] = [];
    yellow.on('value', function(snapshot) {
      $.each(snapshot.val(), function (k, v) {
        //console.log(k,v);
        if(v) o.c[0].push(v);
      });
    });
  
    var green = o.db.ref(o.lang + '/green');
    o.c[1] = [];
    green.on('value', function(snapshot) {
      $.each(snapshot.val(), function (k, v) {
        //console.log(k,v);
        if(v) o.c[1].push(v);
      });
    });
  
    var blue = o.db.ref(o.lang + '/blue');
    o.c[2] = [];
    blue.on('value', function(snapshot) {
      $.each(snapshot.val(), function (k, v) {
        //console.log(k,v);
        if(v) o.c[2].push(v);
      });
    });
  
    var red = o.db.ref(o.lang + '/red');
    o.c[3] = [];
    red.on('value', function(snapshot) {
      $.each(snapshot.val(), function (k, v) {
        //console.log(k,v);
        if(v) o.c[3].push(v);
      });
    });

    var texts = o.db.ref(o.lang + '/text');
    o.texts = [];
    texts.on('value', function(snapshot) {
      $.each(snapshot.val(), function (k, v) {
        if(v) {
          if(k == "category"){
            o.sDesc = [];
            o.sName = [];

            $.each(v, function (kk, vv) {
              var desc = vv.split("|");
              o.sDesc.push(desc[1]);
              o.sName.push(desc[0]);
            });

          }
          if(k == "endslide"){
            $.each(v, function (kk, vv) {
              if(kk == 0){
                $("div.finish").prepend(vv);
              }else if(kk == 1){
                $("div.finish button").html(vv);
              }else if(kk == 2){
                $("div.finish span").html(vv);
              }
            });
          }

          if(k == "welcomeslide0" || k == "welcomeslide1" || k == "welcomeslide2"){
            var slide = k.replace("welcomeslide", "") * 1;
            $(".slide").eq(slide).html("");
            $.each(v, function (kk, vv) {
              $(".slide").eq(slide).append("<p>"+vv+"</p>");
            });
          }

          if(k == "stories"){
            $(".stories .meta").html("");
            $.each(v, function (kk, vv) {
              if(kk == 0){
                $(".stories .meta").append("<p>"+vv+"</p>");
                $(".stories .meta").append("<div class='showMore'>čítaj ďalej</div>");
              }else{
                $(".stories .meta").append("<p style='display: none'>"+vv+"</p>");
              }
            });
          }

          if(k == "info"){
            $(".info .meta").html("");
            $(".info ul").html("");
            $.each(v, function (kk, vv) {
              var dets = vv.split("|");
              if(dets[0] == "base"){
                $(".info .meta").html(dets[1]);
              }else{
                $(".info ul").append("<li><h2>"+dets[0]+"</h2><p>" + dets[1] + "</p></li>");
              }
            });
            setTimeout(function () {
              o.infoSection();
            }, 500)
          }

          if(k == "menu"){
            o.menuLabels = [];
            $.each(v, function (kk, vv) {
              o.menuLabels[kk] = vv;
              if(kk == "play"){
                $(".playbtn").html(vv);
              }
              if(kk == "howto"){
                $(".switchbtn").html(vv);
              }
            });
          }

          if(k == "titles"){
            o.titleLabels = []
            $.each(v, function (kk, vv) {
              o.titleLabels[kk] == vv;
              if(kk == "howto"){
                $(".info h3").html(vv);
              }

              if(kk == "stories"){
                $(".stories h3").html(vv);
              }

              if(kk == "photo"){
                $("#shareMenu div[data-mode='photo']").append(vv);
              }

              if(kk == "text"){
                $("#shareMenu div[data-mode='text']").append(vv);
              }

              if(kk == "share"){
                $("#share span").html(vv);
              }

              if(kk == "textarea"){
                $("#textToShare").attr("placeholder", vv);;
              }
            });
          }

        }
      });

      o.init();
    });
  });
}

o.twitter = function () {

  $.getJSON( "http://beentheretogether.cards/api/timeline.php", function( data ) {

    $.each( data, function( key, val ) {
      //console.log(key, val);
      if(typeof val.entities.media !== 'undefined'){
        var pid = val.entities.media[0].id_str;
        $("#timeline").append("<li><img src='http://beentheretogether.cards/api/"+pid+".jpg' ></li>");
        //console.log(val.entities.media[0]);
      }else{
        //console.log(val.text);
        $("#timeline").append("<li><p>"+val.text+"</p></li>");
      }
    });

  });
  $(document).on('focus', 'input, textarea', function(){
    $('body').addClass("fixfixed");
  });

  $(document).on('blur', 'input, textarea', function(){
    $('body').removeClass("fixfixed");
  });

  $(".stories .meta").on("click", ".showMore", function () {
    $(".stories .meta p").slideDown();
    $(this).slideUp();
  });

  setInterval(function () {
    $("#shareText").height(window.innerHeight);
  }, 300);

  $("#shareMenu div").click(function () {
    var type = $(this).attr("data-mode");
    if(type == "text"){
      $("#shareText").addClass("show");
    }else if(type == "photo"){
      setTimeout(function () {
        $(".yes").css({
          opacity: 1,
          zIndex: 999,
          backgroundColor: o.yesColors[Math.floor(Math.random()*70)]
        });
      }, 400);

      navigator.camera.getPicture(function cameraSuccess(imageBase) {
        //console.log(imageBase);

        $.ajax({
          type: "POST",
          url: "http://beentheretogether.cards/api/save.php",
          data: {img: (imageBase)},
          contentType: "application/x-www-form-urlencoded",
          success: function(e){
            //...
            //console.log(e)

            setTimeout(function () {
              $(".yes").css({
                opacity: 0,
                zIndex: -1
              });
            }, 1500);
          }
        });


        $("#shareText, #shareMenu").removeClass("show");
      }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
      }, {
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        quality: 50,
        targetHeight: 1000
      });
    }
  });

  $("#shareText .button").click(function () {

    var text = $("#textToShare").val();
    $("#textToShare").val("");

    $.ajax({
      type: "POST",
      url: "http://beentheretogether.cards/api/status.php",
      data: {text: text},
      contentType: "application/x-www-form-urlencoded",
      success: function(e){
        //...
        console.log(e)
      }
    });

    setTimeout(function () {
      $("#shareText, #shareMenu").removeClass("show");
    }, 500);

    $(".yes").css({
      opacity: 1,
      zIndex: 999,
      backgroundColor: o.yesColors[Math.floor(Math.random()*70)]
    });

    setTimeout(function () {
      $(".yes").css({
        opacity: 0,
        zIndex: -1
      });
    }, 1500);

  });

  $("#share span").click(function () {
    $("#shareMenu").addClass("show");

  })
};

$(function() {
//  o.lang = "EN";
//  o.loadDb();

    if(navigator != undefined && navigator.userAgent != undefined) {
        user_agent = navigator.userAgent.toLowerCase();
        if(user_agent.indexOf('android') > -1) { // Is Android.
            $(document.body).addClass('android');
        }
    }

});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
          o.lang = "EN";
          o.loadDb();
          o.twitter();
          o.cordova = !!window.cordova;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

jQuery.extend(jQuery.easing, {
  easeOutExpo: function(e, f, a, h, g) {
    return (f === g) ? a + h : h * (-Math.pow(2, -10 * f / g) + 1) + a;
  }
});
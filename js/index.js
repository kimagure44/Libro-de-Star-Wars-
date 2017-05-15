var app = 
{
    colorFilms: '#bcaaa4',
    colorPeople: '#ff8a65',
    colorPlanets: '#ffb74d',
    colorSpecies: '#aed581',
    colorStarships: '#4da0c1',
    colorVehicles: '#ef9a9a',
    currentPage: 1,
    url: "http://swapi.co/api/",
    allURL: ["films","people","planets","species","starships","vehicles"],
    apiPrincipal: 0,
    llamadaApiPrincipal: true,
    contArrayLlamadaPrincipal: 0,
    objetoAPI: [],
    splashscreen: function()
    {
        $("#splashscreen").addClass("hideSplash");
        $("#splashscreen").one("webkitAnimationEnd oanimationend msAnimationEnd animationend",function(e) { $(this).hide(); });
        $("#splashscreen").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(e) { $(this).hide(); });
        app.initialize();
    },
    dialogApp: function(message)
    {
        var html = '<dialog class="mdl-dialog">';
        html+= '<div class="mdl-dialog__content">';
        html+= '<p>';
        html+= message;
        html+= '</p>';
        html+= '</div>';
        html+= '<div class="mdl-dialog__actions">';
        html+= '<button type="button" class="mdl-button close">Ok</button>';
        html+= '</div>';
        html+= '</dialog>';
        $("#container").html(html);
        var dialog = document.querySelector('dialog');
        dialog.showModal();
        dialog.querySelector('.close').addEventListener('click', function() 
        {
            dialog.close();
        });
    },
    loadingResources: function(urlParam)
    {
        if (app.contArrayLlamadaPrincipal<app.allURL.length)
        {
            if (app.llamadaApiPrincipal)
            {
                app.llamadaApiPrincipal = false;
                var url;
                if (urlParam!==undefined) { url = urlParam; }
                else { url = app.url + app.allURL[app.contArrayLlamadaPrincipal]; }
                $.ajax(
                { 
                    url: url, 
                    type: "get", 
                    dataType: "json", 
                    cache: false,
                    success: function(data)
                    {
                        var tiempoLoad = ((app.contArrayLlamadaPrincipal+1) * 100) / app.allURL.length ;
                        $("#loadingResources > .progressbar.bar.bar1").css("width",tiempoLoad + "%");
                        var objDatos = [data.count, data.next, data.previous, data.results];
                        var objGrupo = [app.allURL[app.contArrayLlamadaPrincipal],objDatos];
                        app.objetoAPI.push(objGrupo);
                        if (data.next != null)
                        {
                            app.apiPrincipal++;
                            app.llamadaApiPrincipal = true;
                            app.loadingResources(data.next);
                        }
                        else
                        {
                            app.llamadaApiPrincipal = true;
                            app.contArrayLlamadaPrincipal++;                        
                            app.loadingResources();
                        }
                    }
                });
            }
        }
        else
        {
            app.splashscreen();
        }
    },
    initialize: function() { document.addEventListener('deviceready', app.onDeviceReady(), false); },
    onDeviceReady: function() 
    { 
        console.log(app.objetoAPI);
        $("#loadingResources").remove();
        $("#loadingData").css("top",($(window).height() / 2));
        $("a.mdl-navigation__link:nth-child(1)").css("background-color",app.colorFilms);
        $("a.mdl-navigation__link:nth-child(2)").css("background-color",app.colorPeople);
        $("a.mdl-navigation__link:nth-child(3)").css("background-color",app.colorPlanets);
        $("a.mdl-navigation__link:nth-child(4)").css("background-color",app.colorSpecies);
        $("a.mdl-navigation__link:nth-child(5)").css("background-color",app.colorStarships);
        $("a.mdl-navigation__link:nth-child(6)").css("background-color",app.colorVehicles);
        
        FastClick.attach(document.body);
        $("a").on("click",function()
        {
            $("header > .mdl-layout__drawer-button").click();
            app.loading(true);
            app.menuOptions($(this).attr("data-url"));
        });
        $("#rotateVideo").on("click",function()
        {
            if ($("#dialogVideo").attr("data-rotate") == 0)
            {
                $("#dialogVideo").css({"transform":"rotate(90deg) scale(1.7, 1.4)"});
                $("#dialogVideo").attr("data-rotate","90");
            }
            else
            {

                $("#dialogVideo").css({"transform":"rotate(0deg) scale(1, 1)"});
                $("#dialogVideo").attr("data-rotate","0");
            }
        });
        $("#closeDialog").on("click",function()
        {
            var dialog = document.querySelector('dialog');
            dialog.close();
            var video = document.getElementById("videos");
            video.pause();
            video.currentTime = 0;
        })
        $("#inputSearch").on("keyup", function(e)
        {
            if (e.keyCode == 13 && $(this).val().length > 0)
            {
                app.loading(true);
                $("#container").empty();
                var textoBuscar = $(this).val();
                var arrayNavbar = [0];
                var html = app.navbarPagination(arrayNavbar);
                $("#container").append(html);
                var totalRecors = 0;
                $(app.objetoAPI).each(function(i,v)
                {
                    if (/films/.test(v[0]))
                    {
                        var data = v[1];
                        if (data[0] !== undefined)
                        {
                            var totalRegistros = data[0];
                            var next = data[1];
                            var prev = data[2]
                            var results = data[3];
                            var resultsSort = app.sortByColumn(results, 'release_date');
                            var html = "";
                            $(resultsSort).each(function(i2,v2)
                            {
                                var urlFilm = v2['url'];
                                // Cuando fue creado el registro en la bbdd
                                var created = v2['created'];
                                // Cuando fue editado el registro en la bbdd
                                var edited = v2['edited'];
                                var ret = app.episode_id(v2['episode_id']);
                                var arrayImage = [ret[0]];
                                var arrayInfo = [v2['title'], v2['opening_crawl']];
                                var arrayInfoExtra = [v2['episode_id'], ret[1], v2['characters'], v2['planets'], v2['species'], v2['starships'], v2['vehicles']];
                                var arrayDirector = [v2['director'], v2['producer'], v2['release_date']];

                                var mostrar = true;
                                var miExpReg = new RegExp(textoBuscar,"i"); 
                                var t = v2['title']; 
                                var t1 = t.search(miExpReg);
                                var t = v2['opening_crawl']; 
                                var t2 = t.search(miExpReg);
                                var t = v2['director']; 
                                var t3 = t.search(miExpReg);
                                var t = v2['producer']; 
                                var t4 = t.search(miExpReg);
                                var t = v2['producer']; 
                                var t5 = t.search(miExpReg);
                                var t = v2['release_date']; 
                                var t6 = t.search(miExpReg);
                                if (t1<0 && t2<0 && t3<0 && t4<0 && t5<0 && t6<0) { mostrar = false; }
                                if (mostrar == true)
                                {
                                    html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="films">';
                                    html+= app.cardImage(arrayImage);
                                    html+= app.cardInfo(arrayInfo);
                                    html+= app.cardInfoExtra(arrayInfoExtra);
                                    html+= app.cardDirector(arrayDirector);
                                    html+= '</div>';    
                                    totalRecors++;
                                }
                            });
                            $("#container").append(html);
                        }
                        $("#container .demo-card-wide[data-type=films]").css("background-color",app.colorFilms);
                    }
                    if (/people/.test(v[0]))
                    {
                        var data = v[1];
                        if (data[0] !== undefined)
                        {
                            var totalRegistros = data[0];
                            var next = data[1];
                            var prev = data[2];
                            var results = data[3];
                            var html = "";
                            $(results).each(function(i2,v2)
                            {
                                var arrayDatosInfo = [v2['birth_year'],v2['eye_color'],v2['gender'],v2['hair_color'],v2['height'],v2['mass'],v2['name'],v2['skin_color'],v2['homeworld']];
                                var arrayDatosInfoExtra = [v2['films'],v2['species'],v2['starships'],v2['vehicles']];
                                var mostrar = true;
                                var miExpReg = new RegExp(textoBuscar,"i"); 
                                var t = v2['birth_year']; 
                                var t1 = t.search(miExpReg);
                                var t = v2['eye_color']; 
                                var t2 = t.search(miExpReg);
                                var t = v2['gender']; 
                                var t3 = t.search(miExpReg);
                                var t = v2['hair_color']; 
                                var t4 = t.search(miExpReg);
                                var t = v2['height']; 
                                var t5 = t.search(miExpReg);
                                var t = v2['mass']; 
                                var t6 = t.search(miExpReg);
                                var t = v2['name']; 
                                var t7 = t.search(miExpReg);
                                var t = v2['skin_color']; 
                                var t8 = t.search(miExpReg);
                                if (t1<0 && t2<0 && t3<0 && t4<0 && t5<0 && t6<0 && t7<0 && t8<0) { mostrar = false; }
                                if (mostrar == true)
                                {
                                    html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="people">';
                                    html+= app.cardImage(app.pictureCharacter(v2['name']));
                                    html+= app.cardInfoCharacters(arrayDatosInfo);
                                    html+= app.cardInforExtraCharacter(arrayDatosInfoExtra)
                                    html+= '</div>';
                                    totalRecors++;
                                }
                            })
                            $("#container").append(html);
                        }
                        $("#container .demo-card-wide[data-type=people]").css("background-color",app.colorPeople);
                    }
                    if (/planets/.test(v[0]))
                    {
                        var data = v[1];
                        if (data[0] !== undefined)
                        {
                            var totalRegistros = data[0];
                            var next = data[1];
                            var prev = data[2];
                            var results = data[3];
                            var html = "";
                            $(results).each(function(i2,v2)
                            {
                                var arrayDatos = [v2['climate'],v2['diameter'],v2['gravity'],v2['name'],v2['orbital_period'],v2['population'],v2['rotation_period'],v2['surface_water'],v2['terrain']];
                                var arrayDatosInfoExtra = [v2['films'],v2['residents']];
                                var mostrar = true;
                                var miExpReg = new RegExp(textoBuscar,"i"); 
                                var t = v2['climate']; 
                                var t1 = t.search(miExpReg);
                                var t = v2['diameter']; 
                                var t2 = t.search(miExpReg);
                                var t = v2['gravity']; 
                                var t3 = t.search(miExpReg);
                                var t = v2['name']; 
                                var t4 = t.search(miExpReg);
                                var t = v2['orbital_period']; 
                                var t5 = t.search(miExpReg);
                                var t = v2['population']; 
                                var t6 = t.search(miExpReg);
                                var t = v2['rotation_period']; 
                                var t7 = t.search(miExpReg);
                                var t = v2['surface_water']; 
                                var t8 = t.search(miExpReg);
                                var t = v2['terrain']; 
                                var t9 = t.search(miExpReg);
                                if (t1<0 && t2<0 && t3<0 && t4<0 && t5<0 && t6<0 && t7<0 && t8<0 && t9<0) { mostrar = false; }
                                if (mostrar == true)
                                {
                                    html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                                    html+= app.cardImage(app.picturePlanets(v2['name']));
                                    html+= app.cardInfoPlanets(arrayDatos);
                                    html+= app.cardInforExtraPlanets(arrayDatosInfoExtra)
                                    html+= '</div>';
                                    totalRecors++;
                                }
                            })
                            $("#container").append(html);
                        }
                        $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorPlanets);
                    }
                    if (/species/.test(v[0]))
                    {
                        var data = v[1];
                        if (data[0] !== undefined)
                        {
                            var totalRegistros = data[0];
                            var next = data[1];
                            var prev = data[2];
                            var results = data[3];
                            var html = "";
                            $(results).each(function(i2,v2)
                            {
                                var arrayDatos = [v2['average_height'],v2['average_lifespan'],v2['classification'],v2['designation'],v2['eye_colors'],v2['hair_colors'],v2['language'],v2['name'],v2['skin_colors']];
                                var arrayDatosInfoExtra = [v2['films'],v2['people']];
                                var mostrar = true;
                                var miExpReg = new RegExp(textoBuscar,"i"); 
                                var t = v2['average_height']; 
                                var t1 = t.search(miExpReg);
                                var t = v2['average_lifespan']; 
                                var t2 = t.search(miExpReg);
                                var t = v2['classification']; 
                                var t3 = t.search(miExpReg);
                                var t = v2['designation']; 
                                var t4 = t.search(miExpReg);
                                var t = v2['eye_colors']; 
                                var t5 = t.search(miExpReg);
                                var t = v2['hair_colors']; 
                                var t6 = t.search(miExpReg);
                                var t = v2['language']; 
                                var t7 = t.search(miExpReg);
                                var t = v2['name']; 
                                var t8 = t.search(miExpReg);
                                var t = v2['skin_colors']; 
                                var t9 = t.search(miExpReg);
                                if (t1<0 && t2<0 && t3<0 && t4<0 && t5<0 && t6<0 && t7<0 && t8<0 && t9<0) { mostrar = false; }
                                if (mostrar == true)
                                {
                                    html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                                    html+= app.cardImage(app.pictureSpecies(v2['name']));
                                    html+= app.cardInfoSpecies(arrayDatos);
                                    html+= app.cardInforExtraSpecies(arrayDatosInfoExtra)
                                    html+= '</div>';
                                    totalRecors++;
                                }
                            })
                            $("#container").append(html);
                        }
                        $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorPlanets);
                    }
                    if (/starships/.test(v[0]))
                    {
                        var data = v[1];
                        if (data[0] !== undefined)
                        {
                            var totalRegistros = data[0];
                            var next = data[1];
                            var prev = data[2];
                            var results = data[3];
                            var html = "";
                            $(results).each(function(i2,v2)
                            {
                                var arrayDatos = [v2['MGLT'],v2['cargo_capacity'],v2['consumables'],v2['cost_in_credits'],v2['crew'],v2['hyperdrive_rating'],v2['length'],v2['manufacturer'],v2['max_atmosphering_speed'],v2['model'],v2['name'],v2['passengers'],v2['starship_class']];
                                var arrayDatosInfoExtra = [v2['films'],v2['pilots']];
                                var mostrar = true;
                                var miExpReg = new RegExp(textoBuscar,"i"); 
                                var t = v2['MGLT']; 
                                var t1 = t.search(miExpReg);
                                var t = v2['cargo_capacity']; 
                                var t2 = t.search(miExpReg);
                                var t = v2['consumables']; 
                                var t3 = t.search(miExpReg);
                                var t = v2['cost_in_credits']; 
                                var t4 = t.search(miExpReg);
                                var t = v2['crew']; 
                                var t5 = t.search(miExpReg);
                                var t = v2['hyperdrive_rating']; 
                                var t6 = t.search(miExpReg);
                                var t = v2['length']; 
                                var t7 = t.search(miExpReg);
                                var t = v2['name']; 
                                var t8 = t.search(miExpReg);
                                var t = v2['manufacturer']; 
                                var t9 = t.search(miExpReg);
                                var t = v2['max_atmosphering_speed']; 
                                var t10 = t.search(miExpReg);
                                var t = v2['model']; 
                                var t11 = t.search(miExpReg);
                                var t = v2['name']; 
                                var t12 = t.search(miExpReg);
                                var t = v2['passengers']; 
                                var t13 = t.search(miExpReg);
                                var t = v2['starship_class']; 
                                var t14 = t.search(miExpReg);
                                if (t1<0 && t2<0 && t3<0 && t4<0 && t5<0 && t6<0 && t7<0 && t8<0 && t9<0 && t10<0 && t11<0 && t12<0 && t13<0 && t14<0) { mostrar = false; }
                                if (mostrar == true)
                                {
                                    html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                                    html+= app.cardImage(app.pictureStarships(v2['name']));
                                    html+= app.cardInfoStarships(arrayDatos);
                                    html+= app.cardInforExtraStarships(arrayDatosInfoExtra)
                                    html+= '</div>';
                                    totalRecors++;
                                }
                            })
                            $("#container").append(html);
                        }
                        $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorPlanets);
                    }
                })
                $("#container > table > tbody > tr > td").html("Showing " + totalRecors + " records");
            }
        });
        this.initAd(); 
    },

    openSubmenu: function(obj)
    {
        if ($(obj).attr("data-open") == 0)        
        {
            $(obj).attr("data-open","1");
            $(obj).children("i").removeClass('submenuClose');
            $(obj).children("ul").removeClass('hideSubmenuUL');
        }
        else
        {
            $(obj).attr("data-open","0");
            $(obj).children("i").addClass('submenuClose');
            $(obj).children("ul").addClass('hideSubmenuUL');
        }
        
    },
    initAd: function()
    {
        // ADMOB LIGHTSABER
        if ( window.plugins && window.plugins.AdMob ) 
        {
            var ad_units = 
            {
                ios : 
                {
                    banner: 'ca-app-pub-5933435613682623/6903142998',       //PUT ADMOB ADCODE HERE 
                    interstitial: 'ca-app-pub-5933435613682623/9856609397'  //PUT ADMOB ADCODE HERE 
                },
                android : 
                {
                    banner: 'ca-app-pub-5933435613682623/6903142998',       //PUT ADMOB ADCODE HERE 
                    interstitial: 'ca-app-pub-5933435613682623/9856609397'  //PUT ADMOB ADCODE HERE 
                }
            };
            var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
            window.plugins.AdMob.setOptions( 
            {
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,  //use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD 
                bannerAtTop: false, // set to true, to put banner at top 
                overlap: true, // banner will overlap webview  
                offsetTopBar: false, // set to true to avoid ios7 status bar overlap 
                isTesting: false, // receiving test ad 
                autoShow: true // auto show interstitial ad when loaded 
            });
            this.registerAdEvents();
            window.plugins.AdMob.createBannerView();
            //window.plugins.AdMob.createInterstitialView();  //get the interstitials ready to be shown 
            //window.plugins.AdMob.requestInterstitialAd();
        } 
        else 
        {
            //alert( 'admob plugin not ready' ); 
        }
    },
    registerAdEvents: function() 
    {
        document.addEventListener('onReceiveAd', function()
        {

        });
        document.addEventListener('onFailedToReceiveAd', function(data)
        {

        });
        document.addEventListener('onPresentAd', function()
        {

        });
        document.addEventListener('onDismissAd', function()
        { 

        });
        document.addEventListener('onLeaveToAd', function()
        { 

        });
        document.addEventListener('onReceiveInterstitialAd', function()
        { 

        });
        document.addEventListener('onPresentInterstitialAd', function()
        { 

        });
        document.addEventListener('onDismissInterstitialAd', function()
        {
            //window.plugins.AdMob.createInterstitialView();          //REMOVE THESE 2 LINES IF USING AUTOSHOW 
            //window.plugins.AdMob.requestInterstitialAd();           //get the next one ready only after the current one is closed 
        });
    },
    episode_id: function(episode_id)
    {
        var img = "img/films/";
        var tituloVideo;
        if (episode_id == 1) 
        { 
            img+= "Star_Wars_epI.jpg"; 
            tituloVideo = "Qui-Gon vs Darth Maul (Tatooine) - The Phantom Menace [1080p HD]";
        }
        if (episode_id == 2) 
        { 
            img+= "Episode_two_poster.jpg"; 
            tituloVideo = "Star Wars Episode II - Battle of Geonosis HD";
        }
        if (episode_id == 3) 
        { 
            img+= "Ep3_poster.jpg"; 
            tituloVideo = "Obi-Wan and Anakin vs Count Dooku - Revenge of the Sith [1080p HD]";
        }
        if (episode_id == 4) 
        { 
            img+= "EpisodioIV.jpg"; 
            tituloVideo = "Opening Scene (1977) [1080p HD]";
        }
        if (episode_id == 5) 
        { 
            img+= "EpV.jpg"; 
            tituloVideo = "Opening Scene - Empire Strikes Back [1080p HD]";
        }
        if (episode_id == 6) 
        { 
            img+= "ReturnOfTheJediPoster1983.jpg"; 
            tituloVideo = "Star Wars: Return of the Jedi VI - Battle of Endor (Space Only) 1080p";
        }
        if (episode_id == 7) 
        { 
            img+= "Star_Wars_Episode_VII_The_Force_Awakens.png"; 
            tituloVideo = "Star Wars The Force Awakens Millenium Falcon Scene HD";
        }
        var ret = [img,tituloVideo];
        return ret;
    },
    cardImage: function(arrayDatos)
    {
        // Imagen CARD
        html= '<div class="mdl-card__media">';
        html+= '<img src="' + arrayDatos[0] + '" width="100%" height="auto" border="0" alt=""  />';
        html+= '</div>';
        // Fin imagen CARD
        return html;
    },
    cardInfo: function(arrayDatos)
    {
        // Titulo y descripción de CARD
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[0] + '</b></h2><br>';
        html+= '<div class="textJustify">' + arrayDatos[1] + '</div>';
        html+= '</div>';
        // Fin titulo y descripcion de CARD
        return html;
    },
    convertirLinkInfoExtra: function(type, valor)
    {
        var ret = [];
        var salir = false;
        $(app.objetoAPI).each(function(i,v)
        {
            if (salir == true) { return false; }
            var miExpReg = new RegExp(type,"i"); 
            var t = v[0];
            var t1 = t.search(miExpReg);
            if (t1>=0)
            {
                var objAPI = v[1];
                var obj = objAPI[3];
                $(obj).each(function(i2,v2)
                {
                    if (valor === v2['url'])
                    {
                        if (/people/.test(type))
                        {
                            ret[0] = v2['name'];
                            ret[1] = v2['url'];
                        }
                        if (/planets/.test(type))
                        {
                            ret[0] = v2['name'];
                            ret[1] = v2['url'];
                        }
                        if (/species/.test(type))
                        {
                            ret[0] = v2['name'];
                            ret[1] = v2['url'];
                        }
                        if (/starships/.test(type))
                        {
                            ret[0] = v2['name'];
                            ret[1] = v2['url'];
                        }
                        if (/vehicles/.test(type))
                        {
                            ret[0] = v2['name'];
                            ret[1] = v2['url'];
                        }
                        if (/films/.test(type))
                        {
                            ret[0] = v2['episode_id'];
                            ret[1] = v2['url'];
                            ret[2] = v2['title'];
                        }
                        salir = true;
                        return false;
                    }
                });
            }
        })
        return ret;
    },
    cardInfoExtra: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Video <b>(1)</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulVideo hideSubmenuUL transicion">';
        html+= '<span class="mdl-list__item-primary-content" onclick="app.video(' + arrayDatos[0] + ')">' + arrayDatos[1] + '</span>';
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Characters <b>(' + arrayDatos[2].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[2]).each(function(icharacter,vcharacter) 
        { 
            var character = app.convertirLinkInfoExtra("people",vcharacter);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureCharacter(character[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + character[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Planets <b>(' + arrayDatos[3].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[3]).each(function(iplanets,vplanets) 
        { 
            var planets = app.convertirLinkInfoExtra("planets",vplanets);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.picturePlanets(planets[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + planets[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Species <b>(' + arrayDatos[4].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulSpecies hideSubmenuUL transicion">';
        $(arrayDatos[4]).each(function(ispecies,vspecies) 
        { 
            var species = app.convertirLinkInfoExtra("species",vspecies);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureSpecies(species[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + species[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Starships <b>(' + arrayDatos[5].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulStarships hideSubmenuUL transicion">';
        $(arrayDatos[5]).each(function(istarships,vstarships) 
        { 
            var starships = app.convertirLinkInfoExtra("starships",vstarships);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureStarships(starships[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + starships[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Vehicles <b>(' + arrayDatos[6].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulVehicles hideSubmenuUL transicion">';
        $(arrayDatos[6]).each(function(ivehicles,vvehicles) 
        { 
            var vehicles = app.convertirLinkInfoExtra("vehicles",vvehicles);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureVehicles(vehicles[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + vehicles[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInforExtraCharacter: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Films <b>(' + arrayDatos[0].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[0]).each(function(ifilms,vfilms) 
        { 
            var films = app.convertirLinkInfoExtra("films",vfilms);
            var img = app.episode_id(films[0]);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + img[0] + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + films[2] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Species <b>(' + arrayDatos[1].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[1]).each(function(ispecies,vspecies) 
        { 
            var species = app.convertirLinkInfoExtra("species",vspecies);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureSpecies(species[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + species[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Starships <b>(' + arrayDatos[2].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulSpecies hideSubmenuUL transicion">';
        $(arrayDatos[2]).each(function(istarships,vstarships) 
        { 
            var starships = app.convertirLinkInfoExtra("starships",vstarships);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureStarships(starships[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + starships[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Vehicles <b>(' + arrayDatos[3].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulStarships hideSubmenuUL transicion">';
        $(arrayDatos[3]).each(function(ivehicles,vvehicles) 
        { 
            var vehicles = app.convertirLinkInfoExtra("vehicles",vvehicles);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureVehicles(vehicles[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + vehicles[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInforExtraPlanets: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Films <b>(' + arrayDatos[0].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[0]).each(function(ifilms,vfilms) 
        { 
            var films = app.convertirLinkInfoExtra("films",vfilms);
            var img = app.episode_id(films[0]);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + img[0] + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + films[2] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Residents <b>(' + arrayDatos[1].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[1]).each(function(iresidents,vresidents) 
        { 
            var character = app.convertirLinkInfoExtra("people",vresidents);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureCharacter(character[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + character[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInforExtraSpecies: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Films <b>(' + arrayDatos[0].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[0]).each(function(ifilms,vfilms) 
        { 
            var films = app.convertirLinkInfoExtra("films",vfilms);
            var img = app.episode_id(films[0]);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + img[0] + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + films[2] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Species <b>(' + arrayDatos[1].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[1]).each(function(ispecies,vspecies) 
        { 
            var character = app.convertirLinkInfoExtra("people",vspecies);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureCharacter(character[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + character[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInforExtraStarships: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Films <b>(' + arrayDatos[0].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[0]).each(function(ifilms,vfilms) 
        { 
            var films = app.convertirLinkInfoExtra("films",vfilms);
            var img = app.episode_id(films[0]);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + img[0] + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + films[2] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Pilots <b>(' + arrayDatos[1].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[1]).each(function(ipilots,vpilots) 
        { 
            var character = app.convertirLinkInfoExtra("people",vpilots);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureCharacter(character[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + character[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInforExtraVehicles: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>Extra information</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Films <b>(' + arrayDatos[0].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulCharacter hideSubmenuUL transicion">';
        $(arrayDatos[0]).each(function(ifilms,vfilms) 
        { 
            var films = app.convertirLinkInfoExtra("films",vfilms);
            var img = app.episode_id(films[0]);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + img[0] + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + films[2] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '<li onclick="app.openSubmenu(this)" data-open="0">';
        html+= '<i class="material-icons mdl-list__item-icon submenuClose transicion">arrow_drop_down</i>';
        html+= '<span class="mdl-list__item-primary-content">Pilots <b>(' + arrayDatos[1].length + ')</b></span>';
        html+= '<ul class="demo-list-item mdl-list ulPlanets hideSubmenuUL transicion">';
        $(arrayDatos[1]).each(function(ipilots,vpilots) 
        { 
            var character = app.convertirLinkInfoExtra("people",vpilots);
            html+= '<li class="">';
            html+= '<span class="mdl-list__item-primary-content">';
            html+= '<i class="material-icons mdl-list__item-avatar"><img src="' + app.pictureCharacter(character[0]) + '" class="iconoStyle" /></i>';
            html+= '<span class="ajustarLI">' + character[0] + '</span>';
            html+= '</span>';
            html+= '</span>';
            html+= '</li>';
        });
        html+= '</ul>';
        html+= '</li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardDirector: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<b>Director:</b> ' + arrayDatos[0] + "<br>";
        html+= '<b>Producer:</b> ' + arrayDatos[1] + "<br>";
        html+= '<b>Release date:</b> ' + arrayDatos[2] + "<br>";
        html+= '</div>';
        return html;
    },
    navbarPagination: function(arrayDatos)
    {
        html= '<table class="mdl-data-table mdl-shadow--2dp customTable">';
        html+= '<tbody>';
        html+= '<tr>';
        html+= '<td class="textCenter">Showing ' + arrayDatos[0] + ' records</td>';
        html+= '</tr>';
        html+= '</tbody>';
        html+= '</table>';
        return html;
    },
    pictureCharacter: function(character)
    {
        var img = "img/people/";
        if (character.indexOf("Luke Skywalker") >= 0) { img+= "Luke-rotjpromo.jpg"; }
        if (character.indexOf("C-3PO") >= 0) { img+= "C-3PO_EP3.png"; }
        if (character.indexOf("R2-D2") >= 0) { img+= "ArtooTFA2-Fathead.png"; }
        if (character.indexOf("Darth Vader") >= 0 || character.indexOf("Anakin Skywalker") >= 0) { img+= "Anakin_Skywalker_RotS.png"; }
        if (character.indexOf("Leia Organa") >= 0) { img+= "Leia_endorpromo02.jpg"; }
        if (character.indexOf("Owen Lars") >= 0) { img+= "Owenlars.jpg"; }
        if (character.indexOf("Beru Whitesun lars") >= 0) { img+= "Beru_headshot2.jpg"; }
        if (character.indexOf("R5-D4") >= 0) { img+= "R5d4.jpg"; }
        if (character.indexOf("Biggs Darklighter") >= 0) { img+= "Biggs.jpg"; }
        if (character.indexOf("Obi-Wan Kenobi") >= 0) { img+= "ObiWanHS-SWE.jpg"; }
        if (character.indexOf("Wilhuff Tarkin") >= 0) { img+="Tarkininfobox.jpg"; }
        if (character.indexOf("Chewbacca") >= 0) { img+= "Chewbacca-TFA.png"; }
        if (character.indexOf("Han Solo") >= 0) { img+= "TFAHanSolo.png"; }
        if (character.indexOf("Greedo") >= 0) { img+= "Greedo.jpg"; }
        if (character.indexOf("Jabba Desilijic Tiure") >= 0) { img+= "Jabba_HS.jpg"; }
        if (character.indexOf("Wedge Antilles") >= 0) { img+= "WedgeHelmetless-ROTJHD.jpg"; }
        if (character.indexOf("Jek Tono Porkins") >= 0) { img+= "Porkins.jpg"; }
        if (character.indexOf("Yoda") >= 0) { img+= "Yoda.jpg"; }
        if (character.indexOf("Palpatine") >= 0) { img+= "Emperor_Sidious.png"; }
        if (character.indexOf("Boba Fett") >= 0) { img+= "BobaFettMain2.jpg"; }
        if (character.indexOf("IG-88") >= 0) { img+= "IG-88.jpg"; }
        if (character.indexOf("Bossk") >= 0) { img+= "Bossk.png"; }
        if (character.indexOf("Lando Calrissian") >= 0) { img+= "Lando_WoSW.jpg"; }
        if (character.indexOf("Lobot") >= 0) { img+= "250px-Lobot_b_tm.jpg"; }
        if (character.indexOf("Ackbar") >= 0) { img+= "Gial_Ackbar_Resistance.jpg"; }
        if (character.indexOf("Mon Mothma") >= 0) { img+= "Monmothma.jpg"; }
        if (character.indexOf("Arvel Crynyd") >= 0) { img+= "Arvel-crynyd.jpg"; }
        if (character.indexOf("Wicket Systri Warrick") >= 0) { img+="Wicket_detail.png"; }
        if (character.indexOf("Nien Nunb") >= 0) { img+= "Nien_Nunb.jpg"; }
        if (character.indexOf("Qui-Gon Jinn") >= 0) { img+= "QuiGon.jpg"; }
        if (character.indexOf("Nute Gunray") >= 0) { img+= "Nutegunraygeonosis.jpg"; }
        if (character.indexOf("Finis Valorum") >= 0) { img+= "ValorumPortrait-SWE.png"; }
        if (character.indexOf("Jar Jar Binks") >= 0) { img+= "Jarjar.jpg"; }
        if (character.indexOf("Roos Tarpals") >= 0) { img+= "TarpalsHS.jpg"; }
        if (character.indexOf("Rugor Nass") >= 0) { img+= "Bossnass.jpg"; }
        if (character.indexOf("Ric") >= 0) { img+= "RicOlie.jpg"; }
        if (character.indexOf("Watto") >= 0) { img+= "WattoEp1TPM.jpg"; }
        if (character.indexOf("Sebulba") >= 0) { img+= "Sebulba.jpg"; }
        if (character.indexOf("Quarsh Panaka") >= 0) { img+= "Panaka_btm.jpg"; }        
        if (character.indexOf("Shmi Skywalker") >= 0) { img+= "ShmiHS-SWE.jpg"; }
        if (character.indexOf("Darth Maul") >= 0) { img+= "Darth_Maul_profile.png"; }
        if (character.indexOf("Bib Fortuna") >= 0) { img+= "Sleasy.jpg"; }
        if (character.indexOf("Ayla Secura") >= 0) { img+= "Aayla_Secura_SWE.png"; }
        if (character.indexOf("Dud Bolt") >= 0) { img+="Bolt.jpg"; }
        if (character.indexOf("Gasgano") >= 0) { img+= "Gasganp.jpg"; }
        if (character.indexOf("Ben Quadinaros") >= 0) { img+= "Toong_AA.JPG"; }
        if (character.indexOf("Mace Windu") >= 0) { img+= "Mace_Windu.jpg"; }
        if (character.indexOf("Ki-Adi-Mundi") >= 0) { img+= "KiAdiMundi.jpg"; }
        if (character.indexOf("Kit Fisto") >= 0) { img+= "Fisto.png"; }
        if (character.indexOf("Eeth Koth") >= 0) { img+= "Eeth_Koth_profile.png"; }
        if (character.indexOf("Adi Gallia") >= 0) { img+= "AdiGallia2-SWE.jpg"; }
        if (character.indexOf("Saesee Tiin") >= 0) { img+= "Iktotchi_AA.JPG"; }
        if (character.indexOf("Yarael Poof") >= 0) { img+= "YaraelPoof.jpg"; }
        if (character.indexOf("Plo Koon") >= 0) { img+= "Plo_Koon_TPM.png"; }
        if (character.indexOf("Mas Amedda") >= 0) { img+= "Mas12432.jpg"; }
        if (character.indexOf("Gregar Typho") >= 0) { img+= "Gregar_Typho.jpg"; }
        if (character.indexOf("Cord") >= 0) { img+= "Corde.jpg"; }
        if (character.indexOf("Cliegg Lars") >= 0) { img+= "ClieggLarsHS-SWE.jpg"; }
        if (character.indexOf("Poggle the Lesser") >= 0) { img+= "Poggle_HS.jpg"; }                    
        if (character.indexOf("Luminara Unduli") >= 0) { img+= "Luminaraprofile.jpg"; }
        if (character.indexOf("Barriss Offee") >= 0) { img+= "Barrisprofile2.jpg"; }
        if (character.indexOf("Dorm") >= 0) { img+= "Dormesenate.jpg"; }
        if (character.indexOf("Dooku") >= 0) { img+= "Count_Dooku_headshot_gaze.jpg"; }
        if (character.indexOf("Bail Prestor Organa") >= 0) { img+= "Bail_Organa_Mug.jpg"; }
        if (character.indexOf("Jango Fett") >= 0) { img+= "JangoInfobox.png"; }
        if (character.indexOf("Zam Wesell") >= 0) { img+= "Zamaotc.jpg"; }
        if (character.indexOf("Dexter Jettster") >= 0) { img+= "DexterHS-SWE.jpg"; }
        if (character.indexOf("Lama Su") >= 0) { img+= "Lama_Su.jpg"; }
        if (character.indexOf("Taun We") >= 0) { img+= "Taun_We.jpg"; }
        if (character.indexOf("Jocasta Nu") >= 0) { img+= "Jocasta_Nu_SWE.png"; }
        if (character.indexOf("Ratts Tyerell") >= 0) { img+= "RattsHS.jpg"; }
        if (character.indexOf("R4-P17") >= 0) { img+= "R4-P17.jpg"; }
        if (character.indexOf("Wat Tambor") >= 0) { img+= "TamborBoomHeadshot.jpg"; }
        if (character.indexOf("San Hill") >= 0) { img+= "San_hill.jpg"; }
        if (character.indexOf("Shaak Ti") >= 0) { img+= "Shaak_Ti_closeup-SWE.png"; }
        if (character.indexOf("Grievous") >= 0) { img+= "Grievoushead.jpg"; }
        if (character.indexOf("Tarfful") >= 0) { img+= "Tarffulprofile.jpg"; }
        if (character.indexOf("Raymus Antilles") >= 0) { img+= "RaymusAntilles.jpg"; }
        if (character.indexOf("Sly Moore") >= 0) { img+= "Sly_moore.jpg"; }
        if (character.indexOf("Tion Medon") >= 0) { img+= "Tion.jpg"; }
        if (character.indexOf("Finn") >= 0) { img+= "Finn1.png"; }
        if (character.indexOf("Rey") >= 0) { img+= "Rey_infobox.png"; }
        if (character.indexOf("Poe Dameron") >= 0) { img+= "PoeDameronHS-Fathead.png"; }
        if (character.indexOf("BB8") >= 0) { img+= "BB8-Fathead.png"; }
        if (character.indexOf("Captain Phasma") >= 0) { img+= "Capitana_Phasma.png"; }
        if (character.indexOf("Amidala") >= 0) { img+= "Padme_episodeIII_green.png"; }
        var ret = [img];
        return ret;
    },
    cardInfoCharacters: function(arrayDatos)
    {
        // Titulo y descripción de CARD
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[6] + '</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Birth year: </b>' + arrayDatos[0] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Eye color: </b>' + arrayDatos[1] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Gender: </b>' + arrayDatos[2] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Hair color: </b>' + arrayDatos[3] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Height: </b>' + arrayDatos[4] + ' cm</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Mass: </b>' + arrayDatos[5] + ' kg</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Skin color: </b>' + arrayDatos[7] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Homeworld: </b>' + arrayDatos[8] + '</span></li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    
    picturePlanets: function(planets)
    {
        var img = "img/planets/";
        if (planets.indexOf("Alderaan") >= 0) { img+= "Alderaan.jpg"; }
        if (planets.indexOf("Yavin IV") >= 0) { img+= "Eaw_Yavin4.jpg"; } 
        if (planets.indexOf("Hoth") >= 0) { img+= "Hoth_SWCT.png"; }
        if (planets.indexOf("Dagobah") >= 0) { img+= "Dagobah_ep3.jpg"; }
        if (planets.indexOf("Bespin") >= 0) { img+= "Bespin_TESB.png"; }
        if (planets.indexOf("Endor") >= 0) { img+= "Endor-DB.png"; }
        if (planets.indexOf("Naboo") >= 0) { img+= "NabooFull-SW.png"; }
        if (planets.indexOf("Coruscant") >= 0) { img+= "CoruscantGlobeE1.png"; }
        if (planets.indexOf("Kamino") >= 0) { img+= "Kamino-DB.png";}
        if (planets.indexOf("Geonosis") >= 0) { img+= "Geonosis_AotC.png"; }
        if (planets.indexOf("Utapau") >= 0) { img+= "UtapauRotS.png"; }
        if (planets.indexOf("Mustafar") >= 0) { img+= "Mustafar_DB.png"; }
        if (planets.indexOf("Kashyyyk") >= 0) { img+= "Kashyyk_Ghost_Raid.png"; }
        if (planets.indexOf("Polis Massa") >= 0) { img+= "Polis_Massa_surface.jpg"; }
        if (planets.indexOf("Mygeeto") >= 0) { img+= "Mygeeto_bridge_battle.png"; }
        if (planets.indexOf("Felucia") >= 0) { img+= "BlockadeofFelucia.png"; }
        if (planets.indexOf("Cato Neimoidia") >= 0) { img+= "CatoNeimoidia-SS.png"; }
        if (planets.indexOf("Saleucami") >= 0) { img+= "Saleucami-TD.png"; }
        if (planets.indexOf("Stewjon") >= 0) { img+= "NSLegitalplanet.jpg"; }
        if (planets.indexOf("Eriadu") >= 0) { img+= "Eriadu.jpg"; }
        if (planets.indexOf("Corellia") >= 0) { img+= "Espacio_Corellia.jpg"; }
        if (planets.indexOf("Rodia") >= 0) { img+= "Rodia_canon.png"; }
        if (planets.indexOf("Nal Hutta") >= 0) { img+= "NalHutta-HFZ.png"; }
        if (planets.indexOf("Dantooine") >= 0) { img+= "Dant-eaw.jpg"; }
        if (planets.indexOf("Bestine IV") >= 0) { img+= "Bestine_eaw.jpg"; }
        if (planets.indexOf("Ord Mantell") >= 0) { img+= "Ord_Mantell_EotECR.png"; }
        if (planets.indexOf("unknown") >= 0) { img+= "Unkwld_space.jpg"; }
        if (planets.indexOf("Trandosha") >= 0) { img+= "Trandosha-PL.png"; }
        if (planets.indexOf("Socorro") >= 0) { img+= "d4f006769bcce0c7101b421790e24c54.jpg"; }
        if (planets.indexOf("Mon Cala") >= 0) { img+= "Mon_Calamari.png"; }
        if (planets.indexOf("Chandrila") >= 0) { img+= "Chandrila.jpg"; }
        if (planets.indexOf("Sullust") >= 0) { img+= "Sullust_DICE.png"; }
        if (planets.indexOf("Toydaria") >= 0) { img+= "Toydaria-TCW.png"; }
        if (planets.indexOf("Malastare") >= 0) { img+= "Malastare_landscape.png"; }
        if (planets.indexOf("Dathomir") >= 0) { img+= "Dathomir-Massacre.png"; }
        if (planets.indexOf("Ryloth") >= 0) { img+= "Ryloth_Rebels.png"; }
        if (planets.indexOf("Aleen Minor") >= 0) { img+= "Aleen_NEGAS.jpg"; }
        if (planets.indexOf("Vulpter") >= 0) { img+= "Vulpter_FF7.jpg"; }
        if (planets.indexOf("Troiken") >= 0) { img+= "Troiken_FFG.png"; }
        if (planets.indexOf("Tund") >= 0) { img+= "Tund_FFG.png"; }
        if (planets.indexOf("Haruun Kal") >= 0) { img+= "HaruunKalCSWE.JPG"; }
        if (planets.indexOf("Cerea") >= 0) { img+= "Cerea_-_sw_galactic_atlas.png"; }
        if (planets.indexOf("Glee Anselm") >= 0){ img+= "Glee_Anselm_fuel_log.png"; }
        if (planets.indexOf("Iridonia") >= 0) { img+= "Iridonia_FFG.png"; }
        if (planets.indexOf("Tholoth") >= 0) { img+= "CaridaSpace.jpg"; }
        if (planets.indexOf("Iktotch") >= 0) { img+= "Iktotchon_NEGAS.jpg"; }
        if (planets.indexOf("Quermia") >= 0) { img+= "Quermia_Atlas.png"; }
        if (planets.indexOf("Dorin") >= 0) { img+= "Dorin_NEGAS.jpg";}
        if (planets.indexOf("Champala") >= 0) { img+= "Champala_NEGAS.jpg"; }
        if (planets.indexOf("Mirial") >= 0) { img+= "image.jpg"; }
        if (planets.indexOf("Serenno") >= 0) { img+= "Serenno-Massacre.png"; }
        if (planets.indexOf("Concord Dawn") >= 0) { img+= "Concord_Dawn_system.png"; }
        if (planets.indexOf("Zolan") >= 0) { img+= "Zolan.jpg"; }
        if (planets.indexOf("Ojom") >= 0) { img+= "AlzocPlanet.jpg"; }
        if (planets.indexOf("Skako") >= 0) { img+= "Skako_FFG.png"; }
        if (planets.indexOf("Muunilinst") >= 0) { img+= "Muunilinst.jpg"; }
        if (planets.indexOf("Shili") >= 0) { img+= "Shili_and_balnab_-_sw_galactic_atlas.png"; }
        if (planets.indexOf("Kalee") >= 0) { img+= "KaleePlanet.jpg"; }
        if (planets.indexOf("Umbara") >= 0) { img+= "UmbaraSystem-DoU.jpg"; }
        if (planets.indexOf("Tatooine") >= 0) { img+= "Tatooine_TPM.png"; }
        if (planets.indexOf("Jakku") >= 0)  { img+= "Jakku_-_full_-_SW_Poe_Dameron_Flight_Log_.png"; }
        var ret = [img];
        return ret;
    },
    pictureSpecies: function(species)
    {
        var img = "img/species/";
        if (species.indexOf("Hutt") >= 0)  { img+= "JabbaPromo.png"; }
        if (species.indexOf("Yoda's species") >= 0)  { img+= "MP-YodaSpecies.png"; }
        if (species.indexOf("Trandoshan") >= 0)  { img+= "Bossk_full_body.png"; }
        if (species.indexOf("Mon Calamari") >= 0)  { img+= "The_Mon_Calamari.png"; }
        if (species.indexOf("Ewok") >= 0)  { img+= "Ewoks_Encyclopedia.png"; }
        if (species.indexOf("Sullustan") >=0) { img+= "Sullustan_DICE.png"; }
        if (species.indexOf("Neimodian") >=0) { img+= "NeimoidiansSWE.png"; }
        if (species.indexOf("Gungan") >=0) { img+= "Gungans.png"; }
        if (species.indexOf("Toydarian") >=0) { img+= "Wattoep2promotionalfull.jpg"; }
        if (species.indexOf("Dug") >=0) { img+= "Dug_full_body.png"; }
        if (species.indexOf("Twi'lek") >=0) { img+= "Twileks.png"; }
        if (species.indexOf("Aleena") >=0) { img+= "Databank_aleena.png"; }
        if (species.indexOf("Vulptereen") >=0) { img+= "Dud_Bolt_FF_Scan.png"; }
        if (species.indexOf("Xexto") >=0) { img+= "Gasgano.jpg"; }
        if (species.indexOf("Toong") >=0) { img+= "BenQuadinarosFull-SWE.png"; }
        if (species.indexOf("Cerean") >=0) { img+= "Mundi_bodyshot.png"; }
        if (species.indexOf("Nautolan") >=0) { img+= "KitFisto-SithSnapshot.jpg"; }
        if (species.indexOf("Zabrak") >=0) { img+= "Zabrak_DICE.png"; }
        if (species.indexOf("Tholothian") >=0) { img+= "AdiGallia2-SWE.jpg"; }
        if (species.indexOf("Iktotchi") >=0) { img+= "Iktotchi_AA.JPG"; }
        if (species.indexOf("Quermian") >=0) { img+= "Yarael_Poof_USW.png"; }
        if (species.indexOf("Kel Dor") >=0) { img+= "Plokoon_detail.png"; }
        if (species.indexOf("Chagrian") >=0) { img+= "Mas_Amedda_SWE.png"; }
        if (species.indexOf("Geonosian") >=0) { img+= "GeonosianWarriors-LaPR.jpg"; }
        if (species.indexOf("Mirialan") >=0) { img+= "Luminara_Unduli_Barriss_Offee_TCW.png"; }
        if (species.indexOf("Clawdite") >=0) { img+= "Clawdite.jpg"; }
        if (species.indexOf("Besalisk") >=0) { img+= "Dexter_Jettster_(Besalisk)_FF44.jpg"; }
        if (species.indexOf("Kaminoan") >=0) { img+= "HalleBurtoni-TCWCE.jpg"; }
        if (species.indexOf("Skakoan") >=0) { img+= "Wat_Tambor_SWE.png"; }
        if (species.indexOf("Muun") >=0) { img+= "SanHill_hs.jpg"; }
        if (species.indexOf("Togruta") >=0) { img+= "ShaatTi-SWE.png"; }
        if (species.indexOf("Kaleesh") >=0) { img+= "Pre-robo_grievous.png"; }
        if (species.indexOf("Pau'an") >=0) { img+= "Tion_Medon.jpg"; }
        if (species.indexOf("Wookiee") >=0) { img+= "Chewie19BBY-CVD.jpg"; }
        if (species.indexOf("Droid") >=0) { img+= "Droid_Counterparts_Fathead.png"; }
        if (species.indexOf("Human") >=0) { img+= "Leiadeathstar.jpg"; }
        if (species.indexOf("Rodian") >=0) { img+= "Rodian_DICE.png"; }
        var ret = [img];
        return ret;
    },
    pictureStarships: function(species)
    {
        var img = "img/starships/";
        if (species.indexOf("Sentinel-class landing craft") >= 0)  { img+= "Imperial_Sentinel-class_shuttle.png"; }
        if (species.indexOf("Death Star") >= 0)  { img+= "DeathStar1-SWE.png"; }
        if (species.indexOf("Millennium Falcon") >= 0)  { img+= "MillenniumFalconTFA-Fathead.png"; }        
        if (species.indexOf("Y-wing") >= 0)  { img+= "Y-wing.png"; }
        if (species.indexOf("X-wing") == 0)  { img+= "Xwing-SWB.jpg"; }
        if (species.indexOf("TIE Advanced x1") >= 0)  { img+= "Vader_TIEAdvanced_SWB.png"; }
        if (species.indexOf("Executor") >= 0)  { img+= "Executor-SWE.png"; }
        if (species.indexOf("Slave 1") >= 0)  { img+= "Slave_I_DICE.png"; }
        if (species.indexOf("Imperial shuttle") >= 0)  { img+= "Imperial_shuttle.png"; }
        if (species.indexOf("EF76 Nebulon-B escort frigate") >= 0)  { img+= "NBfrigate.JPG"; }
        if (species.indexOf("Calamari Cruiser") >= 0)  { img+= "MonCalline.jpg"; }
        if (species.indexOf("A-wing") >= 0)  { img+= "A-wing_DICE.png"; }
        if (species.indexOf("B-wing") >= 0)  { img+= "BWingsKillISD2-ST.jpg"; }
        if (species.indexOf("Republic Cruiser") >= 0)  { img+= "Radiant7_negvv.jpg"; }
        if (species.indexOf("Naboo fighter") >= 0)  { img+= "N-1_Starfighter.png"; }
        if (species.indexOf("Naboo Royal Starship") >= 0)  { img+= "Naboo_Royal_Starship_SWE.png"; }
        if (species.indexOf("Scimitar") >= 0)  { img+= "Sith_Infiltrator_SWCT.png"; }
        if (species.indexOf("J-type diplomatic barge") >= 0)  { img+= "Royalcruiser.jpg"; }
        if (species.indexOf("AA-9 Coruscant freighter") >= 0)  { img+= "Aa9coruscantfreighter.jpg"; }
        if (species.indexOf("Jedi starfighter") >= 0)  { img+= "Jsf_duo2.jpg"; }
        if (species.indexOf("H-type Nubian yacht") >= 0)  { img+= "NabooYachtLanding-AotC.jpg"; }
        if (species.indexOf("Star Destroyer") >= 0)  { img+= "ISD-I.png"; }
        if (species.indexOf("Trade Federation cruiser") >= 0)  { img+= "InvisibleHandStarboard-FF.png"; }
        if (species.indexOf("Theta-class T-2c shuttle") >= 0)  { img+= "Theta.jpg"; }
        if (species.indexOf("T-70 X-wing fighter") >= 0)  { img+= "T70XWing-Fathead.png"; }
        if (species.indexOf("Rebel transport") >= 0)  { img+= "GR-75_Medium_Transport.jpg"; }
        if (species.indexOf("Droid control ship") >= 0)  { img+= "Lucrehulk_battleship_TCW.jpg"; }
        if (species.indexOf("Republic Assault ship") >= 0)  { img+= "Acclamator.jpg"; }
        if (species.indexOf("Solar Sailer") >= 0)  { img+= "Solar_sail.jpg"; }
        if (species.indexOf("Republic attack cruiser") >= 0)  { img+= "Venator-class.jpg"; }
        if (species.indexOf("Naboo star skiff") >= 0)  { img+= "Naboo_star_skiff_1.png"; }
        if (species.indexOf("Jedi Interceptor") >= 0)  { img+= "Eta-2_Interceptor.png"; }
        if (species.indexOf("arc-170") >= 0)  { img+= "ARC170starfighter.jpg"; }
        if (species.indexOf("Banking clan frigte") >= 0)  { img+= "CoreFive.png"; }
        if (species.indexOf("Belbullab-22 starfighter") >= 0)  { img+= "Soulless_One_TCW.jpg"; }
        if (species.indexOf("V-wing") >= 0)  { img+= "VWing-NEGVV.jpg"; }
        if (species.indexOf("CR90 corvette") >= 0)  { img+= "Rebels-TantiveIVConceptArt-CroppedBackground.png"; }
        var ret = [img];
        return ret;
    },
    pictureVehicles: function(species)
    {
        var img = "img/vehicles/";
        if (species.indexOf("Sand Crawler") >= 0)  { img+= "Sandcrawler.png"; }
        if (species.indexOf("T-16 skyhopper") >= 0)  { img+= "T16skyhopper_negvv.jpg"; }
        if (species.indexOf("X-34 landspeeder") >= 0)  { img+= "X34-landspeeder.jpg"; }
        if (species.indexOf("TIE/LN starfighter") >= 0)  { img+= "TIE_Fighter_DICE.png"; }
        if (species.indexOf("Snowspeeder") >= 0)  { img+= "Rebspeeder_swenc.jpg"; }
        if (species.indexOf("TIE bomber") >= 0)  { img+= "Tie_bombardero.jpeg"; }
        if (species.indexOf("AT-AT") >= 0)  { img+= "ATAT-SWFB.jpg"; }
        if (species.indexOf("AT-ST") >= 0)  { img+= "250px-At-st_large_pic.jpg"; }
        if (species.indexOf("Storm IV Twin-Pod cloud car") >= 0)  { img+= "StormIV_btm.jpg"; }
        if (species.indexOf("Sail barge") >= 0)  { img+= "Sailbarge-chron1.jpg"; }
        if (species.indexOf("Bantha-II cargo skiff") >= 0)  { img+= "Skiff-NEGVV.jpg"; }
        if (species.indexOf("TIE/IN interceptor") >= 0)  { img+= "Interceptor1.jpg"; }
        if (species.indexOf("Imperial Speeder Bike") >= 0)  { img+= "FlitknotSpeeder.jpg"; }
        if (species.indexOf("Vulture Droid") >= 0)  { img+= "Droid_Starfighters.png"; }
        if (species.indexOf("Multi-Troop Transport") >= 0)  { img+= "MTT-SWE.jpg"; }
        if (species.indexOf("Armored Assault Tank") >= 0)  { img+= "SepAAT"; }
        if (species.indexOf("Single Trooper Aerial Platform") >= 0)  { img+= "STAP-SWE.png"; }
        if (species.indexOf("C-9979 landing craft") >= 0)  { img+= "C9979_ep1ig.jpg"; }
        if (species.indexOf("Tribubble bongo") >= 0)  { img+= "Bongo.jpg"; }
        if (species.indexOf("Sith speeder") >= 0)  { img+= "FC20_speeder_bike_SWFFfb.png"; }
        if (species.indexOf("Zephyr-G swoop bike") >= 0)  { img+= "Zephyr-G.jpg"; }
        if (species.indexOf("Koro-2 Exodrive airspeeder") >= 0)  { img+= "Koro2_uvg.jpg"; }
        if (species.indexOf("XJ-6 airspeeder") >= 0)  { img+= "Hotrod-NEGVV.jpg"; }
        if (species.indexOf("LAAT/i") >= 0)  { img+= "Low_Altitude_Assault_Transport.png"; }
        if (species.indexOf("LAAT/c") >= 0)  { img+= "Laatc.jpg"; }
        if (species.indexOf("Tsmeu-6 personal wheel bike") >= 0)  { img+= "GrievWheelBike_wsmi.jpg"; }
        if (species.indexOf("Emergency Firespeeder") >= 0)  { img+= "Fire_ship.jpg"; }
        if (species.indexOf("Droid tri-fighter") >= 0)  { img+= "DroidTrifighter-TCWs3BR2.png"; }
        if (species.indexOf("Oevvaor jet catamaran") >= 0)  { img+= "Wookieeflyingcat.jpg"; }
        if (species.indexOf("Raddaugh Gnasp fluttercraft") >= 0)  { img+= "Catamaran.JPG"; }
        if (species.indexOf("Clone turbo tank") >= 0)  { img+= "JuggernautROTS.jpg"; }
        if (species.indexOf("Corporate Alliance tank droid") >= 0)  { img+= "Confed_Artillery.jpg"; }
        if (species.indexOf("Droid gunship") >= 0)  { img+= "DroidGunship-DB.png"; }
        if (species.indexOf("AT-RT") >= 0)  { img+= "AT-RT_Unmanned.jpg"; }
        if (species.indexOf("AT-TE") >= 0)  { img+= "ATTE-SWE.jpg"; }
        if (species.indexOf("SPHA") >= 0)  { img+= "SPHA-T.jpg"; }
        if (species.indexOf("Flitknot speeder") >= 0)  { img+= "FlitknotSpeeder.jpg"; }
        if (species.indexOf("Neimoidian shuttle") >= 0)  { img+= "Sheathipede_OS.jpg"; }
        if (species.indexOf("Geonosian starfighter") >= 0)  { img+= "Nantex-class_fighters.png"; }
        var ret = [img];
        return ret;
    },
    cardInfoPlanets: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[3] + '</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Climate: </b>' + arrayDatos[0] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Diameter: </b>' + arrayDatos[1] + ' km</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Gravity: </b>' + arrayDatos[2] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Orbital period: </b>' + arrayDatos[4] + ' days</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Population: </b>' + arrayDatos[5] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Rotation period: </b>' + arrayDatos[6] + ' hoirs</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Surface water: </b>' + arrayDatos[7] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Terrain: </b>' + arrayDatos[8] + '</span></li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInfoSpecies: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[7] + '</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Average Height: </b>' + arrayDatos[0] + ' cm</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Average Lifespan: </b>' + arrayDatos[1] + ' years</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Classification: </b>' + arrayDatos[2] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Designation: </b>' + arrayDatos[3] + ' </span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Eye Colors: </b>' + arrayDatos[4] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Hair Colors: </b>' + arrayDatos[5] + ' hoirs</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Language: </b>' + arrayDatos[6] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Skin Colors: </b>' + arrayDatos[8] + '</span></li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInfoStarships: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[10] + '</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li><span class="mdl-list__item-primary-content"><b>MGLT: </b>' + arrayDatos[0] + ' Megalights / hour</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Cargo Capacity: </b>' + arrayDatos[1] + ' kg</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Consumables: </b>' + arrayDatos[2] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Cost in Credits: </b>' + arrayDatos[3] + ' galactics credits</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Crew: </b>' + arrayDatos[4] + ' personnel</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Hyperdrive Rating: </b>' + arrayDatos[5] + ' hoirs</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Length: </b>' + arrayDatos[6] + ' m</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Manufacturer: </b>' + arrayDatos[7] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Max Atmosphering Speed: </b>' + arrayDatos[8] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Model: </b>' + arrayDatos[9] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Passengers: </b>' + arrayDatos[11] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Starship Class: </b>' + arrayDatos[12] + '</span></li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    cardInfoVehicles: function(arrayDatos)
    {
        html= '<div class="mdl-card__supporting-text">';
        html+= '<h2 class="mdl-card__title-text"><b>' + arrayDatos[8] + '</b></h2><br>';
        html+= '<ul class="demo-list-item mdl-list">';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Cargo Capacity: </b>' + arrayDatos[0] + ' kg</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Consumables: </b>' + arrayDatos[1] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Cost in Credits: </b>' + arrayDatos[2] + ' galactics credits</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Crew: </b>' + arrayDatos[3] + ' personnel</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Length: </b>' + arrayDatos[4] + ' m</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Manufacturer: </b>' + arrayDatos[5] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Max Atmosphering Speed: </b>' + arrayDatos[6] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Model: </b>' + arrayDatos[7] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Passengers: </b>' + arrayDatos[9] + '</span></li>';
        html+= '<li><span class="mdl-list__item-primary-content"><b>Vehicle Class: </b>' + arrayDatos[10] + '</span></li>';
        html+= '</ul>';
        html+= '</div>';
        return html;
    },
    menuOptions: function(dataURL)
    {
        $("#container").empty();
        $(app.objetoAPI).each(function(i,v)
        {
            if (v[0] == dataURL)
            {
                if (/films/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2]
                        var results = data[3];
                        var resultsSort = app.sortByColumn(results, 'release_date');
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(resultsSort).each(function(i3,v3)
                        {
                            var urlFilm = v3['url'];
                            // Cuando fue creado el registro en la bbdd
                            var created = v3['created'];
                            // Cuando fue editado el registro en la bbdd
                            var edited = v3['edited'];
                            var ret = app.episode_id(v3['episode_id']);
                            var arrayImage = [ret[0]];
                            var arrayInfo = [v3['title'], v3['opening_crawl']];
                            var arrayInfoExtra = [v3['episode_id'], ret[1], v3['characters'], v3['planets'], v3['species'], v3['starships'], v3['vehicles']];
                            var arrayDirector = [v3['director'], v3['producer'], v3['release_date']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="films">';
                            html+= app.cardImage(arrayImage);
                            html+= app.cardInfo(arrayInfo);
                            html+= app.cardInfoExtra(arrayInfoExtra);
                            html+= app.cardDirector(arrayDirector);
                            html+= '</div>';
                        });
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=films]").css("background-color",app.colorFilms);
                }
                if (/people/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2];
                        var results = data[3];
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(results).each(function(i2,v2)
                        {
                            var arrayDatosInfo = [v2['birth_year'],v2['eye_color'],v2['gender'],v2['hair_color'],v2['height'],v2['mass'],v2['name'],v2['skin_color'],v2['homeworld']];
                            var arrayDatosInfoExtra = [v2['films'],v2['species'],v2['starships'],v2['vehicles']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="people">';
                            html+= app.cardImage(app.pictureCharacter(v2['name']));
                            html+= app.cardInfoCharacters(arrayDatosInfo);
                            html+= app.cardInforExtraCharacter(arrayDatosInfoExtra)
                            html+= '</div>';
                        })
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=people]").css("background-color",app.colorPeople);
                }
                if (/planets/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2];
                        var results = data[3];
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(results).each(function(i2,v2)
                        {
                            var arrayDatos = [v2['climate'],v2['diameter'],v2['gravity'],v2['name'],v2['orbital_period'],v2['population'],v2['rotation_period'],v2['surface_water'],v2['terrain']];
                            var arrayDatosInfoExtra = [v2['films'],v2['residents']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                            html+= app.cardImage(app.picturePlanets(v2['name']));
                            html+= app.cardInfoPlanets(arrayDatos);
                            html+= app.cardInforExtraPlanets(arrayDatosInfoExtra)
                            html+= '</div>';
                        })
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorPlanets);
                }
                if (/species/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2];
                        var results = data[3];
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(results).each(function(i2,v2)
                        {
                            var arrayDatos = [v2['average_height'],v2['average_lifespan'],v2['classification'],v2['designation'],v2['eye_colors'],v2['hair_colors'],v2['language'],v2['name'],v2['skin_colors']];
                            var arrayDatosInfoExtra = [v2['films'],v2['people']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                            html+= app.cardImage(app.pictureSpecies(v2['name']));
                            html+= app.cardInfoSpecies(arrayDatos);
                            html+= app.cardInforExtraSpecies(arrayDatosInfoExtra)
                            html+= '</div>';
                        })
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorSpecies);
                }
                if (/starships/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2];
                        var results = data[3];
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(results).each(function(i2,v2)
                        {
                            var arrayDatos = [v2['MGLT'],v2['cargo_capacity'],v2['consumables'],v2['cost_in_credits'],v2['crew'],v2['hyperdrive_rating'],v2['length'],v2['manufacturer'],v2['max_atmosphering_speed'],v2['model'],v2['name'],v2['passengers'],v2['starship_class']];
                            var arrayDatosInfoExtra = [v2['films'],v2['pilots']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                            html+= app.cardImage(app.pictureStarships(v2['name']));
                            html+= app.cardInfoStarships(arrayDatos);
                            html+= app.cardInforExtraStarships(arrayDatosInfoExtra)
                            html+= '</div>';
                        })
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorStarships);
                }
                if (/vehicles/.test(dataURL))
                {
                    var data = v[1];
                    if (data[0] !== undefined)
                    {
                        var totalRegistros = data[0];
                        var next = data[1];
                        var prev = data[2];
                        var results = data[3];
                        if ($("table.customTable").length == 0)
                        {
                            var arrayNavbar = [totalRegistros, next, prev];
                            var html = app.navbarPagination(arrayNavbar);    
                        }
                        else
                        {
                            var html = "";
                        }
                        $(results).each(function(i2,v2)
                        {
                            var arrayDatos = [v2['cargo_capacity'],v2['consumables'],v2['cost_in_credits'],v2['crew'],v2['length'],v2['manufacturer'],v2['max_atmosphering_speed'],v2['model'],v2['name'],v2['passengers'],v2['vehicle_class']];
                            var arrayDatosInfoExtra = [v2['films'],v2['pilots']];
                            html+= '<div class="demo-card-wide mdl-card mdl-shadow--4dp" data-type="planets">';
                            html+= app.cardImage(app.pictureVehicles(v2['name']));
                            html+= app.cardInfoVehicles(arrayDatos);
                            html+= app.cardInforExtraVehicles(arrayDatosInfoExtra)
                            html+= '</div>';
                        })
                        $("#container").append(html);
                    }
                    $("#container .demo-card-wide[data-type=planets]").css("background-color",app.colorVehicles);
                }
            }
        })
    },
    sortByColumn: function(a, nomCol)
    {
        a.sort(sortFunction);
        function sortFunction(a, b) 
        {
            if (a[nomCol] === b[nomCol]) { return 0; }
            else { return (a[nomCol] < b[nomCol]) ? -1 : 1; }
        }
        return a;
    },
    loading: function(estado)
    {
        if (estado) { $("#loadingData").show(); }
        else { $("#loadingData").hide(); }
    },
    video: function (episode_id)
    {
        var urlVideo = "";
        if (episode_id == 4) { urlVideo = "https://www.youtube.com/watch?v=yHfLyMAHrQE"; }
        if (episode_id == 5) { urlVideo = "https://www.youtube.com/watch?v=lGsAxG0r9wQ"; }
        if (episode_id == 6) { urlVideo = "https://www.youtube.com/watch?v=xPZigWFyK2o"; }
        if (episode_id == 1) { urlVideo = "https://www.youtube.com/watch?v=HdJnoL4KR8g"; }
        if (episode_id == 2) { urlVideo = "https://www.youtube.com/watch?v=8fP7YJtjbZY"; }
        if (episode_id == 3) { urlVideo = "https://www.youtube.com/watch?v=eYT3ctPuVRw"; }
        if (episode_id == 7) { urlVideo = "https://www.youtube.com/watch?v=8sarFZJl3h0"; }
        $(location).attr("href",urlVideo);
    },
    exit: function() 
    {
        var exit = confirm("Exit app?")
        if (exit)
        {
            navigator.app.exitApp();
        }
            
    }    
};
app.loadingResources();
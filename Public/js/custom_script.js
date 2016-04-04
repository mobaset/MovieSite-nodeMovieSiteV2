/**
 * Created by Mo on 2/20/2016.
 */

$(document).ready(function () {
    $('.hidden_div').hide();
    $('#overview').show();
    $('ul#div_selector > li').click(function () {
        $('li').each(function() {
            $(this).removeClass('active')
        });
        $(this).addClass('active');
        $('.hidden_div').hide();
        $($(this).find('a').attr('href')).slideDown('slow')
    })
});

//added by Elwaleed 20/03.2016
$(document).ready(function loadJSON(){
    var data_file = "../public/data/movies.json";
    var http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    }catch (e){
        // Internet Explorer Browsers
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        }catch (e) {

            try{
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e){
                // Something went wrong
                alert("Your browser broke!");
                return false;
            }

        }
    }

    http_request.onreadystatechange = function(){

        if (http_request.readyState == 4  ){
            // Javascript function JSON.parse to parse JSON data
            var jsonObj = JSON.parse(http_request.responseText);

            // jsonObj variable now contains the data structure and can
            // be accessed as jsonObj.name and jsonObj.country.
            document.getElementById("id").innerHTML = jsonObj.id;
            document.getElementById("title").innerHTML = jsonObj.title;
            document.getElementById("overview").innerHTML = jsonObj.overview;
            document.getElementById("poster_path").innerHTML = jsonObj.poster_path;
        }
    };

    http_request.open("GET", data_file, true);
    http_request.send();
});

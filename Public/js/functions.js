var Act_Name = "";
var Act_ID = "";
var Act_Detail, Act_Movies;
var DETAIL_HOST = "https://node-movie-site.herokuapp.com/actid?q=";
var MOVIES_HOST = "https://node-movie-site.herokuapp.com/actmovies?q=";
var moviDetail;
var SEARCH_HOST = "https://node-movie-site.herokuapp.com/actsearch?q=";
var totalPages="";
var currentPage="";
var currentUrl="";
var actBio = "";
var actNam = "";
var actID = "";
var actBirthday = "";
var actDeathday = "";
var actHomepage = "";
var actGender = "";
var actBirthPlace = "";
var actPopularity = "";
var actProfileImg = "";
var actKnownAs = "";
var actFacts = "";
var actMovies = "";
	 
	 
    function getActNam()  // get the search string string and call getResponse to get the data from the middleware
    {
        
		var SearchName = document.getElementById("srcNam").value;
		var srchString = SEARCH_HOST+SearchName;
		currentUrl = srchString;
        getResponse(srchString,ActorsList);  //call a function to get the search results
		
		showPop(event,"Actors List"); 	//will show the hidden popup div
    }
    
    function showPop(event, text)  // display a popup window
    {
        var el, x, y;
        el = document.getElementById('popUp');
        if (window.event) {
            x = window.event.clientX + document.documentElement.scrollLeft
                    + document.body.scrollLeft;
            y = window.event.clientY + document.documentElement.scrollTop +
                    +document.body.scrollTop;
        }
        else {
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }
        x -= 220; y += 2;
        y = y + 15;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.display = "block";
    }
    function closePop() {	// close the popup window
        document.getElementById("srcNam").value = "";	//delete the text of input box
		parent.document.getElementById("popUp").style.display = "none";
    }

function getResponse(url,cFun) // send request to the middleware to get required data
{
	var http = new XMLHttpRequest();	//create http request object
	http.open("GET",url);
	http.send();
    http.onreadystatechange = function()
	{
		if (http.readyState == 4 && http.status == 200)	//if the request is ok
		{
             cFun(http); 	//call another function to handle the response	 
		}
	};
}

function ActorsList(htp) //populate the search box with actors list
{
    var data = htp.responseText;	//extraxt the responce text
    var rslt = JSON.parse(data);	//transform response text to an object
    var out = "<ul>";
	var i;
    var len = rslt.results.length;
	for (i=0;i<len;i++)
	{
		var a1 = '"'+rslt.results[i].name+'"';
		var a2 = '"'+rslt.results[i].id+'"';
		var a3 = '"'+rslt.results[i].profile_path+'"';
		out+= "<li><a href='javascript:UpdateActor("+a1+","+a2+","+a3+")'>"+rslt.results[i].name+"</a></li><br>";
	}
    out+="</ul>"
	document.getElementById("actList").innerHTML = out;
    totalPages = rslt.total_pages;
    currentPage = rslt.page;
}

function UpdateActor (name,id,profileImg) //updating the actor article
{
    document.getElementById("popUp").style.display = "none";	//hide the popup window
	document.getElementById("srcNam").value = "";			//delete the value of input box
	document.getElementById("actList").innerHTML = "<p></p>";		//reset the output html element
	document.getElementById("poster").setAttribute("src","http://image.tmdb.org/t/p/w185/"+profileImg);
	Act_Name = name;
	Act_ID = id;
	document.getElementById("actorName").innerHTML = "<h1 class='actorName'>"+name+"</h1>";
	getResponse (DETAIL_HOST+id,getOverview);      //make request for actor details & change the article accordingly
}

function changeDetail(detail) //change the details of the article.
{
	document.getElementById("Detail_Title").innerHTML = "<h3 class='Detail_Title'>"+detail+"</h3>";
	switch (detail)
	{
	case "biography":		
		document.getElementById("Detail_Content").innerHTML = "<p class='Detail_Content'>"+actBio+"</p>";
		console.log("changed to:"+actBio);
		break;
	case "overview":
		document.getElementById("Detail_Content").innerHTML = "<p class='Detail_Content'>"+actFacts+"</p>";
		console.log("changed to:"+actFacts);
		break;
	case "movies":
		getResponse(MOVIES_HOST+actID,movieCredits)
		break;
	}
}

function brows(args)		//navigating between the actors lists
 {
     var newUrl = currentUrl+"&p=";		//add page= to the url
	 console.log(newUrl);
	 var cp = Number(currentPage);
	 var tp = Number(totalPages);
	 var gp = "0";
     switch (args)
     {
      case "next":
       if(cp < tp)
       {
        gp = cp+1;
		newUrl += gp.toString();
		currentPage = 
        getResponse(newUrl,ActorsList);		//call another request with the next page
       }
       break;
      case "previous":
        if(cp > 1)
        {
         gp = cp-1;
		 newUrl += gp.toString();
         getResponse(newUrl,ActorsList);	//call another requesy with the previous page
        }
       break;
     }  
 }

function getOverview(data) 
{
	 var obj = JSON.parse(data.responseText);	 
     var out = "<ul class='Detail_Content'>";
     document.getElementById("Detail_Title").innerHTML = "<h3 class = 'Detail_Title'>Overview</h3>";
     out+="<li>birthday:"+obj.birthday+"</li><br><li>deathday:"+obj.deathday+"</li><br><li>Gender:"+obj.gender+"</li><br><li>Homepage:"+obj.homepage+"</li><br><li>Place of Birth:"+obj.place_of_birth+"</li><br><li>Popularity:"+obj.popularity+"</li></ul>";
     document.getElementById("Detail_Content").innerHTML = out;
	 actFacts = out;
	 actBio = obj.biography;
	 actNam = obj.name;
	 actID = obj.id;
	 actBirthday = obj.birthday;
	 actDeathday = obj.deathday;
	 actHomepage = obj.homepage;
	 actGender = obj.gender;
	 actBirthPlace = obj.place_of_birth;
	 actPopularity = obj.populairty;
	 actProfileImg = obj.profile_path;
	 actKnownAs = obj.also_known_as;
}

function movieCredits(data)		//display a list of movies perfomed
{
	var obj = JSON.parse(data.responseText);	//change the response text into json onbject
	var len = obj.cast.length;		//length of the response array
	var out = "<table>";
	out += "<th><td>Character</td><td>Movie Title</td><td>Release Date</td></th>"
	for(i=0;i<len;i++)		//loop between the the aray items
	{
		out += "<tr><td>"+obj.cast[i].character+"</td><td>"+obj.cast[i].title+"</td><td>"+obj.cast[i].release_date+"</td></tr>";
	}
	out += "</table>";
	document.getElementById("Detail_Content").innerHTML = out;	//change the detail content
}
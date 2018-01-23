function getBlog(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

function deleteNote(url, callback) {
    var req = new XMLHttpRequest();
    req.open("DELETE", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

var express = require('express');
var bodyParser = require("body-parser");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();
  
// serveur html
var server= express();
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.listen(80);


 
server.get('/', function(request, response) {
 
   response.render('manageBlogs');
});

// search 
 var id ; 
server.post('/search', function(request, response) {
  
			id = request.body.id; 
			 
			getBlog("http://clubfreetst.herokuapp.com/blogs/"+id, function (reponse) {
				var blogs = JSON.parse(reponse);
				
				var err = blogs.err;
				var status ; 
				
				if(err){
					if (err == "Invalid siteID"){
					response.render('manageBlogs', {id:id , status:false , msg:"Invalid siteID (5-7 digits)"});
					}
					else {
						response.render('manageBlogs', {id:id , status:false , msg:err});
					}
				}
				else{
				var blogger = blogs.blogger ;
				var title = blogs.title ; 
				var notes = blogs.notes ; 
				
				response.render('manageBlogs', {id:id  , status:true ,  blogger:blogger , title:title , notes:notes});
				}
				
			});
});


// delete

server.get('/delete/:id', function(request, response){
	var idNote = request.params.id;
	// console.log(idNote);

		deleteNote("http://clubfreetst.herokuapp.com/notes/"+idNote, function (reponse) {
						// console.log('response '+reponse);
						// console.log('2');							
						
						
		getBlog("http://clubfreetst.herokuapp.com/blogs/"+id, function (rep) {
				// console.log('2');	
				var blogs = JSON.parse(rep);
				
				var err = blogs.err;
				var status ; 
				
				if(err){
					response.render('manageBlogs', {id:id , status:false , msg:err});
				}
				else{
				var blogger = blogs.blogger ;
				var title = blogs.title ; 
				var notes = blogs.notes ; 
				
				response.render('manageBlogs', {id:id  , status:true ,  blogger:blogger , title:title , notes:notes , deleteNote:"The note was successfully deleted"});
				}
				
			});
	
					});	
					
	
	
	
});
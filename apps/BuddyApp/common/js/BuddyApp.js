

			var friends= [];
			var bfriends = [];
			var global = this;
			// FACEBOOK LOGIN
			
			// Login with fb account
			function Login()
			{
				
				// User login with permissions
				FB.login(
						function(response) {
							if (response.authResponse) {
								console.log('Welcome!');
								console.log(response);
								window.location.replace("#homePage");
							} else {
								console.log('User cancelled login or did not fully authorize.');
						}
					},{scope: 'publish_actions,friends_birthday,friends_likes,friends_location'});
				
				// hover on menu
				$("#message").hover(showMessage);
				$("#birthday").hover(showBirthday);
				$("#post").hover(showPost);
				$("#tracker").hover(showTracker);
			}	
			
			// Logout from fb account
			function Logout()
			{
				FB.logout(function(response) {
					  	console.log("logout");
					  	window.location.replace("#loginPage");
					});
			}
			
			function showMessage(evt)
			{
				$("#friendlist").html("<img class='logo' src='http://designmodo.github.io/Flat-UI/images/icons/svg/mail.svg'/>");
				$("#friendlist").append("<h2 style='text-align:center'>Buddy Chat</h2>");
				$("#friendlist").show();
			}
			
			function showBirthday(evt)
			{
				$("#friendlist").html("<img class='logo' src='http://designmodo.github.io/Flat-UI/images/icons/svg/gift-box.svg'/>");
				$("#friendlist").append("<h2 style='text-align:center'>Birthdays</h2>");
				$("#friendlist").show();
			}
			
			function showPost(evt)
			{
				$("#friendlist").html("<img class='logo' src='http://designmodo.github.io/Flat-UI/images/icons/svg/compas.svg'/>");
				$("#friendlist").append("<h2 style='text-align:center'>Location Sharer</h2>");
				$("#friendlist").show();
			}
			
			function showTracker(evt)
			{
				$("#friendlist").html("<img class='logo' src='http://designmodo.github.io/Flat-UI/images/icons/svg/map.svg'/>");
				$("#friendlist").append("<h2 style='text-align:center'>Buddy Tracker</h2>");
				$("#friendlist").show();
			}			
			
			//FETCHING FACEBOOK FRIENDS
			
	           function getFriends()
	           {
	        	   // Fetching friends with required fields 
	        	   $.mobile.loading( 'show', {
	        			text: 'Loading...',
	        			textVisible: true,
	        			theme: 'z',
	        			html: ""
	        		});
	        	  
	        	   
	        	   FB.api('/me/friends?fields=name,picture,location', function(response){
	        		   console.log(response);
	            	   $.mobile.loading('hide');
	        		   str='<ul data-role="listview" data-inset="true" >';
	        		   
	        		   for(var i=0;i<response.data.length;i++)
	        			   {
	        			   	global.friends.push(response.data[i]);
	        			   	str+="<li><a href='#' id="+i+" onclick='lod(this)' class='ui-link-inherit'>"+response.data[i].name+"</a></li>";
	        			   }
	        		 
	        		  str+="</ul>";
	        		
	        			   $("#friendlist").html(str);
	        			   
	        	   });
	           }			
		
	           // Loading map on selection of a friend

			function lod(evt){
                // find current position and on success initialize map and calculate the route
				
				$("#friendlist").hide();
				
				if(!global.friends[evt.id].location)
					{
						alert(global.friends[evt.id].name+" doesn't share location!");
						return;
					}
				var fid = global.friends[evt.id].location.id;
				
					
				var frnlat,frnlng;
				var self=this;
				FB.api("/"+fid,function(response){

							frnlat = response.location.latitude;
							frnlng = response.location.longitude;
						
							
							if(frnlat&&frnlng)
							{
								window.location.replace("#map");
								mapInit(frnlat,frnlng,"map_panel","map_panelbtn","map_canvas","I am here!");
								navigator.geolocation.getCurrentPosition(locSuccess, locError);
							}
						else
							{
								console.log("No Lat Lng");
								window.location.replace("#map");
								mapInit(18.9900, 77.7000,"map_panel","map_panelbtn","map_canvas","I am here!");
								navigator.geolocation.getCurrentPosition(locSuccess, locError);
							}							
				});
			
					
           }
			
			// GETTING LOCATION AND PUBLISH FEED
			
			
			function getLocation(lat, lng) {
				var latlng = new google.maps.LatLng(lat, lng);
				// This is making the Geocode request
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 'latLng': latlng }, function (results, status) {
					if (status !== google.maps.GeocoderStatus.OK) {
						alert(status);
					}
					// This is checking to see if the Geoeode Status is OK before proceeding
					if (status == google.maps.GeocoderStatus.OK) {
						//console.log(results);
						//picture: 'http://maps.google.com/maps/api/staticmap?center='+lat+','+lng+'&zoom=14&size=512x512&maptype=roadmap&markers=color:blue|48.0,9.0&sensor=true'
						//+"\n"+"http://maps.googleapis.com/maps/api/staticmap?center="+address+"&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&sensor=false"
						var address = (results[0].formatted_address);
						console.log(address);
						var self=this;
						   FB.ui(
								      {
								       method: 'feed',
								       name: 'IBM Worklight',
								       caption: 'IBM Worklight helps you extend your business to mobile devices. It is designed to provide an open, comprehensive platform to build, run and manage HTML5, hybrid and native mobile apps. ',
								       description: (
								          "Working on IBM Worklight at "+address
								       ),
								       link: 'http://localhost:8080/apps/services/preview/BuddyApp/common/0/default/BuddyApp.html',
								       picture:'http://www.zslinc.com/global-newsletter/images/ibm-worklight-logo.png'								     
								      },
								      function(response) {
								        if (response && response.post_id) {
								        	alert('Post is published');
								        } else {
								          alert('Post was not published.');
								        }
								      }
								    );						
						return address;
					}
				});
			}			
			
			
			function createFeed()
			{
				
				//var loc = getLocation(48.00,9.00); Posting location on fb
				
				
				getCurrentLocation();
				function getCurrentLocation()
				  {
				  if (navigator.geolocation)
					{
					navigator.geolocation.getCurrentPosition(showPosition);
					}
				  else{console.log("Geolocation is not supported by this browser.");}
				  }
				function showPosition(position)
				  {
					var lat= position.coords.latitude;
					var lng = position.coords.longitude;
					console.log("Lat:"+lat+" Long:"+lng);
					loc = getLocation(lat,lng);
				  }
			}
			
			function getBirthdays()
			{
				$("#friendlist").show();
				// Fetching friends with birthdays in one month
	        	   $.mobile.loading( 'show', {
	        			text: 'Loading...',
	        			textVisible: true,
	        			theme: 'z',
	        			html: ""
	        		});
	        	   
	        	   var today = new Date();
	        	   var dd = today.getDate();
	        	   var mm = today.getMonth()+1; //January is 0!
	        	   var yyyy = today.getFullYear();

	        	   if(dd<10) {
	        	       dd='0'+dd
	        	   } 

	        	   if(mm<10) {
	        	       mm='0'+mm
	        	   } 

	        	   var day1 = mm+'/'+dd+'/'+yyyy;
	        	   var day2 = (mm+1)+'/'+dd+'/'+yyyy;
	        	   
	        	   
	        	   qry="SELECT uid,pic_big,name, birthday, birthday_date FROM user " ;
	        	   qry+="WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) "; 
	        	   qry+="AND birthday_date != 'null' "; 
                   qry+="AND birthday_date > '"+day1+"' ";
                   qry+="AND birthday_date < '"+day2+"'";
	        	   
                   console.log(qry);
	        	   FB.api({ method:'fql.query',query:qry}, function(response){
	        		   console.log(response.length);
	            	   $.mobile.loading('hide');
	        		   str='<ul data-role="listview" data-inset="true" >';
	        		   
	        		  for(var i=0;i<response.length;i++)
	        			   {
	        			   	global.bfriends.push(response[i]);
	        			   	str+="<li><a href='#' id="+i+" onClick='showSuggestions(this)' class='ui-link-inherit'>"+response[i].name+"</a></li>";
	        			   }
	        		 
	        		  str+="</ul>";
	        			   $("#friendlist").html(str);
	        			   
	        	   });	        	   
			}
			
			function showSuggestions(evt)
			{
				$("#friendlist").hide();
				console.log(global.bfriends[evt.id]);
				$("#bname").html(global.bfriends[evt.id].name);
				$("#bimage").attr("src",global.bfriends[evt.id].pic_big);
				$("#bdate").html("<a data-role='button' href='#'>"+global.bfriends[evt.id].birthday.split(",")[0]+"</a>");
				window.location.replace("#birthdayPage");
				
	        	$.mobile.loading( 'show', {
	        			text: 'Loading...',
	        			textVisible: true,
	        			theme: 'z',
	        			html: ""
	        		});				
				qry="SELECT uid,interests,movies, music, tv FROM user WHERE uid="+global.bfriends[evt.id].uid;
	        	   FB.api({ method:'fql.query',query:qry}, function(response){
	        		   console.log(response);
	            	   $.mobile.loading('hide');
	            	   
	            	   if(response[0].interests)
	            	   {
	            		   str='<div data-role="collapsible" data-collapsed-icon="flat-time" data-expanded-icon="flat-cross">';
	            		   str+="<h3>Interests</h3>"
	            		   str+="<p>"+response[0].interests+"</p>";
	            		   str+='</div>';
	            		   $("#suggestions").append(str);
	            	   }  
	            	   if(response[0].movies)
	            	   {
	            		   str='<div data-role="collapsible" data-collapsed-icon="flat-time" data-expanded-icon="flat-cross">';
	            		   str+="<h3>Movies</h3>"
	            		   str+="<p>"+response[0].movies+"</p>";
	            		   str+='</div>';
	            		   $("#suggestions").append(str);
	            	   }  
	            	   if(response[0].music)
	            	   {
	            		   str='<div data-role="collapsible" data-collapsed-icon="flat-time" data-expanded-icon="flat-cross">';
	            		   str+="<h3>Music</h3>"
	            		   str+="<p>"+response[0].music+"</p>";
	            		   str+='</div>';
	            		   $("#suggestions").append(str);
	            	   }  
	            	   if(response[0].tv)
	            	   {
	            		   str='<div data-role="collapsible" data-collapsed-icon="flat-time" data-expanded-icon="flat-cross">';
	            		   str+="<h3>TV</h3>"
	            		   str+="<p>"+response[0].tv+"</p>";
	            		   str+='</div>';
	            		   $("#suggestions").append(str);
	            	   }  	            	   
	            	    	  
	            	      
	        	   });
			}
			
			
/****************** Place Order **********************/

function newOrder()
{
	
}
			

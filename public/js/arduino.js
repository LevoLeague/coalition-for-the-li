Sweater ={};
Sweater.GetMessage = function(message){
	/*$.post('', message, function(data){
		console.log(data);
	}); */

	$.ajax({
		url: 'http://arduinobridge.jit.su/message/?text=' + message,
		type: 'GET',
    crossDomain:true

	});
  alert("Message sent!!");
};

$(document).ready(function(){

  $("#newMessage").click(function(){
    var message = $("#sweaterMessage").val();
    console.log(message);
    Sweater.GetMessage(message);
  });

});

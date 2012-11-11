Sweater ={};
Sweater.GetMessage = function(message){
	/*$.post('', message, function(data){
		console.log(data);
	}); */

	$.ajax({
		url: 'http://arduinobridge.jit.su/message/?text=awesome',
		type: 'GET'
	});
};

$(document).ready(function(){

  $("#newMessage").click(function(){
    var message = $("#sweaterMessage").val();
    console.log(message);
    Sweater.GetMessage(message);
  });

});
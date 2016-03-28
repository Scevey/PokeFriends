"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
        $("#digMessage").animate({width:'toggle'},350);
    }
    
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#domoMessage").animate({width:'hide'},350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#makeBioSubmit").on("click", function(e) {
        e.preventDefault();
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#first").val() == '' || $("#last").val() == ''|| $("#age").val() == '') {
            handleError("First, Last and Age are required");
            return false;
        }

        sendAjax($("#acctForm").attr("action"), $("#acctForm").serialize());
        
        return false;
    });
   $("#makeBioSubmit").on("click", function(e) {
        e.preventDefault();
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#userName").val() == '') {
            handleError("username required to search");
            return false;
        }

        sendAjax($("#bioForm").attr("action"), $("#bioForm").serialize());
        
        return false;
    });
	 $("#doBioDelete").on("click", function(e) {
		e.preventDefault();
		$("#digMessage").animate({width:'hide'},350);
    
        if($("#bioDelFirst").val() == '' || $("#bioDelLAst").val() == ''|| $("#bioDelAge").val() == '') {
            handleError(" All fields are required");
            return false;
        }
        sendAjax($("#bioDelForm").attr("action"), $("#bioDelForm").serialize());
        
        return false;
    });
});
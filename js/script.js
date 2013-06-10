$(document).ready(function(){
    // bind to tags to dynamically remove tag
    $("body").on( "click",".TagButton", function(){
        $(this).remove();
    } );

    // bind to questions to dynamically ignore and remove question
    $("body").on( "click",".ignore_question", function(){
        $(this).parent().parent().attr("style","display:none");
    } );

    // rate up a solution
    $("body").on( "click",".arrowUp", function(){
        //TODO: change the color of the arrow, forbid it from 
        // changing the rate anymore if it has been clicked once
        // for this user
        var rate = $(this).parent().find(".SolutionRate").html();
        $(this).parent().find(".SolutionRate").html(++rate);
    } );
    // rate down a solution
    $("body").on( "click",".arrowDown", function(){
        var rate = $(this).parent().find(".SolutionRate").html();
        $(this).parent().find(".SolutionRate").html(--rate);
    } );

    // demo data
    var countries = [
    { value: 'Andorra', data: 'AD' },
    { value: 'Zimbabwe', data: 'ZZ' }
    ];

    // bind a third-party autocomplete plugin to the search input box
    a = $('#SearchBoxInput').autocomplete({
        //TODO: For demo purpose:
        //lookup:countries,

        // <change_python_script_url>
        //TODO: Uncomment the following line, replace it with the actual
        // python script which answers autocomplete
        serviceUrl:'SomeFolder/SomeService/autocomplete.py',
      onSelect: function(suggestion){
          //alert($('#SearchBoxInput').val());
      }
    });
});

// called when user type in the search input box,
// executed when the key is <Enter>. auto-completion
// already handled by a third-party plugin mentioned above
function ProcessKeyPress(e){
    // when the key is enter
    if (e.keyCode == 13) {

        // for demo purpose
        var testJson = "\
        {\
            \"Type\":\"question\",\
                \"Questions\": [\
                {\
                    \"id\": 1,\
                        \"type\": 2,\
                        \"data\": \"ubuntu\",\
                        \"pid\": \"some id\"\
                },\
            {\
                \"id\": 2,\
                    \"type\": 1,\
                    \"data\": \"OS\",\
                    \"pid\": \"some id\"\
            }\
            ]\
        }\
        "
            //for demo
            var testJson = $.parseJSON(testJson);

        // ajax for the initial query
        $.ajax({
            type:   'get',
            // <change_python_script_url>
            // put the python url which accept initial query here
            // the query is simply put in the url to form a get request
            url:    "HandleInitialQuery.py?" + $("#SearchBoxInput").val(),
            success:function(result){
                var response = $.parseJSON(result);
                // handle the question returned from server
                HandleQueryResponse(testJson);
            },
            error:  function(){
                    }
        });
    }
}

// dynamically change the page, add all the questions input box
// according the the response
function HandleQueryResponse(response){
    if(response["Type"] == "question"){
        console.log("question list coming!");
        HandleQuestionResponse(response);
    }
    else if(response["Type"] == "solution_list"){
        console.log("solution list coming!");
        HandleSolutionResponse(response);
    }
    else{
        console.log("Encountered unexpected response type!");
    }
}

// handle the solution list response from the server, display the dynamically
function HandleSolutionResponse(response){
//TODO: implement
}

// handle the questions asked by the server, display the dynamically
function HandleQuestionResponse(response){
    var qType = {1:"OS",2:"software"};
    $("#MainPageQuestion").attr("style","");
    //alert(response["Questions"][0]["data"]);
    $(response["Questions"]).each(function(index,val){
        //alert(val["id"]);
        var questionString = "Please give the " +qType[val["type"]]
        +" version of "+val["data"];
    var questionDiv = $("div.hidden_question").clone();
    $(questionDiv).find("label").html(questionString);
    $(questionDiv).find("input").attr("id",val["id"]);
    $(questionDiv).attr("style","");
    $(questionDiv).addClass("answer_input");
    $(questionDiv).removeClass("hidden_question");
    $("div.hidden_question").after(questionDiv);
    });
}

// dynamically add tags, but it seems like the back-end does not
// need this information for now, so did not send it in the request
function AddTagFunction(){
    var newTagName = $("#TagInput").val();
    if(newTagName !== null && newTagName !== ""){
        var hiddenTag = $("#HiddenTag").clone();
        $(hiddenTag).attr("style","");
        $(hiddenTag).attr("id","hiddenTagProcessing");
        $(hiddenTag).html(newTagName+"<i class=\"icon-remove\"></i>");
        $("#TagListSpan").append(hiddenTag);
        $("#TagInput").val("");
    }
}

function HandleSubmit(type){
    var params = new Array();
    $(".answer_input input").each(function(index,val){
        var id = $(this).attr("id");
        var answer = $(this).val();
        // if the user choose to ignore all the questions,
        // this code will generate an empty answer for each
        // question
        if(type == "ignore_all"){
            console.log("ignore");
            params.push({"id":id,"answer":""});
        }
        else{
            params.push({"id":id,"answer":answer});
        }
    });

    // remove the previous questions
    $(".answer_input").each(function(){
        $(this).remove();
    });
    // hide the question asking bar
    $("#MainPageQuestion").attr("style","display:none;");

    // parse the answers into json
    var answer = {"Answers":params};
    var json_answer = JSON.stringify(answer);
    console.log(json_answer);
    // send the answers as json
    $.ajax({
        type:   'post',
        // <change_python_script_url>
        url:    "HandleAnswer.py?" + $("#SearchBoxInput").html(),
        // I can't see the actual payload data from my debug tools, I assume it
        // do send the json, if it does not work correctly, please let me know
        data:   json_answer,
        success:function(result){
            var response = $.parseJSON(result);
            HandleQueryResponse(result);
        },
        error:  function(){
                }
    });
}


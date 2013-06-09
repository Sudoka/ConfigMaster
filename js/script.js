$(document).ready(function(){
    $("body").on( "click",".TagButton", function(){
        $(this).remove();
    } );
    $("body").on( "click",".ignore_question", function(){
        $(this).parent().parent().attr("style","display:none");
    } );
    $("body").on( "click",".arrowUp", function(){
        //TODO: change the color of the arrow, forbid it from 
        // changing the rate anymore if it has been clicked once
        // for this user
        var rate = $(this).parent().find(".SolutionRate").html();
        $(this).parent().find(".SolutionRate").html(++rate);
    } );
    $("body").on( "click",".arrowDown", function(){
        var rate = $(this).parent().find(".SolutionRate").html();
        $(this).parent().find(".SolutionRate").html(--rate);
    } );


    var countries = [
    { value: 'Andorra', data: 'AD' },
    { value: 'Zimbabwe', data: 'ZZ' }
    ];

    a = $('#SearchBoxInput').autocomplete({
        //TODO: For demo purpose:
        //lookup:countries,
      //TODO: Uncomment the following line, replace it with the actual
      // python script which answers autocomplete
      serviceUrl:'SomeFolder/SomeService/autocomplete.py',
      onSelect: function(suggestion){
          //alert($('#SearchBoxInput').val());
      }
    });
});

function ProcessKeyPress(e){
    if (e.keyCode == 13) {

        var testJson = "\
        {\
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
        var testJson = $.parseJSON(testJson);
        HandleQueryResponse(testJson);
        
            // ajax for the initial query
            $.ajax({
                type:   'get',
            url:    "SomePlace.py?" + $("#SearchBoxInput").html(),
            success:function(result){
                var response = $.parseJSON(result);
            },
            error:  function(){
                    }
            });
    }
}

function SendGetRequest(params){
}

function HandleQueryResponse(response){
    var qType = {1:"OS",2:"software"};
    $("#MainPageQuestion").attr("style","");
    //alert(response["Questions"][0]["data"]);
    $(response["Questions"]).each(function(index,val){
        alert(val["id"]);
        var questionString = "Please give the "+qType[val["type"]]+" version of "+val["data"];
        var questionDiv = $("div.hidden_question").clone();
        $(questionDiv).find("label").html(questionString);
        $(questionDiv).find("input").attr("id",val["id"]);
        $(questionDiv).attr("style","");
        $(questionDiv).removeClass("hidden_question");
        $("div.hidden_question").after(questionDiv);
    });
}

function AddTagFunction(){
    var newTagName = $("#TagInput").val();
    if(newTagName !== null && newTagName !== ""){
        var hiddenTag = $("#HiddenTag").clone();
        $(hiddenTag).attr("style","");
        $(hiddenTag).attr("id","hiddenTagProcessing");
        $(hiddenTag).html(newTagName+"<i class=\"icon-remove\"></i>");
        $("#TagListSpan").append(hiddenTag);
    }
}

function HandleSubmit(){
}

function IgnoreAll(){
}

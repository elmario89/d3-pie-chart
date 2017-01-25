$(function() {

    // svg4everybody init
    svg4everybody();


    // small hack for fieldset
    var input = $(".dsx-form-input");
    $(input).focus(function(){
        $(this).parent(".dsx-form-input-container").addClass("-focused");
    });
    $(input).blur(function(){
        $(this).parent(".dsx-form-input-container").removeClass("-focused");
    });

});

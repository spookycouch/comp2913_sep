/*
 *  Function:   Get all activities id to populate dropdown
*/
$.getJSON('/ajax/data/activity/all/', function(result) { 
    
    // Error check
    if(result.error == undefined){

        let activities = result.activities;

        // Populate select
        activities.forEach(function(activity){

            $('.a-select')
                .append('<option value="' + activity + '">' + activity + '</option>')
        });

        // Render first by default
        renderActivity(activities[0]);
        renderWeeklyActivity(activities[0]);

        // Enable and trigger
        $('.a-select').prop('disabled', false);
        $('#loader-1').fadeOut();
        $('#loader-2').fadeOut();

    }
});

/*
 *  Function:   Get all facilities id to populate dropdown
*/
$.getJSON('/ajax/data/facility/all/', function(result) { 
    
    // Error check
    if(result.error == undefined){

        let facilities = result.facilities;

        // Populate select
        facilities.forEach(function(facility){

            $('.a-select-2')
                .append('<option value="' + facility + '">' + facility + '</option>')
        });

        // Render first by default
        renderFacility(facilities[0]);
        renderWeeklyFacility(facilities[0]);

        // Enable and trigger
        $('.a-select-2').prop('disabled', false);
        $('#loader-3').fadeOut();
        $('#loader-4').fadeOut();

    }
});

/*
 *  Function:   Handle overall select change
*/
$('#activity-select-1').on('change', function() {
    
    var id = this.value;
    renderActivity(id);
});

/*
 *  Function:   Handle weekly select change
*/
$('#activity-select-2').on('change', function() {
    
    var id = this.value;
    renderWeeklyActivity(id);
});

/*
 *  Function:   Handle overall select change
*/
$('#facility-select-1').on('change', function() {
    
    var id = this.value;
    renderFacility(id);
});

/*
 *  Function:   Handle weekly select change
*/
$('#facility-select-2').on('change', function() {
    
    var id = this.value;
    renderWeeklyFacility(id);
});
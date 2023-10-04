/*
# Week 6 JustIT Skills BootCamp Project
# Codee: A.M. Howe (InnaviHowe) AUG 2023
    Project title: JS|JSON|HTML|CSS Menu GHVK Project
# File name: skeleton/newJS.js
# Details: Javascript - Populate timetable, populate order menu from a JSON FILE
# Function(s):
    function loadTimetableJSON()

    function loadMenuJSON()
    function showMainHiddenIngredient(menu_choice) 
    function clearOrder()
    function calculatePreppedOfferings() 
*/
window.onload=function() {
    loadTimetableJSON();
    loadMenuJSON();
};
// window.onload=function() {
//     
// };
//GLOBAL VARIABLES
//An array to store the JSON data after request is successful */
var arr_timeTable = [];
var arr_mealMain = [];

//* CALLED on windows load page
//* Request to load json.data file*/
function loadTimetableJSON()
{
var data_file = "infoJSON.json";
var http_request = new XMLHttpRequest();
try{
    // Opera 8.0+, Firefox, Chrome, Safari
    http_request = new XMLHttpRequest();
}catch (e){
    // Internet Explorer Browsers
    try{
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch (e) {
        try{
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
        }catch (e){
            // Something went wrong
            alert("Could not load the timetable!!");
            return false;
        }
    }
}
http_request.onreadystatechange = function(){
    if (http_request.readyState == 4 )
    {
        // Use Javascript function JSON.parse to parse JSON data
        const myObj1 = JSON.parse(http_request.responseText);

        var i = 0
        
        // LOOP THROUGH ALL ELEMENTS RETURNED FROM THE JSON DATA FILE
        // TO POPULATE the timetable
        // day of the week, kitchen opening, kicthen closing and last orders
        for ( i=0; myObj1.gvhktimeTable.length; i++)
        {
            // Create 1 table row element and 4 table data elements
            // Append (assign) the values from the JSON file
            // Append the table data elements to their row 
            let newTableRow =document.createElement('tr');
            let newTableDataDOW =document.createElement('td');
            newTableDataDOW.appendChild(document.createTextNode(myObj1.gvhktimeTable[i].dayofweek));
            newTableRow.appendChild(newTableDataDOW);
            let newTableDataKO =document.createElement('td');
            newTableDataKO.appendChild(document.createTextNode(myObj1.gvhktimeTable[i].kitchenopen));
            newTableRow.appendChild(newTableDataKO);
            let newTableDataKC =document.createElement('td');
            newTableDataKC.appendChild(document.createTextNode(myObj1.gvhktimeTable[i].kitchenclose));
            newTableRow.appendChild(newTableDataKC);
            let newTableDataLO =document.createElement('td');
            newTableDataLO.appendChild(document.createTextNode(myObj1.gvhktimeTable[i].lastorder));
            newTableRow.appendChild(newTableDataLO);

            // Append the table row and elements to the table
            document.getElementById('timeData').appendChild(newTableRow);
                      
            // STORE THIS JSON DATA object in an array for future use
            arr_timeTable.push( [myObj1.gvhktimeTable[i].dayofweek, myObj1.gvhktimeTable[i].kitchenopen, myObj1.gvhktimeTable[i].kitchenclose, myObj1.gvhktimeTable[i].lastorder] );
        }
           
    }
}
http_request.open("GET", data_file, true);
http_request.send();
}

// onclick eventlistener for the input form button
//document.getElementById('btnTimeTable').addEventListener('click', loadTimetableJSON);

function loadMenuJSON()
{
var data_file = "infoJSON.json";
var http_request = new XMLHttpRequest();
try{
    // Opera 8.0+, Firefox, Chrome, Safari
    http_request = new XMLHttpRequest();
}catch (e){
    // Internet Explorer Browsers
    try{
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch (e) {
        try{
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
        }catch (e){
            // Something went wrong
            alert("Could not load the Menu!!");
            return false;
        }
    }
}
http_request.onreadystatechange = function(){
    if (http_request.readyState == 4 )
    {
        // Use Javascript function JSON.parse to parse JSON data
        const myObj5 = JSON.parse(http_request.responseText);

        var i = 0
        
        // AN ARRAY THAT HOLDS THE INFO FOR THE MENU ITEMS
        let myMainMeals = ["lblmain1", "lblmain2", "lblmain3", "lblside1", "lblside2", "lblside3", "lbldess1", "lbldess2", "lbldess3", "lbldrink1", "lbldrink2", "lbldrink3" ];
        
        // LOOP THROUGH ALL ELEMENTS RETURNED FROM THE JSON DATA FILE
        // TO POPULATE the details and summary element 
        // an emoji, the item name, the price, and a brief description of the product
        for ( i=0; myObj5.mainMeals.length; i++)
        {
            document.getElementById(myMainMeals[i]).innerHTML =  myObj5.mainMeals[i].oemoji + ' ' + myObj5.mainMeals[i].offering + " ................  " + Number(myObj5.mainMeals[i].price).toFixed(2);
            
            // STORE THIS JSON DATA object in an array for future use
            arr_mealMain.push( [myObj5.mainMeals[i].offering, myObj5.mainMeals[i].price, myObj5.mainMeals[i].ingredients] );
        }     
    }
}
http_request.open("GET", data_file, true);
http_request.send();
document.getElementsByTagName('form')[0].style.display  = 'block';
}

/* Populate the summary dropdown with description of meal offerings after the summary is clicked. */
function showMainHiddenIngredient(menu_choice) {
    document.getElementsByClassName('lblmainingredients')[menu_choice].innerHTML =  `${arr_mealMain[menu_choice][2]}`;   
}
/* Reload and refresh the page. */
function clearOrder() {
    // Refresh the page
    window.location.reload();
    document.getElementsByClassName('ingdetails').style.open = false;
    window.location.href = '#showMenu';
}

/* CALCULATE THE ORDER MENU AFTER Show your order
// Populate the fields of a table with the results.*/
function calculatePreppedOfferings() {
    var offeringsOrdered = document.getElementsByName('offeringCount');
    var ordOfferingName = "";
    var ordOfferingPrice = "";
    var ordOfferingsOrdered = "";
    var ordOfferingOrderByPrice = "";
    var ordOfferingsTotalOrder = 0;
    
    var z = 0;
    var q = 0;
    // LOOP THROUGH ALL ELELMENTS RETURNED FROM THE JSON DATA FILE
    for (z = 0; z < offeringsOrdered.length; z++) {
        if ( offeringsOrdered[z].value > 0  && arr_mealMain.length > 0) {
            ordOfferingName = `${ordOfferingName} ${arr_mealMain[z][0]} <br>`; //.offering + '<br>';
            ordOfferingPrice = `${ordOfferingPrice} ${arr_mealMain[z][1]} <br>`; //.price + '<br>';
            ordOfferingsOrdered = `${ordOfferingsOrdered} ${Number(offeringsOrdered[z].value)}  <br>`;
            ordOfferingOrderByPrice = `${ordOfferingOrderByPrice} ${Number(offeringsOrdered[z].value * arr_mealMain[z][1]).toFixed(2)} <br>`; //.price).toFixed(2) + '<br>';
            ordOfferingsTotalOrder = ordOfferingsTotalOrder + Number(offeringsOrdered[z].value) * Number(arr_mealMain[z][1]).toFixed(2); //.price).toFixed(2);
        }
    }
    // WRITE OUTPUTS TO THE table 
    document.getElementById('orderListPreppedOfferings').innerHTML =  '' + ordOfferingName + '';
    document.getElementById('costPerOffering').innerHTML = '' + ordOfferingPrice + '';
    document.getElementById('numPreppedOfferings').innerHTML = '' + ordOfferingsOrdered + '';
    document.getElementById('numByCostPerOffering').innerHTML = '' + ordOfferingOrderByPrice + '';
    document.getElementById('totalPreppedOfferings').value = Number(ordOfferingsTotalOrder).toFixed(2);
}

// onclick eventlistener for Hide image/ Showimage button
document.getElementById('btn_calNewOfferingTotal').addEventListener('click', calculatePreppedOfferings);

function processNewOrder(){
    // let newOrder = document.getElementById('')
    // console.log()
    alert('Thank you for placing an order - and making a difference in your community ! Glenda will call you shortly!');
}
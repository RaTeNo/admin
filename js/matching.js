/*jslint browser: true */
/*global G_vmlCanvasManager */
$(function() {
    'use strict';
    
    var columnLeftNamesInSequence = ['Fruit', 'Car', 'Vegetable', 'Jungle'],
        columnRightNamesInSequence = ['Apple', 'BMW', 'Carrot', 'Lion'],
        canvasBackgroundColor = 'white',
        lineWidth = 5,
        
        
        
        columnLeftIndexesInSequence = [],
        columnLeftIndexesShuffled = [],
        columnRightIndexesInSequence = [],
        columnRightIndexesShuffled = [],
        answeredIdsArray = [],
        wrongAnsweredIdsArray = [],
        canvas,
        context,
        i,
        x1,
        y1,
        x2,
        y2,
        offsetX = 0,
        offsetY = 0,
        windowHeight,
        windowWidth,
        titleSection,
        clickButtonIdPrevious,
        clickButtonIdCurrent,
        clickColumnIdPrevious,
        clickColumnIdCurrent,
        previousColButton,
        currentColButton,
        leftAnswersIdArray = [],
        rightAnswersIdArray = [],
        isCurrentLeft = false;
    
    var click1 = false, click2 = false, clickId, clickColumn, lastColumn, clickButtonIndex, buttonLeftIndex, buttonRightIndex;
    
    
    // Setting up canvas
    var answers = document.getElementById('answers');
    console.log(answers.offsetHeight);
    console.log(answers.offsetWidth);
    windowHeight = answers.offsetHeight;
    windowWidth = answers.offsetWidth;
    
    canvas = document.getElementById('canvas');
    canvas.height = windowHeight;
    canvas.width = windowWidth;
    canvas.style.backgroundColor = canvasBackgroundColor;
    
    titleSection = document.getElementById('title');
    offsetY = titleSection.offsetHeight;
    
    context = canvas.getContext('2d');
    
    
    
    // Generating Random Column Data
    
    for (i = 0; i < columnLeftNamesInSequence.length; i = i + 1) {
        columnLeftIndexesInSequence[i] = i;
        columnLeftIndexesShuffled[i] = i;
        columnRightIndexesInSequence[i] = i;
        columnRightIndexesShuffled[i] = i;
    }
    shuffle(columnLeftIndexesShuffled);
    shuffle(columnRightIndexesShuffled);
    
    // Generating Random Structure for Column 1 - only for column Left
    $(".column-left").each(function (index) {
        for(i = 0; i < columnLeftIndexesInSequence.length; i = i +1) {
            $(this).append(
                '<div class="col-lg-12 left-button">' +
                    '<button id="btn-left-'+columnLeftIndexesShuffled[i]+'" type="button" class="button-column btn btn-primary btn-lg">'+columnLeftNamesInSequence[columnLeftIndexesShuffled[i]]+'</button>' +
                '</div>'
            );
        }
    });
    // Generating Random Structure for Column 2 - only for column Right
    $(".column-right").each(function (index) {
        for(i = 0; i < columnRightIndexesInSequence.length; i = i +1) {
            $(this).append(
                '<div class="col-lg-12 right-button">' +
                    '<button id="btn-right-'+columnRightIndexesShuffled[i]+'" type="button" class="button-column btn btn-primary btn-lg">'+columnRightNamesInSequence[columnRightIndexesShuffled[i]]+'</button>' +
                '</div>'
            );
        }
    });
    
    
    
    function GetStartPoints() {
      // This function sets start points
        x1 = event.clientX;
        y1 = event.clientY;
    }
    
    function GetEndPoints() {
      // This function sets end points
        x2 = event.clientX;
        y2 = event.clientY;
    }
    function drawLine() {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
    
    
    document.onclick= function(event) {
    // Compensate for IE<9's non-standard event model
    if (event===undefined) event= window.event;
    var target= 'target' in event? event.target : event.srcElement;
    if (target.id == undefined || target.id == 'title' || target.id == '' || target.id == 'canvas') {
       // if any of these ids are clicked then return from click event and dont proceed
        return false;
    }
    
    // if doesnt exist in array
    if (click1 == false && click2 == false) {

        clickId = target.id;
        clickColumn = clickId.split('-')[1];
        clickButtonIndex = clickId.split('-')[2];

        clickColumnIdCurrent = clickColumn;
        clickButtonIdCurrent = clickButtonIndex;

        clickColumnIdPrevious = clickColumnIdCurrent;
        clickButtonIdPrevious = clickButtonIdCurrent;
        
        previousColButton = clickColumn + '-' + clickButtonIndex;
        
        // Getting clicked Coords: x1, y1
        GetStartPoints();

        if (clickColumn == 'left') {
            buttonLeftIndex = clickButtonIndex;
//            alert(clickColumn + ' : '+ buttonLeftIndex);
            lastColumn = clickColumn;
            // Reposition the x1 coord to the right of the clicked button on left column rather than getting the clicked position
            x1 = document.querySelector("#" + clickId).getBoundingClientRect().right;
            
        } else if (clickColumn == 'right') {
            buttonRightIndex = clickButtonIndex;
//            alert(clickColumn + ' : '+ buttonRightIndex);
            lastColumn = clickColumn;
            
            // Reposition the x1 coord to the left of the clicked button on right column rather than getting the clicked position
            x1 = document.querySelector("#" + clickId).getBoundingClientRect().left;
        }

        click1 = true;
        

    } else if (click2 == false) {
        clickId = target.id;
        clickColumn = clickId.split('-')[1];
        clickButtonIndex = clickId.split('-')[2];

        clickColumnIdCurrent = clickColumn;
        clickButtonIdCurrent = clickButtonIndex;
        currentColButton = clickColumn + '-' + clickButtonIndex;
        
        if (clickColumn == 'left') {
            isCurrentLeft = true;
            
        } else if (clickColumn == 'right') {
            isCurrentLeft = false;
        }
        
        if (lastColumn != clickColumn) {
//            alert(clickColumn + ' : '+ lastColumn);
            
            if (isCurrentLeft == true) {
                
                if (jQuery.inArray(currentColButton, leftAnswersIdArray) == -1 
                    && jQuery.inArray(previousColButton, rightAnswersIdArray) == -1) {
                    
                    if (clickColumn == 'left') {
                        buttonLeftIndex = clickButtonIndex;

                        leftAnswersIdArray.push(currentColButton);
                        rightAnswersIdArray.push(previousColButton);

                    } else if (clickColumn == 'right') {
                        buttonRightIndex = clickButtonIndex;

                        leftAnswersIdArray.push(previousColButton);
                        rightAnswersIdArray.push(currentColButton);
                    }
                    
                    // Getting clicked Coords: x2, y2
                    GetEndPoints();
                    
                    // Reposition the x2 coord to the right of the clicked button on left column rather than getting the clicked position
                    x2 = document.querySelector("#" + clickId).getBoundingClientRect().right;
                    
                    context.beginPath();
                    context.moveTo(x1, y1 - offsetY);
                    context.lineTo(x2, y2 - offsetY);
                    context.lineWidth = lineWidth;

                    // set line color
                    if (clickButtonIdCurrent == clickButtonIdPrevious) {
                        // If answer is right

                        context.strokeStyle = '#008800';
                        answeredIdsArray.push(clickButtonIdCurrent);
                        context.stroke();
                    } else {
                        // if it doesnt exist -- it not already answered wrong
                        context.strokeStyle = '#ff0000';
                        context.stroke();
                    }
                    
                }
                isCurrentLeft = false;
                
            } else if (isCurrentLeft == false) {
                
                if (jQuery.inArray(currentColButton, rightAnswersIdArray) == -1 
                    && jQuery.inArray(previousColButton, leftAnswersIdArray) == -1) {
                    if (clickColumn == 'left') {
                        buttonLeftIndex = clickButtonIndex;

                        leftAnswersIdArray.push(currentColButton);
                        rightAnswersIdArray.push(previousColButton);

                    } else if (clickColumn == 'right') {
                        buttonRightIndex = clickButtonIndex;

                        leftAnswersIdArray.push(previousColButton);
                        rightAnswersIdArray.push(currentColButton);
                    }
                    
                    // Getting clicked Coords: x2, y2
                    GetEndPoints();
                    
                    // Reposition the x2 coord to the left of the clicked button on right column rather than getting the clicked position
                    x2 = document.querySelector("#" + clickId).getBoundingClientRect().left;
                    context.beginPath();
                    context.moveTo(x1, y1 - offsetY);
                    context.lineTo(x2, y2 - offsetY);
                    context.lineWidth = lineWidth;

                    // set line color
                    if (clickButtonIdCurrent == clickButtonIdPrevious) {
                        // If answer is right

                        context.strokeStyle = '#008800';
                        answeredIdsArray.push(clickButtonIdCurrent);
                        context.stroke();
                    } else {
                        // if answer is wrong, now we will collect ids of wrong answer from both columns like 1 != 4
                        // So we will pair it and store it on an array index e.g. '1-4' on index n
                        // We will also have to look for if user click on 4 then 1, we shouldn't make '4-1' paid, so will do greater and less than comparison and smaller number will be placed before dash and then greater number id will come so it will become '1-4', which will help us in comparison

                        // if it doesnt exist -- it not already answered wrong
                        context.strokeStyle = '#ff0000';
                        context.stroke();
                    }
                    
                }
                
                
            }

        }
        click1 = false;
        click2 = false;

        }
        
    };
    
    // Shuffle Array functions
    function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
    
});
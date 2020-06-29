let gameOn = true;
let UIController = function(){
    //Declare all DOM Strings
    let DOMStrings = new Map();
    DOMStrings.set('container', '.container');
    DOMStrings.set('resetBtn', '#resetBtn');

    //Map which contains ID and card icon pairs
    let cardID = new Map();
    cardID.set(0, 'chess.jpg');
    cardID.set(1, 'chess.jpg');
    cardID.set(2, 'chess-art.jpg');
    cardID.set(3, 'chess-art.jpg');
    cardID.set(4, 'chess-white.jpg');
    cardID.set(5, 'chess-white.jpg');

    let flipCard = (ID)=>{
        document.querySelector(`#card-${ID}`).firstChild.src = cardID.get(ID)
    };

    let removeAll = ()=>{
        document.querySelector(DOMStrings.get('container')).innerHTML = '';
        document.querySelector(DOMStrings.get('container')).innerHTML = '<img class = "winnerImg" src = "winner.jpg">';
    }

    let check = ()=>{
        let fields, sameCards;
        sameCards = [];

        fields = document.querySelectorAll(`#card-0 , #card-1 , #card-2 , #card-3 , #card-4 , #card-5`);
        
        let nodeListForEach = (list, callback)=>{
            for(let i = 0; i<list.length; i++){
                callback(list[i]);
            }
        };

        nodeListForEach(fields, (current)=>{
            let img = current.firstChild.src.split('/').pop();
            if(img !== 'card.jpg'){
                sameCards.push(img);
            }
        });

        if(sameCards[0] === sameCards[1]){
            gameOn = false;
            setTimeout(removeAll, 500);
        }
        sameCards.splice(0, sameCards.length);
    }

    let clearArea = function(){
        document.querySelector(DOMStrings.get('container')).innerHTML = '';
    }

    let coverAll = ()=>{
        let fields;

        fields = document.querySelectorAll(`#card-0 , #card-1 , #card-2 , #card-3 , #card-4 , #card-5`);
        
        let nodeListForEach = (list, callback)=>{
            for(let i = 0; i<list.length; i++){
                callback(list[i]);
            }
        }

        nodeListForEach(fields, (current)=>{
            current.firstChild.src = 'card.jpg';
        })
        
    };

    return{
        DOMStrings : ()=>DOMStrings,

        //function to flip the card
        flipCard : (ID)=>flipCard(ID),

        //function to cover back all the cards
        coverAll : ()=>coverAll(),

        //check is the game is in winning position or not
        check : ()=>check(),

        //remove all the child elements
        removeAll : ()=>removeAll(),

        //clear Area function
        clearArea : ()=>clearArea()
    }

}();

let AppCtrl = function(UICtrl){
    //counter to keep track to number of clicks
    let clickCounter = 0;

    //Import DOM Strings from UI Controller
    let DOMStrings = UICtrl.DOMStrings();
    
    //Start Listening Click Event
    let initiateApplication = ()=>{
        
        //set click couneter to 0
        clickCounter = 0;

        //set gameOn status to true
        gameOn = true;

        //Clear Area
        UICtrl.clearArea();

        //Shuffle the cards
        shuffleCards();
        
        //Start Listening the events
        document.querySelector(DOMStrings.get('container')).addEventListener('click', clickEventHandler);

        //start listening reset button
        document.querySelector(DOMStrings.get('resetBtn')).addEventListener('click', initiateApplication);
    }

    //function to show the cards
    let cardShow = ()=>{
        let cardID, ID;
        cardID = event.target.parentNode.id;
        ID = parseInt(cardID.split('-')[1]);
        console.log(clickCounter);
        if(ID !== '' && ID !== undefined && !isNaN(ID)){
            clickCounter++;
            UICtrl.flipCard(ID);
        }
    };

    //Click Event Handler
    function clickEventHandler(event){
        if(gameOn === true){
            cardShow();
            if(clickCounter > 2){
                clickCounter = 0;
                UICtrl.check();
                setTimeout(UICtrl.coverAll, 100);                               
            }
            else{
                cardShow(event);            
            }
        }
                           
    }


    //function to shuffle
    function shuffleCards(){
        let array = [0, 1, 2, 3, 4, 5], html, newHtml;
        
        //Algorithm to shuffle an array
        for(let i = array.length - 1; i > 0; i--){
            let j = Math.floor(Math.random()*(i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        html = '<div class = "card" id = "card-%id%"><img class = "imgCard" src = "card.jpg"></div>';
        array.forEach((current)=>{
            newHtml = html.replace('%id%', current);
            document.querySelector(DOMStrings.get('container')).insertAdjacentHTML('beforeend', newHtml);
        })
    }
   

    return{
        
        //Start Listening Click Event
        init : ()=>initiateApplication()
    }
}(UIController);

AppCtrl.init();
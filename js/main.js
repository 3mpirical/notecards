
////////// THIS FUNCTION HELPS APPEND TO THE DOM
const DOM = (node) => {
    //// This function clears the contents of an element
    //// (Think resetting a display)
    const deleteContents = (node) => {
        node.innerHTML = "";
        return DOM();
    };

    //// These three functions create a document fragment 
    //// and then adds elements to the fragment until 
    //// it is appended with the append function below.
    const createFrag = () => {
        let node = document.createDocumentFragment();
        return DOM(node);
    };

    const add = (element, text, ...nodeClass) => {
        let fragNode = document.createElement(element);
        if(text) fragNode.textContent = text;
        [...nodeClass].forEach((item) => {
            fragNode.classList.add(item);
        });
        node.appendChild(fragNode);
        return DOM(node);
    };

    const addImg = (src, ...nodeClass) => {
        let fragNode = document.createElement("img");
        [...nodeClass].forEach((item) => {
            fragNode.classList.add(item);
        });
        fragNode.setAttribute("src", src);
        node.appendChild(fragNode);
        return DOM(node);
    };

    //// These two functions are for creating singluar elements an images
    const create = (element, text, ...nodeClass) => {
        let node = document.createElement(element);
        if(text) node.textContent = text;
        [...nodeClass].forEach((item) => {
            node.classList.add(item);
        });
        return DOM(node);
    };

    const createImg = (src, ...nodeClass) => {
        let node = document.createElement("img");
        [...nodeClass].forEach((item) => {
            node.classList.add(item);
        });
        node.setAttribute("src", src);
        return DOM(node);
    };

    //// this function appends the ndoe or document fragment to the DOM
    const append = (parentNode) => {
        parentNode.appendChild(node);
        return DOM();
    };

    return {
        deleteContents,
        createFrag,
        add,
        addImg,
        create,
        createImg,
        append
    };
};



const elements = {
    display: document.querySelector(".notecard-container"),
    add: () => document.querySelector(".add"),
    remove: () =>  document.querySelector(".remove"),
    recall: () =>  document.querySelector(".recall"),
    questionInput: () =>  document.querySelector(".add-question"),
    answerInput: () =>  document.querySelector(".add-answer"),
    cardSubmit: () =>  document.querySelector(".add-submit"),
    removeContainer: () => document.querySelector(".remove-container"),
    recallNext: () => document.querySelector(".recall-next"),
};



////////// MODEL //////////
const MDL = (function() {

    class Notecard {
        constructor(question, answer, id) {
            this.question = question;
            this.answer = answer;
            this.id = id;
        }
    }

    let recall;
    let cardCount = 0;
    let idCount = 0;
    let cardArray = [];

    const addCard = (question, answer) => {
        const card = new Notecard(question, answer, idCount);
        cardArray.push(card);
        idCount ++;
    };

    const removeCard = (id) => {
        cardArray = cardArray.filter((item) => item.id !== id );
    };

    const getCards = () => {
        return cardArray;
    };

    return {
        addCard,
        removeCard,
        getCards,
        recall,
        cardCount,
    };
} () );



///// SEEDING DATA
MDL.addCard("Why is the sky blue?", "It just is");
MDL.addCard("Who was Albert Einstein?", "A smart guy...");
MDL.addCard("Why do bad things happen to good people?", "Define \"good\" people, and I'll give you a proper answer");
MDL.addCard("Who made the first smartphone?", "No one, it's MAGIC!");
MDL.addCard("Why are deserts dry?", "It's the other way around, places are deserts because they are dry" );



////////// VIEW //////////
const VIEW = (function(MDL) {

    function questionDisplay() {
        const question = MDL.getCards()[MDL.cardCount].question;
        DOM()
        .deleteContents(elements.display)
        .createFrag()
        .add("div", null, "recall-notecard")
        .add("div", "Next", "button", "recall-next")
        .add("p", question, "recall-text")
        .add("p", MDL.recall === "question"? "Question:" : "Answer:", "recall-type")
        .append(elements.display);
    }

    function answerDisplay() {
        const answer = MDL.getCards()[MDL.cardCount].answer;
        DOM()
        .deleteContents(elements.display)
        .createFrag()
        .add("div", null, "recall-notecard")
        .add("div", "Next", "button", "recall-next")
        .add("p", answer, "recall-text")
        .add("p", MDL.recall === "question"? "Question:" : "Answer:", "recall-type")
        .append(elements.display);
    }

    function navDisplay() {
        DOM()
        .createFrag()
        .add("div", null, "nav-border")
        .add("h3", "Note Cards", "nav-heading")
        .add("button", "Add", "button", "add")
        .add("button", "Remove", "button", "remove")
        .add("button", "Recall", "button", "recall")
        .append(elements.display);
    }

    function addDisplay() {
        DOM()
        .deleteContents(elements.display)
        .createFrag()
        .add("div", null, "add-notecard")
        .add("input", "Question...", "add-question")
        .add("input", "...Answer", "add-answer")
        .add("div", "Submit", "button", "add-submit")
        .append(elements.display);

        elements.questionInput().placeholder = "Question .....";
        elements.answerInput().placeholder = "..... Answer";

        navDisplay();
    }

    function removeDisplay() {
        const docFrag = document.createDocumentFragment();

        MDL.getCards().forEach((item) => {
            node = document.createElement("p");
            node.classList.add("question");
            node.classList.add("button");
            node.setAttribute("data-id", item.id);
            node.textContent = item.question;
            docFrag.appendChild(node);
        });

        DOM()
        .deleteContents(elements.display)
        .create("div", null, "remove-container")
        .append(elements.display);

        document.querySelector(".remove-container").appendChild(docFrag);
        navDisplay();
    }

    function welcomeDisplay() {
        DOM()
        .createFrag()
        .add("p", "Welcome to your notecards!", "welcome-text")
        .add("p", "Hit \"Recall\" to review your notecards.", "welcome-text")
        .add("p", "Some example cards are included.", "welcome-text")
        .append(elements.display);
    }
    
    return {
        welcomeDisplay,
        navDisplay,
        addDisplay,
        removeDisplay,
        questionDisplay,
        answerDisplay,
    };
} (MDL) );



////////// CONTROLLER //////////
const CTRL = (function(MDL, VIEW) {

    function handleRecall() {
        if(MDL.cardCount < MDL.getCards().length) {
            if(MDL.recall === "question") {
                VIEW.questionDisplay();
                elements.recallNext().addEventListener("click", (event) => {
                    MDL.recall = "answer";
                    handleRecall();
                });
            } else if(MDL.recall === "answer") {
                VIEW.answerDisplay();
                elements.recallNext().addEventListener("click", (event) => {
                    MDL.recall = "question";
                    MDL.cardCount ++;
                    handleRecall();
                });
            }
        } else {
            MDL.cardCount = 0;
            DOM().deleteContents(elements.display);
            VIEW.navDisplay();
            VIEW.welcomeDisplay();
            initNavListeners();
        }
    }

    function initRemoveListeners() {
        elements.removeContainer().addEventListener("click", (event) => {
            if(event.target.matches(".question")) {
                const id = parseInt(event.target.dataset.id);
                MDL.removeCard(id);
                VIEW.removeDisplay();
                initRemoveListeners();
                initNavListeners();
            }
        });
    }


    function initAddDisplayListeners() {
        const submitCard = () => {
            const questionInput = elements.questionInput();
            const answerInput = elements.answerInput();

            if(questionInput.value !== "" && answerInput.value !== "") {
                const question = questionInput.value;
                const answer = answerInput.value;
                questionInput.value = "";
                answerInput.value = "";
                questionInput.focus();
    
                MDL.addCard(question, answer);
            }
        };

        elements.cardSubmit().addEventListener("submit", submitCard);
        document.addEventListener("keypress", (event) => {
            if(event.keyCode === 13 && elements.cardSubmit()) submitCard();
        });   
    }

    function initNavListeners() {
        elements.add().addEventListener("click", (event) => {
            VIEW.addDisplay();
            initAddDisplayListeners();
            initNavListeners();
        });
        elements.remove().addEventListener("click", (event) => {
            VIEW.removeDisplay();
            initRemoveListeners();
            initNavListeners();
        });
        elements.recall().addEventListener("click", (event) => {
            if(MDL.getCards().length === 0) return;
            MDL.recall = "question";
            handleRecall();
        });
    }

    function initializeNoteCards() {
        VIEW.navDisplay();
        VIEW.welcomeDisplay();
        initNavListeners();
    }

    return {
        initializeNoteCards,
    };
} (MDL, VIEW) );



////////// EXECUTION //////////
CTRL.initializeNoteCards();
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCWzc4_SGHgtLLfZSrM7cHyOivYRR2djRk",
    authDomain: "adventkalender-71f8a.firebaseapp.com",
    databaseURL: "https://adventkalender-71f8a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "adventkalender-71f8a",
    storageBucket: "adventkalender-71f8a.appspot.com",
    messagingSenderId: "603397180626",
    appId: "1:603397180626:web:444b314e12b6e5d2a2710b",
    measurementId: "G-M3HCYX2SG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ReOpenWindows();
Clickable();



function getDataRef(number) {
    //get the window content from firebase
    const item = ref(database, 'items/' + number);

    //return data as promise
    return item;
}
//add a function to make the window clickable
function Clickable() {
    var today = new Date();
    var day = today.getDate();
    console.log(day);

    var elements =document.getElementsByClassName("window")
    for (var i = 0; i < 24; i++) {
        console.log(i);
        elements[i].addEventListener("click",Clicked);

    }
}

//add a function that gets called when the window is clicked
function Clicked() {
    //get the number of the classname
    var classname = this.className;
    //remove all the text from the classname
    var number = classname.replace( /^\D+/g, '');
    console.log(number);
    OpenWindow(number);
}

//add a function that checjks if one can open the window
function CanOpen(number) {
    //get the current day
    var today = new Date();
    var day = today.getDate();
    //check if the number is greater current day
    return number <= day;

}

//add a function that opens the window
function OpenWindow(number) {
    //check if the window can be opened
    if (CanOpen(number)) {
        var elements =document.getElementsByClassName("window window-" + number)
        //open the window
        // check if the item is in local storage
        if (localStorage.getItem("window" + number) != null) {
            //get the item from local storage
            var item = ReadLocalWindowContent(number);
            elements[0].innerHTML= item;
            elements[0].classList.add("open");

            //get the item from firebase
        } else {
            var data = getDataRef(number);
            //add the item to local storage
            onValue(data, (snapshot) => {
                    const value = snapshot.val();
                    console.log("prommiss" + number)
                    elements[0].innerHTML= value;
                    elements[0].classList.add("open");
                    //add the window to the local storage
                    WriteWindowContent(number, value);
                }
            );
        }

    }
}

//add a function that writes the items in windows to local storage
function WriteWindowContent(id,item) {
    //check if local storage 'windows' exists
    if (localStorage.getItem("windows") === null) {
        //if not, create it
        localStorage.setItem("windows", "0" );
    }
    else {
        //if it does, get the value
        var windowString  = localStorage.getItem("windows");

    }
    //convert the string to a number
    var windowFlags  = parseInt(windowString );
    //set the bit of the number to 1
    windowFlags  |= 1 << id;
    //convert the number back to a string
    windowString  = windowFlags .toString();
    localStorage.setItem("windows", windowString );
    //add the item to local storage
    localStorage.setItem("window" + id, item);


}
//add a function that reads the items in windows from local storage
function ReadLocalWindowContent(id) {
    //get the value from local storage
    var item = localStorage.getItem("window" + id);
    //return the value
    return item;
}

//add a function that gets the open windows from local storage
function GetOpenWindows() {
    //check if local storage 'windows' exists
    if (localStorage.getItem("windows") === null) {
        //if not, create it
        localStorage.setItem("windows", "0" );
        return 0;
    }
    else {
        //if it does, get the value
        var windowString  = localStorage.getItem("windows");
        //convert the string to a number
        var windowFlags  = parseInt(windowString );
        //return the number
        return windowFlags ;
    }

}


//add a function that opens the windows based on the flag
function ReOpenWindows() {
    //get the open windows
    var windowFlags = GetOpenWindows();
    if (windowFlags === 0) {
        return;
    }
    //loop through all the windows
    for (var i = 1; i <= 24; i++) {
        //check if the bit is set
        if (windowFlags & (1 << i)) {
            //open the window
            OpenWindow(i);

        }
    }
}
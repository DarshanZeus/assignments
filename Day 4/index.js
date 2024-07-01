fetch("./json/card-data.json")
    .then((response) => response.json())
    .then((cardData) => {
        // console.log(cardData);
        console.log(cardData.length);
        cardData.forEach((course) => {
            createCard(course);
        });
    }
    ).catch((error) => console.error("Error fetching cardData:", error));


function createCard(course) {
    // console.log(course);

    const cardContainer = document.getElementById("card-container");
    // console.log(cardContainer + "this is card container");
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    // console.log(cardData)

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-flex-container");
    cardContent.innerHTML = `
        <img class="card-img img${course.courseId - 1}"
            src="${course.image}"
            alt="course image" />

        ${course.expire === true  ?   
        `<div class="card-content1">` 
        :   
        `<div class="card-content">`
        }
            <div class="card-heading${course.courseId}">
                ${course.name}
            </div>
            <div class="course-details">
                <span class="type">
                    ${course.type}
                </span>
                <div class="pipe1"></div>
                <div class="grade">
                    ${course.grade}
                </div>
                <span class="extra-count">
                    ${course.extraCount}
                </span>
            </div>
            <div class="course-lengthdetails">
                <div class="unit-detail">
                    <span class="count">
                        ${course.unitCount}
                    </span>
                    <span class="unit">
                        Units
                    </span>
                </div>
                <div class="lessons-detail">
                    <span class="count">
                            ${course.lessonsCount}
                    </span>
                    <span class="lessons">
                        Lessons
                    </span>
                </div>
                <div class="topics-detail">
                    <span class="count">
                            ${course.topicsCount}
                    </span>
                    <span class="topics">
                        Topics
                    </span>
                </div>
            </div>

            <div class="inputContainer1">
                <select required="true" class="customInput customInput1" id="ci1" name="state">
                    ${
                        course.classes.map((i) => `<option class="option" value="Course Name" selected> ${i} </option>`)
                    }
                    <!-- <option class="option" value="Course Name" selected> ${course.classes[0]} </option> -->
                    <!-- <option class="option" value="" disabled>${course.classes[1] }</option> -->
                    <!-- <option value="Date" class="option">${course.classes[2] }</option> -->
                    <!-- <option value="Date" class="option">${course.classes[3] }</option> -->

                    <!-- Add more options as needed -->
                </select>
            <div class="inputUnderline"></div>
        </div>
        <div class="time-details">
            <span class="student">
                ${course.students}
            </span>
                ${course.date ? 
                    `<div class="pipe1"></div><div class="date">
                        ${course.date}
                    </div>`
                    : 
                    `<div> </div>`
                }
        </div>
        </div>
        ${
            course.brightstar === false ? 
            `<div class="star1">
                <img class="brightstar1"
                    src="./icons/favourite.svg"
                    alt="star icon" />

            </div>`
                : 
            `<div class="star">
                <img class="brightstar"
                    src="./icons/favourite.svg"
                    alt="star icon" />
            </div>`
        }    

    `;

    const underline = document.createElement("div");
    underline.classList.add("inputUnderlinecard");

    const btncontainer = document.createElement("div");
    btncontainer.classList.add("fourbtn-container");

    btncontainer.innerHTML = `  
    ${
        course.preview ?
        `<img class="showicon" alt="show icon" src="./icons/preview.svg"></img>`
        :
        `<img class="showicon opacity" alt="show icon" src="./icons/preview.svg"></img>`
    }  
    ${
        course.calender ?
        `<img class="calendericon" alt="calendar icon" src="./icons/manage course.svg"></img>`
        :
        `<img class="calendericon opacity" alt="calendar icon" src="./icons/manage course.svg"></img>`
    }  
    ${
        course.gradeSubmission ?
        `<img class="gradeicon" alt="grade icon" src="./icons/grade submissions.svg"></img>`
        :
        `<img class="gradeicon opacity" alt="grade icon" src="./icons/grade submissions.svg"></img>`
    }  
    ${
        course.reports ?
        `<img class="reporticon" alt="report icon" src="./icons/reports.svg"></img>`
        :
        `<img class="reporticon opacity" alt="report icon" src="./icons/reports.svg"></img>`
    }
    `;




    const courseExpired = document.createElement("div");
    courseExpired.classList.add("expired-label");
    courseExpired.innerHTML = `EXPIRED`;
    if (course.expire === true) {
        cardDiv.appendChild(courseExpired);
    }
    
    cardDiv.appendChild(cardContent);
    cardDiv.appendChild(underline);
    cardDiv.appendChild(btncontainer);

    cardContainer.appendChild(cardDiv);
}



//////////////////////////////////////////////////////////////////////////////////////////
/// MENU HAMBURGER ///////////////////////////////////////////////////////////////////////

const menuOptioncontainer =  document.createElement("div");
menuOptioncontainer.classList.add("nav-option-container");
menuOptioncontainer.innerHTML = `
    <div class="nav-option-content">
  <a href="#" class="menu-option option1">DASHBOARD</a>
  <a href="#" class="menu-option option2"><div class="flex">CONTENT
  <img src="./icons/arrow-down.svg" class="arrow-down" alt="arrow down"/>
  </div>
  <div class="submenu">COURSE CATALOG</div>
  </a>
  <a href="#" class="menu-option option3"><div class="flex">USERS
  <img src="./icons/arrow-down.svg" class="arrow-down" alt="arrow down"/>
   </div>
  <div class="submenu">COURSE CATALOG</div></a>
  <a href="#" class="menu-option option4"><div class="flex">REPORTS
  <img src="./icons/arrow-down.svg" class="arrow-down" alt="arrow down"/>
   </div>
  <div class="submenu">COURSE CATALOG</div></a>
  <a href="#" class="menu-option option5"><div class="flex">ADMIN
  <img src="./icons/arrow-down.svg" class="arrow-down" alt="arrow down"/>
   </div>
  <div class="submenu">COURSE CATALOG</div></a>
  </div>
`

menuOptioncontainer.style.display = "none";
document.body.appendChild(menuOptioncontainer);
const hamburgerIcon = document.querySelector(".hamburger");
if (hamburgerIcon){
    hamburgerIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if(notifications)
            notifications.style.display = "none";
        if(announcements)
            announcements.style.display = "none";
        if(menuOptioncontainer.style.display === "none")
            menuOptioncontainer.style.display = "block";
        else
            menuOptioncontainer.style.display = "none";
    })
}

const menuoption = document.querySelectorAll(".menu-option");
menuoption.forEach((menu) => {
    const clickedSubMenu = menu.querySelector(".submenu");
    const clickedSubMenuImg = menu.querySelector(".menu-option img");
    
    if (menu && clickedSubMenu) {
        menu.addEventListener("click", (e) => {
            e.stopPropagation();
            // const arrowIcon = document.querySelector(".arrow-down");
            // arrowIcon.classList.add("rotate180");
            if(clickedSubMenu) {
                if(clickedSubMenu){
                    if (clickedSubMenu.style.display === "none"){
                        clickedSubMenu.style.display = "block";
                        clickedSubMenuImg.classList.add("rotate180")
                    }
                    else{
                        clickedSubMenu.style.display = "none"
                        clickedSubMenuImg.classList.remove("rotate180")
                    }
                }
                if(menuOptioncontainer.style.display === "none")
                    clickedSubMenu.style.display = "none";
            }
        });
    }
});


document.body.addEventListener("click", (e) => {
    if(hamburgerIcon){
        if(!menuOptioncontainer.contains(e.target) && !hamburgerIcon.contains(e.target) ){
            menuOptioncontainer.style.display = "none";
            menuoption.forEach((menu) => {
                const submenu = menu.querySelector(".submenu");
                if(submenu){
                    submenu.style.display = "none";
                }
            });
        }
    }
    if (notifications) {
        if (!(notifications === null || notifications === void 0 ? void 0 : notifications.contains(event.target))) {
            notifications.style.display = "none";
        }
    }
    if (announcements) {
        if (!(announcements === null || announcements === void 0 ? void 0 : announcements.contains(event.target))) {
            announcements.style.display = "none";
        }
    }
});




/////////////////////////////////////////////////////////////////////////////////////
///// ANNOUNCEMENT /////////////////////////////////

const announcements = document.querySelector(".announcements");
if (announcements) {
    announcements.style.display = "none";
}
const announceIcon = document.querySelector(".Announcement");
if (announceIcon) {
    announceIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (notifications)
            notifications.style.display = "none";
        menuOptioncontainer.style.display = "none";
        if (announcements) {
            announcements.innerHTML = "";
        }
        fetch("./json/announcement-data.json")
            .then((response) => response.json())
            .then((AnnounceData) => {
            // console.log(cardData);
            AnnounceData.forEach((announce) => {
                createAnnouncement(announce);
            });
            if (announcements){
                announcements.innerHTML += 
                `<div class="announce-buttons">
                    <button type="button" class="show-button">
                        SHOW ALL
                    </button>
                    <div class="btncenterline"></div>
                    <button type="button" class="create-button">
                        CREATE NEW
                    </button>
                </div>`;
            }
        }).catch((error) => console.error("Error fetching Notification Data:", error));
        
        if (announcements)
            (announcements === null || announcements === void 0 ? void 0 : announcements.style.display) == "none"
                ? (announcements.style.display = "block")
                : (announcements.style.display = "none");
    });
}
function createAnnouncement(announcement) {
    const announcecontainer = document.createElement("div");
    announcecontainer.classList.add("announce-container");
    
    if (announcements) {
        announcements.appendChild(announcecontainer);
    }
    announcement.readStatus
        ? announcecontainer.classList.add("announce-read")
        : announcecontainer.classList.add("announce-unread");
    announcecontainer.innerHTML = `
    

  <div class="announce-PA"><p class='lowoptitle'>PA:</p>${announcement.PA}</div>
    <div class="announce-firstline">
          <div class="announce-description">${announcement.Description}</div>


          <div class="announce-readStatus">${announcement.readStatus
        ? `
              <img class="readicon" src="./icons/correct.png" alt="announcement Read" />
            `
        : `
              <img class="dndicon" src="./icons/dnd.png" alt="announcement not read" />
            `}</div>
          </div>
          ${announcement.class !== ""
        ? `<div class="announce-class"><p class='lowoptitle'>Class:</p>${announcement.class}</div>`
        : `<div class="announce-emptyClass"></div>`}
          ${announcement.Course !== ""
        ? `<div class="announce-course"><p class='lowoptitle'>Course:</p>${announcement.Course}</div>`
        : `<div class="announce-emptycourse"></div>`}
          
          ${announcement.files_atteched
        ? ` <div class="announce-lastline"> <div class="announce-lastline-files">
          <img src="./icons/paperclip.svg" alt="paperclip icon" class="paperclip-icon" />
          <div class="announce-fileatteched">${announcement.files_atteched}</div>
          </div>
          <div class="announce-dateTime">${announcement.Date_Time}</div> 
          </div>`
        : `  <div class="announce-dateTime">${announcement.Date_Time}</div> `}
        
          
          `;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// NOTIFICATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// document.body.addEventListener("click", (event) => {
//     if (hamburgerIcon) {
//         if (!menuOptioncontainer.contains(event.target) &&
//             !hamburgerIcon.contains(event.target)) {
//             menuOptioncontainer.style.display = "none";
//             menuoption.forEach((menu) => {
//                 const submenu = menu.querySelector(".submenu");
//                 if (submenu) {
//                     submenu.style.display = "none";
//                 }
//             });
//         }
//     }
//     if (notifications) {
//         if (!(notifications === null || notifications === void 0 ? void 0 : notifications.contains(event.target))) {
//             notifications.style.display = "none";
//         }
//     }
//     if (announcements) {
//         if (!(announcements === null || announcements === void 0 ? void 0 : announcements.contains(event.target))) {
//             announcements.style.display = "none";
//         }
//     }
// });
const notifications = document.querySelector(".notifications");
if (notifications) {
    notifications.style.display = "none";
}
const notifyIcon = document.querySelector(".notification");
if (notifyIcon) {
    notifyIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (announcements) {
            announcements.style.display = "none";
        }
        menuOptioncontainer.style.display = "none";
        if (notifications) {
            notifications.innerHTML = "";
        }
        fetch("./json/notification-data.json")
            .then((response) => response.json())
            .then((NotifyData) => {
            // console.log(cardData);
            NotifyData.forEach((notification) => {
                createNotification(notification);
            });
            if (notifications)
                notifications.innerHTML += `<div class="notify-buttons"><button type="button" class="show-button">Show All</button>
        </div>`;
        })
            .catch((error) => console.error("Error fetching Notification Data:", error));
        if (notifications)
            (notifications === null || notifications === void 0 ? void 0 : notifications.style.display) == "none"
                ? (notifications.style.display = "block")
                : (notifications.style.display = "none");
    });
}
function createNotification(notification) {
    const notifycontainer = document.createElement("div");
    notifycontainer.classList.add("notify-container");
    if (notifications) {
        notifications.appendChild(notifycontainer);
    }
    notification.readStatus
        ? notifycontainer.classList.add("notify-unread")
        : notifycontainer.classList.add("notify-read");
    notifycontainer.innerHTML = `
    <div class="notify-firstline">
          <div class="notify-description">${notification.Description}</div>
          <div class="notify-readStatus">${notification.readStatus
        ? `
              <img class="readicon" src="./icons/correct.png" alt="Notification Read" />
            `
        : `
              <img class="dndicon" src="./icons/dnd.png" alt="Notification not read" />
            `}</div>
          </div>
          ${notification.class !== ""
        ? `<div class="notify-class"><p class='lowoptitle'>Class:</p>${notification.class}</div>`
        : `<div class="notify-emptyClass"></div>`}
          ${notification.Course !== ""
        ? `<div class="notify-course"><p class='lowoptitle'>Course:</p>${notification.Course}</div>`
        : `<div class="notify-emptycourse"></div>`}
          <div class="notify-dateTime">${notification.Date_Time}</div> 
          
          `;
}

// (".arrow-down").click(function(){
//     (this).toggleClass("rotate")  ; 
// })

// const arrowIcon = document.querySelector(".arrow-down");
// if (arrowIcon) {
//     arrowIcon.addEventListener("click", (e) => {
//         e.stopPropagation();
//         arrowIcon.classList.add("rotate180");
//     })
// }


export {};



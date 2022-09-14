const actionsButtonsImages = [
    {
        id: "user_actions_chat",
        src: "./icons/icon-chat.png",
    },
    {
        id: "user_actions_add",
        src: "./icons/icon-add-friend.png",
    },
    {
        id: "user_actions_preview",
        src: "./icons/icon-preview.png",
    },
];

const settings = {
    baseURL: "https://randomuser.me/api/",
    numberOfUsers: 24,
    usersPerPage: 8,
    nations: ["ua"],
    fieldsToFetch: {
        gender: true,
        name: true,
        location: true,
        email: false,
        login: true,
        registered: false,
        dob: true,
        phone: false,
        cell: false,
        id: true,
        picture: true,
        nat: false,
    },
    userIDField: "uuid",
    filtersFields: ["gender", "age"],
};

let usersData,
    filteredUsersData,
    shownUsersNumber = 0;

const filtersForm = document.querySelector(".filter_form");

document
    .querySelector("#search_friends")
    .addEventListener("click", async function (e) {
        document.querySelector("#filters_menu_btn").classList.remove("hide");
        document.querySelector(".main_content").classList.remove("hide");
        document.querySelector(".main").classList.remove("hide");
        document.querySelector(".found_users").innerHTML = "";
        shownUsersNumber = 0;
        toggleLoaderAnimation();
        await searchFriends();
        renderUsersCards(usersData, document.querySelector(".found_users"));
        toggleLoaderAnimation();
    });

function toggleLoaderAnimation() {
    document.querySelector(".lds-ripple").classList.toggle("hide");
}

async function searchFriends() {
    usersData = await getUsers(
        createRequestUrl(settings.baseURL, settings.fieldsToFetch),
        settings.numberOfUsers
    );
    filteredUsersData = usersData;
    console.log(usersData);
}

function createRequestUrl(baseURL, fieldsToFetch) {
    return (
        `${baseURL}?inc=` +
        Object.keys(fieldsToFetch)
            .filter((key) => fieldsToFetch[key])
            .join(",")
    );
}

async function getUsers(url, numberOfUsers) {
    url += `&results=${+numberOfUsers}&nat=${settings.nations.join(",")}`;
    return (await getData(url)).results;
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        showErrorMessage();
    }
}

function showErrorMessage() {
    document.querySelector(".found_users").innerHTML = `
        <div></div>
        <p class="error_massage">Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.</p>
        <div></div>`;
    toggleLoaderAnimation();
}

function renderUsersCards(usersData, container) {
    if (container.querySelector("#show_more")) {
        container.querySelector("#show_more").parentNode.remove();
    }
    let usersCardsForShow = [];
    for (
        let i = settings.usersPerPage * shownUsersNumber;
        i < settings.usersPerPage * (shownUsersNumber + 1);
        i++
    ) {
        if (i < usersData.length) {
            usersCardsForShow.push(createUserCardHTML(usersData[i]));
        } else {
            break;
        }
    }
    container.innerHTML +=
        usersCardsForShow.join("") + makePaginationButtonHTML();
    document.querySelector("#show_more").addEventListener("click", (e) => {
        shownUsersNumber++;
        renderUsersCards(
            filteredUsersData,
            document.querySelector(".found_users")
        );
    });
}

function createUserCardHTML(user) {
    return (
        `<div class="user_card">` +
        makeUserCardAvatarHTML(user) +
        makeUserCardInfoHTML(user) +
        makeUserCardActionsButtonsHTML() +
        makeUserCardMoreInfoHTML(user) +
        `</div>`
    );
}

function makePaginationButtonHTML() {
    return `<div class="user_card">
    <button class="nav_menu_item" id="show_more">
            Show more...
            </button>
            </div>`;
}

function makeUserCardAvatarHTML(user) {
    return `<img
            src="${user.picture.large}"
            alt=""
            class="user_avatar"/>`;
}

function makeUserCardInfoHTML(user) {
    let gSymbol = "";
    switch (user.gender) {
        case "female":
            gSymbol = "&#9792";
            break;
        case "male":
            gSymbol = "&#9794";
            break;
        default:
            break;
    }
    return `<div class="less_user_info">
            <p class="user_nickname">
            ${user.login.username} ${gSymbol};
            </p>
            <p class="user_age">Age: ${user.dob.age}</p>
            </div>`;
}

function makeUserCardActionsButtonsHTML() {
    return (
        `<div class="user_actions">` +
        actionsButtonsImages
            .map((actionImg) => {
                return `<img
                    src="${actionImg.src}"
                    alt=""
                    class="user_actions_icon"
                    id="${actionImg.id}"
                />`;
            })
            .join("") +
        `</div>`
    );
}

function makeUserCardMoreInfoHTML(user) {
    return `<div class="more_user_info hide">
                <p>
                    <span class="extra_field">First name:</span>
                    ${user.name.first}
                </p>
                <p>
                    <span class="extra_field"
                        >Second name:</span
                    >
                    ${user.name.last}
                </p>
                <p>
                    <span class="extra_field"
                        >Day OF Birth:</span
                    >
                    ${dobOfUser(user.dob.date)}
                </p>
                <p>
                    <span class="extra_field">Location:</span>
                    ${user.location.city}, ${user.location.country}
                </p>
            </div>`;
}

function dobOfUser(date) {
    return new Date(date).toDateString();
}

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});

/* function filteringFoundUsers(usersData) {
    const filtersInputsValues = parseFiltersInputs();
    let filteredUsers = usersData;
    filtersInputsValues.forEach((filtersValues) => {
        if (filtersValues.length != 0) {
            filteredUsers = filterUserWithFiltersGroup(
                filteredUsers,
                filtersValues
            );
        } else {
            return usersData;
        }
    });
    return filteredUsers;
}
 */ /*

function filterUserWithFiltersGroup(users, filtersValues) {
    const arrayOfFilters = makeFiltersFunctions(filtersValues);
    return users.filter((user) => {
        const isRelatedByAnyFilter = arrayOfFilters
            .map((filter) => filter(user))
            .indexOf(true);
        return isRelatedByAnyFilter === -1 ? false : true;
    });
} */
/*
function parseFiltersInputs() {
    let filters = [];
    document.querySelectorAll(".filters_group").forEach((filtersGroup) => {
        filters.push(
            Array.from(filtersGroup.querySelectorAll(".filtering:checked")).map(
                (filter) => [filter.name, filter.value]
            )
        );
    });
    return filters;
}
 */
/*
function makeFiltersFunctions(filters) {
    return filters.map((filter) => {
        switch (filter[0]) {
            case "gender":
                return createFilter("gender", filter[1]);
            case "age":
                return createFilter(
                    "age",
                    filter[1].split(" ")[0],
                    filter[1].split(" ")[1]
                );
            default:
                break;
        }
    });
}
 */

document.querySelectorAll(".disable_filter_btn").forEach((button) =>
    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.parentNode
            .querySelectorAll("input")
            .forEach((input) => (input.checked = false));
    })
);

/*
function createFilter(field, value, valueMax) {
    return function (user) {
        return checkField(user);
        function checkField(object) {
            for (let prop in object) {
                if (typeof object[prop] === "object") {
                    if (checkField(object[prop])) {
                        return true;
                    }
                } else if (
                    prop === field &&
                    (valueMax === undefined
                        ? object[prop] === value
                        : object[prop] >= value && object[prop] <= valueMax)
                ) {
                    return true;
                }
            }
            return false;
        }
    };
}
 */
filtersForm.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        document.querySelector(".found_users").innerHTML = "";
        filteredUsersData = filterUsers(usersData);
        renderUsersCards(
            filteredUsersData,
            document.querySelector(".found_users")
        );
    }
});

function filterUsers(usersData) {
    shownUsersNumber = 0;
    const filterFormData = new FormData(filtersForm);
    const filtersFunctions = createAllFiltersFunctions(filterFormData);
    if (isEmptyFilters(filtersFunctions)) {
        return usersData;
    } else {
        console.log(filtersFunctions);
        return usersData.filter((user) =>
            isRemainsByAllFilters(user, filtersFunctions)
        );
        //console.log(filteredUsersData);
    }
}

function isEmptyFilters(filters) {
    for (const field in filters) {
        if (filters[field].length != 0) {
            return false;
        }
    }
    return true;
}

function isRemainsByAllFilters(user, filtersFunctions) {
    let isUserRemainsByAllFilters = [];
    for (const fieldName in filtersFunctions) {
        if (filtersFunctions[fieldName].length !== 0) {
            const isUserRemainsByFilterGroup = filtersFunctions[fieldName]
                .map((fFunction) => {
                    return fFunction(user);
                })
                .indexOf(true);
            isUserRemainsByAllFilters.push(
                isUserRemainsByFilterGroup === -1 ? false : true
            );
        }
    }
    return !isUserRemainsByAllFilters.includes(false);
    /*
    const isUserRemainsByFilter =
    filterFunctions
    .map(filterFunction => {
        return filterFunction(user);
    });
    return (isUserRemainsByFilter.indexOf(true) === -1) ? false : true;
     */
}
/*
function filterUserWithFiltersGroup(users, filtersValues) {
    const arrayOfFilters = makeFiltersFunctions(filtersValues);
    return users.filter((user) => {
        const isRelatedByAnyFilter = arrayOfFilters
            .map((filter) => filter(user))
            .indexOf(true);
        return isRelatedByAnyFilter === -1 ? false : true;
    });
}
 */
function createAllFiltersFunctions(formData) {
    let allFiltersFunctions = {};
    settings.filtersFields.map((field) => {
        allFiltersFunctions[field] = createFilterByFieldFunctions(
            formData,
            field
        );
    });
    console.log(allFiltersFunctions);
    return allFiltersFunctions;
}

function createFilterByFieldFunctions(formData, field) {
    let filterByFieldFunctions = [];
    for (let [key, value] of formData) {
        const [valueMin, valueMax] = value.split("-");
        if (key === field) {
            filterByFieldFunctions.push(
                createFilterFunction(key, valueMin, valueMax)
            );
        }
    }
    return filterByFieldFunctions;
}

function createFilterFunction(field, value, valueMax) {
    if (valueMax === undefined) {
        return function (user) {
            return getUserFieldValue(user, field) === value ? true : false;
        };
    } else {
        return function (user) {
            return getUserFieldValue(user, field) >= value &&
                getUserFieldValue(user, field) <= valueMax
                ? true
                : false;
        };
    }
}

/*
function generateSortingMask(usersData, sortType) {
    const [field, sortTrend] = [...sortTypeDecrypter(sortType)];
    return usersData
        .map((user) => {
            return {
                sortingField: getUserFieldValue(user, field),
                id: getUserFieldValue(user, settings.userIDField),
            };
        })
        .sort((a, b) => sortTrend * sortByAsc(a, b));
}
 */
/*
function sortByAsc(a, b) {
    return (
        (b.sortingField < a.sortingField) - (a.sortingField < b.sortingField)
    );
}
 */
/*
function sortTypeDecrypter(sortType) {
    switch (sortType) {
        case "name_asc":
            return ["first", 1];
        case "name_des":
            return ["first", -1];
        case "age_asc":
            return ["age", 1];
        case "age_des":
            return ["age", -1];
    }
} */
/*
function sortUsers(usersData, sortType) {
    const sortingMask = generateSortingMask(usersData, sortType);
    return getUsersByMask(usersData, sortingMask);
}
 */
/*
function getUsersByMask(usersData, mask) {
    return mask.map((maskedUser) =>
        usersData.find(
            (user) =>
                getUserFieldValue(user, settings.userIDField) === maskedUser.id
        )
    );
}
 */

function getUserFieldValue(obj, field) {
    for (const prop in obj) {
        if (typeof obj[prop] === "object") {
            const value = getUserFieldValue(obj[prop], field);
            if (value) {
                return value;
            }
        } else {
            if (prop === field) {
                return obj[prop];
            }
        }
    }
}

document.querySelector(".found_users").addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.src = e.target.classList.contains("active")
            ? "./icons/icon-preview.png"
            : "./icons/icon-hidden.png";
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
        e.target.classList.toggle("active");
    }
});

import { getUserInfo } from "./userDataActions.js";
import { urlPropsActions } from "./urlPropsActions.js";

export function renderUsersCards(usersData, target, renderParameters) {
    const {
        lightColorTheme,
        actionsIconsSrc,
        usersPerPage,
        shownPagesOfUsersCount
    } = renderParameters;

    const usersCardsForRender = collectUsersCardsForRender(usersData, usersPerPage, shownPagesOfUsersCount);
    if (target.querySelector("#show_more")) {
        target
            .querySelector("#show_more")
            .parentNode.insertAdjacentHTML("beforebegin", usersCardsForRender);
    } else {
        target.innerHTML = usersCardsForRender + createShowMoreButtonHTML();
    }

    function collectUsersCardsForRender(usersData, usersPerPage, shownPagesOfUsersCount) {
        let usersCardsForRender = [];
        const shownUsers = usersPerPage * shownPagesOfUsersCount,
            shownUsersAfterRender =
                usersPerPage * (shownPagesOfUsersCount + 1);
        for (let i = shownUsers; i < shownUsersAfterRender; i++) {
            if (i < usersData.length) {
                usersCardsForRender.push(createUserCardHTML(usersData[i]));
            } else {
                break;
            }
        }
        return usersCardsForRender.join("");
    }

    function createUserCardHTML(user) {
        return (
            `<div class="user_card">` +
            createUserCardAvatarHTML(user) +
            createUserCardInfoHTML(user) +
            createUserCardActionsButtonsHTML() +
            createUserCardMoreInfoHTML(user) +
            `</div>`
        );

        function createUserCardAvatarHTML(user) {
            return `<img
            src="${user.picture.large}"
            alt=""
            class="user_avatar"/>`;
        }

        function createUserCardInfoHTML(user) {
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

        function createUserCardActionsButtonsHTML() {
            /* const iconsSrc = lightColorTheme
                ? settings.actionsLightThemeIconsSrc
                : settings.actionsDarkThemeIconsSrc; */
    /*     
                return `<div class="user_actions">
        <img src="${iconsSrc.chat}" alt="" class="user_actions_icon" id="user_actions_chat"/>
        <img src="${iconsSrc.add}" alt="" class="user_actions_icon" id="user_actions_add"/>
        <img src="${iconsSrc.preview}" alt="" class="user_actions_icon" id="user_actions_preview"/>
        </div>`;
     */    
                
        return `<div class="user_actions">
        <img src="#" alt="chat" class="user_actions_icon" id="user_actions_chat"/>
        <img src="#" alt="add" class="user_actions_icon" id="user_actions_add"/>
        <img src="#" alt="info" class="user_actions_icon" id="user_actions_preview"/>
        </div>`;
    
    }

        function createUserCardMoreInfoHTML(user) {
            return `<div class="more_user_info hide">
                <p>
                    <span class="extra_field">First name:</span>
                    ${user.name.first}
                </p>
                <p>
                    <span class="extra_field"
                        >Last name:</span
                    >
                    ${user.name.last}
                </p>
                <p>
                    <span class="extra_field"
                        >Day OF Birth:</span
                    >
                    ${getUserInfo.getDob(user)}
                </p>
                <p>
                    <span class="extra_field">Location:</span>
                    ${user.location.city}, ${user.location.country}
                </p>
            </div>`;
        }
    }

    function createShowMoreButtonHTML() {
        return `<div class="user_card">
    <button class="nav_menu_item" id="show_more">
            Show more...
            </button>
            </div>`;
    }

}

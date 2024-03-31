import $  from "jquery";

const NesteTab = function(/** @type {string} */ tabsElement, /** @type {string} */ currentElement, active = void 0){
    const tabs = tabsElement ?? "ul.tabs";
    const currentClass = currentElement ?? "active";

    document.querySelectorAll(tabs).forEach(function (tabContainer) {
        let activeLink, activeContent;
        const links = Array.from(tabContainer.querySelectorAll("a[toggle-event='tab']"));

        activeLink =
            links.find(function (link) {
                return link.getAttribute("data-href") === active;
            }) || links[0];

        $(activeLink).addClass(currentClass);

        activeContent = $($(activeLink).attr("data-href"));
        activeContent.addClass(currentClass);

        links.forEach(function (link) {
            if (link !== activeLink) {
                $(link).removeClass(currentClass);
            }
        });

        $(tabContainer).on("click", (e) => {
            //valida link
            e.preventDefault();
            if (e.target.tagName === "A") {
                // Make the old tab inactive.
                $(activeLink).removeClass(currentClass);
                activeContent.removeClass(currentClass);

                // Update the variables with the new link and content.
                activeLink = e.target;
                activeContent = $($(activeLink).attr("data-href"));

                // Make the tab active.
                $(activeLink).addClass(currentClass);
                activeContent.addClass(currentClass);
            }
        });
    });
};

export default NesteTab;
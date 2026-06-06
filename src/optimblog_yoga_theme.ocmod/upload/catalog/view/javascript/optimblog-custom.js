// переключатель вида списка для YOGA theme
let changeViewButtons = document.querySelectorAll('.js-chage-information-view');
if (changeViewButtons.length > 0) {
    const blogWrapper = document.getElementById('optimblog-list');

    document.querySelectorAll('.js-chage-information-view');

    changeViewButtons.forEach(changeViewButton => {
        changeViewButton.addEventListener('click', () => {
            if (changeViewButton.dataset.viewType == 'information-block-view') {
                // Включить на всю ширину
                blogWrapper.className = 'optimblog-wrapper view-full';
            } else if (changeViewButton.dataset.viewType == 'information-list-view') {
                // Включить список
                blogWrapper.className = 'optimblog-wrapper view-list';
            } else if (changeViewButton.dataset.viewType == 'information-grid-view') {
                // Включить сетку
                blogWrapper.className = 'optimblog-wrapper view-grid';
            }
        });
    });
}
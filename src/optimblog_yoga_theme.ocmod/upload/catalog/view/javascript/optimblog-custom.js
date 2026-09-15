/**
 * OptimBlog Yoga Theme — переключатель вида списка (список / сетка / во всю ширину)
 *
 * Конфликт с catalog/view/javascript/optimblog.js:
 *
 * Кнопки переключения вида в шаблоне Yoga сохранили старые id из базового
 * модуля (#information-list-view, #information-block-view,
 * #information-grid-view) вместе с новым классом .js-chage-information-view,
 * на который завязан этот файл. Из-за общих id на одних и тех же кнопках
 * висят обработчики сразу двух скриптов, и это даёт два побочных эффекта:
 *
 *   1) optimblog.js при каждой загрузке страницы программно «нажимает» на
 *      кнопку #information-list-view, чтобы восстановить вид из
 *      localStorage. Даже когда localStorage пуст (например, в режиме
 *      инкогнито) или ни одно из его условий не выполняется, скрипт всё
 *      равно попадает в ветку «по умолчанию — список» и кликает по ней.
 *      Такой клик — программный (event.isTrusted === false), в отличие от
 *      настоящего клика пользователя (event.isTrusted === true). Поэтому
 *      вид по умолчанию, выставленный админом в настройках, всегда
 *      перебивается списком.
 *
 *   2) Обработчик click из optimblog.js навешан на те же самые кнопки и
 *      применяет к разметке чужие bootstrap-классы
 *      (.information-layout .thumbnail/.image/.caption), не имеющие
 *      отношения к вёрстке Yoga.
 *
 * Решение:
 *   - Реагируем только на настоящие клики пользователя (event.isTrusted),
 *     игнорируя программный клик, которым optimblog.js навязывает список.
 *   - Останавливаем остальные обработчики этого же события через
 *     event.stopImmediatePropagation(), чтобы обработчик optimblog.js на
 *     этой же кнопке вообще не отрабатывал — ни на программный, ни на
 *     настоящий клик.
 *
 * Это работает надёжно, потому что optimblog-custom.js подключается в
 * install.xml сразу ПОСЛЕ optimblog.js: наш addEventListener регистрируется
 * на кнопке раньше, чем jQuery успевает навесить свой обработчик внутри
 * $(document).ready() (тот выполняется асинхронно, уже после того как этот
 * файл отработает синхронно). Браузер вызывает обработчики одного события в
 * порядке их регистрации, поэтому stopImmediatePropagation() из нашего
 * обработчика гарантированно блокирует более поздний обработчик optimblog.js.
 * ВАЖНО: порядок подключения скриптов в install.xml менять нельзя — именно
 * от него зависит эта защита.
 */
let changeViewButtons = document.querySelectorAll('.js-chage-information-view');
if (changeViewButtons.length > 0) {
    const blogWrapper = document.getElementById('optimblog-list');

    changeViewButtons.forEach(changeViewButton => {
        changeViewButton.addEventListener('click', (event) => {
            // Блокируем обработчик optimblog.js, навешанный на ту же кнопку
            // (общий id), чтобы он не применял свои классы поверх разметки Yoga.
            event.stopImmediatePropagation();

            // Игнорируем программный (не пользовательский) клик, которым
            // optimblog.js принудительно выставляет вид "список" при каждой
            // загрузке страницы.
            if (!event.isTrusted) {
                return;
            }

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

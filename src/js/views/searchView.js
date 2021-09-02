class SearchView {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        /* We cannot simply call the handler immediately, because when we submit
         * a form we need first prevent the default action: reloading the page */
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
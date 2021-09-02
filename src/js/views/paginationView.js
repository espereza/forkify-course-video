import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(event) {
            const btn = event.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup(){
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsaPerPage);
        //  Page 1, there are other pages
        if (currentPage === 1 && numPages > 1) {
            return this._generateMarkupButtonNext(currentPage);
        }
        
        // Last page
        if (currentPage === numPages && numPages > 1) {
            return this._generateMarkupButtonPrev(currentPage);
        }
        
        // Other page
        if (currentPage < numPages) {
            return this._generateMarkupButtonPrev(currentPage) + this._generateMarkupButtonNext(currentPage);
        }
        
        // Page 1, and there are NO other pages
        return '';
    }

    _generateMarkupButtonNext(currentPage) {
        return `
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
    }

    _generateMarkupButtonPrev(currentPage) {
        return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `;
    }
}

export default new PaginationView();
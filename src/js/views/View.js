// importing assets, including images.
//import icons from '../img/icons.svg'; // in parcel 1
import icons from 'url:../../img/icons.svg'; // in parcel 2: for any static asset that are not programming files (images, videos, sound files) we need to write "url:[path_to_file]"

/** 
 * Exporting the class itself, because ther will be no instance creation.
 * It is only used as parent class.
 */
export default class View {
    _data;

    /**
     * Render the recived object to the DOM.
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM.
     * @returns {undefined | string} A markup string is returned if render=false.
     * @this {Object} View instance
     * @author Sebastian Perez
     * @todo Finish implementation
     */
    render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear(); // Emptying before inserting
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    // this algorithm is not the best for large applications, but it is enough for
    // this little project.
    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        // this methods convert the string into real DOM node objects
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        // a virtual DOM, not living on the page but which lives in our memory, and so
        // this DOM can be used as the real DOM on our page.
        const newElements = Array.from(newDOM.querySelectorAll('*')); // return a node list
        const currentElements =  Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newElement, index) => {
            const currentElement = currentElements[index];
            
            // Updates changed TEXT
            if (
                !newElement.isEqualNode(currentElement) && // compare the contents, not the nodes themself
                newElement.firstChild?.nodeValue.trim() !== ''
            ) {
                currentElement.textContent = newElement.textContent;
            }

            // Updates changed ATTRIBUTES
            if (!newElement.isEqualNode(currentElement)) {
                Array.from(newElement.attributes).forEach(attribute => 
                    currentElement.setAttribute(attribute.name, attribute.value));
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear(); // Emptying before inserting
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear(); // Emptying before inserting
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderMessage(message = this._successMessage) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear(); // Emptying before inserting
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

}
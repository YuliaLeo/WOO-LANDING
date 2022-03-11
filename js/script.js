"use strict";

window.onload = function () {

	function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});;
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];

	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);


		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {

				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
	}

	dynamicAdapt();

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
}());;
const animItems = document.querySelectorAll("._anim-item");

if (animItems.length > 0) {

	window.addEventListener('scroll', animOnScroll);

	function animOnScroll(params) {
		for (let index = 0; index < animItems.length; index++) {

			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4; //para que el objeto aparezca cuando alcamzamos su quarta parte

			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && (pageYOffset < (animItemOffset + animItemHeight))) {
				animItem.classList.add("_animation");
			}
			else {
				if (!animItem.classList.contains("_anim-no-hide")) {
					animItem.classList.remove("_animation");
				}
			}
		}
	}

	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => { //Delay al principio
		animOnScroll();
	}, 300);

};
"use strict"

const spoilersArray = document.querySelectorAll('[data-spoilers]'); //consegir la coleccion

if (spoilersArray.length > 0) {

	//Recibimos los spoilers normales
	const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
		return !item.dataset.spoilers.split(",")[0];
	});

	//Verificamos si los spoilers normales existen
	if (spoilersRegular.length > 0) {
		initSpoilers(spoilersRegular);
	}

	//Recibimos los spoilers con media
	const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
		return item.dataset.spoilers.split(",")[0];
	});

	//Verificamos si los spoilers con media existen
	if (spoilersMedia.length > 0) {
		const breakpointArray = []; //creamos una matriz de objetos
		spoilersMedia.forEach(item => {
			const params = item.dataset.spoilers; //recibimos una fila con parametros para cada uno de los objetos
			const breakpoint = {}; //creamos un objeto
			const paramsArray = params.split(","); //recibimos una matriz con parametros
			breakpoint.value = paramsArray[0]; //agregamos el valor del breakpoint
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"; //agregamos el valor max o min
			breakpoint.item = item; //agregamos el elemento de la matriz
			breakpointArray.push(breakpoint);  //agregamos el objeto a la matriz
		});

		//Recibimos los breakpoints con los valores unicos
		let mediaQueries = breakpointArray.map(function (item) {
			return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
		});

		//Devolvemos solo los elementos unicos
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		//Trabajamos con cada breakpoint
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spoilersArray = breakpointArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			matchMedia.addListener(function () {
				initSpoilers(spoilersArray, matchMedia);
			});
			initSpoilers(spoilersArray, matchMedia);
		});
	}

	//initSpoilers()
	function initSpoilers(spoilersArray, matchMedia = false) {
		spoilersArray.forEach(spoilerBlock => {
			spoilerBlock = matchMedia ? spoilerBlock.item : spoilerBlock;
			if (matchMedia.matches || !matchMedia) {
				spoilerBlock.classList.add("_init");
				initSpoilerBody(spoilerBlock);
				spoilerBlock.addEventListener("click", setSpoilerAction);
			}
			else {
				spoilerBlock.classList.remove("_init");
				initSpoilerBody(spoilerBlock, false);
				spoilerBlock.removeEventListener("click", setSpoilerAction);
			}
		});
	}

	//initSpoilerBody()
	function initSpoilerBody(spoilerBlock, hideSpoilerBody = true) {
		const spoilerTitles = spoilerBlock.querySelectorAll('[data-spoiler]');
		if (spoilerTitles.length > 0) {
			spoilerTitles.forEach(spoilerTitle => {
				if (hideSpoilerBody) {
					spoilerTitle.removeAttribute("tabindex");
					if (!spoilerTitle.classList.contains("_active")) {
						spoilerTitle.nextElementSibling.hidden = true;
					}
				}
				else {
					spoilerTitle.setAttribute("tabindex", "-1");
					spoilerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	//setSpoilerAction()
	function setSpoilerAction(e) {
		const el = e.target;
		if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
			const spoilerTitle = el.hasAttribute("data-spoiler") ? el : el.closest("[data-spoiler]");
			const spoilerBlock = spoilerTitle.closest("[data-spoilers]");
			const oneSpoiler = spoilerBlock.hasAttribute("data-one-spoiler") ? true : false;
			if (!spoilerBlock.querySelectorAll("._slide").length) {
				if (oneSpoiler && !spoilerTitle.classList.contains("_active")) {
					hideSpoilerBody(spoilerBlock);
				}
				spoilerTitle.classList.toggle("_active");
				_slideToggle(spoilerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}

	//hideSpoilerBody()
	function hideSpoilerBody(spoilerBlock) {
		const spoilerActiveTitle = spoilerBlock.querySelector('[data-spoiler]._active');
		if (spoilerActiveTitle) {
			spoilerActiveTitle.classList.remove("_active");
			_slideUp(spoilerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove("_slide");
		}, duration);
	}
}

let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove("_slide");
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};
const popupLinks = document.querySelectorAll(".popup-link"); //elegir todos las enlaces para popups
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); //utilizar para objetos son valor absolute y fixed

let unlock = true;

const timeout = 800;  //para detener la animacion, tiene que ser el mismo numero que transition: all 0.8s;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute("href").replace("#", ""); //para qiutar #
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll(".close-popup"); //para cerrar popups
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest(".popup"));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		}
		else {
			bodyLock();
		}
		curentPopup.classList.add("_open");
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest(".popup__content")) { //permite cerrar popup si haces click en area negra
				popupClose(e.target.closest(".popup"));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove("_open");
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add("_lock");

	unlock = false;
	setTimeout(function () { //para detener la animacion
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = "0px";
			}
		}
		body.style.paddingRight = "0px";
		body.classList.remove("_lock");
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);

}

document.addEventListener('keydown', function (e) { //para cerrar con ESCAPE
	if (e.which === 27) {
		const popupActive = document.querySelector(".popup._open");
		popupClose(popupActive);
	}
});

//POLIFILLS PARA EXPLOER (para que closest y matches funcionen)
(function () {

	if (!Element.prototype.closest) {

		Element.prototype.closest = function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}

})();

(function () {

	if (!Element.prototype.matches) {

		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;

	}

})();;
const formGetStarted = document.forms.getStarted;
const formLogin = document.forms.loginForm;

const creditCard = formGetStarted.cardNumber;
const cardCvc = formGetStarted.cardCvc;
const symbolsAllowed = /[0-9]/;

formGetStarted.addEventListener('input', (e) => {
	const inputLength = e.target.value.length;
	const inputSymbol = e.target.value[inputLength - 1];

	if (e.target === creditCard) {
		if (inputLength <= 19) {
			if (!symbolsAllowed.test(inputSymbol)) {
				e.target.value = e.target.value.slice(0, inputLength - 1);
			}
			else {
				let inputValue = e.target.value;
				inputValue = inputValue.split(" ").join("").split(/(\d{4})/).filter(item => item !== '').join(' ');
				e.target.value = inputValue;
			}
		}
		else {
			e.target.value = e.target.value.slice(0, inputLength - 1);
		}
	}
	else if (e.target === cardCvc) {
		if (((inputLength <= 3) && (!symbolsAllowed.test(inputSymbol))) || (inputLength > 3)) {
			e.target.value = e.target.value.slice(0, inputLength - 1);
		}
	}
	else if ((e.target.classList.contains("_day")) || (e.target.classList.contains("_month"))) {
		if (((inputLength <= 2) && (!symbolsAllowed.test(inputSymbol))) || (inputLength > 2)) {
			e.target.value = e.target.value.slice(0, inputLength - 1);
		}
	}
	else if (e.target.classList.contains("_year")) {
		if (((inputLength <= 4) && (!symbolsAllowed.test(inputSymbol))) || (inputLength > 4)) {
			e.target.value = e.target.value.slice(0, inputLength - 1);
		}
	}
});

formGetStarted.addEventListener('paste', (e) => {
	if (e.target.classList.contains("_no-paste")) {
		event.preventDefault();
	}
});

formGetStarted.addEventListener('focusin', function (e) {
	formRemoveError(e.target);
});

formLogin.addEventListener('focusout', (e) => {
	if (e.target === formLogin.userLoginName || e.target === formLogin.userLoginPassword) {
		if (e.target.value !== "") {
			e.target.classList.add("_filled");
		}
		else {
			e.target.classList.remove("_filled");
		}
	}
});

formLogin.addEventListener('focusin', function (e) {
	formRemoveError(e.target);
});

if (formGetStarted) {
	const form = formGetStarted;
	form.addEventListener("submit", formSend);

	async function formSend(e) {
		e.preventDefault();

		let errors = formValidate(form);

		if (errors === 0) {
			form.reset();
			form.querySelector(".getstarted-form__item_month .select__selected").innerHTML = "Month";
			form.querySelector(".getstarted-form__item_year .select__selected").innerHTML = "Year";
		}
	}

	function formValidate(form) {
		let errors = 0;

		if (inputsCheck(form.fullName, /^[a-zA-Zа-яА-ЯёЁ\s,.'-]+$/) !== 0) {
			errors++;
		}

		if (inputsCheck(form.userEmail, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/) !== 0) {
			errors++;
		}

		if (inputsCheck(form.userPassword, /^\w[-!?\w]{4,19}$/) !== 0) {
			errors++;
		}

		if (form.userCheckPassword && form.userPassword) {
			formRemoveError(form.userCheckPassword);
			if (form.userCheckPassword.value === "" || form.userCheckPassword.value !== form.userPassword.value) {
				formAddError(form.userCheckPassword);
				errors++;
			}
		}
		else {
			errors++;
		}

		if (form.agreeCheck) {
			formRemoveError(form.agreeCheck);

			if (form.agreeCheck.checked === false) {
				formAddError(form.agreeCheck);
				errors++;
			}
		}
		else {
			errors++;
		}

		if (checkDate(form) !== 0) {
			errors++;
		}

		if (selectCheck(form.genderSelect, 'getstarted-form__items_gender') !== 0) {
			errors++;
		}

		if (paymentsCheck(form) !== 0) {
			errors++;
		}

		return errors;
	}
}

if (formLogin) {
	const form = formLogin;
	form.addEventListener("submit", formSend);

	async function formSend(e) {
		e.preventDefault();

		let errors = formValidate(form);

		if (errors === 0) {
			form.reset();
		}
	}

	function formValidate(form) {
		let errors = 0;
		let formReq = form.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.value === "") {
				formAddError(input);
				errors++;
			}
		}

		return errors;
	}
}

function formAddError(input) {
	input.parentElement.classList.add("_error");
	if (input.dataset.error) {
		input.parentElement.insertAdjacentHTML(
			"afterend",
			`<div class='form-field__error'>${input.dataset.error}</div>`,
		);
	}
	input.classList.add("_error");
}

function formRemoveError(input) {
	input.parentElement.classList.remove("_error");
	if (input.closest(".form-field")) {
		if (input.closest(".form-field").querySelector(".form-field__error")) {
			input.closest(".form-field").querySelector(".form-field__error").remove();
		}
	}
	input.classList.remove("_error");
}

function inputsCheck(input, regularExpression) {
	let errors = 0;

	if (input) {
		formRemoveError(input);

		if (!regularExpression.test(input.value)) {
			formAddError(input);
			errors++;
		}

		return errors;
	}
	else {
		return ++errors;
	}
}

function checkDate(form) {
	const day = form.birthDay;
	const month = form.birthMonth;
	const year = form.birthYear;
	let errors = 0;

	if (day && month && year) {
		const date = new Date(year.value, month.value - 1, day.value);

		formRemoveError(year);
		formRemoveError(month);
		formRemoveError(day);

		if (date.getFullYear() != year.value || year.value === "") {
			formAddError(year);
			errors++;
		}
		if (date.getMonth() != month.value - 1 || month.value === "") {
			formAddError(month);
			errors++;
		}
		if (date.getDate() != day.value || day.value === "") {
			formAddError(day);
			errors++;
		}

		return errors;
	}
	else {
		return ++errors;
	}
}

function selectCheck(genderSelect, errorAddClassName) {
	let counter = 0;
	let errors = 0;

	if (genderSelect) {
		genderSelect.forEach(item => {
			if (item.checked) counter++;
		});

		if (counter === 0) {
			errors++;
			if (document.querySelector(`.${errorAddClassName}`)) {
				document.querySelector(`.${errorAddClassName}`).classList.add("_error");
			}
		}
		else {
			if (document.querySelector(`.${errorAddClassName}`)) {
				document.querySelector(`.${errorAddClassName}`).classList.remove("_error");
			}
		}
		return errors;
	}
	else {
		++errors;
	}
}

function paymentsCheck(form) {
	let errors = 0;
	formRemoveError(form.cardCvc);
	formRemoveError(form.cardNumber);

	if ((form.cardCvc.value === "") || (form.cardCvc.value.length !== 3)) {
		formAddError(form.cardCvc);
		errors++;
	}

	if ((form.cardNumber.value === "") || (form.cardNumber.value.length !== 19)) {
		formAddError(form.cardNumber);
		errors++;
	}

	if (selectCheck(form.payMethod, 'getstarted-form__items_pay') !== 0) {
		errors++;
	}

	if (selectCheck(form.cardExpireYear, 'getstarted-form__item_year') !== 0) {
		errors++;
	}

	if (selectCheck(form.cardExpireMonth, 'getstarted-form__item_month') !== 0) {
		errors++;
	}

	return errors;
};;

	//==================================WRAPPER
	if (document.querySelector(".wrapper")) {
		document.querySelector(".wrapper").classList.add("_loaded");
	}
	//==================================

	//==================================BURGER
	const iconMenu = document.querySelector('.icon-menu');
	const menuBody = document.querySelector('.menu__body');
	if (iconMenu) {
		iconMenu.addEventListener('click', function (e) {
			document.body.classList.toggle("_lock-burger");
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		});
	}
	//==================================

	//==================================IBG
	function ibg() {
		let ibgs = document.querySelectorAll('.ibg');
		if (ibgs.length > 0) {
			for (let index = 0; index < ibgs.length; index++) {
				const ibg = ibgs[index];
				if (ibg.querySelector("img")) {
					ibg.style.backgroundImage = 'url("' + ibg.querySelector('img').src + '")';
				}
			}
		}
	}
	ibg();
	//==================================

	//==================================HEADER_SCROLL
	const headerElement = document.querySelector('.header');
	if (headerElement) {
		const callback = function (entries, observer) {
			if (entries[0].isIntersecting) {
				headerElement.classList.remove("_scroll");
			}
			else {
				headerElement.classList.add("_scroll");
			}
		}
		const headerObserver = new IntersectionObserver(callback);
		headerObserver.observe(headerElement);
	}
	//==================================

	//==================================ONCLICK_FUNCTION
	document.addEventListener("click", documentActions);
	function documentActions(e) {
		const targetElement = e.target;

		//---SEARCH
		if (targetElement.classList.contains("header__btn")) {
			document.querySelector(".search").classList.toggle("_active");
		}
		else if (!targetElement.closest(".search") && document.querySelector(".search._active")) {
			document.querySelector(".search").classList.remove("_active");
		}

		//--SELECT
		if (targetElement.classList.contains("select__selected")) {
			selectOpen(targetElement, targetElement.closest('.select'));
		}
		else if (!targetElement.closest('.select')) {
			let selectsActive = document.querySelectorAll(".select._active");
			if (selectsActive.length > 0) {
				selectsActive.forEach(item => {
					item.classList.remove("_active");
				});
			}
		}
	}
	//==================================

	//==================================QUANTITY
	let quantityButtons = document.querySelectorAll('.quantity__button');
	if (quantityButtons.length > 0) {
		for (let index = 0; index < quantityButtons.length; index++) {
			const quantityButton = quantityButtons[index];
			quantityButton.addEventListener('click', function (e) {
				let value = parseInt(quantityButton.closest('.quantity').querySelector("input").value);
				if (quantityButton.classList.contains("quantity__button_plus")) {
					value++;
					if (value < 1) {
						value = 1;
					}
				}
				else {
					value = value - 1;
					if (value < 1) {
						value = 1;
					}
				}
				quantityButton.closest(".quantity").querySelector("input").value = value;
			});
		}
	}
	//==================================

	//==================================FOOTER_LINKS
	const footerContents = document.querySelectorAll('.spoiler-footer__content');

	if (footerContents.length > 0) {
		for (let index = 0; index < footerContents.length; index++) {
			const footerContent = footerContents[index];
			const footerContentLinks = footerContent.querySelectorAll('.spoiler-footer__link');
			let timeStep = 0;

			if (footerContentLinks.length > 0) {
				for (let index = 0; index < footerContentLinks.length; index++) {
					const footerContentLink = footerContentLinks[index];
					timeStep += 0.1;
					footerContentLink.style.transition = `color 0.3s ease 0s, transform 0.8s ease ${timeStep}s, opacity 0.8s ease ${timeStep}s`;
				}
			}
		}
	}
	//==================================

	//==================================TEAM_SLIDER
	if (document.querySelector(".team-slider")) {
		new Swiper(".team-slider", {
			navigation: {
				nextEl: ".team-slider-button-next",
				prevEl: ".team-slider-button-prev"
			},

			autoHeight: true,

			speed: 1000,

			autoplay: {
				delay: 1500,
				stopOnLastSlide: false,
				disableOnInteraction: true,
			},

			grabCursor: true,
		});
	}
	//==================================

	//==================================TEXT_TYPING
	const bottomWorksText = document.querySelector('.getstarted__text').innerHTML.split("");
	let newBottomWorksText = "";

	if (bottomWorksText) {
		for (let index = 0; index < bottomWorksText.length; index++) {
			if (((index >= 18) && (index <= 53)) || ((index >= 68) && (index <= (bottomWorksText.length - 1)))) {
				newBottomWorksText += "<span class='getstarted__text_bold'>" + bottomWorksText[index] + "</span>";
			}
			else {
				newBottomWorksText += "<span>" + bottomWorksText[index] + "</span>";
			}
		}
		document.querySelector('.getstarted__text').innerHTML = newBottomWorksText;
	}
	//==================================

	//==================================SELECTS
	function selectOpen(selected, select) {
		if (select) {
			const selectItems = select.querySelectorAll('.select__item');

			select.classList.toggle("_active");

			selectItems.forEach(item => {
				item.addEventListener('click', function (e) {
					selected.innerHTML = item.querySelector(".select__span").innerHTML;
					select.classList.remove("_active");
				});
			});
		}
	}
	//==================================
}
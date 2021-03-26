const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//........START

const sliderButtonNext = document.querySelector('.slider-button-next');
const buttonCart       = document.querySelector('.button-cart');
const modalCart  	   = document.getElementById('modal-cart');
const modalClose 	   = document.querySelector('.modal-close');
const modal     	   = document.querySelector('.modal');
const overlay  		   = document.querySelector('.overlay');
const cartTableGoods   = document.querySelector('.cart-table__goods');
const cardTableTotal   = document.querySelector('.card-table__total');
const cartCount		   = document.querySelector('.cart-count');

setTimeout(function d(){sliderButtonNext.click(); setTimeout(d, 3000)}, 3000);

const getData  = async function() {
	let result = await fetch('../db/db.json')
		.then(response => {
			if(!response.ok){
				console.error('Ошибочка: ' + response.status)
			}
			return response;})
		return await result.json();
}

const cart = {
	cartGoods: [],
	cartCounter(){
		cartCount.textContent = this.cartGoods.reduce((sum, item) => sum + item.count, 0);
	},
	renderCart(){
		cartTableGoods.textContent = "";
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGoods = document.createElement('tr');
			trGoods.classList.add('cart-item');
			trGoods.dataset.id = id;
			trGoods.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus" data-id=${id}>-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus" data-id=${id}>+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete" data-id=${id}>x</button></td>
			`;
			cardTableTotal.textContent = this.cartGoods.reduce((sum, item) => {
				return sum + item.price * item.count;
			}, 0) + '$';
			cartTableGoods.append(trGoods);
		});
		this.cartCounter();
	},
	minusGood(id){
		let o = this.cartGoods.find(obj => obj.id == id);
		o.count--;
		o.count <=0 ? this.deleteGood(o.id) : this.renderCart();

	},
	plusGood(id){
		let o = this.cartGoods.find(obj => obj.id == id);
		o.count++;
		this.renderCart();
	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => item.id !== id)
		this.renderCart();
	},
	addCartGood(id){
		if(this.cartGoods.find(item => item.id === id)){
			this.plusGood(id)
			} else {
			getData()
				.then(arr => arr.find(item => item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.cartCounter();
				});
			
		}
		
	}
};

const openModal  = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};

const closeModal = () => modalCart.classList.remove('show');

document.body.addEventListener('click', e => {
	if(e.target.closest('.add-to-cart'))
		cart.addCartGood(e.target.closest('.add-to-cart').dataset.id)
});
buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
	if(!e.target.closest('.modal')) {
	closeModal();
	};
	if(e.target.classList.contains('cart-btn-delete')){
	cart.deleteGood(e.target.closest('.cart-item').dataset.id);
	};
	if(e.target.classList.contains('cart-btn-plus')){
		if(e.target.tagname = 'button')
		cart.plusGood(e.target.closest('.cart-item').dataset.id);
	};
	if(e.target.classList.contains('cart-btn-minus')){
		if(e.target.tagname = 'button')
		cart.minusGood(e.target.closest('.cart-item').dataset.id);
	};

});
//scroll smooth

(function(){
	const scrollLinks   = document.querySelectorAll('.scroll-link');

	for(let scrollLink of scrollLinks){
		scrollLink.addEventListener('click', e => {
			e.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth', 
				block: 'start',
			})
		})
	}
})()

//render goods

const more 			 = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList  = document.querySelector('.long-goods-list');
const logoLink 		 = document.querySelector('.container');

const renderCard   = function(obj){
	const card     = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
			<div class="goods-card">
				${obj.label ? `<span class="label">New</span>` : ''}		
				<img src="db/${obj.img}" alt="${obj.name}" class="goods-image">
				<h3 class="goods-title">${obj.name}</h3>
				<p class="goods-description">${obj.description}</p>
				<button class="button goods-card-btn add-to-cart" data-id="${obj.id}">
					<span class="button-price">$${obj.price}</span>
				</button>
			</div>
	`;
	return card;
}

const addCards = function(data){
	document.body.classList.add('show-goods');
	longGoodsList.textContent = '';
	let cards = data.map(renderCard);
	longGoodsList.append(...cards);
}

more.addEventListener('click', event => {
	event.preventDefault();
	getData().then(addCards);
	const logoLink = document.querySelector('.container');
	setTimeout(() => logoLink.scrollIntoView({
				behavior: 'smooth', 
				block: 'start',
			}), 500)
});

//filter goods

const filterCards = function(field, value){
	getData()
	.then(data => data.filter(d => d[field].toLowerCase() === value.toLowerCase()))
	.then(addCards);	
}


navigationLink.forEach(btn => {
	const field = btn.dataset.field;
	const value = btn.innerText;	
	btn.addEventListener('click', e => {
		e.preventDefault();
		if(field && value){	
			filterCards(field, value)
		} else {
			getData().then(addCards);
		}
	})
})
	
//banners event

const buttons = document.querySelectorAll('.button');

buttons.forEach(btn => {
	btn.addEventListener('click', e => {		

		e.preventDefault();
		if(e.target.closest('.card-1')){
			filterCards("category", "Accessories");
		}
		if(e.target.closest('.card-2')){
			filterCards("category", "Clothing");
		}
		logoLink.scrollIntoView({
			behavior: 'smooth', 
			block: 'start',
		})
	})

})



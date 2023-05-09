if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}


function ready() {

    var removeCartItemButtons=document.getElementsByClassName('btn-danger')
    for(var i = 0; i < removeCartItemButtons.length; i++) {

        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)

    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {

        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)

    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {

        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)

    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchaseClicked)
};

//section: direct cart manipulation


//sub-section: display and hide cart

function showCart() {

    var cart = document.getElementsByClassName(`cart`)[0]
    var showCartButton = document.getElementsByClassName('toggle-cart')[0]
    showCartButton.addEventListener(`click`,() => {

        if (cart.classList.contains(`hide`)) {
            cart.classList.remove(`hide`)
        } else {
            cart.classList.add('hide')
        }     

    })
};

//sub-section: update cart total

function updateCartTotal() {

    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    
    for (var i = 0; i < cartRows.length; i++) {
    
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.textContent.replace('$',''))
        var quantity = quantityElement.value 
        total = total + (price * quantity);        

    }
    
    total = Math.round(total * 100)/100
    document.getElementsByClassName('cart-total-price')[0].textContent = '$' + total

};


//sub-section: removes items from cart

function removeCartItem(e) {

    var buttonClicked = e.target
    var sharedClassName = document.getElementsByClassName(buttonClicked.parentElement.parentElement.classList[1])
    let storageNumber = buttonClicked.parentElement.parentElement.firstChild.value
    console.log(storageNumber)
    console.log(sharedClassName)
    localStorage.removeItem(storageNumber)

    for ( let i = 0; i < sharedClassName.length; i++  ) {
        sharedClassName[i].classList.remove(buttonClicked.parentElement.parentElement.classList[1])
    }

    
    buttonClicked.parentElement.parentElement.remove()

    if (document.getElementsByClassName('cart-item').length < 1){
        document.getElementsByClassName(`btn-purchase`)[0].style.display= 'none';
        cart.classList.add('hide')
    }

    updateCartTotal()
    displayCartCount()
};

//sub-section: displays how many items are in the cart


function displayCartCount() {
    let count = document.getElementsByClassName('cart-count')[0]
    let number = count.childNodes[1]
    console.log(number)
    if (localStorage.length === 0) {

        count.style.display = `none`;

    } else {

        count.style.display = 'flex';
        count.style.flexDirection = 'column';
        count.style.alignItems = `center`;
        count.style.justifyContent = 'center'
        number.classList.add(`count-integer`)
        number.textContent = localStorage.length
        
    }
}



//sub-section: what happens when the checkout button is clicked

function purchaseClicked() {
    
    if(document.getElementsByClassName('cart-row').length === 0) {

        alert('There is nothing in the cart')
        
    } else if (document.getElementsByClassName('cart-row').length > 0){ 
          
        cartCheckout()
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)

        }

        document.getElementsByClassName(`btn-purchase`)[0].style.display= 'none'
        updateCartTotal()
        window.location.href = `../Checkout-page/checkout.html`

    }

    cart.classList.add('hide');
    
};



//sub-section: watches how the quantity input changes to update the prices

function quantityChanged(event) {

    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {

        input.value = 1

    }

    updateCartTotal()

};

//sub-section sends purchase information to cart 

function cartCheckout() {
    for (let i = 0; i < document.getElementsByClassName(`cart-item`).length; i++  ) {

        var title = document.getElementsByClassName(`cart-item-title`)[i].textContent;
        var priceElement = document.getElementsByClassName('cart-price')[i].textContent;
        var quantityElement = document.getElementsByClassName('cart-quantity-input')[i].value;
        let checkoutOBJ = {title: title, price: priceElement, quantity: quantityElement,};
        console.log(checkoutOBJ);
        checkoutStore = JSON.stringify(checkoutOBJ)
        sessionStorage.setItem(`checkout${i}`, checkoutStore)
        console.log(sessionStorage)
    }

    var total = document.getElementsByClassName(`cart-total-price`)[0].textContent
    let checkoutTotal = JSON.stringify(total)
    sessionStorage.setItem('total', checkoutTotal)
    
}

// section outside elements-to-cart interactions

// sub-section add items to cart

function addItemToCart(title,price,imageSrc,place) {

    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = document.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){

        if (cartItemNames[i].textContent == title) {

            alert('This is Item is already added to the cart')
            return

        };
    };

    cartRow.classList.add(`item-${place}`)
    var cartRowItem = document.createElement('div')
    cartRowItem.classList.add('cart-item', `cart-column`)
   
    var cartRowItemImg = document.createElement('img')
    cartRowItemImg.classList.add(`cart-item-image`)
    console.log(cartRowItemImg.src = imageSrc) 
    cartRowItemImg.style.width = `36px`
    cartRowItemImg.style.height = '27px';
    
    let storageValue = document.createElement('div')
    storageValue.classList.add(`storage-${place}`)
    storageValue.value = place
    storageValue.display = 'none'
    
    var cartRowItemSpan = document.createElement('span')
    cartRowItemSpan.classList.add(`cart-item-title`)
    cartRowItemSpan.textContent = title;

    var cartRowPrice = document.createElement('span')
    cartRowPrice.classList.add('cart-price','cart-column')
    cartRowPrice.textContent = price

    var cartRowQuantity = document.createElement(`div`)
    cartRowQuantity.classList.add(`cart-quantity`,`cart-column`)

    var cartRowQuantityInput = document.createElement('input')
    cartRowQuantityInput.classList.add('cart-quantity-input')
    cartRowQuantityInput.type = 'number'
    cartRowQuantityInput.value = 1;
    
    var cartRowQuantityBtn = document.createElement('button');
    cartRowQuantityBtn.classList.add('btn','btn-danger');
    cartRowQuantityBtn.type = `button`
    cartRowQuantityBtn.textContent = 'Remove'

    cartItems.append(cartRow)
    cartRow.append(storageValue)
    cartRow.append(cartRowItem)
    cartRowItem.append(cartRowItemImg, cartRowItemSpan)
    cartRow.append(cartRowPrice)
    cartRow.append(cartRowQuantity)
    cartRowQuantity.append(cartRowQuantityInput)
    cartRowQuantity.append(cartRowQuantityBtn)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    cartRow.style.boxShadow='0px 0px 10px 0px rgba(0,0,0,0.75)'
    cartRow.style.borderRadius='1px'
    cartRow.style.textAlign= `center`
    cartRow.style.margin = "10px auto"
    cartRow.style.width = `100%`
    document.getElementsByClassName(`btn-purchase`)[0].style.display = 'block'

    // The original code used innerHTML I decided not to use it
    // just to remember that this is apart of the original function
    // cart.classList.remove('hide')

};

//sub-section: all that happens when the add-to-cart button is clicked

function addToCartClicked(e){
    var place = Math.random()
    var button = e.target
    var shopItem = button.parentElement.parentElement 
    var title = shopItem.getElementsByClassName('shop-item-title')[0].textContent
    var price = shopItem.getElementsByClassName('shop-item-price')[0].textContent
    var imageSrc =shopItem.getElementsByClassName('shop-item-image')[0].src
    shopItem.classList.add(`item-${place}`)
    addItemToCart(title,price,imageSrc,place)
    updateCartTotal()
    addToStorage(title,price,imageSrc,place)
    
};

//sub-section creates storage object for objects when added to cart

function addToStorage(title,price,imageSrc,place) {
    var infoArray = [title,price,imageSrc]
    cartItemString = JSON.stringify(infoArray)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        extractedData = JSON.parse(value);
        extractedTitle = extractedData[0]
        if (title === extractedTitle) {
            return;
            }
        } 
    
    localStorage.setItem(place, cartItemString)
    displayCartCount()
};

//sub-section: persist cart across web pages 

function persistCart() {
    if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            extractedData = JSON.parse(value);
            console.log(extractedData);
            title = extractedData[0]
            price = extractedData[1]
            image = extractedData[2]
            addItemToCart(title,price,image,key);
        }
    }

    displayCartCount()
    updateCartTotal()
}

persistCart()
showCart()




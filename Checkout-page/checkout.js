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

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click',returnToMenuClicked)

};

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
}

//sub-section: removes items from cart

function removeCartItem(e) {

    var buttonClicked = e.target
    var sharedClassName = document.getElementsByClassName(buttonClicked.parentElement.parentElement.classList[1])
    let storageNumber = buttonClicked.parentElement.parentElement.firstChild.value
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

//sub-section: watches how the quantity input changes to update the prices

function quantityChanged(event) {

    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {

        input.value = 1

    }

    updateCartTotal()

};

//sub-section returns to menu page when clicked

function returnToMenuClicked() {
    window.location.href = '../Menu-page/menu.html';
    cart.classList.add('hide');
};

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
    cartRowItemImg.src = imageSrc
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


//sub-section: persist cart across web pages 

function persistCart() {
    if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            extractedData = JSON.parse(value);
            title = extractedData[0]
            price = extractedData[1]
            image = extractedData[2]
            addItemToCart(title,price,image,key);
        }
    }

    displayCartCount()
    updateCartTotal()
}

//sub-section: add items to purchase information section
function checkoutItems(title,price,quantity) {
    var checkoutItem = document.createElement('div')
    checkoutItem.classList.add(`checkout-items`)
    checkoutItem.textContent = `${title} ${price} x ${quantity}`
    document.getElementsByClassName('purchase-recap')[0].append(checkoutItem)
}

//sub-section: retrive checkout information from session storage

function retriveFromSessionStorage() {
    for (let i = 0; i < sessionStorage.length - 1; i++) {

        let sessionObj = sessionStorage.getItem(`checkout${i}`)
        let retrievedObj = JSON.parse(sessionObj);
        title = retrievedObj.title;
        price = retrievedObj.price;
        quantity = retrievedObj.quantity;   
        checkoutItems(title,price,quantity) 

    }

    let sessionTotal = sessionStorage.getItem(`total`)
    let retrievedTotal = JSON.parse(sessionTotal);
    let checkoutTotal = document.createElement(`div`)
    checkoutTotal.classList.add('checkout-total')
    checkoutTotal.textContent = `Total: ${retrievedTotal}`
    document.getElementsByClassName('purchase-recap')[0].append(checkoutTotal)
}

//sub-section: make sure all the necessary fields are filled out before purchase

function textContentCompleted() {
    for (let i = 0; i < document.getElementsByClassName('text-field billing').length; i++) {

        if (document.getElementsByClassName('text-field billing')[i].value === "" ) {

            document.getElementsByClassName('text-field billing')[i].style.backgroundColor = 'red'
            document.getElementsByClassName('text-field billing')[i].scrollIntoView({behavior: 'smooth'});
            return

        }
    }
    
    //let creditCardCodes = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
    // if (creditCardCodes.test(document.getElementsByClassName('payment')[0].value) == false) {
    //     document.getElementsByClassName('payment')[0].style.backgroundColor = 'red'
    //     document.getElementsByClassName('payment')[0].scrollIntoView({behavior: 'smooth'});
    //     return
    // }
    

    let date = new Date(document.getElementsByClassName('expiration')[1].value, document.getElementsByClassName('expiration')[0].value)
    let currentDate = new Date()

    if (date.getMonth() < currentDate.getMonth() && date.getFullYear() <= currentDate.getFullYear() || date.getFullYear() < currentDate.getFullYear()) {
        document.getElementsByClassName('expiration')[0].style.backgroundColor = 'red'
        document.getElementsByClassName('expiration')[1].style.backgroundColor = 'red'
        document.getElementsByClassName('expiration')[0].scrollIntoView({behavior: 'smooth'});
        alert("this date is not valid")
        return

    }
    
    if(document.getElementsByClassName(`card-security`)[0].value !== "") {
        alert('Thank you for you purchase');
                localStorage.clear()
                sessionStorage.clear()
                retriveFromSessionStorage()
                persistCart()
                window.location.href = '../index.html'
    } else {
        document.getElementsByClassName('text-field billing')[i].style.backgroundColor = 'red'
        document.getElementsByClassName('text-field billing')[i].scrollIntoView({behavior: 'smooth'});
        return
    }
}

//sub-section section: adds listener to checkout button
document.getElementsByClassName(`checkout-btn-purchase`)[0].addEventListener('click' , textContentCompleted)

persistCart()
showCart()
retriveFromSessionStorage()

// section: when an input field turns red from not being filled typing in it turns it back white
for (let i = 0; i <  document.getElementsByClassName('text-field billing').length; i++) {
    document.getElementsByClassName('text-field billing')[i].addEventListener('input', (e) => {
        if (e.target.style.backgroundColor == 'red') {
            e.target.style.backgroundColor = `white`
        }
    })
    
    for (let i = 0; i <  document.getElementsByClassName('payment').length; i++) {
        document.getElementsByClassName('payment')[i].addEventListener('input', (e) => {
            if (e.target.style.backgroundColor == 'red') {
                e.target.style.backgroundColor = `white`
            }
        })
    }
} 
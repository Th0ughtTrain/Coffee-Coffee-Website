if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

var cart = document.getElementsByClassName(`cart`)[0]


// let persistentCart = cartDetails.map( (items) =>{
//     return items.innerHTML
// })

function showCart() {
    var showCartButton = document.getElementsByClassName('toggle-cart')[0]
    showCartButton.addEventListener(`click`,() => {
        if (cart.classList.contains(`hide`)) {
            cart.classList.remove(`hide`)
        } else {
            cart.classList.add('hide')
        }
                
        // console.log(cart.innerHTML)
        // console.log(myCartItems)
        // for (let i = 0; i < myCartItems.length; i++) {
        //     console.log(myCartItems[i].innerHTML)
        // }
    })
};

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

function purchaseClicked() {
    if(document.getElementsByClassName('cart-row').length === 0) {
        alert('There is nothing in the cart')
    } else if (document.getElementsByClassName('cart-row').length > 0){   
        alert('Thank you for your purchase')
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        document.getElementsByClassName(`btn-purchase`)[0].style.display= 'none'
        updateCartTotal()
    }

    cart.classList.add('hide');
};

// console.log(document.getElementsByClassName('cart-row'))

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
    }

    updateCartTotal()
    displayCartCount()
};

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
};

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

function addItemToCart(title,price,imageSrc,place) {

    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    //!Need to add cart-item-title in html
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

    // var cartRowContents = `
    //     <div class="cart-item cart-column">
    //         <img class="cart-item-image" src="${imageSrc}" alt="" width="36px" height="27px">
    //         <span class="cart-item-title">${title}</span>
    //     </div>
    //     <span class="cart-price cart-column">${price}</span>
    //     <div class="cart-quantity cart-column">
    //         <input type="number" class="cart-quantity-input" value="1">
    //         <button class="btn btn-danger" type="button">Remove</button>
    //     </div>`
    // cartRow.innerHTML = cartRowContents

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
    cart.classList.remove('hide')
};

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

let backToTop = document.getElementById('back-to-top')

backToTop.addEventListener('click', function() {
    window.scrollTo(0,0)
});

showCart()
// console.log(document.getElementsByClassName('toggle-cart'))

let myCartItems = document.getElementsByClassName('cart-row')

// localStorage.setItem(`cartStorage`, )

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
}

persistCart()

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
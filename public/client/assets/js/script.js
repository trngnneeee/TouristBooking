// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if (buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");

  // Click vào button mở menu
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Click vào overlay đóng menu
  const overlay = menu.querySelector(".inner-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  // Click vào icon down mở sub menu
  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach(button => {
    button.addEventListener("click", () => {
      button.parentNode.classList.toggle("active");
    })
  });
}
// End Menu Mobile

// Box Address Section 1
const boxAddressSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-address");
if (boxAddressSection1) {
  // Ẩn/hiện box suggest
  const input = boxAddressSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  })

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  })

  // Sự kiện click vào từng item
  const listItem = boxAddressSection1.querySelectorAll(".inner-suggest-list .inner-item");
  listItem.forEach(item => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      if (title) {
        input.value = title;
      }
    })
  })
}
// End Box Address Section 1

// Box User Section 1
const boxUserSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-user");
if (boxUserSection1) {
  // Hiện box quantity
  const input = boxUserSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  })

  // Ẩn box quantity
  document.addEventListener("click", (event) => {
    // Kiểm tra nếu click không nằm trong khối `.inner-box.inner-user`
    if (!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove("active");
    }
  });

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(".inner-count .inner-number");
    const listNumber = [];
    listBoxNumber.forEach(boxNumber => {
      const number = parseInt(boxNumber.innerHTML.trim());
      listNumber.push(number);
    })
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  }

  // Bắt sự kiện click nút up
  const listButtonUp = boxUserSection1.querySelectorAll(".inner-count .inner-up");
  listButtonUp.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    })
  })

  // Bắt sự kiện click nút down
  const listButtonDown = boxUserSection1.querySelectorAll(".inner-count .inner-down");
  listButtonDown.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      if (number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
        updateQuantityInput();
      }
    })
  })
}
// End Box User Section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if (clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");

  // Chuyển đổi chuỗi thời gian thành đối tượng Date
  const expireDateTime = new Date(expireDateTimeString);

  // Hàm cập nhật đồng hồ
  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now; // quy về đơn vị mili giây

    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      // Tính số ngày, 24 * 60 * 60 * 1000 Tích của các số này = số mili giây trong 1 ngày

      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      // Tính số giờ, 60 * 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số giờ.
      // % 24 Lấy phần dư khi chia tổng số giờ cho 24 để chỉ lấy số giờ còn lại trong ngày.

      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      // Tính số phút, 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số phút.
      // % 60 Lấy phần dư khi chia tổng số phút cho 60 để chỉ lấy số phút còn lại trong giờ.

      const seconds = Math.floor((remainingTime / 1000) % 60);
      // Tính số giây, 1000 Chia remainingTime cho giá trị này để nhận được tổng số giây.
      // % 60 Lấy phần dư khi chia tổng số giây cho 60 để chỉ lấy số giây còn lại trong phút.

      // Cập nhật giá trị vào thẻ span
      const listBoxNumber = clockExpire.querySelectorAll('.inner-number');
      listBoxNumber[0].innerHTML = `${days}`.padStart(2, '0');
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, '0');
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, '0');
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, '0');
    } else {
      // Khi hết thời gian, dừng đồng hồ
      clearInterval(intervalClock);
    }
  }

  // Gọi hàm cập nhật đồng hồ mỗi giây
  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Box Filter
const buttonFilterMobile = document.querySelector(".section-9 .inner-filter-mobile");
if (buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");
  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  })

  const overlay = document.querySelector(".section-9 .inner-left .inner-overlay");
  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  })
}
// End Box Filter

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if (boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    boxTourInfo.classList.add("active");
  })

  new Viewer(boxTourInfo);
}
// End Box Tour Info

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");
if (swiperSection2) {
  new Swiper('.swiper-section-2', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if (swiperSection3) {
  new Swiper('.swiper-section-3', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 3

// Swiper Box Images
const boxImages = document.querySelector(".box-images");
if (boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 5,
    slidesPerView: 4,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });

  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 0,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Swiper Box Images

// Zoom Box Images Main
const boxImagesMain = document.querySelector(".box-images .inner-images-main");
if (boxImagesMain) {
  new Viewer(boxImagesMain);
}
// End Zoom Box Images Main

// Box Tour Schedule
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if (boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Box Tour Schedule

// Email Form
const emailForm = document.querySelector("#email-form");
if (emailForm) {
  const validation = new JustValidate('#email-form');

  validation
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email của bạn!',
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;

      const finalData = {
        email: email
      };

      fetch(`/contact/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalData)
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.reload();
        })
    })
    ;
}
// End Email Form

// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if (couponForm) {
  const validation = new JustValidate('#coupon-form');

  validation
    .onSuccess((event) => {
      const coupon = event.target.coupon.value;
      console.log(coupon);
    })
    ;
}
// End Email Form

// Order Form
const orderForm = document.querySelector("#order-form");
if (orderForm) {
  const validation = new JustValidate('#order-form');

  validation
    .addField('#full-name-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#phone-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const method = event.target.method.value;

      let cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart.filter(item => {
        return item.checked && (item.quantityAdult > 0 || item.quantityChildren > 0 || item.quantityBaby > 0);
      })
      cart = cart.map(item => {
        return {
          tourID: item.tourID,
          departure: item.departure,
          quantityAdult: item.quantityAdult,
          quantityChildren: item.quantityChildren,
          quantityBaby: item.quantityBaby,
        }
      });

      if (cart.length > 0) {
        const finalData = {
          fullName: fullName,
          phone: phone,
          note: note,
          paymentMethod: method,
          items: cart
        }

        fetch(`/order/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(finalData)
        })
          .then(res => res.json())
          .then((data) => {
            if (data.code == "error")
              alert(data.message);
            if (data.code == "success") {
              // Cập nhật lại giỏ hàng
              let cart = JSON.parse(localStorage.getItem("cart"));
              cart = cart.filter(item => item.checked == false);
              localStorage.setItem("cart", JSON.stringify(cart));

              switch (method) {
                case "money":
                  {
                    window.location.href = `/order/success?orderID=${data.orderID}&phone=${phone}`;
                    break;
                  }
                case "zalopay":
                  {
                    window.location.href = `/order/zalopay?orderID=${data.orderID}`
                    break;
                  }
              }
            }
          })
      }
      else alert("Vui lòng đặt ít nhất một tour!");
    })
    ;

  // List Input Method
  const listInputMethod = orderForm.querySelectorAll("input[name='method']");
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");

  listInputMethod.forEach(inputMethod => {
    inputMethod.addEventListener("change", () => {
      if (inputMethod.value == "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    })
  })
  // End List Input Method
}
// End Order Form

// Alert
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // Xóa phần tử khỏi giao diện
  }, time);
}
// End Alert

// Tour Filter
const filterList = [
  "departure",
  "destination",
  "departureDate",
  "stockAdult",
  "stockChildren",
  "stockBaby",
  "price"
];

const tourFilterButton = document.querySelector("[tour-filter-apply]");
if (tourFilterButton) {
  const url = new URL(`${window.location.origin}/search`);
  tourFilterButton.addEventListener("click", () => {
    for (const item of filterList) {
      const target = document.querySelector(`[name=${item}]`);
      const value = target.value;
      if (value && value != "0")
        url.searchParams.set(item, value);
      else url.searchParams.delete(item);
    }
    window.location.href = url.href;
  })

  for (const item of filterList) {
    if (url.searchParams.get(item)) {
      const target = document.querySelector(`[name=${item}]`);
      target.value = url.searchParams.get(item);
    }
  }
}
// End Tour Filter

// Home Search Form
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  const url = new URL(`${window.location.origin}/search`);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = event.target.destination.value;
    if (destination)
      url.searchParams.set("destination", destination);
    else url.searchParams.delete("destination");

    const stockAdult = parseInt(formSearch.querySelector("[stockAdult]").innerHTML);
    if (stockAdult)
      url.searchParams.set("stockAdult", stockAdult);
    else url.searchParams.delete("stockAdult");

    const stockChildren = parseInt(formSearch.querySelector("[stockChildren]").innerHTML);
    if (stockChildren)
      url.searchParams.set("stockChildren", stockChildren);
    else url.searchParams.delete("stockAdult");

    const stockBaby = parseInt(formSearch.querySelector("[stockBaby]").innerHTML);
    if (stockBaby)
      url.searchParams.set("stockBaby", stockBaby);
    else url.searchParams.delete("stockAdult");

    const departureDate = event.target.departureDate.value;
    if (departureDate)
      url.searchParams.set("departureDate", departureDate);
    else url.searchParams.delete("departureDate");

    window.location.href = url.href;
  })
}
// End Home Search Form

// Total Price
const totalPrice = document.querySelector("[totalPrice]");
if (totalPrice) {
  const stockFields = {
    adult: document.querySelector("[stockAdult]"),
    children: document.querySelector("[stockChildren]"),
    baby: document.querySelector("[stockBaby]")
  };

  const prices = {
    adult: Number(document.querySelector("[priceAdult]").innerHTML.replace(/\./g, '')),
    children: Number(document.querySelector("[priceChildren]").innerHTML.replace(/\./g, '')),
    baby: Number(document.querySelector("[priceBaby]").innerHTML.replace(/\./g, ''))
  };

  const displayFields = {
    adult: document.querySelector("[displayPriceAdult]"),
    children: document.querySelector("[displayPriceChildren]"),
    baby: document.querySelector("[displayPriceBaby]")
  };

  function updateTotal() {
    const total =
      stockFields.adult.value * prices.adult +
      stockFields.children.value * prices.children +
      stockFields.baby.value * prices.baby;

    totalPrice.innerHTML = `${total.toLocaleString('vi-VN')} đ`;
  }

  Object.keys(stockFields).forEach((key) => {
    stockFields[key].addEventListener("change", () => {
      displayFields[key].innerHTML = stockFields[key].value;
      updateTotal();
    });
  });
}
// End Total Price

// Add To Cart
const addButton = document.querySelector("[tour-id]");
if (addButton) {
  addButton.addEventListener("click", () => {
    const id = addButton.getAttribute("tour-id");
    const quantitykAdult = parseInt(document.querySelector("[stockAdult]").value);
    const quantityChildren = parseInt(document.querySelector("[stockChildren]").value);
    const quantityBaby = parseInt(document.querySelector("[stockBaby]").value);
    const departure = document.querySelector("[departure]").value;
    if (quantitykAdult > 0 || quantityChildren > 0 || quantityBaby > 0) {
      const cartItem = {
        tourID: id,
        quantityAdult: quantitykAdult,
        quantityChildren: quantityChildren,
        quantityBaby: quantityBaby,
        departure: departure,
        checked: true
      };

      const cart = JSON.parse(localStorage.getItem("cart"));
      const indexItemExist = cart.findIndex(item => item.tourID == cartItem.tourID);
      if (indexItemExist != -1) {
        cart[indexItemExist] = cartItem;
      }
      else {
        cart.push(cartItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "/cart";
    }
  })
}
// End Add To Cart

// Init LocalStorage Cart
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}
else {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const miniCart = document.querySelector("[cart-quantity]");
  miniCart.innerHTML = cart.length;
}
// End Init LocalStorage Cart

// Cart Page
const renderCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const finalData = {
    cart: cart
  };
  fetch(`/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(finalData)
  })
    .then(res => res.json())
    .then((data) => {
      if (data.code == "error")
        alert(data.message);
      if (data.code == "success") {
        // Hiển thị data
        const cart = data.cart;
        const cartList = document.querySelector("[cart-list]");
        let str = "";
        for (const item of cart) {
          str += `
            <div class="inner-tour-item">
              <div class="inner-actions">
                <button class="inner-delete" button-delete tourID=${item.tourID}>
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <input 
                  class="inner-check" 
                  type="checkbox" 
                  ${item.checked ? "checked" : ""}
                  cart-check
                  tourID=${item.tourID}
                />
              </div>
              <div class="inner-product">
                <div class="inner-image">
                  <a href="#">
                    <img alt="" src=${item.avatar}
                  </a>
                </div>
                <div class="inner-content">
                  <div class="inner-title">
                    <a href='/tours/detail/${item.slug}'>
                      ${item.name}
                    </a>
                  </div>
                  <div class="inner-meta">
                    <div class="inner-meta-item">Mã Tour:<b>TOUR000${item.position}</b></div>
                    <div class="inner-meta-item">Ngày Khởi Hành:<b>${item.departureDateFormat}</b></div>
                    <div class="inner-meta-item">Khởi Hành Tại:<b>${item.departureName}</b></div>
                  </div>
                </div>
              </div>
              <div class="inner-quantity">
                <label class="inner-label">Số Lượng Hành Khách</label>
                <div class="inner-list">
                  <div class="inner-item">
                    <div class="inner-item-label">Người lớn:</div>
                    <div class="inner-item-input">
                      <input 
                        value=${item.quantityAdult} 
                        min="0" 
                        type="number"
                        input-quantity="quantityAdult"
                        tourID=${item.tourID}
                      />
                    </div>
                    <div class="inner-item-price"><span>${item.quantityAdult}</span><span>x</span><span class="inner-highlight">${item.priceNewAdult.toLocaleString('vi-VN')}</span></div>
                  </div>
                  <div class="inner-item">
                    <div class="inner-item-label">Trẻ em:</div>
                    <div class="inner-item-input">
                      <input 
                        value=${item.quantityChildren} 
                        min="0" 
                        type="number"
                        input-quantity="quantityChildren"
                        tourID=${item.tourID}
                      />
                    </div>
                    <div class="inner-item-price"><span>${item.quantityChildren}</span><span>x</span><span class="inner-highlight">${item.priceNewChildren.toLocaleString('vi-VN')}</span></div>
                  </div>
                  <div class="inner-item">
                    <div class="inner-item-label">Em bé:</div>
                    <div class="inner-item-input">
                      <input 
                        value=${item.quantityBaby} 
                        min="0" 
                        type="number"
                        input-quantity="quantityBaby"
                        tourID=${item.tourID}
                      />
                    </div>
                    <div class="inner-item-price"><span>${item.quantityBaby}</span><span>x</span><span class="inner-highlight">${item.priceNewBaby.toLocaleString('vi-VN')}</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
        cartList.innerHTML = str;
        // End Hiển thị data

        // Cập nhật lại LocalStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        const miniCart = document.querySelector("[cart-quantity]");
        miniCart.innerHTML = cart.length;
        // End Cập nhật lại LocalStorage

        // Tổng tiền
        let totalPrice = 0;
        for (const item of cart) {
          if (item.checked) {
            totalPrice += item.quantityAdult * item.priceNewAdult;
            totalPrice += item.quantityChildren * item.priceNewChildren;
            totalPrice += item.quantityBaby * item.priceNewBaby;
          }
        }
        const totalPriceElement = document.querySelector("[cart-total]");
        totalPriceElement.innerHTML = totalPrice.toLocaleString("vi-VN");
        // End Tổng tiền

        // Cart Input Change
        const quantityInputList = document.querySelectorAll("[input-quantity]");
        if (quantityInputList.length) {
          for (const quantityInput of quantityInputList) {
            quantityInput.addEventListener("change", () => {
              const tourID = quantityInput.getAttribute("tourID");
              const name = quantityInput.getAttribute("input-quantity");
              const quantity = parseInt(quantityInput.value);

              const cart = JSON.parse(localStorage.getItem("cart"));
              const itemUpdate = cart.find(item => item.tourID == tourID);
              itemUpdate[name] = quantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              renderCart();
            })
          }
        }
        // End Cart Input Change

        // Xóa tour
        const buttonDeleteList = document.querySelectorAll("[button-delete]");
        if (buttonDeleteList.length) {
          for (const button of buttonDeleteList) {
            button.addEventListener("click", () => {
              const tourID = button.getAttribute("tourID");
              const cart = JSON.parse(localStorage.getItem("cart"));
              const indexItem = cart.findIndex(tour => tour.tourID = tourID);
              cart.splice(indexItem, 1);
              localStorage.setItem("cart", JSON.stringify(cart));
              renderCart();
            })
          }
        }
        // End Xóa tour

        // Cart Check
        const checkList = document.querySelectorAll("[cart-check]");
        if (checkList.length) {
          for (const input of checkList) {
            input.addEventListener("change", () => {
              const tourID = input.getAttribute("tourID");
              const cart = JSON.parse(localStorage.getItem("cart"));
              const itemUpdate = cart.find(item => item.tourID == tourID);
              itemUpdate.checked = input.checked;
              localStorage.setItem("cart", JSON.stringify(cart));
              renderCart();
            })
          }
        }
        // End Cart Check
      }
    })
}

const cartPage = document.querySelector("[cart-page]");
if (cartPage) {
  renderCart();
}
// End Cart Page
// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if (buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  })

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  })
}
// End Menu Mobile

// Schedule Section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if (scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const listItem = scheduleSection8.querySelector(".inner-schedule-list");

  // Tạo mới
  if (buttonCreate) {
    buttonCreate.addEventListener("click", () => {
      const firstItem = listItem.querySelector(".inner-schedule-item");
      const cloneItem = firstItem.cloneNode(true);
      cloneItem.querySelector(".inner-schedule-head input").value = "";

      const body = cloneItem.querySelector(".inner-schedule-body");
      const id = `mce_${Date.now()}`;
      body.innerHTML = `<textarea textarea-mce id="${id}"></textarea>`;

      listItem.appendChild(cloneItem);

      initTinyMCE(`#${id}`);
    })
  }

  listItem.addEventListener("click", (event) => {
    // Đóng/mở item
    if (event.target.closest('.inner-more')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      if (parentItem) {
        parentItem.classList.toggle('hidden');
      }
    }

    // Xóa item
    if (event.target.closest('.inner-remove')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      const totalItem = listItem.querySelectorAll(".inner-schedule-item").length;
      if (parentItem && totalItem > 1) {
        parentItem.remove();
      }
    }
  })

  // Sắp xếp
  new Sortable(listItem, {
    animation: 150, // Thêm hiệu ứng mượt mà
    handle: ".inner-move", // Chỉ cho phép kéo bằng class .inner-move
    onStart: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    }
  });
}
// End Schedule Section 8

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilepondImage.length > 0) {
  listFilepondImage.forEach(filepondImage => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementImageDefault = filepondImage.closest("[image-default]");
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if (imageDefault) {
        files = [
          {
            source: imageDefault, // Đường dẫn ảnh
          },
        ]
      }
    }

    filePond[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: '+',
      files: files
    });
  });
}
// End Filepond Image

// Biểu đồ doanh thu
const revenueChart = document.querySelector("#revenue-chart");
if (revenueChart) {
  new Chart(revenueChart, {
    type: 'line',
    data: {
      labels: ['01', '02', '03', '04', '05'],
      datasets: [
        {
          label: 'Tháng 04/2025', // Nhãn của dataset
          data: [1200000, 1800000, 3200000, 900000, 1600000], // Dữ liệu
          borderColor: '#4379EE', // Màu viền
          borderWidth: 1.5, // Độ dày của đường
        },
        {
          label: 'Tháng 03/2025', // Nhãn của dataset
          data: [1000000, 900000, 1200000, 1200000, 1400000], // Dữ liệu
          borderColor: '#EF3826', // Màu viền
          borderWidth: 1.5, // Độ dày của đường
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Ngày'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Doanh thu (VND)'
          }
        }
      },
      maintainAspectRatio: false, // Không giữ tỷ lệ khung hình mặc định
    }
  });
}
// Hết Biểu đồ doanh thu

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
  const validation = new JustValidate('#category-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();

      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      fetch(`/${pathAdmin}/category/create`, {
        method: "POST",
        body: formData // Không cần headers vì không gửi dạng JSON
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/category/list`;
          }
        })
    })
    ;
}
// End Category Create Form

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if (categoryEditForm) {
  const validation = new JustValidate('#category-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();

      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      fetch(`/${pathAdmin}/category/edit/${id}`, {
        method: "PATCH",
        body: formData // Không cần headers vì không gửi dạng JSON
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success") {
            window.location.reload();
          }
        })
    })
    ;
}
// End Category Edit Form

// Delete Category
const categoryDeleteButtonList = document.querySelectorAll("[button-delete]");
if (categoryDeleteButtonList) {
  categoryDeleteButtonList.forEach((buttonDelete) => {
    buttonDelete.addEventListener("click", () => {
      fetch(buttonDelete.getAttribute("data-api"), {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success")
            window.location.reload();
        })
    })
  })
}
// End Delete Category

// Status Filter
const statusFilter = document.querySelector(".status-filter")
if (statusFilter) {
  const url = new URL(window.location.href);
  statusFilter.addEventListener("change", () => {
    const value = statusFilter.value;
    if (value) {
      url.searchParams.set("status", value);
    }
    else {
      url.searchParams.delete("status");
    }
    window.location.href = url.href;
  })

  const valueCurrent = url.searchParams.get("status");
  if (valueCurrent) {
    statusFilter.value = valueCurrent;
  }
}
// End Status Filter

// Create By Filter
const createByFilter = document.querySelector(".create-by-filter");
if (createByFilter) {
  const url = new URL(window.location.href);
  createByFilter.addEventListener("change", () => {
    const id = createByFilter.value;
    if (id)
      url.searchParams.set("createdBy", id);
    else
      url.searchParams.delete("createdBy");
    window.location.href = url.href;
  })

  if (url.searchParams.get("createdBy")) {
    createByFilter.value = url.searchParams.get("createdBy");
  }
}
// End Create By Filter

// Date Filter
const startDateFilter = document.querySelector(".start-date-filter");
const endDateFilter = document.querySelector(".end-date-filter");

if (startDateFilter) {
  const url = new URL(window.location.href);
  startDateFilter.addEventListener("change", () => {
    const startDate = startDateFilter.value;
    if (startDate) {
      url.searchParams.set("startDate", startDate);
    }
    else {
      url.searchParams.delete("startDate");
    }
    window.location.href = url.href;
  })
  if (url.searchParams.get("startDate"))
    startDateFilter.value = url.searchParams.get("startDate");
}

if (endDateFilter) {
  const url = new URL(window.location.href);
  endDateFilter.addEventListener("change", () => {
    const endDate = endDateFilter.value;
    if (endDate) {
      url.searchParams.set("endDate", endDate);
    }
    else {
      url.searchParams.delete("endDate");
    }
    window.location.href = url.href;
  })
  if (url.searchParams.get("endDate"))
    endDateFilter.value = url.searchParams.get("endDate");
}
// End Date Filter

// Delete Filter
const deleteFilter = document.querySelector(".filter-delete");
if (deleteFilter) {
  const url = new URL(window.location.href);
  deleteFilter.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  })
}
// End Delete Filter

// Check All
const checkAllButton = document.querySelector(".check-all-button");
if (checkAllButton) {
  checkAllButton.addEventListener("click", () => {
    const itemCheckList = document.querySelectorAll("[check-item]");
    itemCheckList.forEach((item) => {
      item.checked = checkAllButton.checked;
    })
  })
}
// End Check All

// Áp dụng trạng thái cho nhiều phần tử
const changeMultiStatus = document.querySelector("[change-multi-status]");
if (changeMultiStatus) {
  const api = changeMultiStatus.getAttribute("data-api");
  const select = changeMultiStatus.querySelector("select");
  const button = changeMultiStatus.querySelector("button");

  button.addEventListener("click", () => {
    const status = select.value;
    const itemCheckedList = document.querySelectorAll("[check-item]:checked");
    if (status && itemCheckedList.length) {
      const idList = [];
      itemCheckedList.forEach((item) => {
        idList.push(item.getAttribute("check-item"));
      })
      const finalData = {
        status: status,
        idList: idList
      }
      fetch(api, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalData)
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "success")
            window.location.reload();
          if (data.code == "error")
            alert(data.message);
        })
    }
    else {
      alert("Vui lòng lựa chọn Hoạt động hoặc Bản ghi muốn thực hiện!")
    }
  })
}
// End Áp dụng trạng thái cho nhiều phần tử

// Category Search
const searchElement = document.querySelector("[search]");
if (searchElement) {
  const url = new URL(window.location.href)
  searchElement.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const value = searchElement.value;
      if (value)
        url.searchParams.set("search", value);
      else
        url.searchParams.delete("search");
      window.location.href = url.href;
    }
  })
  if (url.searchParams.get("search"))
    searchElement.value = url.searchParams.get("search");
}
// End Category Search

// Pagination
const paginationElement = document.querySelector("[pagination]");
if (paginationElement) {
  const url = new URL(window.location.href);
  paginationElement.addEventListener("change", () => {
    const value = paginationElement.value;
    if (value)
      url.searchParams.set("page", value);
    else
      url.searchParams.delete("page");

    window.location.href = url.href;
  })
  const currentValue = url.searchParams.get("page");
  if (currentValue)
    paginationElement.value = currentValue;
}
// End Pagination

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const validation = new JustValidate('#tour-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourCreateForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourCreateForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations)); // Mảng -> Gửi JSON để ko lỗi
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules)); // Mảng -> Gửi JSON để ko lỗi

      fetch(`/${pathAdmin}/tour/create`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success")
            window.location.href = `/${pathAdmin}/tour/list`
        })
    })
    ;
}
// End Tour Create Form

// Tour Edit 
const tourEditButtonList = document.querySelectorAll("[tour-edit-button]");
if (tourEditButtonList.length) {
  tourEditButtonList.forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const api = editButton.getAttribute("data-api");
      window.location.href = api;

    })
  })
}

const tourEditForm = document.querySelector("#tour-edit-form");
if (tourEditForm) {
  const validation = new JustValidate('#tour-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourEditForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourEditForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations)); // Mảng -> Gửi JSON để ko lỗi
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules)); // Mảng -> Gửi JSON để ko lỗi

      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success")
            window.location.reload()
        })
    })
    ;
}
// End Tour Edit

// Delete Tour
const tourDeleteButtonList = document.querySelectorAll("[tour-delete-button]");
if (tourDeleteButtonList.length) {
  tourDeleteButtonList.forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const api = deleteButton.getAttribute("data-api");
      fetch(api, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success") {
            window.location.reload();
          }
        })
    })
  })
}
// End Delete Tour

// Recovery Tour
const tourRecoveryButtonList = document.querySelectorAll("[recovery-tour-button]");
if (tourRecoveryButtonList) {
  tourRecoveryButtonList.forEach((button) => {
    button.addEventListener("click", () => {
      const api = button.getAttribute("data-api");
      fetch(api, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success")
            window.location.reload();
        })
    })
  })
}
// End Recovery Tour

// Hard Delete
const tourHardDeleteButtonList = document.querySelectorAll("[hard-delete-tour-button]");
if (tourHardDeleteButtonList) {
  tourHardDeleteButtonList.forEach((button) => {
    button.addEventListener("click", () => {
      const api = button.getAttribute("data-api");
      fetch(api, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message)
          if (data.code == "success")
            window.location.reload();
        })
    })
  })
}
// End Hard Delete

// Tour List Status Filter
const tourStatusFilter = document.querySelector(".tour-status-filter");
if (tourStatusFilter) {
  const url = new URL(window.location.href);
  tourStatusFilter.addEventListener("change", () => {
    const value = tourStatusFilter.value;
    if (value)
      url.searchParams.set("status", value);
    else url.searchParams.delete("status");

    window.location.href = url.href;
  })
  if (url.searchParams.get("status"))
    tourStatusFilter.value = url.searchParams.get("status")
}
// End Tour List Status Filter

// Tour Created By Filter
const tourCreatedByFilter = document.querySelector(".tour-create-status");
if (tourCreatedByFilter) {
  const url = new URL(window.location.href);
  tourCreatedByFilter.addEventListener("change", () => {
    const value = tourCreatedByFilter.value;
    if (value)
      url.searchParams.set("createdBy", value);
    else url.searchParams.delete("createdBy");

    window.location.href = url.href;
  })

  if (url.searchParams.get("createdBy"))
    tourCreatedByFilter.value = url.searchParams.get("createdBy");
}
// End Tour Created By Filter

// Tour Date Filter
const tourStartDateFilter = document.querySelector(".tour-start-date-filter");
if (tourStartDateFilter) {
  const url = new URL(window.location.href);
  tourStartDateFilter.addEventListener("change", () => {
    const value = tourStartDateFilter.value;
    if (value)
      url.searchParams.set("startDate", value);
    else url.searchParams.delete("startDate");

    window.location.href = url.href;
  })
  if (url.searchParams.get("startDate"))
    tourStartDateFilter.value = url.searchParams.get("startDate");
}
const tourEndDateFilter = document.querySelector(".tour-end-date-filter");
if (tourEndDateFilter) {
  const url = new URL(window.location.href);
  tourEndDateFilter.addEventListener("change", () => {
    const value = tourEndDateFilter.value;
    if (value)
      url.searchParams.set("endDate", value);
    else url.searchParams.delete("endDate");

    window.location.href = url.href;
  })
  if (url.searchParams.get("endDate"))
    tourEndDateFilter.value = url.searchParams.get("endDate");
}
// End Tour Date Filter

// Tour Category Filter
const tourCategoryFilter = document.querySelector(".category-filter");
if (tourCategoryFilter) {
  const url = new URL(window.location.href);
  tourCategoryFilter.addEventListener("change", () => {
    const value = tourCategoryFilter.value;
    if (value)
      url.searchParams.set("category", value);
    else url.searchParams.delete("category");

    window.location.href = url.href;
  })
  if (url.searchParams.get("category"))
    tourCategoryFilter.value = url.searchParams.get("category");
}
// End Tour Category Filter

// Tour Price Filter
const tourPriceFilter = document.querySelector(".tour-price-filter");
if (tourPriceFilter) {
  const url = new URL(window.location.href);
  tourPriceFilter.addEventListener("change", () => {
    const data = tourPriceFilter.value;
    let value;
    if (data)
      value = JSON.parse(data);
    if (data && value.length) {
      const startPrice = value[0];
      const endPrice = value[1];
      if (startPrice != -1)
        url.searchParams.set("startPrice", startPrice);
      else if (startPrice == -1 || !startPrice)
        url.searchParams.delete("startPrice");
      if (endPrice != -1)
        url.searchParams.set("endPrice", endPrice);
      else if (endPrice == -1 || !endPrice)
        url.searchParams.delete("endPrice");
    }
    else {
      url.searchParams.delete("startPrice");
      url.searchParams.delete("endPrice");
    }
    window.location.href = url.href;
  })
  if (url.searchParams.get("startPrice") || url.searchParams.get("endPrice")) {
    const array = [];
    if (url.searchParams.get("startPrice")) array.push(parseInt(url.searchParams.get("startPrice")));
    else array.push(parseInt(-1));
    if (url.searchParams.get("endPrice")) array.push(parseInt(url.searchParams.get("endPrice")));
    else array.push(parseInt(-1));
    tourPriceFilter.value = JSON.stringify(array);
  }
}
// End Tour Price Filter

// Tour Remove Filter
const tourRemoveFilter = document.querySelector(".tour-remove-filter");
if (tourRemoveFilter) {
  const url = new URL(window.location.href);
  tourRemoveFilter.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  })
}
// End Tour Remove Filter

// Tour Check All
const tourCheckAll = document.querySelector(".tour-check-all");
if (tourCheckAll) {
  tourCheckAll.addEventListener("change", () => {
    const tourItemCheck = document.querySelectorAll("[item-checked]");
    for (const item of tourItemCheck) {
      item.checked = tourCheckAll.checked;
    }
  })
}
// End Tour Check All

// Tour Apply All
const tourApplyAll = document.querySelector(".tour-apply-button");
if (tourApplyAll) {
  tourApplyAll.addEventListener("click", () => {
    const tourItemCheck = document.querySelectorAll("[item-checked]:checked");
    const idList = [];
    for (const item of tourItemCheck) {
      idList.push(item.getAttribute("item-checked"));
    }
    const select = document.querySelector(".tour-apply-multi");
    const status = select.value;
    const api = select.getAttribute("data-api");

    if (idList.length && status) {
      const finalData = {
        idList: idList,
        status: status
      }
      fetch(api, {
        method: "PATCH",
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
            window.location.reload();
          }
        })
    }
    else {
      alert("Vui lòng chọn Item hoặc Trạng thái cần áp dụng!");
    }
  })
}
// End Tour Apply All 

// Tour Search
const tourSearch = document.querySelector(".tour-search");
if (tourSearch) {
  const url = new URL(window.location.href);
  tourSearch.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const input = tourSearch.querySelector("input");
      const keyword = input.value;
      if (keyword)
        url.searchParams.set("search", keyword);
      else
        url.searchParams.delete("search");
      window.location.href = url.href;
    }
  })
  if (url.searchParams.get("search")) {
    const input = tourSearch.querySelector("input");
    input.value = url.searchParams.get("search");
  }
}
// End Tour Search

// Pagination
const tourPagination = document.querySelector(".tour-pagination");
if (tourPagination) {
  const url = new URL(window.location.href);
  tourPagination.addEventListener("change", () => {
    const value = tourPagination.value;
    if (value)
      url.searchParams.set("page", value);
    else
      url.searchParams.delete("page");

    window.location.href = url.href;
  })
  if (url.searchParams.get("page"))
    tourPagination.value = url.searchParams.get("page");
}
// End Pagination

// Tour Trash Check All
const tourTrashCheckAll = document.querySelector(".tour-trash-check-all");
if (tourTrashCheckAll) {
  tourTrashCheckAll.addEventListener("change", () => {
    const itemCheckedList = document.querySelectorAll("[item-check]");
    for (const item of itemCheckedList) {
      item.checked = tourTrashCheckAll.checked;
    }
  })
}
// End Tour Trash Check All

// Tour Trash Apply Multi
const tourTrashApplyButton = document.querySelector(".tour-trash-apply-multi-button");
if (tourTrashApplyButton) {
  tourTrashApplyButton.addEventListener("click", () => {
    const tourTrashApply = document.querySelector(".tour-trash-apply-multi");
    const status = tourTrashApply.value;
    const itemCheck = document.querySelectorAll("[item-check]:checked");
    const idList = [];
    for (const item of itemCheck)
      idList.push(item.getAttribute("item-check"));
    const api = tourTrashApplyButton.getAttribute("data-api");
    if (status && idList.length) {
      if (status == "recovery") {
        fetch(api, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(idList)
        })
          .then(res => res.json())
          .then((data) => {
            if (data.code == "error")
              alert(data.message);
            if (data.code == "success")
              window.location.reload();
          })
      }
      if (status == "hard-delete") {
        fetch(api, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(idList)
        })
          .then(res => res.json())
          .then((data) => {
            if (data.code == "error")
              alert(data.message);
            if (data.code == "success")
              window.location.reload();
          })
      }
    }
    else
      alert("Vui lòng lựa chọn Tour hoặc Trạng thái cần áp dụng!");
  })
}
// End Tour Trash Apply Multi

// Tour Trash Search
const tourTrashSearch = document.querySelector(".tour-trash-search");
if (tourTrashSearch) {
  const url = new URL(window.location.href);
  tourTrashSearch.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const input = tourTrashSearch.querySelector("input");
      const value = input.value;
      if (value)
        url.searchParams.set("search", value);
      else url.searchParams.delete("search");

      window.location.href = url.href;
    }
  })

  if (url.searchParams.get("search")) {
    const input = tourTrashSearch.querySelector("input");
    input.value = url.searchParams.get("search");
  }
}
// End Tour Trash Search

// Tour Trash Pagination
const tourTrashPagination = document.querySelector(".tour-trash-pagination");
if (tourTrashPagination) {
  const url = new URL(window.location.href);
  tourTrashPagination.addEventListener("change", () => {
    const value = tourTrashPagination.value;
    if (value)
      url.searchParams.set("page", value);
    else url.searchParams.delete("page");
    window.location.href = url.href;
  })

  if (url.searchParams.get("page"))
    tourTrashPagination.value = url.searchParams.get("page");
}
// End Tour Trash Pagination

// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
  const validation = new JustValidate('#order-edit-form');

  validation
    .addField('#fullName', [
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
    .addField('#phone', [
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
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;

      console.log(fullName);
      console.log(phone);
      console.log(note);
      console.log(paymentMethod);
      console.log(paymentStatus);
      console.log(status);
    })
    ;
}
// End Order Edit Form

// Setting Website Info Form
const settingWebsiteInfoForm = document.querySelector("#setting-website-info-form");
if (settingWebsiteInfoForm) {
  const validation = new JustValidate('#setting-website-info-form');

  validation
    .addField('#websiteName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên website!'
      },
    ])
    .addField('#email', [
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if (logos.length > 0) {
        logo = logos[0].file;
      }
      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if (favicons.length > 0) {
        favicon = favicons[0].file;
      }

      const formData = new FormData();
      formData.append("websiteName", websiteName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("logo", logo);
      formData.append("favicon", favicon);
      fetch(`/${pathAdmin}/setting/website-info`, {
        method: "PATCH",
        body: formData
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
// End Setting Website Info Form

// Admin Account Status Filter
const adminAccountStatusFilter = document.querySelector("[admin-account-status-filter]");
if (adminAccountStatusFilter) {
  const url = new URL(window.location.href);
  adminAccountStatusFilter.addEventListener("change", () => {
    const value = adminAccountStatusFilter.value;
    if (value)
      url.searchParams.set("status", value);
    else url.searchParams.delete("status");

    window.location.href = url.href;
  })

  if (url.searchParams.get("status"))
    adminAccountStatusFilter.value = url.searchParams.get("status");
}
// End Admin Account Status Filter

// Admin Account Date Filter
const adminAccountStartDateFilter = document.querySelector("[admin-account-start-date-filter]");
if (adminAccountStartDateFilter) {
  const url = new URL(window.location.href);
  adminAccountStartDateFilter.addEventListener("change", () => {
    const value = adminAccountStartDateFilter.value;
    if (value)
      url.searchParams.set("startDate", value);
    else url.searchParams.delete("startDate");

    window.location.href = url.href;
  })

  if (url.searchParams.get("startDate"))
    adminAccountStartDateFilter.value = url.searchParams.get("startDate")
}

const adminAccountEndDateFilter = document.querySelector("[admin-account-end-date-filter]");
if (adminAccountEndDateFilter) {
  const url = new URL(window.location.href);
  adminAccountEndDateFilter.addEventListener("change", () => {
    const value = adminAccountEndDateFilter.value;
    if (value)
      url.searchParams.set("endDate", value);
    else url.searchParams.delete("endDate");

    window.location.href = url.href;
  })

  if (url.searchParams.get("endDate"))
    adminAccountEndDateFilter.value = url.searchParams.get("endDate")
}
// End Admin Account Date Filter

// Admin Account Role Filter
const adminAccountRoleFilter = document.querySelector("[admin-account-role-filter]");
if (adminAccountRoleFilter) {
  const url = new URL(window.location.href);
  adminAccountRoleFilter.addEventListener("change", () => {
    const value = adminAccountRoleFilter.value;
    if (value)
      url.searchParams.set("role", value);
    else url.searchParams.delete("role");

    window.location.href = url.href;
  })

  if (url.searchParams.get("role"))
    adminAccountRoleFilter.value = url.searchParams.get("role")
}
// End Admin Account Role Filter

// Admin Account Delete Filter
const adminAccountDeleteFilter = document.querySelector("[admin-account-delete-filter]");
if (adminAccountDeleteFilter) {
  const url = new URL(window.location.href);
  adminAccountDeleteFilter.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  })
}
// End Admin Account Delete Filter

// Admin Account Check All
const adminAccountCheckAll = document.querySelector("[admin-account-checkall]");
if (adminAccountCheckAll) {
  adminAccountCheckAll.addEventListener("click", () => {
    const adminAccountCheckItem = document.querySelectorAll("[admin-account-checkall-item]");
    for (const item of adminAccountCheckItem) {
      item.checked = adminAccountCheckAll.checked;
    }
  })
}
// End Admin Account Check All

// Admin Account Multiple Apply
const adminAccountMultipleApply = document.querySelector("[admin-account-multi-apply-button]");
if (adminAccountMultipleApply)
{
  adminAccountMultipleApply.addEventListener("click", () => {
    const statusSelect = document.querySelector("[admin-account-multi-apply-status]");
    const status = statusSelect.value;

    const idList = [];
    const itemList = document.querySelectorAll("[admin-account-checkall-item]:checked");
    for (const item of itemList)
    {
      idList.push(item.getAttribute("admin-account-checkall-item"));
    }

    if (status && idList.length > 0)
    {
      const finalData = {
        status: status,
        idList: idList
      };

      fetch(`/${pathAdmin}/setting/account-admin/multi-apply`, {
        method: "PATCH",
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
    }
    else
    alert("Vui lòng chọn Tài khoản quản trị hoặc Trạng thái cần áp dụng!");
  })
}
// End Admin Account Multiple Apply

// Admin Account Search
const adminAccountSearch = document.querySelector("[admin-account-search]");
if (adminAccountSearch)
{
  const input = adminAccountSearch.querySelector("input");
  const url = new URL(window.location.href);
  input.addEventListener("keyup", (event) => {
    if (event.code == "Enter")
    {
      const value = input.value;
      if (value)
        url.searchParams.set("search", value);
      else url.searchParams.delete("search");

      window.location.href = url.href;
    }
  })
  if (url.searchParams.get("search"))
  {
    const input = adminAccountSearch.querySelector("input");
    input.value = url.searchParams.get("search");
  }
}
// End Admin Account Search

// Admin Account Pagination
const adminAccountPagination = document.querySelector("[admin-account-pagination]");
if (adminAccountPagination)
{
  const url = new URL(window.location.href);
  adminAccountPagination.addEventListener("change", () => {
    const value = adminAccountPagination.value;
    if (value)
      url.searchParams.set("page", value);
    else url.searchParams.delete("page");

    window.location.href = url.href;
  })

  if (url.searchParams.get("page"))
    adminAccountPagination.value = url.searchParams.get("page");
}
// End Admin Account Pagination

// Setting Account Admin Create Form
const settingAccountAdminCreateForm = document.querySelector("#setting-account-admin-create-form");
if (settingAccountAdminCreateForm) {
  const validation = new JustValidate('#setting-account-admin-create-form');

  validation
    .addField('#fullName', [
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
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
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
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập chức vụ!'
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!',
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('role', role);
      formData.append('positionCompany', positionCompany);
      formData.append('status', status);
      formData.append('password', password);
      formData.append('avatar', avatar);

      fetch(`/${pathAdmin}/setting/account-admin/create`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.href = `/${pathAdmin}/setting/account-admin/list`;
        })

    })
    ;
}
// End Setting Account Admin Create Form

// Setting Account Admin Edit Form
const settingAccountAdminEditForm = document.querySelector("#setting-account-admin-edit-form");
if (settingAccountAdminEditForm) {
  const validation = new JustValidate('#setting-account-admin-edit-form');

  validation
    .addField('#fullName', [
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
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
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
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập chức vụ!'
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('role', role);
      formData.append('positionCompany', positionCompany);
      formData.append('status', status);
      formData.append('password', password);
      formData.append('avatar', avatar);

      fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
        method: "PATCH",
        body: formData
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
// End Setting Account Admin Edit Form

// Setting Role Create Form
const settingRoleCreateForm = document.querySelector("#setting-role-create-form");
if (settingRoleCreateForm) {
  const validation = new JustValidate('#setting-role-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      const finalData = {
        name: name,
        description: description,
        permissions: permissions
      };

      fetch(`/${pathAdmin}/setting/role/create`, {
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
            window.location.href = `/${pathAdmin}/setting/role/list`;
        })
    })
    ;
}
// End Setting Role Create Form

// Role Edit
const settingRoleEditForm = document.querySelector("#setting-role-edit-form");
if (settingRoleEditForm) {
  const validation = new JustValidate('#setting-role-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];
      const id = event.target.id.value;

      // permissions
      const listElementPermission = settingRoleEditForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      const finalData = {
        name: name,
        description: description,
        permissions: permissions
      };

      fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
        method: "PATCH",
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
// End Role Edit

// Role Check All
const roleCheckAll = document.querySelector("[role-check-all]");
if (roleCheckAll) {
  roleCheckAll.addEventListener("click", () => {
    const roleListCheckBox = document.querySelectorAll("[item-check-all]");
    roleListCheckBox.forEach((item) => {
      item.checked = roleCheckAll.checked;
    })
  })
}
// End Role Check All

// Role Multiple Apply
const roleApplyButton = document.querySelector("[role-apply-button]");
if (roleApplyButton) {
  roleApplyButton.addEventListener("click", () => {
    const select = document.querySelector("[role-status-apply]");
    const status = select.value;

    const roleListCheckBox = document.querySelectorAll("[item-check-all]:checked");
    const roleList = [];
    for (const item of roleListCheckBox) {
      roleList.push(item.getAttribute("item-check-all"));
    }

    if (status && roleListCheckBox.length) {
      const finalData = {
        roleList: roleList,
        status: status
      }
      fetch(`/${pathAdmin}/setting/role/apply-multi`, {
        method: "DELETE",
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
    }
    else alert("Vui lòng chọn Trạng thái hoặc Nhóm quyền cần áp dụng!");
  })
}
// End Role Multiple Apply

// Role Search
const roleSearch = document.querySelector("[role-search]")
if (roleSearch) {
  const url = new URL(window.location.href);
  roleSearch.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const input = roleSearch.querySelector("input");
      const value = input.value;

      if (value)
        url.searchParams.set("search", value);
      else url.searchParams.delete("search");

      window.location.href = url.href;
    }
  })
  if (url.searchParams.get("search")) {
    const input = roleSearch.querySelector("input");
    input.value = url.searchParams.get("search");
  }
}
// End Role Search

// Role Delete
const roleDeleteButtonList = document.querySelectorAll("[role-delete]");
if (roleDeleteButtonList) {
  roleDeleteButtonList.forEach((button) => {
    button.addEventListener("click", () => {
      const api = button.getAttribute("data-api");
      fetch(api, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.reload();
        })
    })
  })
}
// End Role Delete

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validation = new JustValidate('#profile-edit-form');

  validation
    .addField('#fullName', [
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
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
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
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("avatar", avatar);

      fetch(`/${pathAdmin}/profile/edit`, {
        method: "PATCH",
        body: formData
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
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector("#profile-change-password-form");
if (profileChangePasswordForm) {
  const validation = new JustValidate('#profile-change-password-form');

  validation
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!',
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .addField('#confirmPassword', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng xác nhận mật khẩu!',
      },
      {
        validator: (value, fields) => {
          const password = fields['#password'].elem.value;
          return value == password;
        },
        errorMessage: 'Mật khẩu xác nhận không khớp!',
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      const finalData = {
        password: password
      }

      fetch(`/${pathAdmin}/profile/change-password`, {
        method: "PATCH",
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
            window.location.href = `/${pathAdmin}/profile/edit`;
        })
    })
    ;
}
// End Profile Change Password Form

// Xử lý Sider
const siderElement = document.querySelectorAll(".sider a");
const currentPath = window.location.pathname;
siderElement.forEach((item) => {
  if (item.getAttribute("href") === currentPath)
    item.classList.add("active");
  else item.classList.remove("active");
})
// End Xử lý Sider

// Đăng xuất (Logic: xóa token mà mình tạo được bên BE dùng JWT lib)
const logoutButton = document.querySelector(".sider .inner-logout");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    fetch(`/${pathAdmin}/account/logout`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          window.location.href = `/${pathAdmin}/account/login`
        }
      })
  })
}
// End Đăng xuất

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

// Contact Date Filter
const contactStartDate = document.querySelector("[contact-start-date]");
if (contactStartDate)
{
  const url = new URL(window.location.href);
  contactStartDate.addEventListener("change", () => {
    const value = contactStartDate.value;
    if (value)
      url.searchParams.set("startDate", value);
    else url.searchParams.delete("startDate");

    window.location.href = url.href;
  })

  if (url.searchParams.get("startDate"))
    contactStartDate.value = url.searchParams.get("startDate");
}

const contactEndDate = document.querySelector("[contact-end-date]");
if (contactEndDate)
{
  const url = new URL(window.location.href);
  contactEndDate.addEventListener("change", () => {
    const value = contactEndDate.value;
    if (value)
      url.searchParams.set("endDate", value);
    else url.searchParams.delete("endDate");

    window.location.href = url.href;
  })

  if (url.searchParams.get("endDate"))
    contactEndDate.value = url.searchParams.get("endDate");
}
// End Contact Date Filter

// Contact Remove Filter
const contactRemoveFilter = document.querySelector("[contact-remove-filter]");
if (contactRemoveFilter)
{
  const url = new URL(window.location.href);
  contactRemoveFilter.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  })
}
// End Contact Remove Filter

// Contact Check All
const contactCheckAll = document.querySelector("[contact-check-all]");
if (contactCheckAll)
{
  contactCheckAll.addEventListener("click", () => {
    const contactCheckAllItemList = document.querySelectorAll("[contact-check-all-item]");
    for (const item of contactCheckAllItemList)
    {
      item.checked = contactCheckAll.checked;
    }
  })
}
// End Contact Check All

// Contact Multiple Apply
const contactMultiApplyButton = document.querySelector("[contact-multiple-apply-button]");
if (contactMultiApplyButton)
{
  contactMultiApplyButton.addEventListener("click", () => {
    const select = document.querySelector("[contact-multiple-apply-select]");
    const status = select.value;

    const itemList = document.querySelectorAll("[contact-check-all-item]:checked");
    const idList = [];
    for (const item of itemList)
    {
      idList.push(item.getAttribute("contact-check-all-item"));
    }

    if (status && idList.length)
    {
      const finalData = {
        status: status,
        idList: idList
      };

      fetch(`/${pathAdmin}/contact/multi-apply`, {
        method: "PATCH",
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
    }
    else alert("Vui lòng chọn Mục hoặc Trạng thái cần áp dụng!");
  })
}
// End Contact Multiple Apply

// Contact Search
const contactSearch = document.querySelector("[contact-search]");
if (contactSearch)
{
  const url = new URL(window.location.href);
  contactSearch.addEventListener("keyup", (event) => {
    if (event.code == "Enter")
    {
      const value = contactSearch.value;
      if (value)
        url.searchParams.set("search", value);
      else url.searchParams.delete("search");

      window.location.href = url.href;
    }
  })

  if (url.searchParams.get("search"))
    contactSearch.value = url.searchParams.get("search");
}
// End Contact Search

// Contact Delete
const contactDeleteButtonList = document.querySelectorAll("[contact-delete]");
if (contactDeleteButtonList)
{
  for (const item of contactDeleteButtonList)
  {
    item.addEventListener("click", () => {
      const api = item.getAttribute("data-api");
      fetch(api, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.reload();
        })
    })
  }
}
// End Contact Delete

// Contact Pagination
const contactPagination = document.querySelector("[contact-pagination]");
if (contactPagination)
{
  const url = new URL(window.location.href);
  contactPagination.addEventListener("change", () => {
    const value = contactPagination.value;
    if (value)
      url.searchParams.set("page", value);
    else url.searchParams.delete("page");

    window.location.href = url.href;
  })

  if (url.searchParams.get("page"))
    contactPagination.value = url.searchParams.get("page");
}
// End Contact Pagination

// Contact Trash Multiple Apply
const contactTrashApplyMultiButton = document.querySelector(".contact-trash-apply-multi-button")
if (contactTrashApplyMultiButton)
{
  const button = contactTrashApplyMultiButton.querySelector("button");
  button.addEventListener("click", () => {
    const select = document.querySelector(".contact-trash-apply-multi");  
    const status = select.value;

    const idList = [];
    const contactTrashCheckAllItemList = document.querySelectorAll("[contact-check-all-item]:checked");
    for (const item of contactTrashCheckAllItemList)
      idList.push(item.getAttribute("contact-check-all-item"));

    if (idList.length && status)
    {
      const finalData = {
        status: status,
        idList: idList
      };

      fetch(`/${pathAdmin}/contact/trash/multi-apply`, {
        method: "PATCH",
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
    }
    else alert("Vui lòng chọn Mục hoặc Trạng thái cần áp dụng!");
  })
}
// End Contact Trash Multiple Apply

// Contact Trash Search
const contactTrashSearch = document.querySelector(".contact-trash-search");
if (contactTrashSearch)
{
  const url = new URL(window.location.href);
  contactTrashSearch.addEventListener("keyup", (event) => {
    if (event.code == "Enter")
    {
      const value = contactTrashSearch.value;
      if (value)
        url.searchParams.set("search", value);
      else url.searchParams.delete("search");

      window.location.href = url.href;
    }
  })

  if (url.searchParams.get("search"))
    contactTrashSearch.value = url.searchParams.get("search");
}
// End Contact Trash Search

// Contact Trash Recovery
const contactTrashRecoveryList = document.querySelectorAll("[recovery-contact-button]");
if (contactTrashRecoveryList)
{
  for (const button of contactTrashRecoveryList)
  {
    button.addEventListener("click", () => {
      const api = button.getAttribute("data-api");

      fetch(api, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.reload();
        })
    })
  }
}
// End Contact Trash Recovery

// Contact Trash Hard Delete
const contactTrashHardDeleteList = document.querySelectorAll("[hard-delete-contact-button]");
if (contactTrashHardDeleteList)
{
  for (const button of contactTrashHardDeleteList)
  {
    button.addEventListener("click", () => {
      const api = button.getAttribute("data-api");

      fetch(api, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
            alert(data.message);
          if (data.code == "success")
            window.location.reload();
        })
    })
  }
}
// End Contact Trash Hard Delete

// Contact Trash Pagination
const contactTrashPagination = document.querySelector("[contact-trash-pagination]");
if (contactTrashPagination)
{
  const url = new URL(window.location.href);
  contactTrashPagination.addEventListener("change", () => {
    const value = contactTrashPagination.value;
    if (value)
      url.searchParams.set("page", value);
    else url.searchParams.delete("page");

    window.location.href = url.href;
  })

  if (url.searchParams.get("page"))
    contactTrashPagination.value = url.searchParams.get("page");
}
// End Contact Trash Pagination
let itemsList = [];
const form = document.querySelector('.js-add-form'),
formFilter = document.querySelector('.js-filter-form'),
wrapper = document.querySelector('.js-block-result'),
searchField = document.querySelector('.js-task-search'),
statusField = document.querySelector('.js-filter-status'),
priorityField = document.querySelector('.js-filter-priority'),
resetButton = document.querySelector('.js-button-reset'),
cancelButton = document.querySelector('.js-button-cancel');

(() => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formObject = {},
    formData = new FormData(form);
    formData.append('id', Math.round(Date.now() + Math.random()));
    formData.append('active', 'open');
    formData.append('show', true);
    formData.forEach((value, key) => {formObject[key] = value});
    let elementId = form.querySelectorAll('[name = id]')[0].value;
    if(elementId){
      let element = itemsList.find(item => item.id === elementId);
      let index = itemsList.indexOf(element);
      itemsList[index] = formObject;
    } else {
      itemsList.push(formObject);
    }
    renderList();
    resetForms();
    return false;
  });
})();

const filterItem = (value, name) => {
  itemsList.map(item => {
    const searchStatus = item.title.includes(searchField.value.toLowerCase()),
    statusStatus = item.active === statusField.value || statusField.value == 'allStatus',
    priorityStatus = item.priority === priorityField.value || priorityField.value == 'allPriority';
    item.show = searchStatus && statusStatus && priorityStatus;
    return item;
  });
  renderList();
}

const renderList = () => {
  wrapper.innerHTML = '';
  itemsList.map(item => item.show && renderTask(item));
  removeButtons = document.querySelectorAll('.js-item-delete'),
  statusButtons = document.querySelectorAll('.js-item-status'),
  editButtons = document.querySelectorAll('.js-item-edit'),
  removeButtons.forEach(item => item.addEventListener('click', ({target}) => changeItem(target.closest('.item').id, target.name)));
  statusButtons.forEach(item => item.addEventListener('click', ({target}) => changeItem(target.closest('.item').id, target.name)));
  editButtons.forEach(item => item.addEventListener('click', ({target}) => changeItem(target.closest('.item').id, target.name)));
  if(!wrapper.children.length) wrapper.innerHTML = '<h3>Is empty</h3>';
  localStorage.setItem('itemsList', itemsList);
  console.log(itemsList);
  console.log('www222');
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

const changeItem = (id, name) => {
  let element = itemsList.find(item => item.id === id);
  name === 'delete'
  ? itemsList.splice(itemsList.indexOf(element), 1)
  : name === 'done'
  ? element.active = element.active === 'open' ? 'close' : 'open'
  : Object.keys(element).forEach((key) => {
      let field = form.querySelectorAll(`[name = ${key}]`)[0];
      if(field) field.value = element[key]
    });
  renderList();
}

const renderTask = (item) => {
  let block = document.createElement('div');
  let content = `
    <span class="item-header"></span>
    <p class="item-title">${item.title}</p>
    <p class="item-description">${item.description}</p>
    <div class="item-info">
      <p class="item-priority">${item.priority} priority</p>
      <div class="item-block">
        <button class="js-item-status" type="button" name="done"><i class="fa ${item.active === 'open' ? `fa-check` : `fa-times` }"></i></a>
        <button class="js-item-edit" type="button" name="edit"><i class="fa fa-pencil"></i></a>
        <button class="js-item-delete" type="button" name="delete"><i class="fa fa-trash"></i></a>
      </div>
    </div>
  `
  block.innerHTML = content;
  block.classList.add("item");
  block.setAttribute('id', item.id);
  if (item.active !== 'open') block.classList.add("close");
  wrapper.appendChild(block);
}

const resetForms = () => {
  form.reset();
  formFilter.reset();
  itemsList.forEach(item => item.show = true);
  renderList();
}

cancelButton.addEventListener('click', () => resetForms());
resetButton.addEventListener('click', () => resetForms());
searchField.addEventListener('keyup', ({target}) => filterItem(target.value, target.name));
statusField.addEventListener('change', ({target}) => filterItem(target.value, target.name));
priorityField.addEventListener('change', ({target}) => filterItem(target.value, target.name));

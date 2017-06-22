В статье я попытаюсь описать табличную разметку. Посмотрим, есть ли у неё альтернативы. Попытаюсь дать пример моей таблицы и разметки и общие моменты.

# Оригинальная HTML4 таблица

Когда появилась необходимость в HTML разметке показывать таблицы - изобрели тег `<table>`.
Что же даёт нам [таблица](http://caniuse.com/#feat=css-table) в браузере?
Вот несколько основных "фич":

- Если мы не указали ширину таблицы/столбцов, то ширина таблицы [подстраивается и растягивается](https://codepen.io/volodalexey/pen/bRqEEG), чтобы вместить содержимое любого из столбцов.

- Если мы указали ширину таблицы, и если указанная ширина больше чем содержимое, тогда содержимое растягивается. Самое интересное [как растягивается содержимое](https://codepen.io/volodalexey/pen/weJGWd).<br />
В данном случае вычисляется процентное соотношение каждого столбца к общей ширине и каждый столбец растягивается соответственно процентному соотношению.<br />
В [первом примере](https://codepen.io/volodalexey/pen/bRqEEG) ширина всей таблицы (примерно) = `387px`, колонки `Company` = `206px`, колонки `Contact` = `115px`.<br />
В процентах `Company` = `206px/387px * 100% = 53%`, `Contact` = `115px/387px * 100% = 30%`.<br />
Теперь когда [содержимое таблицы растянулось](https://codepen.io/volodalexey/pen/bRqEEG), ширина всей таблицы (примерно на моем экране) = `1836px`, колонки `Company` = `982px`, колонки `Contact` = `551px`.<br />
В процентах `Company` = `982px/1836px * 100% = 53%`, `Contact` = `551px/1836px * 100% = 30%`.<br />

- Если мы указали ширину таблицы и если указанная ширина меньше чем содержимое, тогда таблица сужается. Но сужается [до минимально возможной ширины содержимого](https://codepen.io/volodalexey/pen/qjrZNz).<br />
Можно "дожать" [таблицу](https://codepen.io/volodalexey/pen/KqWzgQ) указав ей CSS свойство `table-layout: fixed`. [Описание](https://www.w3.org/TR/html4/appendix/notes.html#h-B.5.2.1) к свойству.<br />
Так мы ломаем автоподстройку ширины таблицы и теперь таблица слушается заданных ширин для каждого столбца (или всей таблицы), но зато таблица точно вписывается в указанную ширину.<br />
Если мы не указали ширину столбцов, тогда при ["сломанной" таблице](https://codepen.io/volodalexey/pen/QgpNOm), `ширина каждого столбца = вся ширина / количество столбцов`.<br />

- Схлопывание (наложение) границ ячеек/столбцов `border-collapse: collapse`, если мы указали границы для ячеек. Т.е. в [местах соприкосновения ячеек](https://codepen.io/volodalexey/pen/MopJyM), не будет двойных граничных линий.

- Группировка шапки. Реализуется атрибутами `colspan`, `rowspan`.

## Использование оригинальной таблицы

Во всех вышеприведенный примерах в разметке таблицы я использовал сокращенную разметку:
```html
<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>1.1</td>
    <td>1.2</td>
  </tr>
  <tr>
    <td>2.1</td>
    <td>2.2</td>
  </tr>
</table>
```
Однако можно использовать "каноничную" разметку:
```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.1</td>
      <td>1.2</td>
    </tr>
    <tr>
      <td>2.1</td>
      <td>2.2</td>
    </tr>
  </tbody>
</table>
```
Если нам надо таблицу без шапки, но в то же время нам надо контроллировать ширину столбцов:
```html
<table>
  <tbody>
    <colgroup>
      <col width="100px"></col>
      <col width="150px"></col>
    </colgroup>
    <tr>
      <td>1.1</td>
      <td>1.2</td>
    </tr>
    <tr>
      <td>2.1</td>
      <td>2.2</td>
    </tr>
  </tbody>
</table>
```

Чаще всего нам в разметке необходимо получить следующее.<br />
У нас есть некий контейнер с заданной шириной или с заданной максимальной шириной. Внутри него мы хотим показывать/вписать таблицу, если ширина таблицы больше чем контейнер, тогда надо показывать скролл для контейнера. Если ширина таблицы меньше чем контейнер, тогда надо расширять таблицу до ширины контейнера.<br />
Но ни в коем случае мы не хотим, чтобы таблица сделала наш контейнер шире чем мы задали.<br />
По этой [ссылке](https://codepen.io/volodalexey/pen/NgpNzY) можно уведеть контейнер с таблицей в действии.
Если мы будем сужать контейнер, то в тот момент, когда таблица уже больше не сможет сужаться - появиться скролл.

## Подстройка таблицы

### Задание ширины таблицы и столбцов

Первая дилемма с которой сталкиваются фронт-энд разработчики - это задавать или не задавать ширину столбцов.<br />
Если не задавать, тогда ширина каждого столбца будет вычисляться в зависимости от содержимого.<br />
Исходя из логики, можно понять, что в этом случае браузеру нужно два прохода. На первом он просто отображает все в таблице, подсчитывает ширину столбцов (мин, макс). На втором подстраивает ширину столбцов в зависимости от ширины таблицы.<br />
Со временем вам скажут что таблица выглядит некрасиво, т.к. один из столбцов слишком широкий и `"вот в этом столбце нам надо показать больше текста чем в этом, а у нас наоборот"`.<br />
И самая распространенная "фича":

- это сокращение текста в ячейке с помощью `...`.<br />
Т.е. если текст в ячейке вылазит за ширину колонки, то его надо сокращать и в конце добавлять `...`.<br />
Первое разочарование, что если не задавать ширину столбцов, то сокращение не работает.<br />
В этом есть своя логика, т.к. на первом проходе браузер высчитывает мин/макс ширину колонки без сокращения, а тут мы пытаемся сократить текст. Значит надо либо все пересчитать обратно, либо "не слушаться".<br />
Сокращение реализуется просто, надо указать CSS свойства для ячейки:
```css
td {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```
И соответственно задать ширину колонки. По этой [ссылке](https://codepen.io/volodalexey/pen/gRmLzW) можно увидеть, что все настроено, но сокращение не работает.<br />
В спецификации есть [заметка](https://www.w3.org/TR/html4/struct/tables.html#column-width), немного объясняющая, почему сокращение не работает:<br />
`If column widths prove to be too narrow for the contents of a particular table cell, user agents may choose to reflow the table`.<br />
Опять же сужаться таблица будет до минимальной ширины содержимого. Но если применить свойство `table-layout: fixed` то таблица [начнёт "слушаться"](https://codepen.io/volodalexey/pen/eRWNOV) и сокращение заработает.<br />
Но автоподстройка ширины столбцов уже не работает.

### Задание прокрутки таблицы

Вышеприведенный пример будет работать со скроллом и пользоваться этим можно, однако возникает следующее требование `"здесь нам надо сделать, чтобы шапка таблицы оставась на месте, а тело прокручивалось"`.<br />
Вторая дилемма с которой сталкиваются фронт-энд разработчики:

- задание прокрутки/скролла в таблице.<br />
В спецификации таблицы есть [прямое указание](https://www.w3.org/TR/html4/struct/tables.html), что тело таблицы может быть с шапкой и подвалом. Т.е. шапка и подвал всегда видимы.<br />
`User agents may exploit the head/body/foot division to support scrolling of body sections independently of the head and foot sections. When long tables are printed, the head and foot information may be repeated on each page that contains table data`<br />
А есть и указание о том, что тело таблицы можно скроллить, а шапка и подвал будут оставаться на месте:<br />
`Table rows may be grouped into a table head, table foot, and one or more table body sections, using the THEAD, TFOOT and TBODY elements, respectively. This division enables user agents to support scrolling of table bodies independently of the table head and foot`<br />
А по факту браузеры этого не делают и скролл для таблицы надо придумывать/настраивать вручную.<br />
Есть много способов это сделать, но все они сводяться к тому, что:

- мы не создаем дополнительную разметку и пытаемся прикрутить скролл к тому что есть (к телу таблицы, или оборачиваем в контейнер, а значение ячеек в шапке [делаем абсолютно позиционированным](https://jsfiddle.net/dPixie/byB9d/3/))

Можно задать ограниченную высоту телу таблицы. Предполагая высоту родительского контейнера [попробовать можно](https://codepen.io/volodalexey/pen/dRWoQY).<br />
В результате мы ломаем табличное отображение тела таблицы `display: block`, а также нам необходимо синхронизировать прокрутку шапки с телом таблицы.

- мы создаеём дополнительную разметку (составные таблицы) и тогда при прокрутке оригинала мы синхронизируем дополнительную разметку

Этот вариант, где все [предлагают/строят](https://stackoverflow.com/questions/673153/html-table-with-fixed-headers) решения.

# Примеры составных таблиц

Если нам необходима прокрутка тела таблицы, то без составных разметок не обойтись.<br />
Все примеры составных таблиц используют свои пользовательские разметки.<br />
Одна из самых известных таблиц [Data Tables](https://datatables.net/examples/basic_init/scroll_xy.html) использует следующую разметку:
```html
<div class="dataTables_scroll">
  <div class="dataTables_scrollHead">
    <div class="dataTables_scrollHeadInner">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
  <div class="dataTables_scrollBody">
    <table>
      <thead>
        <tr>
          <th><div class="dataTables_sizing"></div></th>
          <th><div class="dataTables_sizing"></div></th>
          <th><div class="dataTables_sizing"></div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```
Я намеренно сокращаю разметку, чтобы можно было составить общую картину, как выглядит разметка.<br />
Мы видим в разметке две таблицы, хотя для пользователя это "видится" как одна.<br />
Следующий пример [React Bootstrap Table](http://allenfang.github.io/react-bootstrap-table/example.html#basic) если посмотреть в разметку использует тоже две таблицы:
```html
<div class="react-bs-table-container">
  <div class="react-bs-table">
    <div class="react-bs-container-header table-header-wrapper">
      <table class="table table-hover table-bordered">
        <colgroup><col class=""><col class=""><col class=""></colgroup>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="react-bs-container-body">
      <table class="table table-bordered">
        <colgroup><col class=""><col class=""><col class=""></colgroup>
        <tbody>
          <tr class="">
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```
Верхняя таблица отображает заголовок, нижняя - тело. Хотя для пользователя кажется как будто бы это одна таблица.<br />
Опять же пример использует синхронизацию прокрутки, если прокрутить тело таблицы, то произойдет синхронизация заголовка.<br />
А как же получается, что тело таблицы (одна таблица, допустим с данными, подстроенная под эти данные) подстраивается под ширину контейнера, а шапка (другая таблица) подстраивается тоже и они никак не разъезжаются по ширине и совпадают друг с другом?<br />
Тут кто как умеет так и синхронизирует, к примеру вот [функция синхронизации ширины](https://github.com/AllenFang/react-bootstrap-table/blob/a1cd5af3db102214d5e5ed3d959abcbb9489c7b3/src/BootstrapTable.js#L1300) из вышеприведенной библиотеки:
```jsx harmony
componentDidUpdate() {
  ...
  this._adjustHeaderWidth();
  ...
}

_adjustHeaderWidth() {
    ...
    // берем ширину столбцов из тела таблицы если есть хоть один ряд, или берем ширину <col> из тела таблицы
    // и присваиваем шапке полученные размеры
  }
```
Получается вполне логичный вопрос, а зачем тогда вообще использовать тег `<table>`, если собственно из таблицы используется только автоподстройка ширины таблицы?<br />
И тут мы окажемся не первыми и некоторые вообще не используют табличную разметку.<br />
Например [Fixed Data Table](https://facebook.github.io/fixed-data-table/example-object-data.html) или [React Table](https://react-table.js.org/#/story/simple-table).<br />
Разметка в примерах примерно такая:
```html
<div class="table">
  <div class="header">
    <div class="row">
      <div class="cell"></div>
      <div class="cell"></div>
    </div>
  </div>
  <div class="body">
    <div class="row">
      <div class="cell"></div>
      <div class="cell"></div>        
    </div>
  </div>
</div>
```
Отсюда название `fixed table`, т.е. для такой разметки мы должны заранее указать ширину всех столбцов (ширину таблицы, высоту строки).<br />
Хотя если мы хотим сокращение текста, нам все равно надо задавать ширину столбцов, даже в обычной таблице.<br />

Следующая таблица [Reactabular](https://reactabular.js.org/#/easy) использует интересный подход в синхронизации.<br />
Автор пошел дальше и сделал прокручиваемыми не только тело, но и шапку таблицы, в браузерах которые показывают ползунок скролла - выглядит ужасно, зато в `touch` браузерах очень классно и функционально.<br />
Если мы скроллим тело таблицы, то происходит синхронизация шапки, а если мы скроллим шапку, то происходит синхронизация тела.<br />

А как же сделать автоподстройку ширины колонки в составной таблице спросите вы?<br />
Опять же способы есть разные, наиболее интересный использует дополнительный проход браузера.<br />
Например в этой таблице [ag Grid](https://www.ag-grid.com/example.php) можно автоматически рассчитать подходящую ширину столбца.<br />
В [коде есть функция автоподстройки ширины колонки](https://github.com/ceolter/ag-grid/blob/bbf11d41d23fffa77dd4d0cd01d72facc77398eb/src/ts/rendering/autoWidthCalculator.ts#L31):
```typescript
public getPreferredWidthForColumn(column: Column): number {
  // создать <span style="position: fixed;">
  // добавить в него все ячейки столбца
  // вычислить ширину span (вычисляет браузер)
  // удаляем <span style="position: fixed;">
}
```

# Реализация собственной таблицы

Получается, что составная таблица требует дополнительной синхронизации между частями, чтобы для пользователя все вместе казалось как одна таблица.<br />
Все составные таблицы (и моя будущая тоже) страдают одним недостающим фактором, у них нет стандарта (и это логично, т.к. отказались от HTML4 таблицы), как их кастомизировать.<br /> 
Когда ты начинаешь учить одну составную таблицу, потом начинаешь тратить время на её кастомизацию.<br />
Затем для другого проекта учишь другую таблицу (например при переходе с Angular1 на React, или с jQuery на Vue) и кастомизация совсем другая.<br />
Логичный вопрос, а стоит ли потраченное время того? Стоит ли учить снова и снова связку фреймворк-таблица?<br />
Может легче усвоить для себя базовые моменты составной таблицы и тогда вы сможете делать свою таблицу на любом фреймворке (Angular/React/Vue/будущее...)?<br />
Т.е. на свою таблицу вы будете тратить 2 дня на старт, зато потом в течении 30 мин кастомизировать, или взять готовую за 30 мин и потом кастомизировать каждую фичу за 1 день.

К премеру я покажу как сделать свою составную таблицу на React (остались наработки с прошлого проекта, но есть наработки и на VanillaJS).<br />
Таблица будет:
- составной, синхронизировать шапку в зависимости от тела таблицы
- подстраивать свою ширину если она меньше ширины контейнера

## Разметка 

Для разметки будем использовать `div` элементы, и для ячеек тоже. Если использовать `display: inline-block` для ячеек, тогда будет следующая разметка: 
```html
<div class="row">
  <div class="cell" style="width: 40px; display: inline-block;"></div>
  <div class="cell" style="width: 40px; display: inline-block;"></div>
</div>
```
Но есть одна проблема, т.к. браузер (не все) интерпретирует пустые места между ячейками как текстовые ноды.<br />
Есть [отличная статья](https://css-tricks.com/fighting-the-space-between-inline-block-elements/), как с этим бороться.<br />
И если мы используем шаблонизатор (EJS, JSX, Angular, Vue), то это легко решить:
```html
<div class="row">
  <div class="cell" style="width: 40px;">{value}</div><div class="cell" style="width: 40px;">{value}</div>
</div>
```
Однако уже 2017 год, [flexbox](https://caniuse.com/#feat=flexbox) давно поддерживается, я делал на нем проекты еще в 2014 для IE11.<br />
А сегодня можно вообще не стесняться его. Это упростит нам задачу, можно будет делать столько пустых нод, сколько хочеться:
```html
<div class="row" style="display: flex; flex-direction: row;">
  <div class="cell" style="width: 40px; flex: 0 0 auto;">{value}</div>
  <!-- дальше пустое место -->
  
  <div class="cell" style="width: 40px; flex: 0 0 auto;">{value}</div>
</div>
```

## Общие моменты использования

Таблица должна отлично встраиваться в [Redux](http://redux.js.org/docs/introduction/) архитектуру, примеры таких таблиц предалагают подключать свои `reducers`.<br />
Мне этот подход не нравиться, по моему мнению разработчик должен контроллировать процесс сортировки, фильтрации.<br />
Это требует дополнительного кода. Вместо обычного черного ящика, который потом сложно кастомизировать:
```jsx harmony
render() {
  return (
    <div>
      <Table filter={...} data={...} columns={...} format={...} etc={...} />
    </div>
  )
}
```
Разработчик должен будет писать:
```jsx harmony
render() {
  const 
    descriptions = getColumnDescriptions(this.getTableColumns()),
    filteredData = filterBy([], []),
    sortedData = sortBy(filteredData, []);
  return (
    <div>
      <TableHeader descriptions={descriptions} />
      <TableBody data={sortedData} descriptions={descriptions} keyField={"Id"} />
    </div>
  )
}
```
Разработчик должен сам прописывать шаги: вычислить описание колонок, отфильтровать, отсортировать.<br />
Все функции/конструкторы `getColumnDescriptions, filterBy, sortBy, TableHeader, TableBody, TableColumn` будут импортироваться из моей таблицы.<br />
В качестве данных будет использоваться массив объектов:
```javascript
[
  { "Company": "Alfreds Futterkiste", "Cost": "0.25632" },
  { "Company": "Francisco Chang", "Cost": "44.5347645745" },
  { "Company": "Ernst Handel", "Cost": "100.0" },
  { "Company": "Roland Mendel", "Cost": "0.456676" },
  { "Company": "Island Trading Island Trading Island Trading Island Trading Island Trading", "Cost": "0.5" },
]
```
Мне [понравился подход](https://allenfang.github.io/react-bootstrap-table/start.html) создания описания колонок в jsx в качестве элементов.<br />
Будем использовать ту же идею, однако, чтобы сделать независимыми шапку и тело таблицы, нам надо вычислять описание один раз и передавать его и в шапку и в тело:
```jsx harmony
getTableColumns() {
  return [
    <TableColumn row={0} width={["Company", "Cost"]}>first header row</TableColumn>,
    <TableColumn row={1} dataField={"Company"} width={200}>
      Company
    </TableColumn>,
    <TableColumn row={1} dataField={"Cost"} width={100}>
      Cost
    </TableColumn>,
  ];
}

render() {
  const 
    descriptions = getColumnDescriptions(this.getTableColumns());
  return (
    <div>
      <TableHeader descriptions={descriptions} />
      <TableBody data={[]} descriptions={descriptions} keyField={"Id"} />
    </div>
  )
}
```
В функции `getTableColumns` мы создаем описание колонок.<br />
Все обязательные свойства я мог бы описать через `propTypes`, но после того [как их вынесли](https://facebook.github.io/react/blog/#new-deprecation-warnings) в отдельную библиотеку, не уверен.<br />
Обязательно надо указать `row` - число, которое показывает индекс строки в шапке (если шапка будет группироваться).<br />
Параметр `dataField`, будет определять какой ключ из объекта использовать для получения значения.<br />
Ширина `width` тоже обязательный параметр, может быть задана как числом, или как массивом ключей от которых зависит ширина.<br />
В примере верхняя строка в таблице `row={0}` зависит от ширины двух колонок `["Company", "Cost"]`.<br />
Элемент `TableColumn` "фейковый", он никогда не будет отображаться, а вот его содержимое `this.props.children` - будет.

## Разработка

На основе описаний колонок сделаем функцию, которая будет разбивать описание по рядам, и по ключам, а также будет сортировать описания по рядам в результирующем массиве:
```javascript
function getColumnDescriptions(children) {
  let byRows = {}, byDataField = {};
  React.Children.forEach(children, (column) => {
    const {row, hidden, dataField} = column.props;
    if (column === null || column === undefined || typeof row !== 'number' || hidden) { return; }
    if (!byRows[row]) { byRows[row] = [] }
    byRows[row].push(column);
    if (dataField) { byDataField[dataField] = column }
  });
  let descriptions = Object.keys(byRows).sort().map(row => {
    byRows[row].key = row;
    return byRows[row];
  });
  descriptions.byRows = byRows;
  descriptions.byDataField = byDataField;
  return descriptions;
}
```
Теперь обработанное описание, можно подавать в шапку и в тело для отображения ячеек.<br />
Шапка будет строить ячейки так:
```jsx harmony
getFloor(width, factor) {
  return Math.floor(width * factor);
}

renderChildren(descriptions) {
  const {widthFactor} = this.props;
  return descriptions.map(rowDescription => {
    return <div className={styles.tableHeaderRow} key={rowDescription.key}>
      {rowDescription.map((cellDescription, index) => {
        const {props} = cellDescription;
        const {width, dataField} = props;
        const _width = Array.isArray(width) ?
          width.reduce((total, next) => {
            total += this.getFloor(descriptions.byDataField[next].props.width, widthFactor);
            return total;
          }, 0) :
          this.getFloor(width, widthFactor);
        return <div className={styles.tableHeaderCell}
                    key={dataField || index}
                    style={{ width: _width + 'px' }}>
          {cellDescription.props.children}
        </div>
      })}
    </div>
  })
}

render() {
  const {className, descriptions} = this.props;

  return (
    <div className={styles.tableHeader} ref={this.handleRef}>
      {this.renderChildren(descriptions)}
    </div>
  )
}
```
Тело таблицы будет строить ячейки тоже на основе обработанного описания:
```jsx harmony
renderDivRows(cellDescriptions, data, keyField) {
  const {rowClassName, widthFactor} = this.props;
  return data.map((row, index) => {
    return <div className={`${styles.tableBodyRow} ${rowClassName}`} key={row[keyField]}
                data-index={index} onClick={this.handleRowClick}>
      {cellDescriptions.map(cellDescription => {
        const {props} = cellDescription;
        const {dataField, dataFormat, cellClassName, width} = props;
        const value = row[dataField];
        const resultValue = dataFormat ? dataFormat(value, row) : value;
        return <div className={`${styles.tableBodyCell} ${cellClassName}`} key={dataField}
                    data-index={index} data-key={dataField} onClick={this.handleCellClick}
                    style={{ width: this.getFloor(width, widthFactor) + 'px' }}>
          {resultValue ? resultValue : '\u00A0'}
        </div>
      })}
    </div>
  });
}
  
getCellDescriptions(descriptions) {
  let cellDescriptions = [];
  descriptions.forEach(rowDescription => {
    rowDescription.forEach((cellDescription) => {
      if (cellDescription.props.dataField) {
        cellDescriptions.push(cellDescription);
      }
    })
  });
  return cellDescriptions;
}

render() {
  const {className, descriptions, data, keyField} = this.props;
  const cellDescriptions = this.getCellDescriptions(descriptions);

  return (
    <div className={`${styles.tableBody} ${className}`} ref={this.handleRef}>
      {this.renderDivRows(cellDescriptions, data, keyField)}
    </div>
  )
}
```
Тело таблицы использует описания у которых есть свойство `dataField` поэтому необходимо отфильтровать описания `getCellDescriptions`.<br />
Тело таблицы будет слушать события изменения размеров экрана, а также прокрутки самого тела таблицы:
```jsx harmony
componentDidMount() {
  this.adjustBody();
  window.addEventListener('resize', this.adjustBody);
  if (this.tb) {
    this.tb.addEventListener('scroll', this.adjustScroll);
  }
}

componentWillUnmount() {
  window.removeEventListener('resize', this.adjustBody);
  if (this.tb) {
    this.tb.removeEventListener('scroll', this.adjustScroll);
  }
}
```
Подстройка ширины таблицы происходит следующим образом.<br />
После отображения необходимо взять ширину контейнера, сравнить с шириной всех ячеек, если ширина контейнера больше, увеличить все ячейки.<br />
Для этого разработчик должен хранить состояние (где хочет там и хранить, только передавать) коэффициента ширины (который будет меняться).<br />
Следующие функции реализованы в таблице, однако разработчик может использовать свои. Чтобы использовать уже реализованные, надо их импортировать и прилинковать к текущему компоненту:
```jsx harmony
constructor(props, context) {
  super(props, context);

  this.state = {
    activeSorts: [],
    activeFilters: [],
    columnsWidth: {
      Company: 300, Cost: 300
    },
    widthFactor: 1
  };

  this.handleFiltersChange = handleFiltersChange.bind(this);
  this.handleSortsChange = handleSortsChange.bind(this);
  this.handleAdjustBody = handleAdjustBody.bind(this);
  this.getHeaderRef = getHeaderRef.bind(this, 'th');
  this.getBodyRef = getBodyRef.bind(this, 'tb');
  this.syncHeaderScroll = syncScroll.bind(this, 'th');
}
```
Внутри таблицы эти функции реализованы. Подстройка ширины:
```jsx harmony
adjustBody() {
  const {descriptions, handleAdjustBody} = this.props;
  if (handleAdjustBody) {
    const cellDescriptions = this.getCellDescriptions(descriptions);
    let initialCellsWidth = 0;
    cellDescriptions.forEach(cd => {
      initialCellsWidth += cd.props.width;
    });
    handleAdjustBody(this.tb.offsetWidth, initialCellsWidth);
  }
}
```
Синхронизация шапки:
```jsx harmony
adjustScroll(e) {
  const {handleAdjustScroll} = this.props;
  if (typeof handleAdjustScroll === 'function') {
    handleAdjustScroll(e);
  }
}
```
Ключевая особенность таблицы для `redux` - это то, что она не имеет своего состояния (она должна иметь состояние, но только в том месте, где укажет разработчик).<br />
И подстройка ширины `adjustBody` и синхронизация скролла `adjustScroll` - это функции которые изменяют состояние у прилинкованного компонента.

Внутрь `TableColumn` можно вставлять любую разметку. По факту нужны: текст, кнопка сортировки и кнопка фильтрации.
Для массива активных сортировок и для массива активных фильтров разработчик опять же должен создать состояние и передавать его в таблицу.
```jsx harmony
this.state = {
  activeSorts: [],
  activeFilters: [],
};
```
Передаем в таблицу/сортировку/фильтрацию:
```jsx harmony
getTableColumns() {
  const {activeFilters, activeSorts, columnsWidth} = this.state;
  return [
    <TableColumn row={0} width={["Company", "Cost"]}>first header row</TableColumn>,
    <TableColumn row={1} dataField={"Company"} width={300}>
      <MultiselectDropdown title="Company" activeFilters={activeFilters} dataField={"Company"}
                           items={[]} onFiltersChange={this.handleFiltersChange} />
    </TableColumn>,
    <TableColumn row={1} dataField={"Cost"} width={300}>
      <SortButton title="Cost" activeSorts={activeSorts} dataField={"Cost"}
                  onSortsChange={this.handleSortsChange} />
    </TableColumn>,
  ];
}
```
Сортировка и фильтрация при изменении "выбрасывает" новые активные фильтры/сортировки, которые разработчик должен заменить в состоянии.<br />
Массивы `activeSorts` и `activeFilters` как раз и предполагают, что возможна множественная сортировка и фильтрация по каждой колонке.<br />
Формат статьи не позволяет описать всех тонкостей, поэтому предлагаю [сразу посмотреть результат](https://volodalexey.github.io/front-end-notes/).<br />
Исходники находятся [здесь](https://github.com/volodalexey/front-end-notes/tree/master/table).
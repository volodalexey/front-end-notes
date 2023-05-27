Собрал весь свой 2-х месячный опыт разработки на PixiJS. Руководство для новичков, какого мне нехватало.

# Постановка задачи

Сначала определимся что рисовать. Рисовать я буду двухмерные объекты, изображения (текстуры). Двухмерные игры в частности.

Если вам нужно что-то нарисовать в `HTMLCanvasElement` у вас есть несколько опций:
1. использовать библиотеку/фреймворк
2. использовать контекст напрямую (`2d`, `webgl`) в виде API браузера `CanvasRenderingContext2D`, `WebGLRenderingContext`

Вкратце описать процесс рисования можно так:
- `2d` контекст - рисует всё центральным процессором (CPU)
- `webgl` контекст - рисует всё на видеокарте (GPU), а точнее много маленьких процессоров на видеокарте распараллеливают процесс рисования

Для отрисовки двухмерного контента библиотека должна уметь использовать стандартный `2d` контекст. Однако ничто не мешает рисовать двухмерный контент и на `webgl`. Для использования ресурсов вашей видеокарты на полную конечно же лучше использовать `webgl`.

Нужно понимать что, есть вещи которые можно реализовать только на `webgl`, а есть которые наоборот в `2d`. Например [BLEND_MODES](https://pixijs.download/release/docs/PIXI.html#BLEND_MODES) (такая вещь для "смешивания" пикселей) на `webgl` очень ограничен, зато используя `2d` есть где [развернуться](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation).

Подитожив: я хочу рисовать двухмерный контент на `webgl` используя библиотеку.

# Почему [PixiJS](https://pixijs.com/) ?

Быстро пробежавшись по предлагаемым решениям в интернете можно увидеть следующую картину:

| название | контекст  | количество звёзд на github |
|----------|-----------|----------------------------|
| [PhaserJS](https://github.com/photonstorm/phaser)   | 2d, webgl | 34.5k |
| [BabylonJS](https://github.com/BabylonJS/Babylon.js) | webgl | 20.7k |
| [ThreeJS](https://github.com/mrdoob/three.js/) | webgl | 92k |
| [PixiJS](https://github.com/pixijs/pixijs) | 2d, webgl | 40k |
| [FabricJS](https://github.com/fabricjs/fabric.js) | 2d | 24.9k |

Особое внимание нужно уделить выбранным мною библиотекам. 

Если вы хотите заниматься только играми на JavaScript, то `PhaserJS` или `BabylonJS` созданы именно для этого. Вам нужно будет писать меньше кода, не нужно будет ломать голову где взять движок для физики и т.д.

Однако более универсальные `PixiJS` / `FabricJS` / `ThreeJS` созданы не только для игр. Я советую использовать более универсальные инструменты на JS. Для инди-игр вам хватит, а для более серъезных `AAA` игр вам всё равно нужно будет использовать компилируемый язык - и учить PhaserJS / BabylonJS без особой надобности. Из минусов, писать игры на универсальных библиотеках более затратно и муторно.

Универсальные библиотеки также пригодятся для отрисовки графиков, интерактивно двухмерного и трёхмерного контента во фронтенд'е. А также будет хорошей строчкой в вашем резюме.

Для более-менее долгоиграющих проектов хочется взять что-то популярное и поддреживаемое. `FabricJS` - умеет рисовать на сервере для NodeJS, но не умеет в `webgl` контекст, а для игр нужно рисовать быстро и много. `ThreeJS` - больше для трёхмерного контента.

Подитожив: берём `PixiJS` как самую популярную (поддерживаемую) библиотеку для отрисовки двухмерного контента на `webgl`.

Примечание: в `PixiJS` для `2d` контекста нужно использовать [pixi.js-legacy](https://www.npmjs.com/package/pixi.js-legacy).

# PixiJS введение

В 2016 году самый популярный браузер в мире `Chrome` перестаёт поддерживать [Adobe Flash Player](https://blog.google/products/chrome/flash-and-chrome/). В качестве замены предлагалось использовать `HTML5` технологии, а именно:
- `2d` и `webgl` контексты для рисования
- [Web Audio API](https://developer.mozilla.org/ru/docs/Web/API/Web_Audio_API) и [HTMLMediaElement](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement) для звука и видео
- [WebSocket](https://developer.mozilla.org/ru/docs/Web/API/WebSocket) и [WebRTC API](https://developer.mozilla.org/ru/docs/Web/API/WebRTC_API) для передачи данных и коммуникации в режиме реального времени.

Думаю своевременный выход `PixiJS` библиотеки и решение поставленных задач - помогли `Flash` разработчикам перейти на `HTML5`, а также обусловили популярность библиотеки.

Основной объект/класс в PixiJS - это [DisplayObject](https://pixijs.io/guides/basics/display-object.html). Но напрямую использовать я его не буду.

Я будем использовать объекты/классы унаследованные от `DisplayObject`:
- спрайт [Sprite](https://pixijs.io/guides/basics/sprites.html) для отрисовки изображений (текстур)
- анимированный спрайт [AnimatedSprite](https://pixijs.download/release/docs/PIXI.AnimatedSprite.html), т.е. массив из спрайтов, который меняет активный спрайт автоматически с помощью счетчика или вручную
- отрисованную графику [Graphics](https://pixijs.io/guides/basics/graphics.html), т.е. линии, треугольники, квадраты, многоугольники, дуги, арки, круги и т.д.
- текст [Text](https://pixijs.io/guides/basics/text.html)
- контейнер [Container](https://pixijs.io/guides/basics/containers.html), куда всё вышеприведённое будем складывать и манипулировать (передвигать, поворачивать, масштабировать, подкрашивать, затенять, скрывать или показывать)

Под капотом `Container` хранит деверо объектов. Соответственно для каждого объекта можно посмотреть его родителя `parent`, его потомков `children`. Добавить потомка `addChild()`, удалить потомка `removeChild()` и самоудалиться `removeFromParent()`.

`Sprite`, `AnimatedSprite`, `Graphics` и `Text` наследуются от `Container`, поэтому в них тоже можно добавлять другие объекты и т.д.
Не стоит заморачиваться и с проверкой на добавление потомков, каждый объект может иметь только одного родителя. Поэтому если вы добавляете уже добавленный объект куда-то ещё, то он самоудалиться из предыдущего родителя.

Всё это напоминает [DOM-дерево](https://learn.javascript.ru/dom-nodes), не так ли? А везде где есть дерево объектов фронтэндер хочет использовать... правильно, [React](https://github.com/facebook/react/)! И даже такое уже есть в виде [Pixi React](https://github.com/pixijs/pixi-react). Но я такое уж точно не буду использовать, достаточно и того что выбрал.

Вкратце моя игра на `PixiJS` состоит из следующего:
- Сцена. Т.к. отдельного класса для сцены нет, то сценой можно считать любой главный контейнер, куда добавляются все остальные объекты. Есть корневой контейнер, который называется [Stage](https://pixijs.download/release/docs/PIXI.Application.html#stage).
```typescript
import { Container, type DisplayObject } from 'pixi.js'

interface IScene extends DisplayObject {
  handleUpdate: (deltaMS: number) => void
  handleResize: (options: { viewWidth: number, viewHeight: number }) => void
}

class DefaultScene extends Container implements IScene {
  handleUpdate (): void {}
  handleResize (): void {}
}
```
- Может быть несколько сцен. Например сцена загрузки ресурсов. Сцена главного меню. Сцена самой игры. Тогда буду использовать абстракцию для манипулирования сценами.
```typescript
abstract class SceneManager {
    private static currentScene: IScene = new DefaultScene()
    public static async initialize (): Promise<void> {}
    public static async changeScene (newScene: IScene): Promise<void> {}
}
```
- Для подгрузки ресурсов использую `Assets` модуль (загрузчик). Который без проблем подгружает и парсит ресурсы в формате `.jpg`, `.png`, `.json`, `.tiff`/`.woff2`. В момент подгрузки ресурсов можно показывать сцену загрузки, например с прогресс баром (который нужно рисовать самому). Все ресурсы можно перечислить в манифесте и потом запустить загрузчик с этим манифестом.
```typescript
import { Container, Assets, type ResolverManifest } from 'pixi.js'

const manifest: ResolverManifest = {
  bundles: [
    {
      name: 'bundle-1',
      assets: {
        spritesheet: './spritesheet.json',
        background: './background.png',
        font: './font.woff2'
      }
    }
  ]
}

class LoaderScene extends Container implements IScene {
  async initializeLoader (): Promise<void> {
    await Assets.init({ manifest })
    await Assets.loadBundle(manifest.bundles.map(bundle => bundle.name), this.downloadProgress)
  }

  private readonly downloadProgress = (progressRatio: number): void => {}
}
```
- Движок или ядро игры. Движок запрашивает необходимые ресурсы у загрузчика, инициализирует инстанс самого [Application](https://pixijs.download/release/docs/PIXI.Application.html) или использует уже готовый, добавляет объекты в сцену. Подключается к счетчику [Ticker](https://pixijs.download/release/docs/PIXI.Ticker.html) при необходимости. Подписывается на события `resize`, `pointer...`, `key...` если нужно.
```typescript
import { type Application } from 'pixi.js'

class World {
  public app: Application<HTMLCanvasElement>
  constructor ({ app }: { app: Application<HTMLCanvasElement> }) {
    this.app = app
    this.app.ticker.add(this.handleAppTick)
  }

  handleAppTick = (): void => {}
}
```
- Дальше любой класс/компонент в игре может делать всё тоже самое, что и ядро игры, только в большем или меньшем объёме. За исключением создания инстанса `Application`.
```typescript
import { Container, Graphics, Text, Texture } from 'pixi.js'

class StartModal extends Container {
  public background!: Graphics
  public text!: Text
  public icon!: Sprite
  constructor (texture: Texture) {
    super()
    this.setup(texture)
    this.draw()
  }

  setup (texture: Texture): void {
    this.background = new Graphics()
    this.addChild(this.background)

    this.text = new Text('Привет Habr!')
    this.addChild(this.text)

    this.icon = new Sprite(texture)
    this.addChild(this.icon)
  }

  draw (): void {
    this.background.beginFill(0xff00ff)
    this.background.drawRoundedRect(0, 0, 500, 500, 5)
    this.background.endFill()
  }
}
```

# Процесс разработки

Для игр хочется использовать как можно больше инструментов из фронтенда. Разделять код на файлы, модули. Прописывать зависимости (import, export). Использовать проверку синтаксиса кода и автоформатирование. Собирать всё это сборщиком (bundler). Использовать типизацию. В режиме разработки автоматически пересобирать (compile) результирующий код и перезагружать (hot-reload) страницу в браузере, когда я поменял исходный код.

[TypeScript](https://github.com/microsoft/TypeScript) (`91.4k` звёзд) буду использовать повсеместно для типизации.

[Webpack](https://github.com/webpack/webpack) (`61.3k` звёзд) буду использовать для сборки проекта, для режима разработки [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) (`7.6k` звёзд). [HTML Webpack Plugin
](https://github.com/jantimon/html-webpack-plugin) (`10.5k` звёзд) для основной точки входа (начала сборки).

Проверкой синтаксиса и форматированием будет заниматься [ESLint](https://github.com/eslint/eslint) (`22.7k` звёзд) со стандартным конфигом для тайпскрипта [eslint-config-standard-with-typescript
](https://github.com/standard/eslint-config-standard-with-typescript).

Для логгирования возьму [Debug](https://github.com/debug-js/debug) библиотеку (`10.7k` звёзд).

`PixiJS` буду использовать без дополнительных плагинов и шейдеров - только основная библиотека. Количество `HTML` элементов свожу к минимуму, любые экраны/интерфейсы в игре сделаю на `PixiJS`. Все игры обязательно должны запускаться мобильных устройствах `Mobile‌ ‌First‌` (масштабировать если нужно). Все исходники спрайтов в папке `src-texture`. Все исходники карты уровней в папке `src-tiled`.

Итак, [вооружившись](https://pixijs.io/guides/index.html) [несколькими](https://github.com/kittykatattack/learningPixi) [руководствами](https://www.pixijselementals.com/) по `PixiJS` можно приступать к разработке.

Примечание: исходный код содержит практики, которые можно было бы сделать лучше исходя из полученного опыта, однако я оставляю всё как есть, нет времени исправлять. Постараюсь описать что можно сделать по-другому в статье.

# Игра 01: Ферма

## Ферма: Описание

- поле фермы 8x8 клеток
- на клетке может располагаться: пшеница, курица, корова, либо клетка может быть пустой
- отображение объектов, индикаторы прогресса и корма

Свойства сущностей следующие:
- пшеница вырастает за 10 сек, после чего можно собрать урожай (1 единица урожая с одной
клетки), затем рост начинается заново
- пшеницей можно покормить курицу и корову
- если еды достаточно, то курица несёт одно яйцо за 10 сек, а корова даёт молоко раз в 20 сек
- 1 единицы пшеницы хватает на 30 сек курице и на 20 сек корове
- яйца и молоко можно продать, получив прибыль

Поверхностный поиск по интернету не дал существенных результатов. Фермы не так популярны для open-source проектов на JS. Поэтому делаем всё с нуля.

## Ферма: Поиск и обработка изображений

Качественных изображений в свободном доступе очень мало. Возможно в будущем это изменится и можно будет [генерировать через нейросеть](https://github.com/openai/shap-e).

Удалось собрать нарисованные иконки: [зерно (кукуруза)](https://thenounproject.com/icon/corn-1838227/), [яйцо](https://thenounproject.com/icon/egg-153392/), [деньги (мешок с деньгами)](https://thenounproject.com/icon/money-1524558/) и [молоко](https://thenounproject.com/icon/cow-milk-3263282/).
[Спрайт (изображение) травы](https://butterymilk.itch.io/tiny-wonder-farm-asset-pack) на каждой клетке фермы будет самый простой.
С анимированными спрайтами (массивом изображений) пришлось сложнее, но я тоже нашёл [курицу](https://opengameart.org/sites/default/files/chicken_eat.png), [корову](https://opengameart.org/sites/default/files/cow_eat.png) и [зерно](https://danaida.itch.io/free-growing-plants-pack-32x32).

Все спрайты обычно собираются в один результирующий файл. В этом есть два смысла:

1. браузер будет простаивать, если загружать много файлов сразу (HTTP 1.1) - будет открываться много соединений, а в браузере есть [ограничение на максимальное количество открытых соединений](https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser).

2. при загрузке текстур в память видеокарты [тоже лучше загружать всё одним изображением/текструрой](https://gamedev.stackexchange.com/questions/7069/2d-graphics-why-use-spritesheets) - а для моего `webgl` контекста это тоже пригодиться.

Загрузчик (`Assets`) в `PixiJS` может подгрузить и обработать текстурный атлас (spritesheet) в формате `.json`. Достаточно соблюдать [схему внутри json файла](https://pixijs.io/guides/basics/sprite-sheets.html):
```json
{
  "frames": {
    "frame-name-00.png": {
      "frame": { "x": 0, "y": 0, "w": 100, "h": 50 },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": { "x": 0, "y": 0, "w": 100, "h": 50 },
      "sourceSize": { "w": 100, "h": 50 },
      "pivot": { "x": 0, "y": 0 }
    }
  },
  "animations": {
    "animation-name-00": [
      "frame-name-00.png",
      "frame-name-01.png",
      "frame-name-02.png"
    ],
  },
  "meta": {
    "app": "...",
    "version": "...",
    "image": "spritesheet.png",
    "format": "RGBA8888",
    "size": {
      "w": 200,
      "h": 200
    },
    "scale": 1
  }
}
```

Вручную создавать `.json` файл вышеприведённой схемы я не буду, а воспользуюсь программой. На сайте предлагается использовать [ShoeBox](http://renderhjs.net/shoebox/) или [TexturePacker](https://www.codeandweb.com/texturepacker). Т.к. я работаю в Linux, то мне остаётся использовать только `TexturePacker`. Однако бесплатная версия программы "портит" результирующий файл, если использовать нужные мне опции, заменяя некоторую его часть красным цветом (таким образом пытаясь стимулировать пользователей покупать программу):
![Texture Packer экспорт](./pixijs/texture_packer_fail.png)
Т.е. использовать программу в бесплатном режиме нет возможности, хотя мне требуется базовый функционал: собрать `.json`, собрать по возможности квадратный `.png`, добавить паддинг 1 пиксель к каждому фрейму.

Поэтому я нашел другую программу [Free texture packer](https://github.com/odrick/free-tex-packer), тоже под Linux и бесплатную.
Базового функционала достаточно, чтобы упаковать все изображения в одно и сгенерировать результирующие `.json` и `.png` файлы для `PixiJS`.
Из минусов: не умеет работать с анимациями - для этого прийдётся вручную прописать массив фреймов, которые учавствуют в анимации (`animations` ключ).
А также программа не умеет сохранять проект в [относительном формате файлов](https://github.com/odrick/free-tex-packer/issues/72), чтобы открывать на другом компьютере.

Все изображения, которые содержат фреймы для анимации нужно порезать на отдельные изображения, для этого есть опция:
![Free Texture Packer меню](./pixijs/free_texture_packer_split_sheet.png)

Затем выбираем нужный нам размер фрейма и режем:
![Free Texture Packer split sheet](./pixijs/free_texture_packer_split_sheet_run.png)

Добавляем все подготовленные изображения в проект, и подготавливаем результирующие файлы:
![Free Texture Packer проект](./pixijs/free_texture_packer_project.png)

К каждому фрейму нужно добавлять 1 пиксель отступа, [из-за специфики работы GPU](https://webglfundamentals.org/webgl/lessons/webgl-qna-how-to-prevent-texture-bleeding-with-a-texture-atlas.html).

Все файлы для `Free Texture Packer` я буду хранить в отдельной папке `src-texture`.

## Ферма: Сетка

Сперва продумаем интерфейс, сверху будет панель статуса `StatusBar`. Где буду показывать количество денег, количество собранного урожая и продуктов: зерно, яйца, молоко. Иконка и рядом количество.
Посередине будет игровое поле `FarmGrid`.
Внизу будет панель покупки зерна, курицы или коровы `ShopBar`.

Видимо мне понадобится универсальный квадрат (точнее плиточка), на который [можно будет нажимать](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/models/Tile.ts).
```typescript
import { Container, Graphics } from 'pixi.js'

class Tile extends Container {
  static COLORS = {
    regular: 0xffffff,
    active: 0x0d21a1,
    hover: 0x515BA1
  }

  public graphics!: Graphics
  public showSelected!: boolean
  public showHover!: boolean
  public isSelected = false
  public posX!: number
  public posY!: number
  public cellWidth!: number
  public cellHeight!: number
  constructor (onClick?: <T extends Tile>(tile: T) => void) {
    super()
    this.graphics = new Graphics()
    this.addChild(this.graphics)
    this.fillColor(Tile.COLORS.regular)

    this.eventMode = 'static'
    this.cursor = 'pointer'
    this.on('mouseover', this.handleMouseOver)
    this.on('mouseout', this.handleMouseOut)
    this.onClick = onClick
    this.on('pointertap', this.handleClick)
  }

  fillColor (color: typeof Tile.COLORS[keyof typeof Tile.COLORS]): void {
    this.graphics.clear()
    this.graphics.beginFill(color)
    this.graphics.drawRect(this.posX, this.posY, this.cellWidth, this.cellHeight)
    this.graphics.endFill()
  }

  handleClick = (): void => {
    this.toggle()
    if (typeof this.onClick === 'function') {
      this.onClick(this)
    }
  }

  handleMouseOver = (): void => {
    if (this.showHover) {
      if (this.showSelected && this.isSelected) {
        // skip
      } else {
        this.fillColor(Tile.COLORS.hover)
      }
    }
  }

  handleMouseOut = (): void => {
    if (this.showHover) {
      if (this.showSelected && this.isSelected) {
        // skip
      } else {
        this.fillColor(Tile.COLORS.regular)
      }
    }
  }
}
```
Интерактивность объекта включается свойством `eventMode = 'static'` При наведении мышкой в `handleMouseOver`, я рисую квадрат одного цвета (hover), при выбранном состоянии - другого (active).
В объект я буду передавать обработчик события `onClick`.

### PixiJS совет 01: Свои события
Можно использовать событийную модель для своих объектов, т.к. объекты в PixiJS наследуются от `EventEmitter`.
Ваш потомок допустим определяет событие, что на него нажали и передаёт выше уже своё собственное событие:
```typescript
this.on('pointertap', () => {
    this.emit('custom-click', this)
})
```
Тогда в родителе можно будет подписаться на это событие:
```typescript
this.someChild.on('custom-click', () => {})
```
Однако на практике [для TypeScript нехватает поддержки типов](https://github.com/pixijs/pixijs/issues/8957), возможно в будущем это исправят.

### PixiJS совет 02: События мыши и тач
Рекомендую ипользовать `pointer...` события вместо `mouse...` или `touch...`. Если вам нужно различие в событиях, то достаточно посмотреть на свойство `pointerType`:
```typescript
import { type FederatedPointerEvent } from 'pixi.js'

this.on('pointerdown', (e: FederatedPointerEvent) => {
  if (e.pointerType === 'mouse') {    
    e.pointerId // mouse event, pointer id should be the same
  } else if (e.pointerType === 'touch') {
    e.pointerId // touch event, pointer id should be unique for each pointer/finger/etc
  }
})
```

### PixiJS совет 03: Окрашивание графики и текстур
Если вам нужно поменять только цвет `Graphics` или `Sprite` - то лучше использовать окрашивание ([Tinting](https://pixijs.download/release/docs/PIXI.AnimatedSprite.html#tint) или `tint` свойство).
Необязательно перерисовывать всю графику заново или подготавливать несколько разных спрайтов.
Достаточно просто понимать, что всё что вы нарисуете белым цветом `0xffffff` или спрайт с белым цветом будет окрашен в цвет `tint`:
```typescript
this.ting = 0xaaaaaa // всё белое окрасится в серый
```
Здесь работает техника умножения цвета. Поэтому белый умножить на `tint` цвет будет давать `tint`.

Теперь достаточно скомпоновать [нашу сетку из плиток](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L50):
```typescript
import { type Application } from 'pixi.js'
import { ShopBar } from './ShopBar'
import { FarmGrid } from './FarmGrid'
import { ShopTile } from './ShopTile'

class World {
  public app: Application<HTMLCanvasElement>
  public statusBar!: StatusBar
  public farmGrid!: FarmGrid
  public shopBar!: ShopBar

  setupLayout (): void {
    this.statusBar = new StatusBar({})
    this.app.stage.addChild(this.statusBar)
    this.farmGrid = new FarmGrid({})
    this.app.stage.addChild(this.farmGrid)
    this.shopBar = new ShopBar({})
    this.app.stage.addChild(this.shopBar)
  }
}
```
В самом начале инициализируем инстанс `Application`, загружаем необходимые ресурсы и запускаем [наш движок игры `World`](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/app.ts):
```typescript
import { Application } from 'pixi.js'

async function run (): Promise<void> {
  const gameLoader = new GameLoader()
  await gameLoader.loadAll()
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xe6e7ea,
    resizeTo: window
  })
  const world = new World({ app, gameLoader })
  world.setupLayout()
}

run().catch(console.error)
```

## Ферма: Панель статуса и магазина

Переменные, которые будут хранить количество денег, корма (кукурузы), яиц и молока хранит каждая плитка (`Tile`) на панели статуса. Плитка кукурузы - количество кукурузы и т.д. Хотя лучше было-бы сделать глобальные переменные в движке. Далее [в каждую плитку передаю текстуру иконки](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/StatusBarTile.ts#L7).
```typescript
import { type Texture, Sprite, BitmapFont, BitmapText } from 'pixi.js'
import { type ITileOptions, Tile } from './models/Tile'

interface IStatusBarTileOptions extends ITileOptions {
  value: number
  iconTextureResource: Texture
}

class StatusBarTile extends Tile {
  static bitmapFont = BitmapFont.from('comic 40', {
    fill: 0x141414,
    fontFamily: 'Comic Sans MS',
    fontSize: 40
  })
  private _text!: BitmapText
  private _value = 0

  get value (): number {
    return this._value
  }

  setup ({
    iconTextureResource
  }: IStatusBarTileOptions): void {
    const {
      _value,
      iconOptions,
      textOptions
    } = this
    const xCenter = this.posX + Math.round(this.width / 2)
    const yCenter = this.posY + Math.round(this.height / 2)

    const texture = new Sprite(iconTextureResource)
    this.addChild(texture)

    const text = new BitmapText(String(_value), {
      fontName: 'comic 40',
      fontSize: textOptions.fontSize
    })
    this.addChild(text)
    this._text = text
  }

  updateValue (value: number): void {
    this._value = value
    this._text.text = String(value)
  }

  add (value: number): void {
    this.updateValue(this._value + value)
  }

  sub (value: number): void {
    this.updateValue(this._value - value)
  }
}
```
Внутри текстуру иконки оборачиваю в `Sprite`, а для текста использую `BitmapText`. Текст будет отображать количество `value`.

### PixiJS совет 04: Чёткость текста
Чтобы текст был чёткий и хорошо различим необходимо выставлять ему большие значения `fontSize`, например 40 пикселей. Даже несмотря на то, что показывать текст вы будете как 16 пикселей в высоту.
```typescript
import { Text } from 'pixi.js'

const text = new Text('Привет Habr!', {
  fontSize: 40,
})

text.height = 16
```

### PixiJS совет 05: Скорость отрисовки текста
Т.к. текст рисуется на GPU не напрямую, то он сначала рисуется например с помощью `2d` контекста, а уже потом передаётся в виде текстуры на GPU. Поэтому быстро меняющийся текст лучше "пререндерить". Для этого нужно использовать [BitmapText](https://pixijs.download/release/docs/PIXI.BitmapText.html).
Сначала говорим PixiJS выделить память и отрисовать нужный шрифт, нужного размера и цвета:
```typescript
import { BitmapFont } from 'pixi.js'

BitmapFont.from('comic 40', {
  fill: 0x141414,
  fontFamily: 'Comic Sans MS',
  fontSize: 40
})
```
Потом уже можем использовать шрифт и быстро менять его:
```typescript
import { BitmapText } from 'pixi.js'

const bitmapText = new BitmapText(String(_value), {
  fontName: 'comic 40',
  fontSize: 16
})

function change() {
  bitmapText.text = Date.now()
  setTimeout(change)
}
change()
```

Панель магазина [состоит из плиток тоже](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/ShopTile.ts). Каждая плитка отображает сущность которую можно купить, иконку денег и текст, который показывает стоимость покупки.
```typescript
import { BitmapText, Sprite, type Texture } from 'pixi.js'

enum ShopTileType {
  corn,
  chicken,
  cow
}

interface IShopTileOptions extends ITileOptions {
  type: ShopTileType
  cost: number
  moneyTextureResource: Texture
  itemTextureResource: Texture
}

class ShopTile extends Tile {
  setup ({
    itemTextureResource,
    moneyTextureResource,
    iconOptions: { width, height, marginLeft, marginTop }
  }: IShopTileOptions): void {
    const texture = new Sprite(itemTextureResource)
    this.addChild(texture)
    const textIcon = new Sprite(moneyTextureResource)
    this.addChild(textIcon)
    const text = new BitmapText(String(cost), {
      fontName: 'comic 30',
      fontSize: 16
    })
    this.addChild(text)
  }
}
```

Далее при инициализации моих панелей, передаю необходимые загруженные текстуры, выставляю позицию каждой плитки:
![Сетка фермы](./pixijs/farm_layout.png)

## Ферма: Поле

Каждая [плитка поля](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/FarmGridTile.ts#L28) может иметь несколько состояний:
- пустое - отображается трава
- кукуруза, корова или курица куплены
- возможность посадить или поместить на эту плитку кукурузу, корову или курицу
- возможность покормить курицу или корову

Отсюда понятно, что трава будет всегда отображаться.
```typescript
interface IFarmGridTileOptions extends ITileOptions {
  grassTextureResource: Texture
  cornBuildableTextureResource: Texture
  chickenBuildableTextureResource: Texture
  cowBuildableTextureResource: Texture
  cornAnimatedTextureResources: Texture[]
  chickenAnimatedTextureResources: Texture[]
  cowAnimatedTextureResources: Texture[]
}

enum FarmType {
  grass,
  possibleCorn,
  possibleChicken,
  possibleCow,
  corn,
  chicken,
  cow,
  possibleFeedChicken,
  possibleFeedCow
}

class FarmGridTile extends Tile {
  public type!: FarmType
  public cornBuildableSprite!: Sprite
  public chickenBuildableSprite!: Sprite
  public cowBuildableSprite!: Sprite
  public cornAnimatedSprite!: AnimatedSprite
  public chickenAnimatedSprite!: AnimatedSprite
  public cowAnimatedSprite!: AnimatedSprite

  setup ({
    grassTextureResource,
    cornBuildableTextureResource,
  }: IFarmGridTileOptions): void {
    const grassSprite = new Sprite(grassTextureResource)
    this.addChild(grassSprite)
    this.cornBuildableSprite = new Sprite(cornBuildableTextureResource)
    this.addChild(this.cornBuildableSprite)
    // ...
  }

  hideAllSprites (): void {
    const sprites = [
      this.cornBuildableSprite, this.chickenBuildableSprite, this.cowBuildableSprite,
      this.cornAnimatedSprite, this.chickenAnimatedSprite, this.cowAnimatedSprite
    ]
    sprites.forEach(sprite => { sprite.visible = false })
  }

  setType (type: FarmType): void {
    switch (type) {
      case FarmType.possibleCorn:
        this.hideAllSprites()
        this.cornBuildableSprite.visible = true
        break
        // ...
    }
    this.type = type
  }
}
```
![Возможные типы поля фермы](./pixijs/farm_grid_possible_types.png)

### PixiJS совет 06: Замена текстур
Если нужно менять отображаемую текстуру, совсем не обязательно для каждой текстуры создавать отдельный `Sprite`, можно менять свойство `texture` на ходу
```typescript
import { Sprite } from 'pixi.js'

const sprite = new Sprite()

sprite.texture = someTexture
setTimeout(() => {
    sprite.texture = someTexture2
}, 1000)
```

## Ферма: Покупка/продажа

Создаю глобальные состояния игры, как то покупка, простаивание и кормление:
```typescript
enum UIState {
  idle,
  toBuildCorn,
  toBuildChicken,
  toBuildCow,
  toFeedCorn,
}
```
Клик на `StatusBarTile` плитке яиц или молока - продаёт соответствующий ресурс.

![Состояние игры - покормить](./pixijs/farm_feed.png)

Клик на плитке кукурузы - переводит режим игры в возможность [покормить курицу или корову](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L204). Прохожусь по всем сущностям на поле и показываю дополнительный прямоугольник над курицей или коровой. Если пользователь выбирает курицу или корову, то я списываю одну единицу кукурузы и добавляю единицу еды для курицы или коровы.
```typescript
handleStatusBarClick = (tile: StatusBarTile): void => {
  if (tile.isSelected && tile.type === StatusBarTile.TYPES.corns) {
    if (tile.value >= 1) {
      this.shopBar.deselectAll()
      this.setUIState(UIState.toFeedCorn)
    } else {
      this.statusBar.deselectAll()
    }
  } else {
    this.setUIState(UIState.idle)
  }
  switch (tile.type) {
    case StatusBarTile.TYPES.eggs:
      this.statusBar.sellEggs()
      break
    case StatusBarTile.TYPES.milks:
      this.statusBar.sellMilks()
      break
  }
}
```
![Состояние игры - купить кукурузу](./pixijs/farm_buy_corn.png)
![Состояние игры - купить курицу](./pixijs/farm_buy_chicken.png)
![Состояние игры - купить корову](./pixijs/farm_buy_cow.png)

Клик на `ShopTile` плитке - переводит режим игры в возможность купить кукурузу, курицу или корову. Прохожусь по всем свободным плиткам на поле и показываю соответствующую [сущность в розовом цвете](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L225).
```typescript
handleShopBarClick = (tile: ShopTile): void => {
  this.statusBar.deselectAll()
  if (tile.isSelected) {
    if (tile.cost > 0 && this.statusBar.money >= tile.cost) {
      switch (tile.type) {
        case ShopTile.TYPES.corn:
          this.setUIState(UIState.toBuildCorn)
          break
        case ShopTile.TYPES.chicken:
          this.setUIState(UIState.toBuildChicken)
          break
        case ShopTile.TYPES.cow:
          this.setUIState(UIState.toBuildCow)
          break
      }
    } else {
      this.shopBar.deselectAll()
    }
  } else {
    this.setUIState(UIState.idle)
  }
}
```
 Если пользователь выбирает незанятую плитку, тогда списываю деньги и [размещаю купленную сущность на клетке](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L137).

## Ферма: счетчик и прогресс

Теперь нужно "оживить" игру. [Подписываюсь на событие счетчика](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L36) и распространяю эти события дальше на поле фермы. А та в свою очередь добавляет часть сгенерированного ресурса (кукуруза, яйцо или молоко) и, если это курица или корова, - то, отнимаю часть еды.
Соответственно для каждой клетки с курицей или коровой создаю переменные для хранения сгенерированного ресурса (и для кукурузы) `_generated` и для оставшейся еды `_food`.
```typescript
this.app.ticker.add(this.handleAppTick)

handleAppTick = (): void => {
  this.farmGrid.handleWorldTick(this.app.ticker.deltaMS)
}
```

![Прогресс бары](./pixijs/farm_progress_bars.png)

Для отображения индикаторов еды и генерирования ресурса добавляю прогресс бары. Генерация вверху, еда - внизу. Рисую их как [простые прямоугольники `Graphics`](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/models/ProgressBar.ts#L83). И перерисовываю на каждый тик, хотя можно было бы просто менять ширину нарисовав от начала координат.

### PixiJS совет 07: Позиционирование графики и масштабирование
Когда рисуете `Graphics` и впоследствии собираетесь её масштабировать - всегда предпочитайте рисовать от начала координат (0, 0). Так изменение `width` будет [работать корректно](https://pixijs.io/guides/basics/sprites.html).
```typescript
  this.drawRect(0, 0, initWidth, initHeight)
  this.endFill()
```
В противном случае изменение ширины приведёт к масштабированию не только графики, но и отступа графики от начала координат.
Например изменение ширины нарисованного прогресс бара будет работать корректно только если вы рисовали прямоугольник из начала координат.

Для генерации выбираю один цвет прогресс бара независимо от состояния. А вот для еды, сделал интерполяцию цвета, чем больше осталось еды тем зеленее прогресс бар, наоборот - тем краснее.

Когда ресурс сгенерирован, то для наглядности показываю прямоугольник определённого цвет, чтобы пользователь мог собрать ресурс. Клик на клетке поля со сгенерированным ресурсом собирает его, только если игра в режиме ожидания.

## Ферма: масштабирование

При масштабировании любой игры есть два варианта:
1. Подогнать размеры игры под окно (`viewport`/`window` или `camera`) - [Letterbox scale](https://www.pixijselementals.com/#letterbox-scale)
2. Обрезать игру, если она выходит за пределы окна - [Responsive Scale](https://www.pixijselementals.com/#responsive-scale)

Есть ещё экзотический способ просто растянуть по высоте и ширине, нарушая при этом соотношение сторон - такое я не буду делать.

Для фермы я [выбрал 1й вариант](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L105). Для этого вычисляю ширину и высоту всей игры и вписываю в существующие размеры окна.

Для этого подписываюсь на событие резайза:
```typescript
window.addEventListener('resize', this.resizeDeBounce)
```

Однако [обработчик вызываю не сразу](https://github.com/volodalexey/simple-html5-farm-game/blob/5724de2e074c7df3ccfcf74173f75754ce0e8a29/src/World.ts#L89), а с задержкой, чтобы предотвратить постоянное масштабирование когда пользователь тянет за край окна браузера. В этом случае резайз сработает только один раз по проишествии нескольких миллисекунд.

Далее я буду просто переписывать все игры, которые мне понравятся на стек, который я описал выше.

# Игра 02: Покемон

[В этом видео](https://www.youtube.com/watch?v=yP5DKzriqXA) полный процесс разработки игры. Дальше будет много игр с этого канала.

В видео познакомился с программой [Tiled Map Editor](https://www.mapeditor.org/download.html) которая тоже работает под Linux. В ней можно просто и удобно по слоям рисовать 2х мерную тайловую карту. На выходе при экспорте в формат `.json` получаем удобное описание всех слоёв на карте в виде массива:
```json
{
  "layers": {
    "data": [0, 1, 0, 1],
    "name": "Layer name",
    "type": "tilelayer"
  }
}
```
А также при экспорте в `.png` формат получаем готовую отрисованную карту. Только не забудьте правильно выставить видимые слои.

![Tiled Map Editor на Linux](./pixijs/pokemon_tiled_map_editor.png)

В видео автор уже нарисовал карту, я немного ёё подправил из-за неработающих ссылок, остальное сразу заработало. Исходные файлы для `Tiled Map Editor` я буду хранить в папке `src-tiled`.

Автор скорее-всего ввиду упрощения предлагает просто скопировать массив данных [collisions](https://github.com/chriscourses/pokemon-style-game/blob/main/data/collisions.js#LL1C7-L1C17) слоя из экспортируемого `.json` файла. Я же поисследовав схему `.json` файла [написал описание типов](https://github.com/volodalexey/simple-html5-pokemon-game/blob/48456ba0b4db518770c8215207b803ec2a2b2cda/src/GameLoader.ts#L27) и буду использовать полученные массивы данных для определённого слоя прямиком из `.json` [файла](https://github.com/volodalexey/simple-html5-pokemon-game/blob/48456ba0b4db518770c8215207b803ec2a2b2cda/src/World.ts#L83).

Прохожусь [по массиву слоя и добавляю](https://github.com/volodalexey/simple-html5-pokemon-game/blob/48456ba0b4db518770c8215207b803ec2a2b2cda/src/MapScreen.ts#L55) либо прямоугольники для ограничения движения по карте, либо прямоугольники для активации экрана битвы:
```typescript
setupLayers ({ collisionsLayer, battleZonesLayer }: IMapScreenOptions): void {
    const { tilesPerRow } = this
    for (let i = 0; i < collisionsLayer.data.length; i += tilesPerRow) {
      const row = collisionsLayer.data.slice(i, tilesPerRow + i)
      row.forEach((symbol, j) => {
        if (symbol === 1025) {
          const boundary = new Boundary({
            rect: {
              x: j * this.cellWidth,
              y: i / tilesPerRow * this.cellHeight,
              width: this.cellWidth,
              height: this.cellHeight
            }
          })
          this.boundaries.push(boundary)
          this.addChild(boundary)
        }
      })
    }

    for (let i = 0; i < battleZonesLayer.data.length; i += tilesPerRow) {
      const row = battleZonesLayer.data.slice(i, tilesPerRow + i)
      row.forEach((symbol, j) => {
        if (symbol === 1025) {
          const boundary = new Boundary({
            rect: {
              x: j * this.cellWidth,
              y: i / tilesPerRow * this.cellHeight,
              width: this.cellWidth,
              height: this.cellHeight
            },
            fillColor: 0x0000ff
          })
          this.battleZones.push(boundary)
          this.addChild(boundary)
        }
      })
    }
  }
```

Используя библиотеку `Debug` я включаю дебаг режим. Для этого в браузере в `localStorage` я прописываю ключ `debug` (с маленькой буквы), а в значение записываю например `poke-boundary`:

![Tiled Map Editor на Linux](./pixijs/pokemon_debug_boundary.png)

В самом же коде [я проверяю](https://github.com/volodalexey/simple-html5-pokemon-game/blob/48456ba0b4db518770c8215207b803ec2a2b2cda/src/Boundary.ts#L21), если включен режим дебага, то рисую прозрачные прямоугольники, если нет, то они остаются невидимыми и учавствуют в проверке коллизии только.
```typescript
if (logBoundary.enabled) {
  this.visible = true
  this.alpha = 0.3
} else {
  this.visible = false
}
```

### PixiJS совет 08: Дебаг
В PixiJS нет дебаг режима из коробки, его прийдётся рисовать вручную (можете попробовать [браузерное расширение](https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon)). Например после того, как нарисовали все `Graphics` и добавили все `Sprites` и `AnimatedSprites` добавляем еще один полупрозрачный `Graphics` используя ширину и высоту текущего контейнера:
```typescript
import { Container, Sprite, type Texture } from 'pixi.js'

class Some extends Container {
  constructor(texture: Texture) {
    super()
    const gr = new Graphics()
    gr.beginFill(0xff00ff)
    gr.drawRoundedRect(0, 0, 500, 500, 5)
    gr.endFill()
    this.addChild(gr)

    const spr = new Sprite(texture)
    this.addChild(spr)
    
    if (debug) {
      const dgr = new Graphics()
      dgr.beginFill(0xffffff)
      dgr.drawRect(0, 0, this.width, this.height)
      dgr.endFill()
      dgr.alpha = 0.5
      this.addChild(dgr)
    }
  }
}
```


Описанные техники для PixiJS можно посмотреть на YouTube

Полный список всех игр:
[Ферма](https://github.com/volodalexey/simple-html5-farm-game)
[Покемон](https://github.com/volodalexey/simple-html5-pokemon-game)
https://github.com/volodalexey/simple-html5-shooting-game
https://github.com/volodalexey/simple-html5-mario-game
https://github.com/volodalexey/simple-html5-fighting-game
https://github.com/volodalexey/simple-html5-galaxian-game
https://github.com/volodalexey/simple-html5-pacman-game
https://github.com/volodalexey/simple-html5-td-game
https://github.com/volodalexey/simple-html5-sidescroller-game
https://github.com/volodalexey/simple-html5-mrp-game
https://github.com/volodalexey/simple-html5-vp-game
https://github.com/volodalexey/simple-html5-es-game
https://github.com/volodalexey/simple-html5-rts-game

Интерактивый список всех игр:
https://volodalexey.github.io/portfolio/
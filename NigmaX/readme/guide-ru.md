https://bitbucket.org/veopot2014/site_parsers/src/master/RU-json.md
Самый свежий фак будет тут от Veopot(если что можете найти меня на форуме 4pda )

https://drive.google.com/drive/folders/1hGODDb3OlHzAL7jqJbCW01ThdKKgbV9L
Тут все что может вам понабиться 
--------------------------------------
# Как устроен парсер для MangaWatcherX


#1) Поля заголовка парсера
-
* `id [long]` - идентификатор сайта (пережиток далекого прошлого но от него пока не отказаться),
* `version [string]` - версия данного файла, приложение будет брать наибольшую версию или локальную,
* `title [string]` - Название парсера **[обязательно]**,
* `host [string]` - основной хост сайта **[обязательно]**,
* `public_link [string]` - ссылка на каталог манг сайта (для пользователя)можно просто указать адрес сайта сайт,
* `folder [string]` - название каталога для где будут храниться манги **[обязательно]**,
* `name [string]` - короткое название **[не обязательно]**,
* `language [string]` - код языка сайта **ISO 639-1** http://en.wikipedia.org/wiki/ISO_639-1,
* `chapters_order [bool]` - порядок сортировки глав на странице (true - 1,2,3  false: 501,500,499...), по умолчанию `true`
* `time_invalidate [long]` - **[не используется]**.
* `encoding string]` - указывает какую кадировку использует сайт это чаше всего utf-8 или Windows-1251.
* `catalog_link [string]` - ссылка на файл каталога манг в формате protobuf,
   можно использовать и в формате sqlite ток для этого добавте  если хотяте 
   использовать тип sqlite`"file_type": "sqlite",`.
* `self_link [string]` - ссылка на парсера в формате .json ,
* `icon_link [string]` - ссылка на иконку парсера ,
* `"author": {"name": "Кто делает парсер","email": "Адрес для связи "},`
*

#2) Методы формирования БД манг
-
**manga_list_complete** - функция получения списка манг ( title, link, uniq );

* `iterator  [string|array|get_iterator]` - формирование списка страниц каталога манг.
   Т.е. формируется список страниц из которые подлежат обходу;
* `add_manga [add_href]` - парсим каждую страницу и чтобы получить объекты с тменами и ссылками на манги { title, link, uniq };

***Пример работы с сайта mangachan***
```json
"manga_list_complete": {
		"iterator": {
			"base_url": "https://manga-chan.me/mostfavorites?offset=",
			"append_nums": { "from": 0, "to": 16260, "step": 20, "last_page": {"before": ">>>", "token1": "<a href='?offset=", "token2": "'"} }
		},
		"add_manga": {
			"next": "<div class=\"content_row\"",
			"link":  { "token1": "href=\"", "token2": "\"" },
			"title": { "token1": "title=\"", "token2": "\"" },
			"cover": { "token1": "img src=\"", "token2": "\"" }
		},
		"rating_auto_inc": {
			"start": "20000",
			"inc": -1
		}
	},
```
-
-
**manga_complete** - функция формирования полной информации по манге;

* `title       [get_string]` - название манги;
* `author      [get_string]` - автор манги;
* `summary     [get_string]` - описание манги;
* `cover       [get_string]` - обложка манги;
* `rating      [get_string]` - рэйтинг манги (как показала практика можно начхать на это);
* `is_mature   [detect]` - манга для взрослых;
* `read_dir    [enum_detect]` - направление чтения покажет пользователю  как читать 
	* `left_to_right` - слева на право, 
	* `right_to_left` - справа на лево;

***Пример***

```json
"read_dir":  {
"right_to_left": "href=\"/type/Манга\"", 
"left_to_right": "href=\"/type/Манхва\"" 
},
```



* `status      [enum_detect]` - статус манги
	* `unknown` - неизвестен,
	* `ongoing` - продолжается,
	* `complete` - завершена,
	* `single` - сингл,
	* `licensed` - лицензирована/заблокирована,
	* `empty` - пустая.

***Пример***
Нахождения статуса для манги:
```json
"status": { 
	"complete": { 
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"values" : ["завершен", "Переведена", "Сингл"]
	},
	"ongoing": {
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"value" : "продолжается"
	},
	"single" : "<b>Сингл</b>",
	"default" : "ongoing"
}
```
* `chapters_from_page [get_string]` - загружать главы с другой страницы, 
например на многих сайтах используется по страничный вывод списка глав,
для них список глав можно получать со страницы главы, там всегда есть выпадающий список всех глав.
* `add_genre   [get_string]` - добавляем все жанры по одному,
* `add_genres  [get_array]` - добавляем жанры списком,
* `add_chapter [add_href]` - создаем список глав манги.


**chapter_complete** - функция формирования списка страниц главы манги.

* `add_page     [get_string]` - добавляем страницы по одной;
* `add_pages    [get_array]` - добавляем страницы списком;
* `add_images   [get_array]` - добавляем страницы списком,
ссылками сразу на файлы сканов
если использовать это то можно не использовать` "page_complete"` так как вы уже указали ссылки на сканы
пример ниже;
* `images_url   [get_string]` - ;
* `postfix      [string]` - ;
* `prefix       [get_string]` -добавляет вставляемый перед результатом, ;
* `sufix        [get_string]` - добавляет вставляемый после результата;
* `remove_first [bool]` - удаляем первую страницу из списка;
* `remove_last  [bool]` - удаляем последнюю страницу из списка;
> чаще всего `remove_first`и  `remove_last` используеться чтоб удалить рекламные картинки  
как любят некоторые сайты пихать их в читалку чаще иностраные !

> примечание "start" и  "end" обезательно использовать !

***Пример***
```json
"chapter_complete": {
	    "add_numeration": true,
	    "headers": {
			"Accept": "*/*",
			"Referer": "https://remanga.org/",
			"Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
		},
	"add_images": {
			"start": "content",
			"token1": "link\":\"",
			"token2": "\"",
			 "end": "]"
		}
	},
```

**page_complete** - функция извлечения ссылки на файл скана страницы манги;

* `image [get_string]` - извлечение ссылки на файл скана страницы;

***Пример***
```json
"page_complete": {
		"image": { "skip": "<div class=\"maincontent_mr\">", "token1": "<img src=\"", "token2": "\"" }
	},
```

**test** - функция тестирования данного файла;

* `proc [string]` - функция которую будем тестировать;
* `link [string]` - ссылка на мангу/главу/страницу для формирования тестируемого объекта;
* `assert` - данные с которыми будем сравнивать специфичные для тестируемых функций;

	***Сравнение значений***

	* Проверка текстовых значений

		* равно
			`"author" : "OKU Hiroya"`
		* регулярными выражениями, первый символ `@`
			`"image" : "@^http://\\w*\\.manga24\\.ru/manga/gantz/\\d*/\\d*\\.(png|jpg|jpeg)$"`

	* Проверка числовых значений

		* равно `=`
			`"mangas_count" : "=460"`
		* не равно `!=`
			`"pages_count" : "!=20"`
		* больше `>`
			`"mangas_count" : ">460"`
		* меньше `<`
			`"genres_count" : "<7"`
		* больше или равно `>=`
			`"mangas_count" : ">=460"`
		* меньше или равно `<=`
			`"genres_count" : "<=7"`

***Пример***

```json
"test": [
		{
			"proc" : "manga_list_complete",
			"assert" : {
				"mangas" : [
					{ "title" : "Gantz",  "link" : "http://manga.animea.net/gantz.html" },
					{ "title" : "Naruto", 
						"link" : "http://manga.animea.net/naruto.html",
						"uniq" : "naruto.html"
					}
				],
				"mangas_count" : ">12500"
			}
		},
		{
			"proc" : "manga_complete",
			"title" : "Bleach", 
			"link" : "http://manga.animea.net/bleach.html", 
			"assert" : {
				"author" : "KUBO TITE",
				"cover" : "http://s.animea.net/manga/thumbs200x275/42.jpg",
				"summary" : "@^(Ichigo Kurosaki has)",
				"genres" : "@action",
				"status" : "licensed",
				"rating" : ">=70",
				"genres_count" : ">=6"
			}
		},
		{
			"proc" : "chapter_complete",

			"link" : "http://manga.animea.net/gantz-chapter-383.html",
			"title" : "Gantz 383: Endpoint", 
			"assert" : {
				"pages" : [
					{ "link" : "http://manga.animea.net/gantz-chapter-383-page-4.html" },
					{ "link" : "http://manga.animea.net/gantz-chapter-383-page-31.html" }
				]
			}
		},
		{
			"proc" : "page_complete",
			"link" : "http://manga.animea.net/gantz-chapter-383-page-31.html",
			"assert" : {
				"image" : "http://162.210.197.229/b/395%2F383%2Fimg_31_59390.jpg"
			}
		}
	]
```

-------------------

# Типы полей

### Простые типы

* `string` - просто текстовое поле;
* `array`  - массив текстовых полей;
* `int`    - число в формате INT;
* `long`   - число в формате LONG;
* `bool`   - булевое поле;


### Базовые методы парсера сайтов
**replacer** - замена подстроки

* `match  [string]` - заменяемый текст или регулярное выражение,
* `text   [string]` - вставляемый текст,
* `prefix [string]` - текст вставляемый перед результатом,
* `sufix  [string]` - текст вставляемый после результата.

***Пример***
```json
"replace" : { 
	"match" : "\\?.*", 
	"text" : "" 
}
```

**get_string** - получение текстового значения (находящегося между token1 и token2) из документа

* `after   [string]` - курсор устанавливается перед найденным выражением,
* `skip    [string]` - курсор устанавливается после найденного выражения,
* `before  [string]` - выражение token1 ищется перед данным выражением,
* `tag     [string]` - ВНИМАНИЕ это не поиск по тегу! это позиционирование курсора по началу тега,
* `token1, token2 [string]` - выражения между которыми находиться результат **[обязательно]**,
* `replace [replacer]` - конвертирование результата,
* `details [bool]`   - логгирование **[debug]**.

***Пример***

```json
author: { 
	"after": "<a href=\"/list/author/", 
	"token1":"\">", 
	"token2": "</a>" 
}
```

**detect** - проверка наличия выражения в документе

* `start    [string]` - выражение начала окна,
* `end      [string]` - выражение окончания окна,
* `pattern  [string]` - искомое выражение,
* `patterns [array]`  - массив искомых выражений.

**enum_detect** - специфический набор detect'ов с возможностью указать значение по умолчанию - `default`

***Пример***
Нахождения статуса для манги:
```json
"status": { 
	"complete": { 
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"values" : ["завершен", "Переведена", "Сингл"]
	},
	"ongoing": {
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"value" : "продолжается"
	},
	"single" : "<b>Сингл</b>",
	"default" : "ongoing"
}
```

**get_array** - получение списка строк. 
Если указан split то первое выражение найденное между token1 и token2 будет разделено по выражению split,
Если split не указан то список строк будет формироваться вырезанием всех найденых строк между token1 и token2.

* `start   [string]` - выражение начала окна,
* `end     [string]` - выражение окончания окна,
* `after   [string]` - выражение смещение курсора,
* `split   [string]` - выражение по которому нужно нарезать найенное значение,
* `token1, token2 [string]` - ,
* `replace [replacer]` - конвертирование результата,
* `details [bool]`   - логгирование **[debug]**;

***Пример 1***
Результатом будет список всех элементов перечисленных через запятую в элементе "span".
```json
{
	split: ",",
	token1: "<span>", 
	token2: "</span>"
}
```
***Пример 2***
Результатом будет список всех элементов списка.
```json
{
	start: "<ul>", 
	end: "</ul>", 
	token1: "<li>", 
	token2="</li>"
}
```

**add_href** - Получение списка ссылок на манги/главы 

	title - название, 
	link - ссылка, 
	uniq - уникальное значение части пути для формирования папки **[не обязательно]**.

* `start   [detect]`     - выражение начала окна,
* `end     [detect]`     - выражение окончания окна,
* `next    [detect]`     - выражение смещения курсора поиска,
* `link    [get_string]` - получение ссылки,
* `title   [get_string]` - получение названия,
* `uniq    [get_string]` - получение уникального идентификатора, если не указан то формируется из link последний сегмент пути,
* `details [bool]`       - логгирование **[debug]**.

**get_iterator** - итератор значений, служит для формирования списка ссылок.

* `base_url [string]` - базовый url,
* `append_nums` - описание цикла для получения списка url, сформированных как `base_url` + %index% + `sufix`
	* `from  [int]`
	* `to    [int]`
	* `step  [int]`
	* `sufix [string]`
* `append_array [array]` - массив значений для формирования списка url, сформированных как `base_url` + %value%

***Пример***
Формируем список ссылок вида: https://mintmanga.live/list?offset=0, https://mintmanga.live/list?offset=60, https://mintmanga.live/list?offset=120...
```json
"iterator": {
	"base_url": "https://mintmanga.live/list?offset=",
	"append_nums": { "from": 0, "to": 6300, "step": 60 }
},
```




-------------------

# Отладка

* **nigma.jar** - консольное java приложение для отладки парсера
* **test**, **test.bat** - запускаемые скрипты (обертки над **nigma.jar**) для MacOs и Windows
* **site_parsers.sublime-project** - заготовка проекта для SublimeText упрощающая процесс отладки

Приложение на выходе выдает отчет о прохождении тестов + логги работы если они включены (`details : true`) 
для всех методов.
Чтобы вывести результаты работы методов нужно запускать приложение с одинм из ключей: 
`[manga_list_complete]`, `[manga_complete]`, `[chapter_complete]`, `[page_complete]`.

***Запуск тестов для сайта manga24***
```shell
$./test manga24.json

configuaration ok
1. success( 0,4s)
2. disabled( 0,0s)
3. manga_list_complete .............success(10,6s)
4. manga_complete success( 0,7s)
5. chapter_complete success( 0,1s)
Count: 5
Success: 5
Error: 0
Time: 11,8s
Result: 100,0%
```

***Вывод результатов работы метода "chapter_complete" в консоль***
```shell
$java -jar nigma.jar manga24 [chapter_complete] http://manga24.ru/goodending/003/

Chapter link: http://manga24.ru/goodending/003/
Chapter complete ok!
{
    "first_three_pages": [
        {"image": "http://img7.manga24.ru/manga/goodending/003/001.jpeg"},
        {"image": "http://img7.manga24.ru/manga/goodending/003/002.jpeg"},
        {"image": "http://img7.manga24.ru/manga/goodending/003/003.jpeg"}
    ],
    "link": "http://manga24.ru/goodending/003/"
}
time: 280ms
```
